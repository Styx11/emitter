import assert from 'assert';
import unitTestOn from './unit/test.on';

try {
  assert.ok(unitTestOn());

  console.log('TESTS ALL PAST');
} catch (e) {
  console.log('TESTS HAS FAILED');
  console.error(e);
}