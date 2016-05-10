/** Represents the value being checked, and provides assertion methods. Can be subclassed to
    provide assertion methods that are type-specific.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {*} value The value being checked.
    @constructor
*/
function Subject(failureStrategy, value) {
  this.failureStrategy = failureStrategy;
  this.value = value;
  this.name = null;
}

/** Return a string description of the value being tested. */
Subject.prototype.describe = function () {
  return this.name ? "'" + this.name + "'" : Subject.pretty(this.value) + '';
};

/** Convert a value to a printable string representation.
    @param {*} value The value to convert.
    @protected
*/
Subject.pretty = function (value) {
  if (typeof(value) == 'string') {
    return '"' + value + '"';
  }
  return value + '';
};

/** Generic failure method that takes a messasge.
    @param {string} msg The failure message.
    @protected
*/
Subject.prototype.fail = function (msg) {
  this.failureStrategy.fail(msg);
};

/** Failure method for simple comparison assertions.
    @param {*} expected The expected value, which is different from the actual value.
    @protected
*/
Subject.prototype.failEqual = function (expected) {
  if (this.name) {
    this.failureStrategy.fail(
      'Expected \'' + this.name + '\' to be ' + expected + ', actual value was ' +
        Subject.pretty(this.value) + '.');
  } else {
    this.failureStrategy.fail(
      'Expected ' + this.describe() + ' to be ' + expected + '.');
  }
};

/** Failure method for simple negated comparison assertions.
    @param {*} expected The expected value, which is the same as the actual value.
    @protected
*/
Subject.prototype.failNotEqual = function (expected) {
  this.failureStrategy.fail(
    'Expected ' + this.describe() + ' to not be ' + expected + '.');
};

/** Failure method for simple comparison assertions.
    @param {string} verb The name of the comparison verb, such has 'greater than'.
    @param {*} expected The value that we're comparing against.
    @protected
*/
Subject.prototype.failComparison = function (verb, expected) {
  if (this.name) {
    this.failureStrategy.fail(
      'Expected \'' + this.name + '\' to be ' + verb + ' ' + expected +
        ' but was ' + Subject.pretty(this.value) + '.');
  } else {
    this.failureStrategy.fail(
      'Expected ' + this.describe() + ' to be ' + verb + ' ' + expected + '.');
  }
};

/** Assign a descriptive name to the subject.
    @param {string} name The name to assign to this subject.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.named = function (name) {
  this.name = name;
  return this;
};

/** Ensure that the value being tested is true.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isTrue = function () {
  if (this.value !== true) {
    this.failEqual('true');
  }
  return this;
};

/** Ensure that the value being tested is false.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isFalse = function () {
  if (this.value !== false) {
    this.failEqual('false');
  }
  return this;
};

/** Ensure that the value being tested is true when coerced to a boolean.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isTruthy = function () {
  if (!this.value) {
    this.failEqual('truthy');
  }
  return this;
};

/** Ensure that the value being tested is false when coerced to a boolean.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isFalsey = function () {
  if (!!this.value) {
    this.failEqual('falsey');
  }
  return this;
};

/** Ensure that the value being tested is null.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNull = function () {
  if (this.value !== null) {
    this.failEqual('null');
  }
  return this;
};

/** Ensure that the value being tested is not null.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNotNull = function () {
  if (this.value === null) {
    this.failNotEqual('null');
  }
  return this;
};

/** Ensure that the value being tested is undefined.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isUndefined = function () {
  if (this.value !== undefined) {
    this.failEqual('undefined');
  }
  return this;
};

/** Ensure that the value being tested is not undefined.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNotUndefined = function () {
  if (this.value === undefined) {
    this.failNotEqual('undefined');
  }
  return this;
};

/** Ensure that the value being tested is null or undefined.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNullOrUndefined = function () {
  if (this.value !== null && this.value !== undefined) {
    this.failEqual('null or undefined');
  }
  return this;
};

/** Ensure that the value being tested is not null or undefined.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNotNullOrUndefined = function () {
  if (this.value === null || this.value === undefined) {
    this.failNotEqual('null or undefined');
  }
  return this;
};

/** Synonym for isNotNullOrUndefined.
    @function
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.exists = Subject.prototype.isNotNullOrUndefined;

/** Ensure that the value is equal to the expected value.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isEqualTo = function (expected) {
  if (!(this.value == expected)) {
    this.failEqual(Subject.pretty(expected));
  }
  return this;
};

/** Synonym for isEqualTo().
    @function
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.equals = Subject.prototype.isEqualTo;

/** Ensure that the value being tested is not equal to the expected value.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNotEqualTo = function (expected) {
  if (!(this.value != expected)) {
    this.failNotEqual(Subject.pretty(expected));
  }
  return this;
};

/** Ensure that the value being tested is exactly equal (===) to the expected value.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isExactly = function (expected) {
  if (!(this.value === expected)) {
    this.failComparison('exactly', Subject.pretty(expected));
  }
  return this;
};

/** Ensure that the value being tested is equal to the expected value using a deep comparison.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isDeeplyEqualTo = function (expected) {
  // This should be overridden in subclasses
  if (!(this.value == expected)) {
    this.failComparison('deeply equal to', Subject.pretty(expected));
  }
  return this;
};

// /** Ensure that the value being tested is equal to the expected value using a deep comparison. */
// Subject.prototype.isNotDeeplyEqualTo(expected) {
//   // This should be overridden in subclasses
//   if (!(this.value == expected)) {
//     this.failComparison('deeply equal to', expected);
//   }
//   return this;
// }

