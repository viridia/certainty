/* eslint-env node, mocha */
/* global Set Map Promise */
var format = require('../lib/format/format');
var ensure = require('../index.js').ensure;

describe('format (boolean)', function () {
  it('should format a boolean', function() {
    ensure(format(true)).equals('true');
    ensure(format(false)).equals('false');
  });
});

describe('format (undefined)', function () {
  it('should format undefined', function() {
    ensure(format(undefined)).equals('undefined');
  });
});

describe('format (null)', function () {
  it('should format null', function() {
    ensure(format(null)).equals('null');
  });
});

describe('format (number)', function () {
  it('should format a number', function() {
    ensure(format(1)).equals('1');
  });
});

describe('format (string)', function () {
  it('should format an empty string', function() {
    ensure(format('')).equals('""');
  });

  it('should format an simple string', function() {
    ensure(format('abc')).equals('"abc"');
    ensure(format(' ')).equals('" "');
  });

  it('should format a string with control characters', function() {
    ensure(format('abc\n')).equals('"abc\\n"');
    ensure(format('abc\r')).equals('"abc\\r"');
    ensure(format('abc\r\n')).equals('"abc\\r\\n"');
    ensure(format('abc\b')).equals('"abc\\b"');
    ensure(format('abc\0')).equals('"abc\\0"');
    ensure(format('abc\37')).equals('"abc\\37"');
  });

  it('should clip long strings', function() {
    ensure(format('abcdefghihk', { clip: 8 })).equals('"abcde..."');
    ensure(format('abcdefgh', { clip: 8 })).equals('"abcdefgh"');
  });

  it('should clip long strings with control characters', function() {
    ensure(format('abcd\nefghihk', { clip: 8 })).equals('"abcd\\..."');
  });
});

describe('format (Object)', function () {
  it('should format an empty object', function() {
    ensure(format({})).equals('{}');
  });

  it('should format an object with a null prototype', function() {
    ensure(format(Object.create(null))).equals('{}');
  });

  it('should format a simple object', function() {
    ensure(format({b: 1, a: true})).equals('{ a: true, b: 1 }');
  });

  it('should clip large objects', function() {
    ensure(format({b: 1, a: true, c: 2, d: 3}, { clip: 12 })).equals('{ a: true, ... }');
  });

  it('should format an object with a toString method', function() {
    var o = { toString: function() { return 'Custom Object'; } };
    ensure(o).equals('Custom Object');
  });

  // it('should format an object with a prototype', function() {
  //   // Use a NumberSubject as a handy object to test.
  //   var o = ensure(1);
  //   ensure(o).equals('{ a: true, b: 1 }');
  // });
});

describe('format (Array)', function () {
  it('should format an empty array', function() {
    ensure(format([])).equals('[]');
  });

  it('should format an array', function() {
    ensure(format(['abc'])).equals('["abc"]');
    ensure(format([' '])).equals('[" "]');
  });

  it('should clip long arrays', function() {
    ensure(format([1, 2, 3, 4, 5, 6, 7], { clip: 9 })).equals('[1, 2, 3, ...]');
    ensure(format([1, 2, 3], { clip: 9 })).equals('[1, 2, 3]');
  });
});

if (typeof Set !== 'undefined') {
  describe('format (Set)', function () {
    it('should format an empty set', function() {
      ensure(format(new Set([]))).equals('Set([])');
    });

    it('should format a set', function() {
      ensure(format(new Set(['abc']))).equals('Set(["abc"])');
      ensure(format(new Set([' ']))).equals('Set([" "])');
    });

    it('should clip long sets', function() {
      ensure(format(new Set([1, 2, 3, 4, 5, 6, 7]), { clip: 9 })).equals('Set([1, 2, 3, ...])');
      ensure(format(new Set([1, 2, 3]), { clip: 9 })).equals('Set([1, 2, 3])');
    });
  });
}

if (typeof Map !== 'undefined') {
  describe('format (Map)', function () {
    var m = new Map([[1, 2], ['a', 'b']]);

    it('should format an empty map', function() {
      ensure(format(new Map([]))).equals('Map([])');
    });

    it('should format an array', function() {
      ensure(format(m)).equals('Map([[1, 2], ["a", "b"]])');
    });
  });
}

if (typeof Promise !== 'undefined') {
  describe('format (Promise)', function () {
    it('should format a promise', function() {
      ensure(format(Promise.resolve(1))).equals('[Promise]');
    });
  });
}
