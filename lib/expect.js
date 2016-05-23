var subjectFactory = require('./subject/factory');
var LogStrategy = require('./strategy/logStrategy');

module.exports = subjectFactory.newSubject.bind(subjectFactory, new LogStrategy());
