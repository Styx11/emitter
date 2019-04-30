import assert from 'assert';
import Emitter from '../../src';
import {
  Callback,
  Result
} from '../../src/interface';

export default function unitTestRemoveListener (): boolean {
  let res: boolean = true;
  const emitter = new Emitter();
  const result: Result = {res: '', thisCheck: false};

  // off 'removeListener' itself won't call the listener function
  try {
    const cb: Callback = (eventName: string): void => {result.res = eventName};
    emitter.on('removeListener', cb);
    emitter.off('removeListener', cb);
    assert.strictEqual(result.res, '');

    console.log('test:REMOVELISTENER group.1 all past');
  } catch (e) {
    res = false;
    console.log('test:REMOVELISTENER group.1 has failed');
    console.error(e);
  }

  // with out params, you'll get nothing in callback function
  try {
    const cb: Callback = (eventName: string): void => {result.res = eventName};
    emitter.once('removeListener', cb);
    emitter.on('event', console.log);
    emitter.off();
    assert.strictEqual(result.res, '');

    result.res = '';

    console.log('test:REMOVELISTENER group.2 all past');
  } catch (e) {
    res = false;
    console.log('test:REMOVELISTENER group.2 has failed');
    console.error(e);
  }

  // if provide 'eventName' only, there will be no 'listener' in callback params
  try {
    const cb: Callback = (eventName: string, listener?: Callback): void => {
      result.res = eventName;
      result.thisCheck = listener && typeof listener === 'function';
    };
    emitter.once('removeListener', cb);
    emitter.on('event', console.log);
    emitter.off('event');
    assert.ok(!result.thisCheck);
    assert.strictEqual(result.res, 'event');

    result.res = '';
    result.thisCheck = false;

    console.log('test:REMOVELISTENER group.3 all past');
  } catch (e) {
    res = false;
    console.log('test:REMOVELISTENER group.3 has failed');
    console.error(e);
  }

  try {
    const cb: Callback = (): void => {};
    emitter.once('removeListener', (eventName: string, listener: Callback): void => {
      result.res = eventName;
      result.thisCheck = listener && listener === cb;
    });
    emitter.on('event', cb);
    emitter.off('event', cb);
    assert.ok(result.thisCheck);
    assert.strictEqual(result.res, 'event');

    result.res = '';
    result.thisCheck = false;

    console.log('test:REMOVELISTENER group.4 all past');
  } catch (e) {
    res = false;
    console.log('test:REMOVELISTENER group.4 has failed');
    console.error(e);
  }

  return res;
}