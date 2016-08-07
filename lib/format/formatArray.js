var registry = require('./registry');

/** Convert an array value to a printable string representation.
    @param {Array} value The value to format.
    @param {Object} options Formatting options.
    @protected
*/
function formatArray(value, options) {
  var opts = options || {};
  var innerOpts = Object.assign({}, opts, { clip: false });
  var parts = ['['];
  var length = 2; // Include both open and close bracket.
  for (var i = 0; i < value.length; ++i) {
    var sep = i > 0 ? ', ' : '';
    var s = registry.format(value[i], innerOpts);
    length += sep.length + s.length;
    if (opts.clip && opts.clip < length) {
      parts.push(', ...');
      break;
    }
    parts.push(sep);
    parts.push(s);
  }
  parts.push(']');
  return parts.join('');
}

module.exports = formatArray;
