/** @module certainty */

/** Singleton factory that accepts a value to be printed, queries it's type, and returns an
    appropriate formatter for that type.
    @constructor
*/
function Registry() {
  this.types = [];
}

/** Register a new type with the factory.
    @param {function(*)} typeTest A function which returns true when the type is recognized.
    @param {function(*)} formatter A formatting function for this type.
*/
Registry.prototype.addType = function (typeTest, formatFn) {
  this.types.unshift({ test: typeTest, formatter: formatFn });
}

/** Create a new Subject instance given a value. The factory will look through the list of
    registered types to find a subject constructor function, and return the appropriate Subject
    subclass for that value type.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {*} value The value being checked.
    @return {Subject} A subject instance.
*/
Registry.prototype.getFormatter = function (value) {
  for (var i = 0; i < this.types.length; ++i) {
    var entry = this.types[i];
    if (entry.test(value)) {
      return entry.formatter;
    }
  }
  return null;
}

Registry.prototype.format = function (value, opt_clip) {
  var formatFn = this.getFormatter(value);
  if (formatFn) {
    return formatFn(value, opt_clip);
  }
  return String(value);
}

module.exports = new Registry();
