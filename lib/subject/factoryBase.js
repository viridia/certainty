/** @module certainty */
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
  for (var i = 0; i < this.types.length; ++i) {
    var typeEntry = this.types[i];
    if (typeEntry.test(value)) {
      return new typeEntry.subject(failureStrategy, value);
    }
  }
  return new Subject(failureStrategy, value);
}

module.exports = new SubjectFactory();