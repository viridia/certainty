var format = require('./format/format');

function type(v) {
  return typeof v;
}

function inequality(exp, act, path) {
  var strExp = format(exp, { clip: 128 });
  var strAct = format(act, { clip: 128 });
  return {
    diff: 'value',
    path: path,
    expected: strExp,
    actual: strAct,
  };
}

function propertyKeys(obj) {
  var keys = [];
  for (var k in obj) {
    keys.push(k);
  }
  return keys;
}

function protoName(obj) {
  if (obj.constructor && obj.constructor.name) {
    return obj.constructor.name;
  }
  return obj + '';
}

/** Given two arrays or strings, return the first element where they differ (shallow). */
function firstDiff(exp, act) {
  var i;
  for (i = 0; i < exp.length && i < act.length; ++i) {
    if (exp[i] != act[i]) {
      break;
    }
  }
  return i;
}

/** Function to compute the difference between two values. Note that unlike many other object
    diff implementations, this one tries to 'humanize' the results, summarizing them for
    improved readability.
    @param {string} exp The expected value.
    @param {string} act The actual value.
    @param {string} opt_path The expression used to access the value, such as 'a.b.c'.
    @param {bool} opt_deep Whether to do a deep comparison.
    @param {Array} opt_resukts If non-null, will be used to report the differences between the
        expected and actual values.
 */
function compare(exp, act, opt_path, opt_deep, opt_results) {
  var path = opt_path || '';
  var i, j, strExp, strAct;
  if (sameValue(exp, act)) {
    return true;
  }
  var et = type(exp);
  var at = type(act);

  if (et !== at || et === 'number' || at === 'boolean' || et === 'undefined'
    || exp === null || act === null) {
    if (opt_results) {
      opt_results.push(inequality(exp, act, path));
    }
    return false;
  } else if (et === 'object') {
    // Shallow comparison
    if (!opt_deep) {
      if (opt_results) {
        opt_results.push(inequality(exp, act, path));
      }
      return false;
    }

    // Compare prototypes
    var eProto = Object.getPrototypeOf(exp);
    var aProto = Object.getPrototypeOf(act);
    if (eProto != aProto) {
      if (opt_results) {
        var eName = protoName(exp);
        var aName = protoName(act);
        opt_results.push({
          diff: 'type',
          path: path,
          expected: eName,
          actual: aName,
        });
      }
      return false;
    }

    if (Array.isArray(exp) && Array.isArray(act)) {
      if (!opt_results && exp.length !== act.length) {
        return false;
      }
      for (i = 0; i < exp.length && i < act.length; i += 1) {
        if (!compare(exp[i], act[i], path + '[' + i + ']', opt_deep, opt_results, true)) {
          if (!opt_results) {
            return false;
          }
        }
      }
      var strEl;

      if (i < exp.length) {
        for (j = i; j < exp.length && j < i + 3; j += 1) {
          strEl = format(exp[j], { clip: 128 });
          opt_results.push({
            diff: 'element',
            path: path + '[' + j + ']',
            // expected: eName,
            actual: strEl,
          });
        }
        if (j < exp.length) {
          opt_results.push({ diff: 'more', more: (exp.length - j) });
        }
      }
      if (i < act.length) {
        strEl = format(act[i], { clip: 128 });
        for (j = i; j < act.length && j < i + 3; j += 1) {
          strEl = format(act[j], { clip: 128 });
          opt_results.push({
            diff: 'element',
            path: path + '[' + j + ']',
            expected: strEl,
          });
        }
        if (j < act.length) {
          opt_results.push({ diff: 'more', more: (act.length - j) });
        }
      }
      return false;
    }

    // Handle regular expression objects.
    if (exp instanceof RegExp) {
      if (opt_deep && (exp + '') === (act + '')) {
        return true;
      }
      if (opt_results) {
        opt_results.push(inequality(exp, act, path));
      }
      return false;
    }

    // Handle 'date' objects.
    if (exp instanceof Date) {
      if (opt_deep && exp.getTime() === act.getTime()) {
        return true;
      }
      if (opt_results) {
        opt_results.push(inequality(exp, act, path));
      }
      return false;
    }

    // Compare individual properties.
    var same = true;
    var eKeys = propertyKeys(exp);
    var aKeys = propertyKeys(act);
    eKeys.sort();
    aKeys.sort();

    // Check all keys in exp
    for (i = 0; i < eKeys.length; ++i) {
      var k = eKeys[i];
      if (act.hasOwnProperty(k)) {
        if (!compare(exp[k], act[k], path + '.' + k, opt_deep, opt_results, true)) {
          if (!opt_results) {
            return false;
          }
          same = false;
        }
      } else {
        same = false;
        if (opt_results) {
          // opt_results.push(propertyAbsent(exp[k], null, path + '.' + k));
          strExp = format(exp[k], { clip: 128 });
          var keyExp = path + '.' + k;
          opt_results.push({
            diff: 'property',
            path: keyExp,
            expected: strExp,
            // actual: aName,
          });
        }
      }
    }

    // Check all keys in act
    for (i = 0; i < aKeys.length; ++i) {
      var k2 = aKeys[i];
      if (!exp.hasOwnProperty(k2)) {
        if (!opt_results) {
          return false;
        }
        same = false;
        strAct = format(act[k2], { clip: 128 });
        var keyAct = path + '.' + k2;
        opt_results.push({
          diff: 'property',
          path: keyAct,
          // expected: eName,
          actual: strAct,
        });
      }
    }

    return same;
  } else if (et === 'string') {
    if (opt_results) {
      // See if the values have line breaks
      var eLines = exp.split('\n');
      var aLines = act.split('\n');
      var col = 0;
      var start;
      if (eLines.length > 2 || aLines.length > 2) {
        // find the first line where they differ
        var line = firstDiff(eLines, aLines);
        // find the first character where the lines differ
        var expLine = line < eLines.length ? eLines[line] : '';
        var actLine = line < aLines.length ? aLines[line] : '';
        col = firstDiff(expLine, actLine);

        start = Math.max(col - 16, 0);
        strExp = sliceWithEllipsis(expLine, start, Math.min(col + 40, expLine.length));
        strAct = sliceWithEllipsis(actLine, start, Math.min(col + 40, actLine.length));
        opt_results.push({
          diff: 'string',
          path: path,
          line: line,
          col: col,
          expected: strExp,
          actual: strAct
        });
      } else {
        // find the first character where they differ
        col = firstDiff(exp, act);

        // if that index < 16 or strings are short, then show the whole thing:
        if (col < 16 || (exp.length < 30 && act.length < 30)) {
          opt_results.push(inequality(exp, act, path));
          return false;
        }

        // Only show the part of the string that differs.
        start = Math.max(col - 16, 0);
        strExp = sliceWithEllipsis(exp, start, Math.min(col + 40, exp.length));
        strAct = sliceWithEllipsis(act, start, Math.min(col + 40, act.length));
        opt_results.push({
          diff: 'string',
          path: path,
          index: col,
          expected: strExp,
          actual: strAct
        });
      }
      // opt_results.push(msg);
      return false;
    }
    return false;
  } else {
    // buffer
    // arguments
    throw new Error('Type not handled: ' + et);
  }
}

