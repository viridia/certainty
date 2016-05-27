/** @module certainty */
var format = require('../format');
var Subject = require('./subject');
var ProxyBase = require('./proxy');

/** A fluent context object containing the value of the field that was just tested. Used for
    additional assertions about a field.
    @constructor
  */
function KeyValue(subject, key) {
  this.subject = subject;
  this.key = key;
  this.value = subject.value.get(key);
}

/** Ensure that the field has the expected value.
    @param {*} value The expected value of the field.
*/
KeyValue.prototype.withValue = function (expected) {
  if (this.value != expected) {
    this.subject.fail('Expected ' + this.subject.describe() + ' to contain key ' +
      format(this.key) + ' with value ' + format(expected) + ', actual value was ' +
      this.value + '.');
  }
}
ProxyBase.addMethods(KeyValue);

// Used when the key is missing, so that .withValue() doesn't produce a second error message.
function MissingKeyValue() {}
MissingKeyValue.prototype.withValue = function (_expected) {
  return this;
}

/** Subclass of Subject which provides assertions methods for Map types.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {object} value The value being checked.
    @constructor
    @extends Subject
*/
function MapSubject(failureStrategy, value) {
  Subject.call(this, failureStrategy, value);
}
MapSubject.prototype = Object.create(Subject.prototype);
MapSubject.prototype.constructor = MapSubject;

/** Ensure that the map is empty.
    @return {MapSubject} `this` for chaining.
*/
MapSubject.prototype.isEmpty = function () {
  if (this.value.size !== 0) {
    this.fail('Expected ' + this.describe() + ' to be an empty map.');
  }
  return this;
};

/** Ensure that the map is non-empty.
    @return {MapSubject} `this` for chaining.
*/
MapSubject.prototype.isNotEmpty = function () {
  if (this.value.size === 0) {
    this.fail('Expected ' + this.describe() + ' to be a non-empty map.');
  }
  return this;
};

/** Ensure that the map is the expected size.
    @param {number} size The expected size of the map.
    @return {MapSubject} `this` for chaining.
*/
MapSubject.prototype.hasSize = function (size) {
  if (this.value.size !== size) {
    this.fail('Expected ' + this.describe() + ' to be of size ' + size +
      ', actual size was ' + this.value.size + '.');
  }
  return this;
};

/** Ensure that the map contains a given key.
    @return {MapSubject} `this` for chaining.
    @param {*} key The key expected to be in the map.
*/
MapSubject.prototype.containsKey = function (key) {
  if (!this.value.has(key)) {
    this.fail('Expected ' + this.describe() + ' to contain key ' + format(key) + '.');
    return new MissingKeyValue();
  }
  return new KeyValue(this, key);
};

/** Ensure that the map does not contain a given key.
    @param {*} key The key not expected to be in the map.
    @return {MapSubject} `this` for chaining.
*/
MapSubject.prototype.doesNotContainKey = function (key) {
  if (this.value.has(key)) {
    this.fail('Expected ' + this.describe() + ' to not contain key ' +
      format(key) + '.');
  }
  return this;
};

/** Ensure that the map contains a given key / value pair.
    @param {*} key The key expected to be in the map.
    @param {*} value The expected value for that key.
    @return {MapSubject} `this` for chaining.
*/
MapSubject.prototype.containsEntry = function (key, value) {
  if (!this.value.has(key)) {
    this.fail('Expected ' + this.describe() + ' to contain key ' + format(key) + '.');
  } else if (this.value.get(key) != value) {
    this.fail('Expected ' + this.describe() + ' to contain key ' + format(key) + ' with value ' +
      format(value) + ', actual value was ' + format(this.value.get(key)) + '.');
  }
  return this;
};

module.exports = MapSubject;
