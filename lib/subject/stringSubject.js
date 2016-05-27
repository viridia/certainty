/** @module certainty */
var format = require('../format');
var Subject = require('./subject');

/** Subclass of Subject which provides assertions methods for string types.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {object} value The value being checked.
    @constructor
    @extends Subject
*/
function StringSubject(failureStrategy, value) {
  Subject.call(this, failureStrategy, value);
}
StringSubject.prototype = Object.create(Subject.prototype);
StringSubject.prototype.constructor = StringSubject;

/** Ensure that the string being tested is the empty string.
    @return {ObjectSubject} `this` for chaining.
*/
StringSubject.prototype.isEmpty = function () {
  if (this.value !== '') {
    this.fail('Expected ' + this.describe() + ' to be the empty string.');
  }
  return this;
};

/** Ensure that the object being tested is not the empty string.
    @return {ObjectSubject} `this` for chaining.
*/
StringSubject.prototype.isNotEmpty = function () {
  if (this.value === '') {
    this.fail('Expected ' + this.describe() + ' to be non-empty.');
  }
  return this;
};

/** Ensure that the string being tested contains the expected substring.
    @param {string} expected The substring which this string is expected to contain.
    @return {ObjectSubject} `this` for chaining.
*/
StringSubject.prototype.includes = function (expected) {
  if (this.value.indexOf(expected) < 0) {
    this.fail('Expected ' + this.describe() + ' to include ' +
      format(expected) + '.');
  }
  return this;
};

/** Ensure that the string being tested starts with the expected substring.
    @param {string} expected The substring which this string is expected start with.
    @return {ObjectSubject} `this` for chaining.
*/
StringSubject.prototype.startsWith = function (expected) {
  if (this.value.indexOf(expected) != 0) {
    this.fail('Expected ' + this.describe() + ' to start with ' +
      format(expected) + '.');
  }
  return this;
};

/** Ensure that the string being tested ends with the expected substring.
    @param {string} expected The substring which this string is expected end with.
    @return {ObjectSubject} `this` for chaining.
*/
StringSubject.prototype.endsWith = function (expected) {
  if (this.value.lastIndexOf(expected) != this.value.length - expected.length) {
    this.fail('Expected ' + this.describe() + ' to end with ' +
      format(expected) + '.');
  }
  return this;
};

/** Ensure that the string being tested matches the given regular expression.
    @param {string} regex The regular expression.
    @return {ObjectSubject} `this` for chaining.
*/
StringSubject.prototype.matches = function (regex) {
  if (!this.value.match(regex)) {
    this.fail('Expected ' + this.describe() +
      ' to match the regular expression ' + regex + '.');
  }
  return this;
};

module.exports = StringSubject;
