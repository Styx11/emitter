import Emitter from '../src/index';
import { Callback } from '../src/interface';
const assert = require('assert');

let result: boolean = true;
const emitter = new Emitter();
const event1: string = 'event1';
const event2: string = 'event2';
const eventArr: Array<string> = ['event3', 'event4', 'event5'];
const cb: Callback = (...arg: Array<any>): any => {};

emitter.on(event1, cb);
emitter.on(event2, cb);
emitter.on(eventArr, cb);
try {
  assert.strictEqual(emitter.listenerCount(event1), 1);
  assert.strictEqual(emitter.listenerCount(event2), 1);
  assert.strictEqual(emitter.listenerCount('event3'), 1);
  assert.strictEqual(emitter.listenerCount('event4'), 1);
  assert.strictEqual(emitter.listenerCount('event5'), 1);
  console.log('test:ON group.1 all past');
} catch (e) {
  result = false;
  console.error(e);
}

emitter.on(event1, cb);
emitter.on(event2, cb);
emitter.on(eventArr, cb);
try {
  assert.strictEqual(emitter.listenerCount(event1), 2);
  assert.strictEqual(emitter.listenerCount(event2), 2);
  assert.strictEqual(emitter.listenerCount('event3'), 2);
  assert.strictEqual(emitter.listenerCount('event4'), 2);
  assert.strictEqual(emitter.listenerCount('event5'), 2);
  console.log('test:ON group.2 all past');
} catch (err) {
  result = false;
  console.error(err);
}
export default result;