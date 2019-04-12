import result_on from './test.on';
const assert = require('assert');

try {
  assert.ok(result_on);

  console.log('TEST ALL PAST');
} catch (e) {
  console.error(e);
}