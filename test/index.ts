import assert from 'assert';
import unitTestOn from './unit/test.on';
import unitTestOff from './unit/test.off';
import unitTestEmit from './unit/test.emit';
import unitTestOnce from './unit/test.once';

try {
  assert.ok(unitTestOn());
  assert.ok(unitTestOff());
  assert.ok(unitTestEmit());
  assert.ok(unitTestOnce());

  console.log('TESTS ALL PAST');
} catch (e) {
  console.log('TESTS HAS FAILED');
  console.error(e);
}