import { Events } from './interface';

export default class Emitter {
  private _events: Events;
  constructor () {
    this._events = Object.create(null);
  };
}