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

describe('ensure.string', function () {
  it('.isEmpty', function() {
    ensure('').isEmpty();
    ensure('').named('a').isEmpty();
    assertThrows(function() { ensure('a').isEmpty(); },
      'Expected "a" to be the empty string.');
  });

  it('.isNotEmpty', function() {
    ensure('a').isNotEmpty();
    assertThrows(function() { ensure('').isNotEmpty(); },
      'Expected "" to be non-empty.');
  });

  it('.includes', function() {
    ensure('abc').includes('ab');
    assertThrows(function() { ensure('abc').includes('ac'); },
      'Expected "abc" to include "ac".');
  });

  it('.doesNotInclude', function() {
    ensure('abc').doesNotInclude('ac');
    assertThrows(function() { ensure('abc').doesNotInclude('ab'); },
      'Expected "abc" to not include "ab".');
  });

  it('.startsWith', function() {
    ensure('abc').startsWith('a');
    assertThrows(function() { ensure('abc').startsWith('b'); },
      'Expected "abc" to start with "b".');
  });

  it('.endsWith', function() {
    ensure('abc').endsWith('c');
    assertThrows(function() { ensure('abc').endsWith('a'); },
      'Expected "abc" to end with "a".');
  });

  it('.matches', function() {
    ensure('aa').matches(/a+/);
    assertThrows(function() { ensure('aa').matches('/ab/'); },
      'Expected "aa" to match the regular expression /ab/.');
  });
});
