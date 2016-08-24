/** A base class which is able to function as a Proxy for another object. Similar in concept to
    ES6 Proxy, however there are several major differences. It works with earlier versions of
    JavaScript, but is limited in that it can only function as a Proxy for types that have been
    pre-registered.

    How this works: calling `addMethods(someClass)` iterates through all of the methods of the
    class and generates a proxy method for each one. The proxy method merely calls
    this.get(fieldName).

    The primary use case for this class is to allow deferred assertions, for example an assertion
    that doesn't get called until a Promise is resolved.
    @constructor
*/
function ProxyBase() {}

/** Method which is called when a proxied method is called. */
ProxyBase.prototype.invoke = function(fieldName, args) {
  throw new Error('Not Implemented: .get(' + fieldName + ', ' + args + ')');
};

/** Create a proxy method which calls `.get()` with the method name and arguments. */
ProxyBase.addMethod = function(methodName) {
  if (!ProxyBase.prototype.hasOwnProperty(methodName)) {
    ProxyBase.prototype[methodName] = function() {
      return this.invoke(methodName, arguments);
    }
  }
};

/** Create proxy methods for all of the methods defined in the given class. */
ProxyBase.addMethods = function(cls) {
  for (var key in cls.prototype) {
    if (typeof cls.prototype[key] === 'function' && key != 'constructor') {
      ProxyBase.addMethod(key);
    }
  }
};

ProxyBase.prototype.getMethod = function(subject, methodName) {
  var method = subject[methodName];
  if (typeof method !== 'function') {
    var subjectName = Object.prototype.toString.call(subject);
    if (subject.constructor && subject.constructor.name) {
      subjectName = subject.constructor.name;
    }
    if (!(method in subject)) {
      throw new Error(subjectName + ' has no method named \'' + methodName + '\'.');
    } else {
      throw new Error('Property \'' + methodName + '\' in ' + subjectName + ' is not a function.');
    }
  }
  return method;
}

module.exports = ProxyBase;
