import assert from 'assert';
import Emitter from '../../src';
import { Callback } from '../../src/interface';

export default function unitTestEventName (): boolean {
  let res: boolean = true;
  const emitter = new Emitter();
  const events: Array<string> = ['event1', 'event2', 'event3'];
  const cb: Callback = (): void => {};

  try {
    emitter.on(events, cb);
    assert.strictEqual(emitter.listenerCount('event1'), 1);
    assert.strictEqual(emitter.listenerCount('event2'), 1);
    assert.strictEqual(emitter.listenerCount('event3'), 1);

    console.log('test:EVENTNAMES group.1 all past');
  } catch (e) {
    res = false;
    console.log('test:EVENTNAMES group.1 has failed');
    console.error(e);
  }

  try {
    let result: Array<string>;
    result = emitter.eventNames();
    assert.ok(Array.isArray(result));
    assert.deepStrictEqual(result, events);

    console.log('test:EVENTNAMES group.2 all past');
  } catch (e) {
    res = false;
    console.log('test:EVENTNAMES group.2 has failed');
    console.error(e);
  }

  return res;
};