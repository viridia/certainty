var registry = require('./registry');

/** Convert an object value to a printable string representation.
    @param {Object} value The value to format.
    @param {Object} options Formatting options.
    @protected
*/
function formatObject(value, options) {
  if (value === undefined) {
    return 'undefined';
  }
  if (value === null) {
    return 'null';
  }

  if (typeof(value) == 'object') {
    if (value instanceof RegExp || value instanceof Date) {
      return value + '';
    }

    var opts = options || {};
    var innerOpts = Object.assign({}, opts, { clip: false });
    // If it's a plain object
    if (Object.getPrototypeOf(value) === Object.prototype) {
      var keys = [];
      for (var k in value) {
        keys.push(k);
      }
      keys.sort();
      var parts = ['{'];
      var length = 4; // Include both open and close brace.
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var sep = i > 0 ? ', ' : ' ';
        var s = registry.format(value[key], innerOpts);
        length += sep.length + key.length + 2 + s.length;
        if (opts.clip && opts.clip < length) {
          parts.push(', ...');
          break;
        }
        parts.push(sep);
        parts.push(key);
        parts.push(': ');
        parts.push(s);
      }
      if (keys.length > 0) {
        parts.push(' ');
      }
      parts.push('}');
      return parts.join('');
    }
    if (typeof value.toString == 'function') {
      return value.toString();
    }
    return String(value);
  }
  throw new Error('Implement');
}

module.exports = formatObject;
