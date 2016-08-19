var registry = require('./registry');

/** Convert a map value to a printable string representation.
    @param {Map} value The value to format.
    @param {Object} options Formatting options.
    @protected
*/
function formatMap(value, options) {
  return 'Map(' + registry.format(Array.from(value.entries()), options) + ')';
}

module.exports = formatMap;
