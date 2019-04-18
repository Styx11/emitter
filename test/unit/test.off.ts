import assert from 'assert';
import Emitter from '../../src';
import { Callback } from '../../src/interface';

export default function unitTestOff (): boolean {
  let res: boolean = true;
  const emitter = new Emitter();
  const events = ['event1', 'event2', 'event3'];
  const cb: Callback = (...args: Array<any>): any => {};

  try {
    // Catched: TypeError: Cannot read property 'length' of undefined
    // Fix: Check the type of 'cb' and 'this._events[event]'
    emitter.off('event1', cb);
    emitter.off('event2', cb);
    emitter.off('event3', cb);
    console.log('test:OFF group.1 all past');
  } catch (e) {
    res = false;
    console.log('test:OFF group.1 has failed');
    console.error(e);
  }

  // removeListener() 最多只会从监听器数组中移除一个监听器。
  // 如果监听器被多次添加到指定 eventName 的监听器数组中，则必须多次调用 removeListener() 才能移除所有实例。
  try {
    for (let i=0; i<4; i++) {
      emitter.on(events, cb);
    }
    assert.strictEqual(emitter.listenerCount('event1'), 4);
    assert.strictEqual(emitter.listenerCount('event2'), 4);
    assert.strictEqual(emitter.listenerCount('event3'), 4);
    console.log('test:OFF group.2 all past');
  } catch (e) {
    res = false;
    console.log('test:OFF group.2 has failed');
    console.error(e);
  }
  
  try {
    emitter.off(events, cb);
    assert.strictEqual(emitter.listenerCount('event1'), 3);
    assert.strictEqual(emitter.listenerCount('event2'), 3);
    assert.strictEqual(emitter.listenerCount('event3'), 3);
    console.log('test:OFF group.3 all past');
  } catch (e) {
    res = false;
    console.log('test:OFF group.3 has failed');
    console.error(e);
  }
  
  try {
    emitter.off(events, cb);
    assert.strictEqual(emitter.listenerCount('event1'), 2);
    assert.strictEqual(emitter.listenerCount('event2'), 2);
    assert.strictEqual(emitter.listenerCount('event3'), 2);
    console.log('test:OFF group.4 all past');
  } catch (e) {
    res = false;
    console.log('test:OFF group.4 has failed');
    console.error(e);
  }
  
  try {
    emitter.off(events);
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    assert.strictEqual(emitter.listenerCount('event3'), 0);
    console.log('test:OFF group.5 all past');
  } catch (e) {
    res = false;
    console.log('test:OFF group.5 has failed');
    console.error(e);
  }
  
  try {
    emitter.on(events, cb);
    assert.strictEqual(emitter.listenerCount('event1'), 1);
    assert.strictEqual(emitter.listenerCount('event2'), 1);
    assert.strictEqual(emitter.listenerCount('event3'), 1);
    console.log('test:OFF group.6 all past');
  } catch (e) {
    res = false;
    console.log('test:OFF group.6 has failed');
    console.error(e);
  }

  try {
    emitter.off();
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    assert.strictEqual(emitter.listenerCount('event3'), 0);
    console.log('test:OFF group.7 all past');
  } catch (e) {
    res = false;
    console.log('test:OFF group.7 has failed');
    console.error(e);
  }
  return res;
}