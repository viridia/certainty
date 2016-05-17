var subjectFactory = require('./subject/factory');
var ThrowStrategy = require('./strategy/throwStrategy');

module.exports = subjectFactory.newSubject.bind(subjectFactory, new ThrowStrategy());
