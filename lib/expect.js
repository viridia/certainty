var subjectFactory = require('./subject/factory');
var LogStrategy = require('./strategy/logStrategy');

var logStrategy = new LogStrategy();
var expect = subjectFactory.newSubject.bind(subjectFactory, logStrategy);
expect.assertNoErrors = logStrategy.assertNoErrors.bind(logStrategy);

module.exports = expect;
