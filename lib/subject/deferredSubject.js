/** @module certainty */
var ProxyBase = require('./proxy');

/** A class which functions as a subject, but doesn't actually execute any assertions right
    away - instead, the assertions are recorded in a list of calls, which can be played back
    later, multiple times, on different subjects.
    @constructor
    @extends ProxyBase
  */
function DeferredSubject() {
  ProxyBase.call(this);
  this.calls = [];
}
DeferredSubject.prototype = Object.create(ProxyBase.prototype);
DeferredSubject.prototype.constructor = ProxyBase;

/** Called for a proxied method; records a method call for later playback. */
DeferredSubject.prototype.invoke = function(methodName, args) {
  this.calls.push({ methodName: methodName, arguments: args });
  return this;
};

/** Executes all of the recorded methods on a new subject. */
DeferredSubject.prototype.run = function(subject) {
  for (var i = 0; i < this.calls.length; ++i) {
    var call = this.calls[i];
    // For fluent chaining, the return value of the method is the target of the next call.
    subject = subject[call.methodName].apply(subject, call.arguments);
  }
};

module.exports = DeferredSubject;
