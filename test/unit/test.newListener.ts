import assert from 'assert';
import Emitter from '../../src';
import {
  Callback,
  Result
} from '../../src/interface';

export default function unitTestNewListener (): boolean {
  let res: boolean = true;
  const emitter = new Emitter;
  const result: Result = { res: '', thisCheck: false };

  // listen 'newListener' itself won't call cb
  try {
    const cb: Callback = (eventName: string): void => {
      if (eventName) result.res = eventName;
    };
    emitter.on('newListener', cb);
    assert.strictEqual(result.res, '');

    emitter.off('newListener');
    result.res = '';

    console.log('test:NEWLISTENER group.1 all past');
  } catch (e) {
    res = false;
    console.log('test:NEWLISTENER group.1 has failed');
    console.error(e);
  }

  try {
    emitter.once('newListener', (event: string) => {
      result.thisCheck = event === 'event';
    });
    emitter.on('event', () => {});
    assert.ok(result.thisCheck);

    emitter.off('event');
    result.thisCheck = false;

    console.log('test:NEWLISTENER group.2 all past');
  } catch (e) {
    res = false;
    console.log('test:NEWLISTENER group.2 has failed');
    console.error(e);
  }

  // 在 'newListener' 回调中注册到相同 name 的任何其他监听器将插入到正在添加的监听器之前。
  try {
    const cbOrder: Array<string> = [];
    emitter.once('newListener', (eventName: string): void => {
      if (eventName !== 'event') return;
      emitter.on('event', () => {
        cbOrder.push('B');
      });
    });
    emitter.on('event', () => {
      cbOrder.push('A');
    });
    emitter.emit('event');
    assert.deepStrictEqual(cbOrder, ['B', 'A']);

    emitter.off('event');

    console.log('test:NEWLISTENER group.3 all past');
  } catch (e) {
    res = false;
    console.log('test:NEWLISTENER group.3 has failed');
    console.error(e);
  }

  // listener 为添加的监听器的引用
  try {
    const cb: Callback = (): void => {
      console.log('hello');
    };
    emitter.once('newListener', (e: string, listener: Function): void => {
      result.thisCheck = listener === cb;
    });
    emitter.on('event', cb);
    assert.ok(result.thisCheck);

    result.thisCheck = false;

    console.log('test:NEWLISTENER group.4 all past');
  } catch (e) {
    res = false;
    console.log('test:NEWLISTENER group.4 has failed');
    console.error(e);
  }
  return res;
}