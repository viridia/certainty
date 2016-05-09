var subjectFactory = require('./subject/factory');
var ThrowStrategy = require('./strategy/throwStrategy');

/** Assertion verb that throws an exception if an assertion test fails. */
module.exports = subjectFactory.newSubject.bind(subjectFactory, new ThrowStrategy());
