/**
 * @module certainty
 */
module.exports = {
  /** Assertion verb that throws an exception if an assertion test fails.
      @name ensure
      @function
      @param {*} value Value to be checked.
      @return {Subject} A subject object containing assertion methods.
  */
  ensure: require('./lib/ensure'),
  Subject: require('./lib/subject/subject'),
  subjectFactory: require('./lib/subject/factory'),
};
