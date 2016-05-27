/** @module certainty */
var format = require('../format');
var Subject = require('./subject');
var ProxyBase = require('./proxy');

function isEmpty(obj) {
  /* eslint no-unused-vars: ["off"] */
  for (var x in obj) { return false; }
  return true;
}

/** A fluent context object containing the value of the field that was just tested. Used for
    additional assertions about a field.
    @constructor
  */
function FieldValue(subject, name, value) {
  this.subject = subject;
  this.name = name;
  this.value = subject.value[name];
}

/** Ensure that the field has the expected value.
    @param {*} value The expected value of the field.
*/
FieldValue.prototype.withValue = function (expected) {
  if (this.value != expected) {
    this.subject.fail('Expected ' + this.subject.describe() + ' to have a field \'' + this.name +
      '\' with value ' + format(expected) + ', actual value was ' + this.value + '.');
  }
  return this;
}
ProxyBase.addMethods(FieldValue);

// Used when the key is missing, so that .withValue() doesn't produce a second error message.
function MissingKeyValue() {}
MissingKeyValue.prototype.withValue = function (expected) {
  return this;
}

/** Subclass of Subject which provides assertions methods for object types.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {object} value The value being checked.
    @constructor
    @extends Subject
*/
function ObjectSubject(failureStrategy, value) {
  Subject.call(this, failureStrategy, value);
}
ObjectSubject.prototype = Object.create(Subject.prototype);
ObjectSubject.prototype.constructor = ObjectSubject;

/** Ensure that the object being tested is empty. This only checks for fields on the object, not
    its prototype.
    @return {ObjectSubject} `this` for chaining.
*/
ObjectSubject.prototype.isEmpty = function () {
  if (!isEmpty(this.value)) {
    this.fail('Expected ' + this.describe() + ' to be empty.');
  }
  return this;
};

/** Ensure that the object being tested is non-empty. This only checks for fields on the object,
    not its prototype.
    @return {ObjectSubject} `this` for chaining.
*/
ObjectSubject.prototype.isNotEmpty = function () {
  if (isEmpty(this.value)) {
    this.fail('Expected ' + this.describe() + ' to be non-empty.');
  }
  return this;
};

/** Ensure that the object being tested has a property (either its own or inherited) with the
    specified field name.
    @param {string} fieldName The name of the property.
    @return {FieldValue} FieldValue for additional assertions on the field value.
*/
ObjectSubject.prototype.hasField = function (fieldName) {
  if (!(fieldName in this.value)) {
    this.fail('Expected ' + this.describe() + ' to have a field named \'' +
      fieldName + '\'.');
    return new MissingKeyValue();
  }
  return new FieldValue(this, fieldName);
};

/** Ensure that the object has a property with the given field name. The property must be one
    of the object's own properties, not one inherited from a prototype.
    @param {string} fieldName The name of the property.
    @return {FieldValue} FieldValue for additional assertions on the field value.
*/
ObjectSubject.prototype.hasOwnField = function (fieldName) {
  if (!(fieldName in this.value)) {
    this.fail('Expected ' + this.describe() + ' to have own field named \'' +
      fieldName + '\'.');
  }
  return new FieldValue(this, fieldName);
};

module.exports = ObjectSubject;
