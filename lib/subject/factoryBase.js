/** @module certainty */
/* global Proxy */
var Subject = require('./subject');
var ProxyBase = require('./proxy');

/** Singleton factory that accepts a value to be tested, queries it's type, and constructs
    an appropriate Subject type to wrap it.
    @constructor
*/
function SubjectFactory() {
  this.types = [];
}

/** Register a new type with the factory.
    @param {function(*)} typeTest A function which returns true when the type is recognized.
    @param {FailureStrategy} func Constructor function for the subject for this type.
*/
SubjectFactory.prototype.addType = function (typeTest, subjectClass) {
  this.types.unshift({ test: typeTest, subject: subjectClass });
  ProxyBase.addMethods(subjectClass);
}

/** Create a new Subject instance given a value. The factory will look through the list of
    registered types to find a subject constructor function, and return the appropriate Subject
    subclass for that value type.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {*} value The value being checked.
    @return {Subject} A subject instance.
*/
SubjectFactory.prototype.newSubject = function (failureStrategy, value) {
  var subject = undefined;
  for (var i = 0; i < this.types.length; ++i) {
    var typeEntry = this.types[i];
    if (typeEntry.test(value)) {
      subject = new typeEntry.subject(failureStrategy, value);
      break;
    }
  }
  if (subject === undefined) {
    subject = new Subject(failureStrategy, value);
  }

  // Use ES6 Proxy if available to detect for undefined methods.
  if (typeof Proxy === 'function') {
    subject = new Proxy(subject, {
      get: function (target, prop) {
        if (prop in target) {
          return target[prop];
        } else {
          return function() {
            subject.fail(subject.constructor.name + ' has no method named \'' + prop + '\'.');
          }
        }
      }
    });
  }

  return subject;
}

module.exports = new SubjectFactory();
