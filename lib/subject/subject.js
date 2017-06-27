/** @module certainty */
var diff = require('../compare').diff;
var compare = require('../compare').compare;
var format = require('../format/format');

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
  this.format = format;
  this.failureMessage = null;
}

/** Return a string description of the subject. */
Subject.prototype.describe = function () {
  return this.name ? this.name : this.format(this.value, { clip: 128 }) + '';
};

/** Generic failure method that takes a messasge.
    @param {string} msg The failure message.
    @protected
*/
Subject.prototype.fail = function (msg) {
  this.failureStrategy.fail(this.failureMessage || msg);
};

/** Failure method for simple comparison assertions.
    @param {*} expected The expected value, which is different from the actual value.
    @protected
*/
Subject.prototype.failEqual = function (expected) {
  if (this.name) {
    this.fail(
      'Expected ' + this.name + ' to be ' + expected + ', actual value was ' +
        this.format(this.value, { clip: 128 }) + '.');
  } else {
    this.fail(
      'Expected ' + this.describe() + ' to be ' + expected + '.');
  }
};

/** Failure method for simple negated comparison assertions.
    @param {*} expected The expected value, which is the same as the actual value.
    @protected
*/
Subject.prototype.failNotEqual = function (expected) {
  this.fail(
    'Expected ' + this.describe() + ' to not be ' + expected + '.');
};

/** Failure method for simple comparison assertions.
    @param {string} verb The name of the comparison verb, such has 'greater than'.
    @param {*} expected The value that we're comparing against.
    @protected
*/
Subject.prototype.failComparison = function (verb, expected) {
  if (this.name) {
    this.fail(
      'Expected ' + this.name + ' to be ' + verb + ' ' + expected +
        ', actual value was ' + this.format(this.value) + '.');
  } else {
    this.fail(
      'Expected ' + this.describe() + ' to be ' + verb + ' ' + expected + '.');
  }
};

/** Assign a descriptive name to the subject.
    @param {string} name The name to assign to this subject.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.named = function (name) {
  this.name = name;
  return this;
};

/** Override the normal failure message.
    @param {string} msg The failure message to use on failure.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.withFailureMessage = function (msg) {
  this.failureMessage = msg;
  return this;
};

/** Ensure that the subject value is `true`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isTrue = function () {
  if (this.value !== true) {
    this.failEqual('true');
  }
  return this;
};

/** Ensure that the subject value is `false`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isFalse = function () {
  if (this.value !== false) {
    this.failEqual('false');
  }
  return this;
};

/** Ensure that the subject value is true when coerced to a boolean.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isTruthy = function () {
  if (!this.value) {
    this.failEqual('truthy');
  }
  return this;
};

/** Ensure that the subject value is false when coerced to a boolean.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isFalsey = function () {
  if (this.value) {
    this.failEqual('falsey');
  }
  return this;
};

/** Ensure that the subject value is `null`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNull = function () {
  if (this.value !== null) {
    this.failEqual('null');
  }
  return this;
};

/** Ensure that the subject value is not `null`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNotNull = function () {
  if (this.value === null) {
    this.failNotEqual('null');
  }
  return this;
};

/** Ensure that the subject value is `undefined`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isUndefined = function () {
  if (this.value !== undefined) {
    this.failEqual('undefined');
  }
  return this;
};

/** Ensure that the subject value is not `undefined`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNotUndefined = function () {
  if (this.value === undefined) {
    this.failNotEqual('undefined');
  }
  return this;
};

/** Ensure that the subject value is `null` or `undefined`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNullOrUndefined = function () {
  if (this.value !== null && this.value !== undefined) {
    this.failEqual('null or undefined');
  }
  return this;
};

/** Ensure that the subject value is not `null` or `undefined`.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNotNullOrUndefined = function () {
  if (this.value === null || this.value === undefined) {
    this.failNotEqual('null or undefined');
  }
  return this;
};

/** Synonym for isNotNullOrUndefined.
    @function
    @return {Subject} `this` for chaining.
*/
Subject.prototype.exists = Subject.prototype.isNotNullOrUndefined;

