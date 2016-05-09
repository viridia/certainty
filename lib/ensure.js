var subjectFactory = require('./subject/factory');
var ThrowStrategy = require('./strategy/throwStrategy');

var throwStrategy = new ThrowStrategy();

/** Assertion verb that throws an exception if an assertion test fails. */
function ensure(value) {
  return subjectFactory.newSubject(throwStrategy, value);
}

module.exports = ensure;
