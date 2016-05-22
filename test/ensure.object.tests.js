/* eslint-env node, mocha */
var ensure = require('../index.js').ensure;

function assertThrows(f, msg) {
  try {
    f();
  } catch (e) {
    ensure(e + '').named('message').equals('Error: ' + msg);
    return;
  }
  throw new Error('expected assertion failure with message: \'' + msg + '\'');
}

describe('ensure.object', function () {
  it('.isEmpty', function() {
    ensure({}).isEmpty();
    ensure({}).named('a').isEmpty();
    assertThrows(function() { ensure({ a: 1 }).isEmpty(); },
      'Expected [object Object] to be empty.');
  });

  it('.isNotEmpty', function() {
    ensure({ a: 1 }).isNotEmpty();
    ensure({ a: 1 }).named('a').isNotEmpty();
    assertThrows(function() { ensure({}).isNotEmpty(); },
      'Expected [object Object] to be non-empty.');
  });

  it('.hasField', function() {
    ensure({ a: 1 }).hasField('a');
    ensure({ a: 1 }).hasField('a').withValue(1);
    ensure({ a: 1 }).named('a').hasField('a');
    ensure({ a: 1 }).named('a').hasField('a').withValue(1);
    assertThrows(function() { ensure({}).hasField('b'); },
      'Expected [object Object] to have a field named \'b\'.');
    assertThrows(function() { ensure({ a: 1 }).hasField('a').withValue(2); },
      'Expected [object Object] to have a field \'a\' with value 2, actual value was 1.');
  });

  it('.hasOwnField', function() {
    ensure({ a: 1 }).hasOwnField('a');
    ensure({ a: 1 }).hasOwnField('a').withValue(1);
    ensure({ a: 1 }).named('a').hasOwnField('a');
    ensure({ a: 1 }).named('a').hasOwnField('a').withValue(1);
    assertThrows(function() { ensure({}).hasOwnField('b'); },
      'Expected [object Object] to have own field named \'b\'.');
    assertThrows(function() { ensure({ a: 1 }).hasOwnField('a').withValue(2); },
      'Expected [object Object] to have a field \'a\' with value 2, actual value was 1.');
  });
});
