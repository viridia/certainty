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

var testProto = { inherited: 2 };
var testObj = { a: 1 };
Object.setPrototypeOf(testObj, testProto);

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
    ensure(testObj).hasField('a');
    ensure(testObj).hasField('a').withValue(1);
    ensure(testObj).named('a').hasField('a');
    ensure(testObj).named('a').hasField('a').withValue(1);
    ensure(testObj).hasField('inherited');
    ensure(testObj).hasField('inherited').withValue(2);
    assertThrows(function() { ensure({}).hasField('b'); },
      'Expected [object Object] to have a field named \'b\'.');
    assertThrows(function() { ensure({ a: 1 }).hasField('a').withValue(2); },
      'Expected [object Object] to have a field \'a\' with value 2, actual value was 1.');
  });

  it('.doesNotHaveField', function() {
    ensure(testObj).doesNotHaveField('b');
    ensure(testObj).named('a').doesNotHaveField('b');
    assertThrows(function() { ensure(testObj).doesNotHaveField('a'); },
      'Expected [object Object] to not have a field named \'a\'.');
    assertThrows(function() { ensure(testObj).doesNotHaveField('inherited'); },
      'Expected [object Object] to not have a field named \'inherited\'.');
  });

  it('.hasOwnField', function() {
    ensure(testObj).hasOwnField('a');
    ensure(testObj).hasOwnField('a').withValue(1);
    ensure(testObj).named('a').hasOwnField('a');
    ensure(testObj).named('a').hasOwnField('a').withValue(1);
    assertThrows(function() { ensure(testObj).hasOwnField('b'); },
      'Expected [object Object] to have own field named \'b\'.');
    assertThrows(function() { ensure(testObj).hasOwnField('a').withValue(2); },
      'Expected [object Object] to have a field \'a\' with value 2, actual value was 1.');
    assertThrows(function() { ensure(testObj).hasOwnField('inherited'); },
      'Expected [object Object] to have own field named \'inherited\'.');
  });

  it('.doesNotHaveOwnField', function() {
    ensure(testObj).doesNotHaveOwnField('b');
    ensure(testObj).named('a').doesNotHaveOwnField('b');
    ensure(testObj).doesNotHaveOwnField('inherited');
    assertThrows(function() { ensure(testObj).doesNotHaveOwnField('a'); },
      'Expected [object Object] to not have own field named \'a\'.');
  });
});
