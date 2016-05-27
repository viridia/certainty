/* eslint-env node, mocha */
/* global Map */
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

if (typeof Map !== 'undefined') {
  describe('ensure.map', function () {
    var m = new Map([[1, 2], ['a', 'b']]);

    it('.isEmpty', function() {
      ensure(new Map([])).isEmpty();
      assertThrows(function() { ensure(m).isEmpty(); },
        'Expected Map([[1, 2], ["a", "b"]]) to be an empty map.');
    });

    it('.isNotEmpty', function() {
      ensure(m).isNotEmpty();
      assertThrows(function() { ensure(new Map()).isNotEmpty(); },
        'Expected Map([]) to be a non-empty map.');
    });

    it('.hasSize', function() {
      ensure(m).hasSize(2);
      assertThrows(function() { ensure(m).hasSize(3); },
        'Expected Map([[1, 2], ["a", "b"]]) to be of size 3, actual size was 2.');
    });

    it('.containsKey', function() {
      ensure(m).containsKey(1).withValue(2);
      assertThrows(function() { ensure(m).containsKey(2).withValue(2); },
        'Expected Map([[1, 2], ["a", "b"]]) to contain key 2.');
      assertThrows(function() { ensure(m).containsKey(1).withValue(1); },
        'Expected Map([[1, 2], ["a", "b"]]) to contain key 1 with value 1, actual value was 2.');
    });

    it('.containsEntry', function() {
      ensure(m).containsEntry(1, 2);
      assertThrows(function() { ensure(m).containsEntry(2, 2); },
        'Expected Map([[1, 2], ["a", "b"]]) to contain key 2.');
      assertThrows(function() { ensure(m).containsEntry(1, 1); },
        'Expected Map([[1, 2], ["a", "b"]]) to contain key 1 with value 1, actual value was 2.');
    });
  });
}
