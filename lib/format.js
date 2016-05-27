/* global Set Map */
/** Convert a value to a printable string representation.
    @param {*} value The value to convert.
    @param {number} opt_clip Whether to truncate the value if it's too long.
    @protected
*/
function format(value, opt_clip) {
  if (Array.isArray(value)) {
    var parts = [];
    for (var i = 0; i < value.length; ++i) {
      parts.push(format(value[i]));
    }
    return '[' + parts.join(', ') + ']';
  } else if (typeof Set !== 'undefined' && value instanceof Set) {
    return 'Set(' + format(Array.from(value.values()), opt_clip) + ')';
  } else if (typeof Map !== 'undefined' && value instanceof Map) {
    return 'Map(' + format(Array.from(value.entries()), opt_clip) + ')';
  }
  var result = value + '';
  if (opt_clip && result.length > opt_clip) {
    result = result.slice(0, opt_clip) + '...';
  }
  if (typeof(value) == 'string') {
    result = '"' + value + '"';
  }
  return result;
}

module.exports = format;
