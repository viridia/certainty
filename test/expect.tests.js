/* eslint-env node, mocha */
var expect = require('../index.js').expect;

describe('expect', function () {
  // To make the test actually fail if errors were encountered, throw an exception if the error
  // count is non-zero.
  // afterEach(function () {
  //   expect.assertNoErrors();
  // });

  // Execute several failing assertions in a row.
  it('.isTrue', function() {
    expect(true).isFalse();
    expect(false).isTrue();
    expect(3).isNull();
  });
});
