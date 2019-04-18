import assert from 'assert';
import Emitter from '../../src';
import {
  Callback,
  Result
} from '../../src/interface';

export default function unitTestEmit (): boolean {
  let res: boolean = true;
  const emitter = new Emitter();
  const result: Result = { res: '', thisCheck: false, listenerCount: 0 };
  const events: Array<string> = ['event1', 'event2', 'event3'];
  const checkRes: Callback = (...args: Array<any>): any => {
    if (!args) return;
    args[0].res = 'hello, emitter';
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
    emitter.on(events, checkRes);
    assert.strictEqual(emitter.listenerCount('event1'), 1);
    assert.strictEqual(emitter.listenerCount('event2'), 1);
    assert.strictEqual(emitter.listenerCount('event3'), 1);

    console.log('test:EMIT group.1 all past');
  } catch (e) {
    res = false;
    console.log('test:EMIT group.1 has failed');
    console.error(e);
  }

  // 验证 cb 的有效性
  try {
    assert.ok(emitter.emit('event1', result));
    assert.strictEqual(result.res, 'hello, emitter');
    result.res = '';
    
    assert.ok(emitter.emit('event2', result));
    assert.strictEqual(result.res, 'hello, emitter');
    result.res = '';
    
    assert.ok(emitter.emit('event2', result));
    assert.strictEqual(result.res, 'hello, emitter');
    result.res = '';

    console.log('test:EMIT group.2 all past');
  } catch (e) {
    res = false;
    console.log('test:EMIT group.2 has failed');
    console.error(e);
  }

  // 验证 on 的返回值（this）
  try {
    emitter.off();
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    assert.strictEqual(emitter.listenerCount('event3'), 0);

    const res1: boolean = emitter
      .on('event1', checkRes)
      .emit('event1', result);
    assert.ok(res1);
    assert.strictEqual(result.res, 'hello, emitter');
    result.res = '';

    const res2: boolean = emitter
      .on('event2', checkRes)
      .emit('event2', result);
    assert.ok(res2);
    assert.strictEqual(result.res, 'hello, emitter');
    result.res = '';

    const res3: boolean = emitter
      .on('event3', checkRes)
      .emit('event3', result);
    assert.ok(res3);
    assert.strictEqual(result.res, 'hello, emitter');
    result.res = '';

    console.log('test:EMIT group.3 all past');
  } catch (e) {
    res = false;
    console.log('test:EMIT group.3 has failed');
    console.error(e);
  }

  // 当监听器函数（非箭头函数）被调用时， this 关键词会被指向监听器所绑定的 Emitter 实例。
  try {
    result.thisCheck = false;

    emitter.off();
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    assert.strictEqual(emitter.listenerCount('event3'), 0);

    emitter.on(events, checkThis);
    emitter.emit('event1', result);
    assert.ok(result.thisCheck);
    result.thisCheck = false;

    emitter.emit('event2', result);
    assert.ok(result.thisCheck);
    result.thisCheck = false;

    emitter.emit('event3', result);
    assert.ok(result.thisCheck);
    result.thisCheck = false;

    console.log('test:EMIT group.4 all past');
  } catch (e) {
    res = false;
    console.log('test:EMIT group.4 has failed');
    console.error(e);
  }

  // 添加 listener 函数到名为 eventName 的事件的监听器数组的末尾。 不会检查 listener 是否已被添加。
  // 多次调用并传入相同的 eventName 与 listener 会导致 listener 会被添加多次。
  try {
    emitter.off();
    assert.strictEqual(emitter.listenerCount('event1'), 0);
    assert.strictEqual(emitter.listenerCount('event2'), 0);
    assert.strictEqual(emitter.listenerCount('event3'), 0);

    for (let i=1; i<4; i++) {
      for (let j=1; j<4; j++) {
        emitter.on(`event${i}`, checkCount);// 一个事件对应 3 个回调函数
      }
    }

    emitter.emit('event1', result);
    assert.strictEqual(result.listenerCount, 3);
    result.listenerCount = 0;

    emitter.emit('event2', result);
    assert.strictEqual(result.listenerCount, 3);
    result.listenerCount = 0;

    emitter.emit('event3', result);
    assert.strictEqual(result.listenerCount, 3);
    result.listenerCount = 0;

    console.log('test:EMIT group.5 all past');
  } catch (e) {
    res = false;
    console.log('test:EMIT group.5 has failed');
    console.error(e);
  }
  return res;
}