/* eslint-env node, mocha */
var ensure = require('../index.js').ensure;
var libCompare = require('../lib/compare');
var compare = libCompare.compare;
var diff = libCompare.diff;

function TestType() {}

describe('compare', function () {
  it('should compare two booleans', function() {
    ensure(compare(true, true)).isTrue();
    ensure(compare(true, false)).isFalse();
  });

  it('should compare two numbers', function() {
    ensure(compare(0, 0)).isTrue();
    ensure(compare(0, 1)).isFalse();
  });

  it('should compare two objects', function() {
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

  it('should diff two complex objects', function() {
    var exp = {
      name_1: 'p1-value',
      name_2: 'p2-value',
      name_3: ['p3-element'],
      name_5: 1,
      name_6: ['element', 'element-2', 'element-3', 'element-4'],
      name_7: new TestType(),
      name_8: { a: 1, c: 1 },
      name_9: 'a property with a very long value that differs only at the end',
      name_10: 'a property with a very long value that has \n' +
               'several line breaks \n' +
               'within it.\n',
    };
    var act = {
      name_3: ['alt-element', 'alt-element-2', 'alt-element-3', 'alt-element-4'],
      name_4: 'p4-value',
      name_6: [],
      name_7: {},
      name_8: { a: 2, b: 1 },
      name_9: 'a property with a very long value that differs only at the end.',
      name_10: 'a property with a very long value that has \n' +
               'a few line breaks \n' +
               'within it.\n',
    };
    var expectedDiffs = [
      'Expected value of obj does not equal actual value:',
      '  obj.name_1: Missing expected property with value "p1-value".',
      '  obj.name_10: Expected value differs from actual value starting at line 2, column 1:\n' +
      '    expected: "several line breaks "\n' +
      '      actual: "a few line breaks "',
      '  obj.name_2: Missing expected property with value "p2-value".',
      '  obj.name_3[0]: Expected value to be "p3-element", actual value was "alt-element".',
      '  obj.name_3[1]: Missing expected element with value "alt-element-2".',
      '  obj.name_3[2]: Missing expected element with value "alt-element-3".',
      '  obj.name_3[3]: Missing expected element with value "alt-element-4".',
      '  obj.name_5: Missing expected property with value 1.',
      '  obj.name_6[0]: Unexpected element with value "element".',
      '  obj.name_6[1]: Unexpected element with value "element-2".',
      '  obj.name_6[2]: Unexpected element with value "element-3".',
      '  (...and 1 more.)',
      '  obj.name_7: Expected type to be \'TestType\', actual type was \'Object\'.',
      '  obj.name_8.a: Expected value to be 1, actual value was 2.',
      '  obj.name_8.c: Missing expected property with value 1.',
      '  obj.name_8.b: Unexpected property with value 1.',
      '  obj.name_9: Expected value differs from actual value starting at character 62:\n' +
      '    expected: ..." only at the end"\n' +
      '      actual: ..." only at the end."',
      '  obj.name_4: Unexpected property with value "p4-value".',
    ];
    var diffs = diff(exp, act, 'obj', true);
    // console.log(diffs.map(function (s) {
    //   return '\'' + s.replace(/\'/g, '\\\'').replace(/\n/g, '\\n\' +\n\'') + '\',';
    // }).join('\n'));
    ensure(diffs).isDeeplyEqualTo(expectedDiffs);
    // console.log(JSON.stringify(diffs, null, 2));
  });
});
