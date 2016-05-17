var format = require('./format');

function type(v) {
  return typeof v;
}

function inequality(exp, act, path) {
  var strExp = format(exp, 100);
  var strAct = format(act, 100);
  if (strExp.length > 16 || strAct.length > 16) {
    if (path) {
      return 'Expected value of ' + path + ' differs from actual value:\n' +
        '  expected: ' + strExp + '\n' +
        '    actual: ' + strAct;
    } else {
      return 'Expected value differs from actual value:\n' +
        '  expected: ' + strExp + '\n' +
        '    actual: ' + strAct;
    }
  }
  if (path) {
    return 'Expected ' + path + ' to be ' + strExp + ', actual value was ' + strAct + '.';
  } else {
    return 'Expected ' + strAct + ' to be ' + strExp + '.';
  }
}

function propertyKeys(obj) {
  var keys = [];
  for (var k in obj) {
    keys.push(k);
  }
  return keys;
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
  var i, strExp, strAct;
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
        if (path) {
          opt_results.push(
            'Expected ' + path + ' to be type ' + eProto + ', actual value was type ' +
              aProto + '.');
        } else {
          opt_results.push(
            'Expected ' + format(act, 80) + ' to be type ' + eProto +
              ', actual value was type ' + aProto + '.');
        }
      }
      return false;
    }

    if (Array.isArray(exp) && Array.isArray(act)) {
      // do array comparison
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
        if (!compare(exp[k], act[k], path + '.' + k, opt_deep, opt_results)) {
          same = false;
        }
      } else {
        if (opt_results) {
          // opt_results.push(propertyAbsent(exp[k], null, path + '.' + k));
          strExp = format(exp[k], 100);
          var keyExp = path + '.' + k;
          if (strExp.length > 16) {
            opt_results.push(
              'Value missing expected property ' + keyExp + ' with value:\n  ' + strExp);
          } else {
            opt_results.push(
              'Value missing expected property ' + keyExp + ' with value ' + strExp + '.');
          }
        }
        same = false;
      }
    }

    // Check all keys in act
    for (i = 0; i < aKeys.length; ++i) {
      var k2 = aKeys[i];
      if (!exp.hasOwnProperty(k2)) {
        if (opt_results) {
          strAct = format(act[k2], 100);
          var keyAct = path + '.' + k2;
          if (strAct.length > 16) {
            opt_results.push(
              'Value has unexpected property ' + keyAct + ' with value:\n  ' + strAct);
          } else {
            opt_results.push(
              'Value has unexpected property ' + keyAct + ' with value ' + strAct + '.');
          }
        }
        same = false;
      }
    }

    // if (opt_results && opt_results.length) {
    //   console.log(opt_results);
    // }
    return same;
  } else if (et === 'string') {
    if (opt_results) {
      // find the first character where they differ
      for (i = 0; i < exp.length && i < act.length; ++i) {
        if (exp[i] != act[i]) {
          break;
        }
      }
      // if that index < 16 or strings are short, then show the whole thing:
      if (i < 16 || (exp.length < 60 && act.length < 60)) {
        opt_results.push(inequality(exp, act, path));
        return false;
      }

      // Only show the part of the string that differs.
      var start = Math.max(i - 16, 0);
      strExp = '"' + sliceWithEllipsis(exp, start, Math.min(i + 16, exp.length)) + '"';
      strAct = '"' + sliceWithEllipsis(act, start, Math.min(i + 16, act.length)) + '"';
      var msg;
      if (path) {
        msg = 'Expected value of ' + path + ' differs from actual value';
      } else {
        msg = 'Expected value differs from actual value';
      }
      msg += ' starting at character ' + i + ':';
      msg += '\n  expected: ' + strExp;
      msg += '\n    actual: ' + strAct;
      opt_results.push(msg);
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
  var result = str.slice(start, end);
  if (start > 0) {
    result = '...' + result;
  }
  if (end < str.length) {
    result += '...';
  }
  return result;
}

function diff(exp, act, opt_path, opt_deep) {
  var result = [];
  compare(exp, act, opt_path, opt_deep, result);
  return result;
}

function sameValue(lhs, rhs) {
  // TODO: Handle obscure JS behaviors like +0, NaN, etc.
  return lhs === rhs;
}

module.exports = {
  compare: compare,
  diff: diff,
}
