/** Strategy which logs errors to the console but does not stop the test.
    @constructor
*/
function LogStrategy() {}

/** Throw an exception with the specified message.
    @param {string} msg The error message.
*/
LogStrategy.prototype.fail = function(msg) {
  /* eslint no-console: "off"*/
  console.error(msg);
}

module.exports = LogStrategy;
