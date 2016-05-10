var subjectFactory = require('./subject/factory');
var ThrowStrategy = require('./strategy/throwStrategy');

/** Assertion verb that throws an exception if an assertion test fails.
    @function
    @param {*} value Value to be checked.
    @return {Subject} A subject object containing assertion methods.
  */
module.exports = subjectFactory.newSubject.bind(subjectFactory, new ThrowStrategy());
