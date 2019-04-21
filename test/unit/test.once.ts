import assert from 'assert';
import Emitter from '../../src';
import {
  Callback,
  Result
} from '../../src/interface';

export default function unitTestOnce () {
  let res: boolean = true;
  const emitter = new Emitter();
  const events: Array<string> = ['event1', 'event2', 'event3'];
  const result: Result = {res: '', thisCheck: false, listenerCount: 0};
  const checkRes: Callback = (...args: Array<any>): any => {
    if (!args) return;
    args[0].res = 'hello, once';
  };
  const checkThis: Callback = function (this: any, ...args: Array<any>): any {
    if (!args) return;
    const check: boolean = this === emitter && this instanceof Emitter;
    args[0].thisCheck = check;
  };
  const checkCount: Callback = (...args: Array<any>): any => {
    if (!args) return;
    args[0].listenerCount++;
  };

  try {
    emitter.once(events, checkRes);
    assert.strictEqual(emitter.listenerCount('event1'), 1);
    assert.strictEqual(emitter.listenerCount('event2'), 1);
    assert.strictEqual(emitter.listenerCount('event3'), 1);

    console.log('test:ONCE group.1 all past');
  } catch (e) {
    res = false;
    console.log('test:ONCE group.1 has failed');
    console.error(e);
  }

  // 当 eventName 事件下次触发时，监听器会先被移除，然后再调用。
  // 所以 emit 中 hasListener 依然为 true
  try {
    assert.ok(emitter.emit('event1', result));
    assert.strictEqual(result.res, 'hello, once');
    result.res = '';

    assert.ok(emitter.emit('event2', result));
    assert.strictEqual(result.res, 'hello, once');
    result.res = '';

    assert.ok(emitter.emit('event3', result));
    assert.strictEqual(result.res, 'hello, once');
    result.res = '';

    console.log('test:ONCE group.2 all past');
  } catch (e) {
    res = false;
    console.log('test:ONCE group.2 has failed');
    console.error(e);
  }

  try {
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    assert.strictEqual(emitter.listenerCount('event3'), 0);

    console.log('test:ONCE group.3 all past');
  } catch (e) {
    res = false;
    console.log('test:ONCE group.3 has failed');
    console.error(e);
  }

  // once 返回 Emitter 实例
  // 当监听器函数（非箭头函数）被调用时， this 关键词会被指向监听器所绑定的 Emitter 实例。
  try {
    emitter
      .once('event1', checkThis)
      .emit('event1', result);
    assert.ok(result.thisCheck);
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    result.thisCheck = false;

    emitter
      .once('event2', checkThis)
      .emit('event2', result);
    assert.ok(result.thisCheck);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    result.thisCheck = false;

    emitter
      .once('event3', checkThis)
      .emit('event3', result);
    assert.ok(result.thisCheck);
    assert.strictEqual(emitter.listenerCount('event3'), 0);
    result.thisCheck = false;

    console.log('test:ONCE group.4 all past');
  } catch (e) {
    res = false;
    console.log('test:ONCE group.4 has failed');
    console.error(e);
  }

  // cb 绑定在了 once 包装函数上
  try {
    emitter.once(events, checkRes);
    emitter.off('event1', checkRes);
    emitter.off('event2', checkRes);
    emitter.off('event3', checkRes);

    assert.strictEqual(emitter.listenerCount('event1'), 0);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    assert.strictEqual(emitter.listenerCount('event3'), 0);

    console.log('test:ONCE group.5 all past');
  } catch (e) {
    res = false;
    console.log('test:ONCE group.5 has failed');
    console.error(e);
  }

  // Catched: TypeError: Cannot read property 'apply' of undefined
  // Fix: use _events[event]'s copy instead
  //      because cb could be removed when running once wrapper function
  try {
    for (let i=1; i<4; i++) {
      for (let j=1; j<4; j++) {
        emitter.once(`event${i}`, checkCount);// 一个事件对应 3 个回调函数
      }
    }

    emitter.emit('event1', result);
    assert.strictEqual(result.listenerCount, 3);
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    result.listenerCount = 0;

    emitter.emit('event2', result);
    assert.strictEqual(result.listenerCount, 3);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    result.listenerCount = 0;

    emitter.emit('event3', result);
    assert.strictEqual(result.listenerCount, 3);
    assert.strictEqual(emitter.listenerCount('event3'), 0);
    result.listenerCount = 0;

    console.log('test:ONCE group.6 all past');
  } catch (e) {
    res = false;
    console.log('test:ONCE group.6 has failed');
    console.error(e);
  }

  return res;
}