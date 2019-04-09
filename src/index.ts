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
    const count = this._events[event].length;
    return count;
  };
}