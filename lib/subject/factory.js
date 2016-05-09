var Subject = require('./subject');
// var ArraySubject = require('./arraySubject');
// var ObjectSubject = require('./objectSubject');
// var MapSubject = Map ? require('./mapSubject') : undefined;
// var SetSubject = Set ? require('./setSubject') : undefined;

/** Singleton factory that accepts a value to be tested, queries it's type, and constructs
    an appropriate Subject type to wrap it. */
function SubjectFactory() {
  this.types = [];
  // Default factory
  this.types.shift(function(value, failureStrategy) {
    // if (value instanceof Array) {
    //   return new ArraySubject(value, failureStrategy);
    // }
    // if (value instanceof Object) {
    //   return new ObjectSubject(value, failureStrategy);
    // }
    return new Subject(value, failureStrategy);
  });
  // Factory for ES6 Maps
  // if (MapSubject) {
  //   this.types.shift(function(value, failureStrategy) {
  //     if (value instanceof Map) {
  //       return new MapSubject(value, failureStrategy);
  //     }
  //     return null;
  //   });
  // };
  // // Factory for ES6 Sets
  // if (SetSubject) {
  //   this.types.shift(function(value, failureStrategy) {
  //     if (value instanceof Set) {
  //       return new SetSubject(value, failureStrategy);
  //     }
  //     return null;
  //   });
  // };
};

SubjectFactory.prototype.addType = function (func) {
  this.types.shift(func);
}

SubjectFactory.prototype.newSubject = function (value, failureStrategy) {
  for (var i = 0; i < this.types.length; ++i) {
    var s = this.types[i](value, failureStrategy);
    if (s) {
      return s;
    }
  }
  return new Subject(value, failureStrategy);
}

module.exports = new SubjectFactory();
