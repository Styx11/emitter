import {
  Events,
  Callback,
} from './interface';

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
    if (!Array.isArray(this._events[event])) {
      const cbs: Array<Function> = [];
      this._events[event] = cbs;
    }
    this._events[event].push(cb);
    return this;
  };
}