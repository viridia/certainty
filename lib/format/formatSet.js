var registry = require('./registry');

/** Convert a set value to a printable string representation.
    @param {Set} value The value to format.
    @param {Object} options Formatting options.
    @protected
*/
function formatSet(value, options) {
  return 'Set(' + registry.format(Array.from(value.values()), options) + ')';
}

module.exports = formatSet;
