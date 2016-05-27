/* eslint-env node, mocha */
/* global Set */
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

if (typeof Set !== 'undefined') {
  describe('ensure.set', function () {
    it('.isEmpty', function() {
      ensure(new Set([])).isEmpty();
      assertThrows(function() { ensure(new Set([1, 2])).isEmpty(); },
        'Expected Set([1, 2]) to be an empty set.');
    });

    it('.isNotEmpty', function() {
      ensure(new Set([1, 2])).isNotEmpty();
      assertThrows(function() { ensure(new Set()).isNotEmpty(); },
        'Expected Set([]) to be a non-empty set.');
    });

    it('.hasSize', function() {
      ensure(new Set([1, 2])).hasSize(2);
      assertThrows(function() { ensure(new Set([1, 2])).hasSize(3); },
        'Expected Set([1, 2]) to be of size 3, actual size was 2.');
    });

    it('.contains', function() {
      ensure(new Set([1, 2])).contains(2);
      assertThrows(function() { ensure(new Set([1, 2])).contains(3); },
        'Expected Set([1, 2]) to contain 3.');
    });

    it('.containsAllOf', function() {
      ensure(new Set([1, 2])).containsAllOf(1, 2);
      assertThrows(function() { ensure(new Set([1, 2])).containsAllOf(3); },
        'Expected Set([1, 2]) to contain all of [3], is missing [3].');
    });

    it('.containsAllIn', function() {
      ensure(new Set([1, 2])).containsAllIn([1, 2]);
      assertThrows(function() { ensure(new Set([1, 2])).containsAllIn([3]); },
        'Expected Set([1, 2]) to contain all of [3], is missing [3].');
    });

    it('.containsExactly', function() {
      ensure(new Set([1, 2])).containsExactly(1, 2);
      assertThrows(function() { ensure(new Set([1, 2])).containsExactly(3); },
        'Expected Set([1, 2]) to contain exactly elements [3], is missing [3], ' +
        'extra elements [1, 2].');
    });

    it('.containsExactlyIn', function() {
      ensure(new Set([1, 2])).containsExactlyIn([1, 2]);
      assertThrows(function() { ensure(new Set([1, 2])).containsExactlyIn([3]); },
        'Expected Set([1, 2]) to contain exactly elements [3], is missing [3], ' +
        'extra elements [1, 2].');
    });

    it('.containsAnyOf', function() {
      ensure(new Set([1, 2])).containsAnyOf(1, 2, 5, 6);
      assertThrows(function() { ensure(new Set([1, 2])).containsAnyOf(3); },
        'Expected Set([1, 2]) to contain any of [3].');
    });

    it('.containsAnyIn', function() {
      ensure(new Set([1, 2])).containsAnyIn([1, 2, 5, 6]);
      assertThrows(function() { ensure(new Set([1, 2])).containsAnyIn([3]); },
        'Expected Set([1, 2]) to contain any of [3].');
    });

    it('.containsNoneOf', function() {
      ensure(new Set([1, 2])).containsNoneOf(5, 6);
      assertThrows(function() { ensure(new Set([1, 2])).containsNoneOf(1, 2); },
        'Expected Set([1, 2]) to contain none of [1, 2], however it contains 1.');
    });

    it('.containsNoneIn', function() {
      ensure(new Set([1, 2])).containsNoneIn([5, 6]);
      assertThrows(function() { ensure(new Set([1, 2])).containsNoneIn([1, 2]); },
        'Expected Set([1, 2]) to contain none of [1, 2], however it contains 1.');
    });

    function isEven(n) { return  (n % 2) == 0; }
    it('.containsAny', function() {
      ensure(new Set([2, 4])).containsAny('be even', isEven);
      assertThrows(function() { ensure(new Set([1, 3])).containsAny('be even', isEven); },
        'Expected any element of Set([1, 3]) to be even.');
    });

    it('.containsAll', function() {
      ensure(new Set([2, 4])).containsAll('be even', isEven);
      assertThrows(function() { ensure(new Set([1, 2])).containsAll('be even', isEven); },
        'Expected all elements of Set([1, 2]) to be even.');
    });

    it('.containsNone', function() {
      ensure(new Set([1, 3])).containsNone('be even', isEven);
      assertThrows(function() { ensure(new Set([1, 2])).containsNone('be even', isEven); },
        'Expected no elements of Set([1, 2]) to be even.');
    });

    it('.eachMember', function() {
      ensure(new Set([3, 4, 5])).eachMember().isGreaterThan(2);
      assertThrows(function() { ensure(new Set([3, 4, 5])).eachMember().isLessThan(2); },
        'Expected member of Set([3, 4, 5]) to be less than 2, actual value was 3.');
    });
  });
}
