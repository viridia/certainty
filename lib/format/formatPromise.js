/** Convert a promise value to a printable string representation.
    @param {Promise} value The value to format.
    @param {Object} options Formatting options.
    @protected
*/
function formatPromise(value, _options) {
  return '[Promise]';
}

module.exports = formatPromise;