/** Ensure that the value is equal to the expected value.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isEqualTo = function (expected) {
  if (!(this.value == expected)) {
    var d = diff(expected, this.value, this.name, false);
    this.fail(d.join('\n'));
  }
  return this;
};

/** Synonym for isEqualTo().
    @function
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.equals = Subject.prototype.isEqualTo;

/** Ensure that the subject value is not equal to the expected value.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNotEqualTo = function (expected) {
  if (!(this.value != expected)) {
    this.failNotEqual(this.format(expected));
  }
  return this;
};

/** Ensure that the subject value is exactly equal (===) to the expected value.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isExactly = function (expected) {
  if (!(this.value === expected)) {
    this.failComparison('exactly', this.format(expected));
  }
  return this;
};

/** Ensure that the subject value is equal to the expected value using a deep comparison.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isDeeplyEqualTo = function (expected) {
  var d = diff(expected, this.value, this.name, true);
  if (d.length > 0) {
    if (d.length > 4) {
      // If there are more than 4 differences, just display the first 4.
      var msg = '...' + d.length - 4 + ' additional differences not shown.';
      d = d.slice(0, 4);
      d.push(msg);
    }
    this.fail(d.join('\n'));
  }
  return this;
};

/** Ensure that the subject value is equal to the expected value using a deep comparison. */
Subject.prototype.isNotDeeplyEqualTo = function (expected) {
  if (compare(expected, this.value, this.name, true)) {
    this.fail(
      'Expected ' + this.describe() + ' to not be deeply equal to ' + expected + '.');
  }
  return this;
}

/** Ensure that the subject value is greater than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isGreaterThan = function (expected) {
  if (!(this.value > expected)) {
    this.failComparison('greater than', this.format(expected));
  }
  return this;
};

/** Ensure that the subject value is not greater than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNotGreaterThan = function (expected) {
  if (this.value > expected) {
    this.failComparison('not greater than', this.format(expected));
  }
  return this;
};

/** Ensure that the subject value is less than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isLessThan = function (expected) {
  if (!(this.value < expected)) {
    this.failComparison('less than', this.format(expected));
  }
  return this;
};

/** Ensure that the subject value is not less than to the expected value.
    @param {*} expected The expected value.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNotLessThan = function (expected) {
  if (this.value < expected) {
    this.failComparison('not less than', this.format(expected));
  }
  return this;
};

/** Ensure that the subject value is an instance of the expected type.
    @param {Type} expected The expected type.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isInstanceOf = function (expected) {
  if (!(this.value instanceof expected)) {
    var value = this.value;
    if (typeof value !== 'object') {
      // Convert primitive to wrapper object
      value = ({}).valueOf.call(value);
    }
    this.fail(
      'Expected ' + this.describe() + ' to be instance of ' + expected.name +
        ', actual prototype was ' + Object.getPrototypeOf(value).constructor.name + '.');
  }
  return this;
};

/** Ensure that the subject value is not an instance of the expected type.
    @param {Type} expected The expected type.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNotInstanceOf = function (expected) {
  if (this.value instanceof expected) {
    this.fail(
      'Expected ' + this.describe() + ' to not be instance of ' + expected.name + '.');
  }
  return this;
};

/** Ensure that the subject value has the expected type.
    @param {string} expected The name of the expected type.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.hasType = function (expected) {
  var ty = typeof(this.value);
  if (ty !== expected) {
    this.fail(
      'Expected ' + this.describe() + ' to have type ' + this.format(expected) +
        ', actual type was "' + ty + '".');
  }
  return this;
};

/** Ensure that the subject is in the specified collection.
    @param {Collection} collection An array or set containing matchable elements.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isIn = function (collection) {
  /* global Set */
  if (Array.isArray(collection)) {
    if (collection.indexOf(this.value) >= 0) {
      return this;
    }
  } else if (typeof Set !== 'undefined' && collection instanceof Set) {
    if (collection.has(this.value)) {
      return this;
    }
  }
  this.fail(
    'Expected ' + this.describe() + ' to be in ' + this.format(collection) + '.');
  return this;
};

/** Ensure that the given test function returns true for the subject.
    @param {string} verb A description of the test, such as 'be even' or 'be prime'.
    @param {Function} testFn The test that the subject must satisfy.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.is = function (verb, testFn) {
  /* global Set */
  if (testFn(this.value)) {
    return this;
  }
  this.fail('Expected ' + this.describe() + ' to ' + verb + '.');
  return this;
};

/** Ensure that the given test function returns false for the subject.
    @param {string} verb A description of the test, such as 'be even' or 'be prime'.
    @param {Function} testFn The test that the subject must not satisfy.
    @return {Subject} `this` for chaining.
*/
Subject.prototype.isNot = function (verb, testFn) {
  /* global Set */
  if (!testFn(this.value)) {
    return this;
  }
  this.fail('Expected ' + this.describe() + ' to not ' + verb + '.');
  return this;
};

module.exports = Subject;
