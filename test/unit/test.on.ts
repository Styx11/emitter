import assert from 'assert';
import Emitter from '../../src/index';
import { Callback } from '../../src/interface';

export default function unitTestOn (): boolean {
  let res: boolean = true;
  const emitter = new Emitter();
  const event1: string = 'event1';
  const event2: string = 'event2';
  const eventArr: Array<string> = ['event3', 'event4', 'event5'];
  const cb: Callback = (...arg: Array<any>): any => {};

  try {
    emitter.on(event1, cb);
    emitter.on(event2, cb);
    emitter.on(eventArr, cb);
    assert.strictEqual(emitter.listenerCount(event1), 1);
    assert.strictEqual(emitter.listenerCount(event2), 1);
    assert.strictEqual(emitter.listenerCount('event3'), 1);
    assert.strictEqual(emitter.listenerCount('event4'), 1);
    assert.strictEqual(emitter.listenerCount('event5'), 1);
    console.log('test:ON group.1 all past');
  } catch (e) {
    res = false;
    console.log('test:ON group.1 has failed');
    console.error(e);
  }

  try {
    emitter.on(event1, cb);
    emitter.on(event2, cb);
    emitter.on(eventArr, cb);
    assert.strictEqual(emitter.listenerCount(event1), 2);
    assert.strictEqual(emitter.listenerCount(event2), 2);
    assert.strictEqual(emitter.listenerCount('event3'), 2);
    assert.strictEqual(emitter.listenerCount('event4'), 2);
    assert.strictEqual(emitter.listenerCount('event5'), 2);
    console.log('test:ON group.2 all past');
  } catch (err) {
    res = false;
    console.log('test:ON group.2 has failed');
    console.error(err);
  }

  try {
    emitter.on(event1, cb);
    emitter.on(event2, cb);
    emitter.on('event3', cb);
    emitter.on('event4', cb);
    emitter.on('event5', cb);
    assert.strictEqual(emitter.listenerCount(event1), 3);
    assert.strictEqual(emitter.listenerCount(event2), 3);
    assert.strictEqual(emitter.listenerCount('event3'), 3);
    assert.strictEqual(emitter.listenerCount('event4'), 3);
    assert.strictEqual(emitter.listenerCount('event5'), 3);
    console.log('test:ON group.3 all past');
  } catch (err) {
    res = false;
    console.log('test:ON group.3 has failed');
    console.error(err);
  }
  return res;
}