function sliceWithEllipsis(str, start, end) {
  var result = '"' + str.slice(start, end) + '"';
  if (start > 0) {
    result = '...' + result;
  }
  if (end < str.length) {
    result += '...';
  }
  return result;
}

function diff(exp, act, opt_path, opt_deep, opt_max) {
  var diffs = [];
  if (compare(exp, act, opt_path, opt_deep, diffs)) {
    return [];
  }
  var result = [];
  if (diffs.length > 1) {
    if (opt_path) {
      result.push('Expected value of ' + opt_path + ' does not equal actual value:');
    } else {
      result.push('Expected value does not equal actual value:');
    }
  }
  var max = typeof opt_max === 'number' ? opt_max : diffs.length;
  for (var i = 0; i < diffs.length && i < max; ++i) {
    var d = diffs[i];
    var msg = [];
    var indent = '';
    if (diffs.length > 1) {
      indent = '  ';
      if (d.path && d.diff !== 'more') {
        msg.push(indent);
        msg.push(d.path);
        msg.push(': ');
      }
    }
    switch (d.diff) {
      case 'type':
        msg.push('Expected type');
        if (diffs.length === 1) {
          msg.push(' of ' + d.path);
        }
        msg.push(' to be \'' + d.expected + '\', actual type was \'' + d.actual + '\'.');
        break;
      case 'value':
        if (diffs.length === 1 && !d.path) {
          msg.push('Expected ' + d.actual + ' to be ' + d.expected + '.');
        } else if (d.expected.length <= 16 && d.actual.length <= 16) {
          msg.push('Expected');
          if (d.path && diffs.length === 1) {
            msg.push(' ' + d.path);
          } else {
            msg.push(' value');
          }
          msg.push(' to be ' + d.expected + ', actual value was ' + d.actual + '.');
        } else {
          msg.push('Expected value');
          if (d.path && diffs.length === 1) {
            msg.push(' of ' + d.path);
          }
          msg.push(' differs from actual value:');
          msg.push('\n' + indent + '  expected: ' + d.expected);
          msg.push('\n' + indent + '    actual: ' + d.actual);
        }
        break;
      case 'string':
        msg.push('Expected value');
        if (diffs.length === 1 && d.path) {
          msg.push(' of ' + d.path);
        }
        msg.push(' differs from actual value starting at');
        if (typeof d.line === 'number') {
          msg.push(' line ' + (d.line + 1) + ', column ' + (d.col + 1) + ':');
        } else {
          msg.push(' character ' + d.index + ':');
        }
        msg.push('\n' + indent + '  expected: ' + d.expected);
        msg.push('\n' + indent + '    actual: ' + d.actual);
        break;
      case 'element':
        if (!('expected' in d)) {
          msg.push('Unexpected element');
          if (diffs.length === 1) {
            msg.push(' ' + d.path);
          }
          msg.push(' with value ' + d.actual + '.');
        } else {
          msg.push('Missing expected element');
          if (diffs.length === 1) {
            msg.push(' ' + d.path);
          }
          msg.push(' with value ' + d.expected + '.');
        }
        break;
      case 'property':
        if (!('expected' in d)) {
          msg.push('Unexpected property');
          if (diffs.length === 1) {
            msg.push(' ' + d.path);
          }
          msg.push(' with value ' + d.actual + '.');
        } else {
          msg.push('Missing expected property');
          if (diffs.length === 1) {
            msg.push(' ' + d.path);
          }
          msg.push(' with value ' + d.expected + '.');
        }
        break;
      case 'more':
        msg.push(indent + '(...and ' + d.more + ' more.)');
        break;
    }
    result.push(msg.join(''));
  }
  if (max < diffs.length) {
    result.push('  ...' + (diff.length - max) + ' additional differences not shown.');
  }
  return result;
}

function sameValue(lhs, rhs) {
  // TODO: Handle obscure JS behaviors like +0, NaN, etc.
  return lhs === rhs;
}

module.exports = {
  compare: compare,
  diff: diff,
  format_diffs: diff,
}