/** Ensure that the value being tested is greater than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isGreaterThan = function (expected) {
  if (!(this.value > expected)) {
    this.failComparison('greater than', Subject.pretty(expected));
  }
  return this;
};

/** Ensure that the value being tested is not greater than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNotGreaterThan = function (expected) {
  if (this.value > expected) {
    this.failComparison('not greater than', Subject.pretty(expected));
  }
  return this;
};

/** Ensure that the value being tested is less than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isLessThan = function (expected) {
  if (!(this.value < expected)) {
    this.failComparison('less than', Subject.pretty(expected));
  }
  return this;
};

/** Ensure that the value being tested is not less than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNotLessThan = function (expected) {
  if (this.value < expected) {
    this.failComparison('not less than', Subject.pretty(expected));
  }
  return this;
};

/** Ensure that the value being tested is an instance of the expected type.
    @param {Type} expected The expected type.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isInstanceOf = function (expected) {
  if (!(this.value instanceof expected)) {
    this.failureStrategy.fail(
      'Expected \'' + this.describe() + '\' to be instance of ' + Subject.pretty(expected) +
        ' but was type ' + typeof(this.value) + '.');
  }
  return this;
};

/** Ensure that the value being tested is not an instance of the expected type.
    @param {Type} expected The expected type.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.isNotInstanceOf = function (expected) {
  if (this.value instanceof expected) {
    this.failureStrategy.fail(
      'Expected type of \'' + this.describe() + '\' to not be ' + Subject.pretty(expected) + '.');
  }
  return this;
};

/** Ensure that the value being tested has exactly the expected type.
    @param {Type} expected The expected type.
    @return {Subject} 'this' for chaining.
*/
Subject.prototype.hasType = function (expected) {
  if (typeof(this.value) == expected) {
    this.failureStrategy.fail(
      'Expected\'' + this.describe() + '\' to have type ' + Subject.pretty(expected) +
        ' but was ' + typeof(this.value) + '.');
  }
  return this;
};

// .isEmpty()
// .isNotEmpty()
// .hasField(str).withValue(value)
// .contains(value)
// .containsAllOf(values...).inOrder()
// .containsExactly(values...).inOrder()
// .containsAnyOf(values...)
// .containsAllIn(iterable).inOrder()
// .containsExactlyElementsIn(iterable).inOrder()
// .containsAnyIn(iterable)
// .startsWith(str)
// .endsWith(str)
// .hasLength(value)
// .hasSize(value)
// .isOrdered(comparator)
// .isPartiallyOrdered(comparator)
// .containsKey(value)
// .containsEntry(key, value)
// .doesNotContainKey(value)

// .isIn(collection)
// .isNotIn(collection)

module.exports = Subject;
