var subjectFactory = require('./subject/factory');
var ThrowStrategy = require('./strategy/throwStrategy');

var throwStrategy = new ThrowStrategy();

module.exports = function (value) {
  return subjectFactory.newSubject(value, throwStrategy);
}
