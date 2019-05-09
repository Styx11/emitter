import assert from 'assert';
import unitTestOn from './unit/test.on';
import unitTestOff from './unit/test.off';
import unitTestEmit from './unit/test.emit';
import unitTestOnce from './unit/test.once';
import unitTestEventNames from './unit/test.eventNames';
import unitTestNewListener from './unit/test.newListener';
import unitTestRemoveListener from './unit/test.removeListener';

try {
  assert.ok(unitTestOn());
  assert.ok(unitTestOff());
  assert.ok(unitTestEmit());
  assert.ok(unitTestOnce());
  assert.ok(unitTestEventNames());
  assert.ok(unitTestNewListener());
  assert.ok(unitTestRemoveListener());

  console.log('TESTS ALL PAST');
} catch (e) {
  console.log('TESTS HAS FAILED');
  console.error(e);
}