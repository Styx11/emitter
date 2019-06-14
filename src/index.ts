import {
  Events,
  Callback,
} from './interface';

import {
  warn
} from './util';

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
    if (!cb || typeof cb !== 'function') warn(`'on' expected cb as a function`);
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
  eventNames (): Array<string> {
    let res: Array<string> = [];
    res = Object.keys(this._events);
    return res;
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
    if (!cb || typeof cb !== 'function') warn(`'once' expected cb as a function`);
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
      if (cb === fn || cb === fn.prototype.cb) {// cb is bound to once wrapper fn's prototype
        cbs.splice(index, 1);
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