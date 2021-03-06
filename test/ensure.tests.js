/* eslint-env node, mocha */
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
      'Expected f to be true, actual value was false.');
    assertThrows(function() { ensure(1).isTrue(); }, 'Expected 1 to be true.');
  });

  it('.isFalse', function() {
    ensure(false).isFalse();
    assertThrows(function() { ensure(true).isFalse(); }, 'Expected true to be false.');
    assertThrows(function() { ensure(true).named('f').isFalse(); },
      'Expected f to be false, actual value was true.');
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
      'Expected f to be truthy, actual value was false.');
  });

  it('.isFalsey', function() {
    ensure(false).isFalsey();
    ensure(0).isFalsey();
    ensure('').isFalsey();
    assertThrows(function() { ensure(true).isFalsey(); }, 'Expected true to be falsey.');
    assertThrows(function() { ensure(1).isFalsey(); }, 'Expected 1 to be falsey.');
    assertThrows(function() { ensure(true).named('f').isFalsey(); },
      'Expected f to be falsey, actual value was true.');
  });

  it('.isNull', function() {
    ensure(null).isNull();
    ensure(null).named('null value').isNull();
    assertThrows(function() { ensure(false).isNull(); }, 'Expected false to be null.');
    assertThrows(function() { ensure(false).named('f').isNull(); },
      'Expected f to be null, actual value was false.');
    assertThrows(function() { ensure(1).isNull(); }, 'Expected 1 to be null.');
    assertThrows(function() { ensure(undefined).isNull(); },
      'Expected undefined to be null.');
  });

  it('.isNotNull', function() {
    ensure(1).isNotNull();
    ensure(1).named('non-null value').isNotNull();
    assertThrows(function() { ensure(null).isNotNull(); }, 'Expected null to not be null.');
    assertThrows(function() { ensure(null).named('f').isNotNull(); },
      'Expected f to not be null.');
    assertThrows(function() { ensure(1).isNull(); }, 'Expected 1 to be null.');
  });

  it('.isUndefined', function() {
    ensure(undefined).isUndefined();
    ensure(undefined).named('undefined value').isUndefined();
    assertThrows(function() { ensure(false).isUndefined(); },
      'Expected false to be undefined.');
    assertThrows(function() { ensure(false).named('f').isUndefined(); },
      'Expected f to be undefined, actual value was false.');
    assertThrows(function() { ensure(1).isUndefined(); }, 'Expected 1 to be undefined.');
  });

  it('.isNotUndefined', function() {
    ensure(1).isNotUndefined();
    ensure(1).named('non-undefined value').isNotUndefined();
    assertThrows(function() { ensure(undefined).isNotUndefined(); },
      'Expected undefined to not be undefined.');
    assertThrows(function() { ensure(undefined).named('f').isNotUndefined(); },
      'Expected f to not be undefined.');
    assertThrows(function() { ensure(1).isUndefined(); }, 'Expected 1 to be undefined.');
  });

  it('.isNullOrUndefined', function() {
    ensure(null).isNullOrUndefined();
    ensure(undefined).isNullOrUndefined();
    ensure(undefined).named('undefined value').isNullOrUndefined();
    assertThrows(function() { ensure(false).isNullOrUndefined(); },
      'Expected false to be null or undefined.');
    assertThrows(function() { ensure(false).named('f').isNullOrUndefined(); },
      'Expected f to be null or undefined, actual value was false.');
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
      'Expected f to not be null or undefined.');
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
      'Expected f to not be null or undefined.');
  });

  it('.isEqualTo', function() {
    ensure(1).isEqualTo(1);
    ensure(1).named('one').isEqualTo(1);
    ensure('').isEqualTo('');
    assertThrows(function() { ensure(null).isEqualTo(1); },
      'Expected null to be 1.');
    assertThrows(function() { ensure(undefined).isEqualTo(1); },
      'Expected undefined to be 1.');
    assertThrows(function() { ensure(undefined).named('f').isEqualTo(1); },
      'Expected f to be 1, actual value was undefined.');
    assertThrows(function() { ensure(null).isEqualTo(''); },
      'Expected null to be "".');
    assertThrows(function() {
      ensure('a longer string').isEqualTo('an even longer string'); },
        'Expected "a longer string" to be "an even longer string".');
    assertThrows(function() {
      ensure('a very long string that has a whole lot of characters, maybe as many as eighty')
        .isEqualTo('a very long string that has a whole lot of characters'); },
        'Expected value differs from actual value starting at character 53:\n' +
          '  expected: ..."ot of characters"\n' +
          '    actual: ..."ot of characters, maybe as many as eighty"');
  });

  it('.equals', function() {
    ensure(1).equals(1);
    ensure(1).named('one').equals(1);
    ensure('').isEqualTo('');
    assertThrows(function() { ensure(null).equals(1); },
      'Expected null to be 1.');
    assertThrows(function() { ensure(undefined).equals(1); },
      'Expected undefined to be 1.');
    assertThrows(function() { ensure(undefined).named('f').equals(1); },
      'Expected f to be 1, actual value was undefined.');
    assertThrows(function() { ensure(null).equals(''); },
      'Expected null to be "".');
  });

  it('.isNotEqualTo', function() {
    ensure(1).isNotEqualTo(2);
    ensure(1).named('one').isNotEqualTo(2);
    ensure('').isNotEqualTo('1');
    assertThrows(function() { ensure(null).isNotEqualTo(null); },
      'Expected null to not be null.');
    assertThrows(function() { ensure(undefined).isNotEqualTo(undefined); },
      'Expected undefined to not be undefined.');
    assertThrows(function() { ensure(undefined).named('f').isNotEqualTo(undefined); },
      'Expected f to not be undefined.');
    assertThrows(function() { ensure('').isNotEqualTo(''); },
      'Expected "" to not be "".');
  });

  it('.isExactly', function() {
    var obj = {};
    ensure(1).isExactly(1);
    ensure(1).named('one').isExactly(1);
    ensure('').isExactly('');
    ensure(obj).isExactly(obj);
    assertThrows(function() { ensure({}).isExactly({}); },
      'Expected {} to be exactly {}.');
    assertThrows(function() { ensure(null).isExactly(1); },
      'Expected null to be exactly 1.');
    assertThrows(function() { ensure(undefined).isExactly(1); },
      'Expected undefined to be exactly 1.');
    assertThrows(function() { ensure(undefined).named('f').isExactly(1); },
      'Expected f to be exactly 1, actual value was undefined.');
    assertThrows(function() { ensure(null).isExactly(''); },
        'Expected null to be exactly "".');
  });

  it('.isDeeplyEqualTo', function() {
    ensure(1).isDeeplyEqualTo(1);
    ensure(1).named('one').isDeeplyEqualTo(1);
    ensure('').isDeeplyEqualTo('');
    ensure({}).isDeeplyEqualTo({});
    ensure({ a: 1 }).named('value').isDeeplyEqualTo({ a: 1 });
    ensure([1, 2, 3]).isDeeplyEqualTo([1, 2, 3]);
    ensure([{ a: 1 }]).isDeeplyEqualTo([{ a : 1}]);
    ensure(new Date('Sun May 15 2016 10:44:02 GMT-0700 (PDT)'))
      .isDeeplyEqualTo(new Date('Sun May 15 2016 10:44:02 GMT-0700 (PDT)'));
    ensure(/abc/g).isDeeplyEqualTo(/abc/g);
    assertThrows(function() { ensure(null).isDeeplyEqualTo(1); },
      'Expected null to be 1.');
    assertThrows(function() { ensure(undefined).isDeeplyEqualTo(1); },
      'Expected undefined to be 1.');
    assertThrows(function() { ensure(undefined).named('f').isDeeplyEqualTo(1); },
      'Expected f to be 1, actual value was undefined.');
    assertThrows(function() { ensure(null).isDeeplyEqualTo(''); },
      'Expected null to be "".');
    assertThrows(function() {
      ensure('a longer string').isDeeplyEqualTo('an even longer string'); },
        'Expected "a longer string" to be "an even longer string".');
    assertThrows(function() {
      ensure('a very long string that has a whole lot of characters, maybe as many as eighty')
        .isDeeplyEqualTo('a very long string that has a whole lot of characters'); },
        'Expected value differs from actual value starting at character 53:\n' +
          '  expected: ..."ot of characters"\n' +
          '    actual: ..."ot of characters, maybe as many as eighty"');
    assertThrows(function() {
      ensure({ a: 1 }).named('v').isDeeplyEqualTo({ a: 2 }); },
        'Expected v.a to be 2, actual value was 1.');
    assertThrows(function() {
      ensure({ a: 1, b: 2 }).named('v').isDeeplyEqualTo({ a: 1 }); },
        'Unexpected property v.b with value 2.');
    assertThrows(function() {
      ensure({ a: 1 }).named('v').isDeeplyEqualTo({ a: 1, b: 2 }); },
        'Missing expected property v.b with value 2.');
    assertThrows(function() {
      ensure({ a: {} }).named('v').isDeeplyEqualTo({ a: { b: 2 } }); },
        'Missing expected property v.a.b with value 2.');
    assertThrows(function() { ensure(/abc/g).named('r').isDeeplyEqualTo(/abc/i); },
        'Expected r to be /abc/i, actual value was /abc/g.');
    assertThrows(function() {
      ensure({ a: 1, b: 'a' }).named('v').isDeeplyEqualTo(1); },
        'Expected v to be 1, actual value was { a: 1, b: "a" }.');
    assertThrows(function() {
      ensure(1).named('v').isDeeplyEqualTo({ a: 1, b: 'a' }); },
        'Expected v to be { a: 1, b: "a" }, actual value was 1.');
    assertThrows(function() {
      ensure(1).named('v').isDeeplyEqualTo([{ a: 1, b: 'a' }]); },
        'Expected value of v differs from actual value:\n' +
        '  expected: [{ a: 1, b: "a" }]\n' +
        '    actual: 1');
    var obj1 = {
      property_1: 'property_1 value',
      property_2: 'property_2 value',
      property_3: 'property_3 value',
      property_4: 'property_4 value',
      property_5: 'property_5 value',
    };
    assertThrows(function() {
      ensure(obj1).named('v').isDeeplyEqualTo({}); },
        'Expected value of v does not equal actual value:\n' +
        '  v.property_1: Unexpected property with value "property_1 value".\n' +
        '  v.property_2: Unexpected property with value "property_2 value".\n' +
        '  v.property_3: Unexpected property with value "property_3 value".\n' +
        '  v.property_4: Unexpected property with value "property_4 value".\n' +
        '  ...1 additional differences not shown.');
    // TODO: Arrays, buffer, etc.
  });

  it('.isNotDeeplyEqualTo', function() {
    ensure(0).isNotDeeplyEqualTo(1);
    ensure(0).named('one').isNotDeeplyEqualTo(1);
    ensure('a').isNotDeeplyEqualTo('');
    ensure({ a: 1 }).isNotDeeplyEqualTo({});
    ensure({ a: 1 }).named('value').isNotDeeplyEqualTo({ a: 2 });
    assertThrows(function() { ensure(1).isNotDeeplyEqualTo(1); },
      'Expected 1 to not be deeply equal to 1.');
  });

  it('.isGreaterThan', function() {
    ensure(2).isGreaterThan(1);
    ensure(2).named('two').isGreaterThan(1);
    ensure('a').isGreaterThan('1');
    assertThrows(function() { ensure(1).isGreaterThan(2); },
      'Expected 1 to be greater than 2.');
    assertThrows(function() { ensure(null).isGreaterThan(null); },
      'Expected null to be greater than null.');
  });

  it('.isNotGreaterThan', function() {
    ensure(1).isNotGreaterThan(1);
    ensure(1).isNotGreaterThan(2);
    ensure(2).named('two').isNotGreaterThan(3);
    ensure('1').isNotGreaterThan('a');
    assertThrows(function() { ensure(2).isNotGreaterThan(1); },
      'Expected 2 to be not greater than 1.');
  });

  it('.isLessThan', function() {
    ensure(2).isLessThan(3);
    ensure(2).named('two').isLessThan(3);
    ensure('1').isLessThan('a');
    assertThrows(function() { ensure(2).isLessThan(1); },
      'Expected 2 to be less than 1.');
    assertThrows(function() { ensure(null).isLessThan(null); },
      'Expected null to be less than null.');
  });

  it('.isNotLessThan', function() {
    ensure(1).isNotLessThan(1);
    ensure(2).isNotLessThan(1);
    ensure(2).named('two').isNotLessThan(1);
    ensure('a').isNotLessThan('1');
    assertThrows(function() { ensure(1).isNotLessThan(2); },
      'Expected 1 to be not less than 2.');
  });

  it('.isApproximately', function() {
    ensure(1).isApproximately(1);
    ensure(2).isApproximately(2.0000000000001);
    ensure(2).named('two').isApproximately(2);
    ensure(2).isApproximately(2.1, .2);
    assertThrows(function() { ensure(1).isApproximately(2); },
      'Expected 1 to be approximately equal to 2.');
    assertThrows(function() { ensure(2).isApproximately(2.1, .1); },
      'Expected 2 to be approximately equal to 2.1.');
  });

  it('.hasType', function() {
    ensure(1).hasType('number');
    assertThrows(function() { ensure(1).hasType('string'); },
      'Expected 1 to have type "string", actual type was "number".');
  });

  it('.isInstanceOf', function() {
    ensure([]).isInstanceOf(Array);
    assertThrows(function() { ensure(1).isInstanceOf(Array); },
      'Expected 1 to be instance of Array, actual prototype was Number.');
  });

  it('.isNotInstanceOf', function() {
    ensure([]).isNotInstanceOf(Number);
    assertThrows(function() { ensure([]).isNotInstanceOf(Array); },
      'Expected [] to not be instance of Array.');
  });

  it('.isIn', function() {
    ensure(1).isIn([1, 2, 3]);
    /* global Set */
    if (typeof Set != 'undefined') {
      ensure(1).isIn(new Set([1, 2, 3]));
    }
    ensure('a').isIn(['a', 'b', 'c']);
    assertThrows(function() { ensure(1).isIn([2, 3]); },
      'Expected 1 to be in [2, 3].');
  });

  it('.is', function() {
    ensure(2).is('be even', function(n) { return n % 2 === 0 });
    assertThrows(function() { ensure(1).is('be even', function(n) { return n % 2 === 0 }) },
      'Expected 1 to be even.');
  });

  it('.isNot', function() {
    ensure(1).isNot('be even', function(n) { return n % 2 === 0 });
    assertThrows(function() { ensure(2).isNot('be even', function(n) { return n % 2 === 0 }) },
      'Expected 2 to not be even.');
  });

  it('.withFailureMessage', function() {
    assertThrows(function() { ensure(false).withFailureMessage('Not true!').isTrue(); },
      'Not true!');
  });

  if (typeof Proxy === 'function') {
    it('.withUndefinedMethod', function() {
      assertThrows(function() { ensure([]).isBadMethod(Array); },
        'ArraySubject has no method named \'isBadMethod\'.');
    });
  }
});
