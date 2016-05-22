/** @module certainty */
var Subject = require('./subject');
var ProxyBase = require('./proxy');
var format = require('../format');

/** A class which functions as a subject, but doesn't actually execute any assertions until
    the promise has resolved. Once the promise succeeds, any method calls will be played back
    on the result value of the promise.
    @param {PromiseSubject} subject The subject wrapping the promise.
    @param {Promise} promise The promise being tested.
    @constructor
    @extends ProxyBase
  */
function DeferredSubject(subject, promise) {
  ProxyBase.call(this);
  this.subject = subject;
  this.promise = promise;
  this.calls = [];
  var self = this;
  this.promise = this.promise.then(
    function(value) {
      // Play back the recorded calls on a new subject which is created based on the resolved
      // value of the promise.
      var subjectFactory = require('./factory');
      var stem = subjectFactory.newSubject(self.subject.failureStrategy, value);
      for (var i = 0; i < self.calls.length; ++i) {
        var call = self.calls[i];
        // For fluent chaining, the return value of the method is the target of the next call.
        stem = stem[call.methodName].apply(stem, call.arguments);
      }
      return value;
    },
    function(reason) {
      self.subject.fail('Expected promise ' + self.subject.describe() +
        ' to succeed, but failed with ' + format(reason) + '.');
      return reason;
    }
  );
  // Make this object a thenable
  this.then = this.promise.then.bind(this.promise);
  this.catch = this.promise.catch.bind(this.promise);
}
DeferredSubject.prototype = Object.create(ProxyBase.prototype);
DeferredSubject.prototype.constructor = ProxyBase;

/** Called for a proxied method; records a method call for later playback. */
DeferredSubject.prototype.invoke = function(methodName, args) {
  this.calls.push({ methodName: methodName, arguments: args });
  return this;
};

/** Subject subclass which provides assertion methods for promise types.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {*} value The value being checked.
    @constructor
    @extends Subject
*/
function PromiseSubject(failureStrategy, value) {
  Subject.call(this, failureStrategy, value);
  // Make this object a thenable
  this.then = this.value.then.bind(this.value);
  this.catch = this.value.catch.bind(this.value);
}
PromiseSubject.prototype = Object.create(Subject.prototype);
PromiseSubject.prototype.constructor = PromiseSubject;

/** Ensure that the promise eventually succeeds.
    @return {PromiseSubject} `this` for chaining.
*/
PromiseSubject.prototype.succeeds = function () {
  var self = this;
  return this.value.catch(
    function (reason) {
      self.fail('Expected promise ' + self.describe() + ' to succeed, but failed with ' +
        format(reason) + '.');
      return reason;
    });
};

/** Ensure that the promise eventually succeeds with the specified value.
    @param {*} expected The value that the promise must resolve to.
    @return {PromiseSubject} `this` for chaining.
*/
PromiseSubject.prototype.succeedsWith = function (expected) {
  var self = this;
  return this.value.then(
    function (value) {
      if (value !== expected) {
        self.fail('Expected promise ' + self.describe() + ' to resolve to ' + format(expected) +
          ' actual value was ' + format(value) + '.');
      }
      return value;
    },
    function (reason) {
      self.fail('Expected promise ' + self.describe() + ' to succeed, but failed with ' +
        format(reason) + '.');
      return reason;
    });
};

/** Ensure that the promise eventually fails.
    @return {PromiseSubject} `this` for chaining.
*/
PromiseSubject.prototype.fails = function () {
  var self = this;
  return this.value.then(
    function (value) {
      self.fail('Expected promise ' + self.describe() + ' to fail, but succeeded with ' +
        format(value) + '.');
      return value;
    },
    function (reason) {
      return reason;
    });
};

/** Ensure that the promise eventually fails with the specified reason.
    @param {*} expected The expected reason for rejection.
    @return {PromiseSubject} `this` for chaining.
*/
PromiseSubject.prototype.failsWith = function (expected) {
  var self = this;
  return this.value.then(
    function (value) {
      self.fail('Expected promise ' + self.describe() + ' to fail, but succeeded with ' +
        format(value) + '.');
      return value;
    },
    function (reason) {
      if (reason !== expected) {
        self.fail('Expected promise ' + self.describe() + ' to be rejected with ' +
          format(expected) + ' actual reason was ' + format(reason) + '.');
      }
      return reason;
    });
};

/** Ensure that the promise succeds, and returns a 'deferred subject' - an object that allows
    assertions methods to be called, but doesn't actually execute the assertions until after
    the promise has resolved.
    @return {DeferredSubject} `this` for chaining.
*/
PromiseSubject.prototype.eventually = function () {
  return new DeferredSubject(this, this.value);
};

module.exports = PromiseSubject;