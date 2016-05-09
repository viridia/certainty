var ensure = require('../index.js').ensure;

function assertThrows(f, msg) {
  try {
    f();
  } catch (e) {
    ensure(e + '').named('message').equals('Error: ' + msg);
    return;
  }
  throw new Error('expected assertion failure with message: \'' + msg + '\'');
}

describe('ensure', function () {
  it('.isTrue', function() {
    ensure(true).isTrue();
    ensure(true).named('boolean value').isTrue();
    assertThrows(function() { ensure(false).isTrue(); }, 'Expected false to be true.');
    assertThrows(function() { ensure(false).named('f').isTrue(); },
      'Expected \'f\' to be true, actual value was false.');
    assertThrows(function() { ensure(1).isTrue(); }, 'Expected 1 to be true.');
  });

  it('.isFalse', function() {
    ensure(false).isFalse();
    assertThrows(function() { ensure(true).isFalse(); }, 'Expected true to be false.');
    assertThrows(function() { ensure(true).named('f').isFalse(); },
      'Expected \'f\' to be false, actual value was true.');
    assertThrows(function() { ensure(1).isFalse(); }, 'Expected 1 to be false.');
  });

  it('.isTruthy', function() {
    ensure(true).isTruthy();
    ensure(1).isTruthy();
    ensure({}).isTruthy();
    assertThrows(function() { ensure(false).isTruthy(); }, 'Expected false to be truthy.');
    assertThrows(function() { ensure('').isTruthy(); }, 'Expected "" to be truthy.');
    assertThrows(function() { ensure(0).isTruthy(); }, 'Expected 0 to be truthy.');
    assertThrows(function() { ensure(false).named('f').isTruthy(); },
      'Expected \'f\' to be truthy, actual value was false.');
  });

  it('.isFalsey', function() {
    ensure(false).isFalsey();
    ensure(0).isFalsey();
    ensure('').isFalsey();
    assertThrows(function() { ensure(true).isFalsey(); }, 'Expected true to be falsey.');
    assertThrows(function() { ensure(1).isFalsey(); }, 'Expected 1 to be falsey.');
    assertThrows(function() { ensure(true).named('f').isFalsey(); },
      'Expected \'f\' to be falsey, actual value was true.');
  });

  it('.isNull', function() {
    ensure(null).isNull();
    ensure(null).named('null value').isNull();
    assertThrows(function() { ensure(false).isNull(); }, 'Expected false to be null.');
    assertThrows(function() { ensure(false).named('f').isNull(); },
      'Expected \'f\' to be null, actual value was false.');
    assertThrows(function() { ensure(1).isNull(); }, 'Expected 1 to be null.');
    assertThrows(function() { ensure(undefined).isNull(); },
      'Expected undefined to be null.');
  });

  it('.isNotNull', function() {
    ensure(1).isNotNull();
    ensure(1).named('non-null value').isNotNull();
    assertThrows(function() { ensure(null).isNotNull(); }, 'Expected null to not be null.');
    assertThrows(function() { ensure(null).named('f').isNotNull(); },
      'Expected \'f\' to not be null.');
    assertThrows(function() { ensure(1).isNull(); }, 'Expected 1 to be null.');
  });

  it('.isUndefined', function() {
    ensure(undefined).isUndefined();
    ensure(undefined).named('undefined value').isUndefined();
    assertThrows(function() { ensure(false).isUndefined(); },
      'Expected false to be undefined.');
    assertThrows(function() { ensure(false).named('f').isUndefined(); },
      'Expected \'f\' to be undefined, actual value was false.');
    assertThrows(function() { ensure(1).isUndefined(); }, 'Expected 1 to be undefined.');
  });

  it('.isNotUndefined', function() {
    ensure(1).isNotUndefined();
    ensure(1).named('non-undefined value').isNotUndefined();
    assertThrows(function() { ensure(undefined).isNotUndefined(); },
      'Expected undefined to not be undefined.');
    assertThrows(function() { ensure(undefined).named('f').isNotUndefined(); },
      'Expected \'f\' to not be undefined.');
    assertThrows(function() { ensure(1).isUndefined(); }, 'Expected 1 to be undefined.');
  });

  it('.isNullOrUndefined', function() {
    ensure(null).isNullOrUndefined();
    ensure(undefined).isNullOrUndefined();
    ensure(undefined).named('undefined value').isNullOrUndefined();
    assertThrows(function() { ensure(false).isNullOrUndefined(); },
      'Expected false to be null or undefined.');
    assertThrows(function() { ensure(false).named('f').isNullOrUndefined(); },
      'Expected \'f\' to be null or undefined, actual value was false.');
    assertThrows(function() { ensure(1).isNullOrUndefined(); },
      'Expected 1 to be null or undefined.');
  });

  it('.isNotNullOrUndefined', function() {
    ensure(1).isNotNullOrUndefined();
    ensure(1).named('non-undefined value').isNotNullOrUndefined();
    ensure('').isNotNullOrUndefined();
    assertThrows(function() { ensure(null).isNotNullOrUndefined(); },
      'Expected null to not be null or undefined.');
    assertThrows(function() { ensure(undefined).isNotNullOrUndefined(); },
      'Expected undefined to not be null or undefined.');
    assertThrows(function() { ensure(undefined).named('f').isNotNullOrUndefined(); },
      'Expected \'f\' to not be null or undefined.');
  });

  it('.exists', function() {
    ensure(1).exists();
    ensure(1).named('non-undefined value').exists();
    ensure('').exists();
    assertThrows(function() { ensure(null).exists(); },
      'Expected null to not be null or undefined.');
    assertThrows(function() { ensure(undefined).exists(); },
      'Expected undefined to not be null or undefined.');
    assertThrows(function() { ensure(undefined).named('f').exists(); },
      'Expected \'f\' to not be null or undefined.');
  });

  // Subject.prototype.isEqualTo = function (expected) {
  //   /** Ensure that the value being tested is equal to the expected value. */
  //   if (!(this.value == expected)) {
  //     this.failEqual(Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // /** Alias for isEqualTo(). */
  // Subject.prototype.equals = Subject.prototype.isEqualTo;
  //
  // /** Ensure that the value being tested is not equal to the expected value. */
  // Subject.prototype.isNotEqualTo = function (expected) {
  //   if (!(this.value != expected)) {
  //     this.failNotEqual(Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested is exactly equal to the expected value. */
  // Subject.prototype.isExactly = function (expected) {
  //   if (!(this.value === expected)) {
  //     this.failComparison('exactly', Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested is equal to the expected value using a deep comparison. */
  // Subject.prototype.isDeeplyEqualTo = function (expected) {
  //   // This should be overridden in subclasses
  //   if (!(this.value == expected)) {
  //     this.failComparison('deeply equal to', Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // // /** Ensure that the value being tested is equal to the expected value using a deep comparison. */
  // // Subject.prototype.isNotDeeplyEqualTo(expected) {
  // //   // This should be overridden in subclasses
  // //   if (!(this.value == expected)) {
  // //     this.failComparison('deeply equal to', expected);
  // //   }
  // //   return this;
  // // }
  //
  // /** Ensure that the value being tested is greater than to the expected value. */
  // Subject.prototype.isGreaterThan = function (expected) {
  //   if (!(this.value > expected)) {
  //     this.failComparison('greater than', Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested is not greater than to the expected value. */
  // Subject.prototype.isNotGreaterThan = function (expected) {
  //   if (this.value > expected) {
  //     this.failComparison('not greater than', Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested is less than to the expected value. */
  // Subject.prototype.isLessThan = function (expected) {
  //   if (!(this.value < expected)) {
  //     this.failComparison('less than', Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested is not less than to the expected value. */
  // Subject.prototype.isNotLessThan = function (expected) {
  //   if (this.value < expected) {
  //     this.failComparison('not less than', Subject.pretty(expected));
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested is an instance of the expected type. */
  // Subject.prototype.isInstanceOf = function (expected) {
  //   if (!(this.value instanceof expected)) {
  //     this.failureStrategy.fail(
  //       'Expected \'' + this.describe() + '\' to be instance of ' + Subject.pretty(expected) +
  //         ' but was type ' + typeof(this.value) + '.');
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested is not an instance of the expected type. */
  // Subject.prototype.isNotInstanceOf = function (expected) {
  //   if (this.value instanceof expected) {
  //     this.failureStrategy.fail(
  //       'Expected type of \'' + this.describe() + '\' to not be ' + Subject.pretty(expected) + '.');
  //   }
  //   return this;
  // };
  //
  // /** Ensure that the value being tested has exactly the expected type. */
  // Subject.prototype.hasType = function (expected) {
  //   if (typeof(this.value) == expected) {
  //     this.failureStrategy.fail(
  //       'Expected\'' + this.describe() + '\' to have type ' + Subject.pretty(expected) +
  //         ' but was ' + typeof(this.value) + '.');
  //   }
  //   return this;
  // };


});
