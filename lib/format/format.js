/* global Map Set Promise */
var registry = require('./registry');
var formatObject = require('./formatObject');
var formatArray = require('./formatArray');
var formatString = require('./formatString');

// Objects
registry.addType(function(v) { return typeof v === 'object'; }, formatObject);

// Arrays
registry.addType(Array.isArray, formatArray);

// Strings
registry.addType(function(v) { return typeof v === 'string'; }, formatString);

// Promises
if (typeof Promise != 'undefined') {
  var formatPromise = require('./formatPromise');
  registry.addType(function(v) {
    return v && typeof v.then == 'function';
  }, formatPromise);
}

// Maps
if (typeof Map != 'undefined') {
  var formatMap = require('./formatMap');
  registry.addType(function(v) { return v instanceof Map; }, formatMap);
}

// Sets
if (typeof Set != 'undefined') {
  var formatSet = require('./formatSet');
  registry.addType(function(v) { return v instanceof Set; }, formatSet);
}

/** Global format function
    @protected
*/
function format(value, opt_options) {
  return registry.format(value, opt_options);
}

module.exports = format;
