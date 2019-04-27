import assert from 'assert';
import unitTestOn from './unit/test.on';
import unitTestOff from './unit/test.off';
import unitTestEmit from './unit/test.emit';
import unitTestOnce from './unit/test.once';
import unitTestNewListener from './unit/test.newListener';

try {
  assert.ok(unitTestOn());
  assert.ok(unitTestOff());
  assert.ok(unitTestEmit());
  assert.ok(unitTestOnce());
  assert.ok(unitTestNewListener());

  console.log('TESTS ALL PAST');
} catch (e) {
  console.log('TESTS HAS FAILED');
  console.error(e);
}