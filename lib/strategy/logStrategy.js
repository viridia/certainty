/** Strategy which logs errors to the console but does not stop the test.
    @constructor
*/
function LogStrategy() {
  this.errorCount = 0;
}

/** Throw an exception with the specified message.
    @param {string} msg The error message.
*/
LogStrategy.prototype.fail = function(msg) {
  /* eslint no-console: "off"*/
  this.errorCount += 1;
  console.error(msg);
}

/** Throw an exception with the specified message.
    @param {string} msg The error message.
*/
LogStrategy.prototype.assertNoErrors = function() {
  var errorCount = this.errorCount;
  this.errorCount = 0;
  if (errorCount) {
    throw new Error(errorCount + ' errors encountered.');
  }
}

module.exports = LogStrategy;
