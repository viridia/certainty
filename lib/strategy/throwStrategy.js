/** Strategy which throws an exception on failure.
    @constructor
*/
function ThrowStrategy() {}

/** Throw an exception with the specified message.
    @param {string} msg The error message.
*/
ThrowStrategy.prototype.fail = function(msg) {
  throw new Error(msg);
}

module.exports = ThrowStrategy;
