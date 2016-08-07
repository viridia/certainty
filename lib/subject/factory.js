/** @module certainty */
/* global Map Set Promise */
var ArraySubject = require('./arraySubject');
var ObjectSubject = require('./objectSubject');
var StringSubject = require('./stringSubject');
var subjectFactory = require('./factoryBase');

// Objects
subjectFactory.addType(function(v) { return typeof v === 'object'; }, ObjectSubject);

// Arrays
subjectFactory.addType(Array.isArray, ArraySubject);

// Strings
subjectFactory.addType(function(v) { return typeof v === 'string'; }, StringSubject);

// Promises
if (typeof Promise != 'undefined') {
  var PromiseSubject = require('./promiseSubject');
  subjectFactory.addType(function(v) {
    return v && typeof v.then == 'function';
  }, PromiseSubject);
}

// Maps
if (typeof Map != 'undefined') {
  var MapSubject = require('./mapSubject');
  subjectFactory.addType(function(v) { return v instanceof Map; }, MapSubject);
}

// Sets
if (typeof Set != 'undefined') {
  var SetSubject = require('./setSubject');
  subjectFactory.addType(function(v) { return v instanceof Set; }, SetSubject);
}

// Export the singleton factory instance, only this time fully initialized.
module.exports = subjectFactory;
