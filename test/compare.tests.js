/* eslint-env node, mocha */
var ensure = require('../index.js').ensure;
var libCompare = require('../lib/compare');
var compare = libCompare.compare;
var diff = libCompare.diff;

describe('compare', function () {
  it('should compare two booleans', function() {
    ensure(compare(true, true)).isTrue();
    ensure(compare(true, false)).isFalse();
  });

  it('should compare two numbers', function() {
    ensure(compare(0, 0)).isTrue();
    ensure(compare(0, 1)).isFalse();
  });
});

describe('diff', function () {
  it('should diff booleans', function() {
    var result = diff(true, true);
    ensure(result.length).equals(0);
    result = diff(true, false);
    ensure(result.length).equals(1);
    ensure(result.join('\n')).equals('Expected false to be true.');
  });

  it('should diff named booleans', function() {
    var result = diff(true, true, 'b');
    ensure(result.length).equals(0);
    result = diff(true, false, 'b');
    ensure(result.length).equals(1);
    ensure(result.join('\n')).equals('Expected b to be true, actual value was false.');
  });

  it('should diff numbers', function() {
    var result = diff(0, 0);
    ensure(result.length).equals(0);
    result = diff(0, 1);
    ensure(result.length).equals(1);
    ensure(result.join('\n')).equals('Expected 1 to be 0.');
  });

  it('should diff named numbers', function() {
    var result = diff(0, 0, 'n');
    ensure(result.length).equals(0);
    result = diff(0, 1, 'n');
    ensure(result.length).equals(1);
    ensure(result.join('\n')).equals('Expected n to be 0, actual value was 1.');
  });
});
