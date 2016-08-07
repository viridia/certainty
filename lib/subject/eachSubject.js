/** @module certainty */
var ProxyBase = require('./proxy');
var subjectFactory = require('./factoryBase');

/** A subject which executes its assertions on each element of an iterable.
    @param {Subject} The subject responsible for creating this.
    @param {Array} elements List of elements to test.
    @param {string} elementName What noun to use when referring to elements ('item', 'child', etc.)
    @param {bool} opt_noIndex If true, don't include the element index in the failure message.
    @constructor
    @extends ProxyBase
  */
function EachSubject(subject, elements, elementName, opt_noIndex) {
  ProxyBase.call(this);
  this.elementSubjects = [];
  for (var i = 0; i < elements.length; ++i) {
    var es = subjectFactory.newSubject(subject.failureStrategy, elements[i]);
    es.named(elementName + (opt_noIndex ? '' : (' ' + i)) + ' of ' + subject.describe());
    es.failureMessage = subject.failureMessage;
    this.elementSubjects.push(es);
  }
}
EachSubject.prototype = Object.create(ProxyBase.prototype);
EachSubject.prototype.constructor = ProxyBase;

/** Called for a proxied method; invokes the method once for every element in the list. */
EachSubject.prototype.invoke = function(methodName, args) {
  for (var i = 0; i < this.elementSubjects.length; ++i) {
    var subject = this.elementSubjects[i];
    this.elementSubjects[i] = subject[methodName].apply(subject, args);
  }
  return this;
};

module.exports = EachSubject;
