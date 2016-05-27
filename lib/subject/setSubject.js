/** @module certainty */
/* global Set */
var format = require('../format');
var Subject = require('./subject');
var EachSubject = require('./eachSubject');

/** Subclass of Subject which provides assertions methods for Set types.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {object} value The value being checked.
    @constructor
    @extends Subject
*/
function SetSubject(failureStrategy, value) {
  Subject.call(this, failureStrategy, value);
}
SetSubject.prototype = Object.create(Subject.prototype);
SetSubject.prototype.constructor = SetSubject;

/** Ensure that the set is empty. This only checks for fields on the object, not
    its prototype.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.isEmpty = function () {
  if (this.value.size !== 0) {
    this.fail('Expected ' + this.describe() + ' to be an empty set.');
  }
  return this;
};

/** Ensure that the set is non-empty. This only checks for fields on the object,
    not its prototype.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.isNotEmpty = function () {
  if (this.value.size === 0) {
    this.fail('Expected ' + this.describe() + ' to be a non-empty set.');
  }
  return this;
};

/** Ensure that the set is the expected size.
    @param {number} size The expected size of the set.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.hasSize = function (size) {
  if (this.value.size !== size) {
    this.fail('Expected ' + this.describe() + ' to be of size ' + size +
      ', actual size was ' + this.value.size + '.');
  }
  return this;
};

/** Ensure that the set contains a given item
    @param {*} item The expected item.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.contains = function (value) {
  if (!this.value.has(value)) {
    this.fail('Expected ' + this.describe() + ' to contain ' + format(value) + '.');
  }
  return this;
};

/** Ensure that the set does not contain a given item
    @param {*} item The expected item.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.doesNotContain = function (value) {
  if (this.value.has(value)) {
    this.fail('Expected ' + this.describe() + ' to not contain ' +
      format(value) + '.');
  }
  return this;
};

/** Ensure that the set contains all of the elements specified.
    @param {...*} elements The elements that the set must contain.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsAllOf = function () {
  return this.containsAllIn(arguments);
};

/** Ensure that the set contains exactly the elements specified.
    @param {...*} elements The elements that the set must contain.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsExactly = function () {
  return this.containsExactlyIn(arguments);
};

/** Ensure that the set contains any of the elements specified.
    @param {...*} elements The elements that the set must contain.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsAnyOf = function () {
  return this.containsAnyIn(arguments);
};

/** Ensure that the set contains none of the elements specified.
    @param {...*} elements The elements that the set must not contain.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsNoneOf = function () {
  return this.containsNoneIn(arguments);
};

/** Ensure that the array contains all of the elements specified.
    @param {Iterable} elements Iterable which produces the elements that the array must contain.
    @return {InOrder} An InOrder object which allows the 'inOrder' assertion for the
      given elements.
*/
SetSubject.prototype.containsAllIn = function (elements) {
  var missing = [];
  for (var key in elements) {
    var el = elements[key];
    if (!this.value.has(el)) {
      missing.push(el);
    }
  }

  if (missing.length > 0) {
    this.fail('Expected ' + this.describe() + ' to contain all of ' +
      format(Array.prototype.slice.call(elements)) + ', is missing ' + format(missing) + '.');
  }

  return this;
};

/** Ensure that the array contains exactly the elements specified.
    @param {Iterable} elements Iterable which produces the elements that the array must contain.
    @return {InOrder} An InOrder object which allows the 'inOrder' assertion for the
      given elements
*/
SetSubject.prototype.containsExactlyIn = function (elements) {
  var extra = new Set(this.value);
  var missing = [];
  for (var key in elements) {
    var el = elements[key];
    if (this.value.has(el)) {
      extra.delete(el);
    } else {
      missing.push(el);
    }
  }

  var msg;
  if (missing.length || extra.size) {
    msg = 'Expected ' + this.describe() + ' to contain exactly elements ' +
      format(Array.prototype.slice.call(elements));
    if (missing.length) {
      msg += ', is missing ' + format(missing);
    }
    if (extra.size) {
      msg += ', extra elements ' + format(Array.from(extra));
    }
    msg += '.';
    this.fail(msg);
  }
  return this;
};

/** Ensure that the array contains any of the elements specified.
    @param {Iterable} elements Iterable which produces the elements that the array must contain.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsAnyIn = function (elements) {
  for (var key in elements) {
    var el = elements[key];
    if (this.value.has(el)) {
      return this;
    }
  }
  this.fail('Expected ' + this.describe() + ' to contain any of ' +
    format(Array.prototype.slice.call(elements)) + '.');
  return this;
};

/** Ensure that the array contains none of the elements specified.
    @param {Iterable} elements Iterable which produces the elements that the array must not contain.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsNoneIn = function (elements) {
  for (var key in elements) {
    var el = elements[key];
    if (this.value.has(el)) {
      this.fail('Expected ' + this.describe() + ' to contain none of ' +
        format(Array.prototype.slice.call(elements)) + ', however it contains ' + format(el) + '.');
      return this;
    }
  }
  return this;
};

/** Ensure that at least one element of the array satisfies a test function.
    @param {string} verb A description of the test, such as 'be even' or 'be prime'.
    @param {Function} testFn The test that elements must satisfy.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsAny = function (verb, testFn) {
  var iter = this.value.values();
  for (var i = iter.next(); !i.done; i = iter.next()) {
    if (testFn(i.value)) {
      return this;
    }
  }
  this.fail('Expected any element of ' + this.describe() + ' to ' + verb + '.');
  return this;
};

/** Ensure that at all the elements of the array satisfy a test function.
    @param {string} verb A description of the test, such as 'be even' or 'be prime'.
    @param {Function} testFn The test that elements must satisfy.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsAll = function (verb, testFn) {
  var iter = this.value.values();
  for (var i = iter.next(); !i.done; i = iter.next()) {
    if (!testFn(i.value)) {
      this.fail('Expected all elements of ' + this.describe() + ' to ' +
        verb + '.');
      return this;
    }
  }
  return this;
};

/** Ensure that at none the elements of the array satisfy a test function.
    @param {string} verb A description of the test, such as 'be even' or 'be prime'.
    @param {Function} testFn The test that elements must satisfy.
    @return {SetSubject} `this` for chaining.
*/
SetSubject.prototype.containsNone = function (verb, testFn) {
  var iter = this.value.values();
  for (var i = iter.next(); !i.done; i = iter.next()) {
    if (testFn(i.value)) {
      this.fail('Expected no elements of ' + this.describe() + ' to ' + verb + '.');
      return this;
    }
  }
  return this;
};

/** Causes any subsequent assertion methods to apply to each member of the set individually.
    @return {EachSubject} Fluent context that applies assertions to set members.
*/
SetSubject.prototype.eachMember = function () {
  return new EachSubject(this, Array.from(this.value), 'member', true);
};

module.exports = SetSubject;
