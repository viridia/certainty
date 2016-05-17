/** @module certainty */
/* global Map Set */
var Subject = require('./subject');
var ArraySubject = require('./arraySubject');
var ObjectSubject = require('./objectSubject');

/** Singleton factory that accepts a value to be tested, queries it's type, and constructs
    an appropriate Subject type to wrap it.
    @constructor
*/
function SubjectFactory() {
  this.types = [];
  // Default factory
  this.types.unshift(function(failureStrategy, value) {
    if (Array.isArray(value)) {
      return new ArraySubject(failureStrategy, value);
    }
    if (typeof value == 'object') {
      return new ObjectSubject(failureStrategy, value);
    }
    return null;
  });

  if (typeof Map != undefined) {
    var MapSubject = require('./mapSubject');
    this.types.unshift(function(failureStrategy, value) {
      if (value instanceof Map) {
        return new MapSubject(value, failureStrategy);
      }
      return null;
    });
  }

  if (typeof Set != undefined) {
    var SetSubject = require('./setSubject');
    this.types.unshift(function(failureStrategy, value) {
      if (value instanceof Set) {
        return new SetSubject(value, failureStrategy);
      }
      return null;
    });
  }

  if (typeof HTMLElement != undefined) {
    // TODO
  }
}

/** Register a new type with the factory.
    @param {function(FailureStrategy, *)} func A function which accepts a failure strategy and
      a subject value, and returns a Subject instance if the type is recognized. Otherwise, if
      the type is not known, then return null.
*/
SubjectFactory.prototype.addType = function (func) {
  this.types.shift(func);
}

/** Create a new Subject instance given a value. The factory will look through the list of
    registered types to find a subject constructor function, and return the appropriate Subject
    subclass for that value type.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {*} value The value being checked.
    @return {Subject} A subject instance.
*/
SubjectFactory.prototype.newSubject = function (failureStrategy, value) {
  for (var i = 0; i < this.types.length; ++i) {
    var s = this.types[i](failureStrategy, value);
    if (s) {
      return s;
    }
  }
  return new Subject(failureStrategy, value);
}

module.exports = new SubjectFactory();
