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

describe('ensure.array', function () {
  it('.isEmpty', function() {
    ensure([]).isEmpty();
    ensure([]).named('a').isEmpty();
    assertThrows(function() { ensure([1, 2]).isEmpty(); }, 'Expected [1, 2] to be empty.');
    assertThrows(function() { ensure([1, 2]).named('array').isEmpty(); },
      'Expected array to be empty.');
  });

  it('.isNotEmpty', function() {
    ensure([1, 2]).isNotEmpty();
    ensure(['a']).named('a').isNotEmpty();
    assertThrows(function() { ensure([]).isNotEmpty(); }, 'Expected [] to be non-empty.');
    assertThrows(function() { ensure([]).named('array').isNotEmpty(); },
      'Expected array to be non-empty.');
  });

  it('.hasLength', function() {
    ensure([1, 2]).hasLength(2);
    ensure(['a']).named('a').hasLength(1);
    assertThrows(function() { ensure([1, 2]).hasLength(3); },
      'Expected [1, 2] to have length 3, but was 2.');
    assertThrows(function() { ensure([1, 2]).named('array').hasLength(3); },
      'Expected array to have length 3, but was 2.');
  });

  it('.contains', function() {
    ensure([1, 2]).contains(2);
    ensure(['a']).named('a').contains('a');
    assertThrows(function() { ensure([1, 2]).contains(3); },
      'Expected [1, 2] to contain 3.');
    assertThrows(function() { ensure([1, 2]).named('array').contains(3); },
      'Expected array to contain 3.');
  });

  it('.containsAllOf', function() {
    ensure([1, 2]).containsAllOf(2);
    ensure([1, 2]).containsAllOf(1, 2);
    ensure([1, 1, 1, 2, 2, 2]).containsAllOf(1, 1, 2, 2);
    ensure(['a']).named('a').containsAllOf('a');
    assertThrows(function() { ensure([1, 2]).containsAllOf(3); },
      'Expected [1, 2] to contain elements [3], is missing [3].');
    assertThrows(function() { ensure([1, 2]).named('array').containsAllOf(3); },
      'Expected array to contain elements [3], is missing [3].');
    assertThrows(function() { ensure(['a', 'b']).containsAllOf(3); },
      'Expected ["a", "b"] to contain elements [3], is missing [3].');
  });

  it('.containsAllOf.inOrder', function() {
    ensure([1, 2]).containsAllOf(1, 2).inOrder();
    ensure([1, 2, 1, 2]).containsAllOf(1, 1).inOrder();
    ensure([1, 2, 1, 2]).containsAllOf(2, 2).inOrder();
    ensure([1, 2, 1, 2]).containsAllOf(2, 1, 2).inOrder();
    ensure([1, 2, 1, 2]).containsAllOf(1, 2, 1, 2).inOrder();
    assertThrows(function() { ensure([1, 2]).containsAllOf(2, 1).inOrder(); },
      'Expected [1, 2] to contain elements [2, 1] in order, but contains only these elements ' +
      'in order: [2].');
    assertThrows(function() { ensure([1, 2, 1, 2]).containsAllOf(2, 1, 1).inOrder(); },
      'Expected [1, 2, 1, 2] to contain elements [2, 1, 1] in order, but contains only these ' +
      'elements in order: [2, 1].');
    assertThrows(function() { ensure([1, 2]).named('array').containsAllOf(3).inOrder(); },
      'Expected array to contain elements [3], is missing [3].');
  });

  it('.containsAllIn', function() {
    ensure([1, 2]).containsAllIn([2]);
    assertThrows(function() { ensure([1, 2]).containsAllIn([3]); },
      'Expected [1, 2] to contain elements [3], is missing [3].');
  });

  it('.containsExactly', function() {
    ensure([1, 2]).containsExactly(1, 2);
    ensure([1, 2, 1, 2]).containsExactly(1, 2, 1, 2);
    ensure([1, 1, 1, 2, 2, 2]).containsExactly(1, 1, 1, 2, 2, 2);
    assertThrows(function() { ensure([1, 2]).containsExactly(3); },
      'Expected [1, 2] to contain exactly elements [3], is missing [3], extra elements [1, 2].');
    assertThrows(function() { ensure([1, 2]).named('array').containsExactly(3); },
      'Expected array to contain exactly elements [3], is missing [3], extra elements [1, 2].');
    assertThrows(function() { ensure([1, 2, 2]).named('array').containsExactly(1); },
      'Expected array to contain exactly elements [1], extra elements [2, 2].');
    assertThrows(function() { ensure(['a', 'b']).containsExactly(3); },
      'Expected ["a", "b"] to contain exactly elements [3], is missing [3], extra elements ' +
      '["a", "b"].');
  });

  it('.containsExactly.inOrder', function() {
    ensure([1, 2]).containsExactly(1, 2).inOrder();
    ensure([1, 2, 1, 2]).containsExactly(1, 2, 1, 2).inOrder();
    ensure([1, 1, 2, 2]).containsExactly(1, 1, 2, 2).inOrder();
    assertThrows(function() { ensure([1, 2]).containsExactly(2, 1).inOrder(); },
      'Expected [1, 2] to contain exactly elements [2, 1] in order, but contains only these ' +
      'elements in order: [].');
    assertThrows(function() { ensure([1, 2, 1, 2]).containsExactly(1, 2, 2, 1).inOrder(); },
      'Expected [1, 2, 1, 2] to contain exactly elements [1, 2, 2, 1] in order, but contains ' +
      'only these elements in order: [1, 2].');
    assertThrows(function() { ensure([1, 2]).named('array').containsExactly(3).inOrder(); },
      'Expected array to contain exactly elements [3], is missing [3], extra elements [1, 2].');
  });

  it('.containsExactlyIn', function() {
    ensure([1, 2]).containsExactlyIn([1, 2]);
    assertThrows(function() { ensure([1, 2]).containsExactlyIn([3]); },
      'Expected [1, 2] to contain exactly elements [3], is missing [3], extra elements [1, 2].');
  });

  it('.containsAnyOf', function() {
    ensure([1, 2]).containsAnyOf(1, 2, 5, 6);
    ensure([1, 2, 1, 2]).containsAnyOf(1, 5);
    assertThrows(function() { ensure([1, 2]).containsAnyOf(3); },
      'Expected [1, 2] to contain any of [3].');
  });

  it('.containsAnyIn', function() {
    ensure([1, 2]).containsAnyIn([1, 2, 5, 6]);
    assertThrows(function() { ensure([1, 2]).containsAnyIn([3]); },
      'Expected [1, 2] to contain any of [3].');
  });

  it('.containsNoneOf', function() {
    ensure([1, 2]).containsNoneOf(5, 6);
    assertThrows(function() { ensure([1, 2]).containsNoneOf(1, 2); },
      'Expected [1, 2] to contain none of [1, 2], however it contains 1.');
  });

  it('.containsNoneIn', function() {
    ensure([1, 2]).containsNoneIn([5, 6]);
    assertThrows(function() { ensure([1, 2]).containsNoneIn([1, 2]); },
      'Expected [1, 2] to contain none of [1, 2], however it contains 1.');
  });

  function isEven(n) { return  (n % 2) == 0; }
  it('.containsAny', function() {
    ensure([2, 4]).containsAny('be even', isEven);
    assertThrows(function() { ensure([1, 3]).containsAny('be even', isEven); },
      'Expected any element of [1, 3] to be even.');
  });

  it('.containsAll', function() {
    ensure([2, 4]).containsAll('be even', isEven);
    assertThrows(function() { ensure([1, 2]).containsAll('be even', isEven); },
      'Expected all elements of [1, 2] to be even.');
  });

  it('.containsNone', function() {
    ensure([1, 3]).containsNone('be even', isEven);
    assertThrows(function() { ensure([1, 2]).containsNone('be even', isEven); },
      'Expected no elements of [1, 2] to be even.');
  });

  it('.eachElement', function() {
    ensure([3, 4, 5]).eachElement().isGreaterThan(2);
    assertThrows(function() { ensure([3, 4, 5]).eachElement().isLessThan(2); },
      'Expected element 0 of [3, 4, 5] to be less than 2, actual value was 3.');
  });
});
