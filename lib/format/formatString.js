/** Convert a string value to a printable string representation.
    @param {String} value The value to format.
    @param {Object} options Formatting options.
    @protected
*/
function formatString(value, options) {
  var opts = options || {};
  var result = value.replace(/[\0-\37]/g, function (ch) {
    switch (ch) {
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '\t': return '\\t';
      case '\b': return '\\b';
      case '\v': return '\\v';
      case '\f': return '\\f';
      default: return '\\' + ch.charCodeAt(0).toString(8);
    }
  });
  if (opts.clip && result.length > opts.clip) {
    result = result.slice(0, Math.max(0, opts.clip - 3)) + '...';
  }
  return '"' + result + '"';
}

module.exports = formatString;
