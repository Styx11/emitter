import assert from 'assert';
import unitTestOn from './unit/test.on';
import unitTestOff from './unit/test.off';

try {
  assert.ok(unitTestOn());
  assert.ok(unitTestOff());

  console.log('TESTS ALL PAST');
} catch (e) {
  console.log('TESTS HAS FAILED');
  console.error(e);
}