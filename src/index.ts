import {
  Warn,
  Events,
  Callback,
} from './interface';

const warn: Warn = function (msg: string): void {
  if (process.env.NODE_ENV === 'production') return;
  const warnMsg: string = `[Emitter Warn]: ${msg}`;
  throw new Error(warnMsg);
}

export default class Emitter {
  private _events: Events;
  constructor () {
    this._events = Object.create(null);
  };
  on (event: string | Array<string>, cb: Callback): this {
    if (Array.isArray(event)) {
      const length: number = event.length;
      for (let i=0; i<length; i++) {
        this.on(event[i], cb);
      }
      return this;
    }
    if (!event || typeof event !== 'string') warn(`'on' expected a string | string[] as param`);
    if (event !== 'newListener') this.emit('newListener', event, cb);
    if (!Array.isArray(this._events[event])) {
      const cbs: Array<Callback> = [];
      this._events[event] = cbs;
    }
    this._events[event].push(cb);
    return this;
  };
  listenerCount (event: string): number {
    if (!event || typeof event !== 'string') warn(`'listenerCount' expected a string as param`);
    if (!Array.isArray(this._events[event])) return 0;
    const count: number = this._events[event].length;
    return count;
  };
  once (event: string | Array<string>, cb: Callback): this {
    if (Array.isArray(event)) {
      const length: number = event.length;
      for (let i=0; i<length; i++) {
        this.once(event[i], cb);
      }
      return this;
    }
    if (!event || typeof event !== 'string') warn(`'once' expected a string | string[] as param`);
    const on: Callback = function (this: Emitter, ...args: Array<any>): any {
      // if param is a string[], cb could be off before execute
      this.off(event, on);
      if (cb.apply && typeof cb.apply === 'function') {
        cb.apply(this, args);
      } else {
        cb(...args);
      }
    }
    on.prototype.cb = cb;// cb on the prototype is used for off comparison
    return this.on(event, on);
  };
  off (event?: string | Array<string>, cb?: Callback): this {
    if (!event || !arguments.length) {
      this._events = Object.create(null);
      return this;
    }
    if (Array.isArray(event)) {
      const length: number = event.length;
      for (let i=0; i<length; i++) {
        this.off(event[i], cb);
      }
      return this;
    }
    if (!cb || typeof cb !== 'function') {
      const cbs: Array<Callback> = [];
      this._events[event] = cbs;
      if (event !== 'removeListener') this.emit('removeListener', event);
      return this;
    }
    const cbs: Array<Callback> = this._events[event];
    if (!Array.isArray(cbs)) return this;

    let index: number = cbs.length;
    while (index--) {
      let fn = cbs[index];
      if (cb === fn || cb === fn.prototype.cb) {// 当监听 once 事件时，cb 绑定在包装函数的原型上
        cbs.splice(index, 1);// 修改原数组
        if (event !== 'removeListener') this.emit('removeListener', event, cb);
        break;
      }
    }
    return this;
  };
  emit (event: string, ...args: Array<any>): boolean {
    if (!event || typeof event !== 'string') warn(`'emit' expected a string as param`);
    const listenerCount: number = this.listenerCount(event);
    const hasListener: boolean = !!listenerCount;
    if (!Array.isArray(this._events[event])) return hasListener;
    
    // use _events[event]'s copy instead
    // because cb could be removed when running wrapper function
    const cbs: Array<Callback> = this._events[event].slice();
    for (let i=0; i<cbs.length; i++) {
      let cb: Callback = cbs[i];
      if (cb.apply && typeof cb.apply === 'function') {
        cb.apply(this, args);
      } else {
        cb(...args);
      }
    }
    return hasListener;
  }
}