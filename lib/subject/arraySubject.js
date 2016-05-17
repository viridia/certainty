/** @module certainty */
var format = require('../format');
var Subject = require('./subject');

/** Fluent context object used to add an in-order assertion to a contains test. */
function InOrder() {}
InOrder.INSTANCE = new InOrder();

/** Asserts that the array elements previously tested are not only present in the array but
    present in order as well.
*/
InOrder.prototype.inOrder = function () {}

/** Fluent context object used when we know that an in-order assertion would have failed.
    @param {ArraySubject} subject The subject.
    @param {string} msg The message to display when we attempt an in-order assertion.
*/
function NotInOrder(subject, msg) {
  this.subject = subject;
  this.msg = msg;
}

/** Asserts that the array elements previously tested are not only present in the array but
    present in order as well. Since we already know this is false, this function always fails.
*/
NotInOrder.prototype.inOrder = function () {
  this.subject.fail(this.msg);
}

/** Subject subclass which provides assertion methods for array types.
    @param {FailureStrategy} failureStrategy The failure strategy to use when an assertion fails.
    @param {*} value The value being checked.
    @constructor
    @extends Subject
*/
function ArraySubject(failureStrategy, value) {
  Subject.call(this, failureStrategy, value);
}
ArraySubject.prototype = Object.create(Subject.prototype);
ArraySubject.prototype.constructor = ArraySubject;

/** Ensure that the array is empty.
    @return {ArraySubject} `this` for chaining.
*/
ArraySubject.prototype.isEmpty = function () {
  if (this.value.length != 0) {
    this.failureStrategy.fail('Expected ' + this.describe() + ' to be empty.');
  }
  return this;
};

/** Ensure that the array is a not empty.
    @return {ArraySubject} `this` for chaining.
*/
ArraySubject.prototype.isNotEmpty = function () {
  if (this.value.length == 0) {
    this.failureStrategy.fail('Expected ' + this.describe() + ' to be non-empty.');
  }
  return this;
};

/** Ensure that the array has a length equal to the specified length.
    @param {number} length The expected length.
    @return {Subject} `this` for chaining.
*/
ArraySubject.prototype.hasLength = function (length) {
  if (this.value.length != length) {
    this.failureStrategy.fail('Expected ' + this.describe() + ' to have length ' + length
      + ', but was ' + this.value.length + '.');
  }
  return this;
};

/** Ensure that the array contains the given element.
    @param {*} element The element that the value is expected to contain.
    @return {ArraySubject} `this` for chaining.
*/
ArraySubject.prototype.contains = function (element) {
  var i = this.value.indexOf(element);
  if (i < 0) {
    this.failureStrategy.fail('Expected ' + this.describe() + ' to contain ' +
      format(element, 30) + '.');
  }
  return this;
};

/** Ensure that the array contains all of the elements specified.
    @param {...*} elements The elements that the array must contain.
    @return {InOrder} An InOrder object which allows the 'inOrder' assertion for the
      given elements
*/
ArraySubject.prototype.containsAllOf = function () {
  return this.containsAllIn(arguments);
};

/** Ensure that the array contains exactly the elements specified.
    @param {...*} elements The elements that the array must contain.
    @return {InOrder} An InOrder object which allows the 'inOrder' assertion for the
      given elements
*/
ArraySubject.prototype.containsExactly = function () {
  return this.containsExactlyIn(arguments);
};

/** Ensure that the array contains any of the elements specified.
    @param {...*} elements The elements that the array must contain.
    @return {ArraySubject} `this` for chaining.
*/
ArraySubject.prototype.containsAnyOf = function () {
  return this.containsAnyIn(arguments);
};

/** Ensure that the array contains all of the elements specified.
    @param {Iterable} elements Iterable which produces the elements that the array must contain.
    @return {InOrder} An InOrder object which allows the 'inOrder' assertion for the
      given elements.
*/
ArraySubject.prototype.containsAllIn = function (elements) {
  var inOrder = true;
  var nextIndex = 0;
  var elementsInOrder = [];
  var missing = [];
  for (var key in elements) {
    var el = elements[key];
    var index = this.value.indexOf(el, nextIndex);
    if (index < 0) {
      index = this.value.indexOf(el);
      if (index < 0) {
        missing.push(el);
        continue;
      }
      inOrder = false;
    } else {
      nextIndex = index + 1;
      if (inOrder) {
        elementsInOrder.push(el);
      }
    }
  }

  if (missing.length > 0) {
    this.failureStrategy.fail('Expected ' + this.describe() + ' to contain elements ' +
      format(Array.prototype.slice.call(elements)) + ', is missing ' + format(missing) + '.');
    return InOrder.INSTANCE; // No need to fail twice
  }

  if (!inOrder) {
    // We succeeded, but the elements are out of order, so return an object which fails if they
    // as for an order check.
    var msg = 'Expected ' + this.describe() + ' to contain elements ' +
      format(Array.prototype.slice.call(elements)) +
      ' in order, but contains only these elements in order: ' +
      format(elementsInOrder) + '.';
    return new NotInOrder(this, msg);
  }
  return InOrder.INSTANCE;
};

/** Ensure that the array contains exactly the elements specified.
    @param {Iterable} elements Iterable which produces the elements that the array must contain.
    @return {InOrder} An InOrder object which allows the 'inOrder' assertion for the
      given elements
*/
ArraySubject.prototype.containsExactlyIn = function (elements) {
  var inOrder = true;
  var elementsInOrder = [];
  var missing = [];
  var elts = this.value.slice();
  var msg;
  for (var key in elements) {
    var el = elements[key];
    var index = elts.indexOf(el);
    if (index < 0) {
      missing.push(el);
    } else {
      if (index != 0) {
        inOrder = false;
      }
      if (inOrder) {
        elementsInOrder.push(el);
      }
      elts.splice(index, 1);
    }
  }

  if (missing.length || elts.length) {
    msg = 'Expected ' + this.describe() + ' to contain exactly elements ' +
      format(Array.prototype.slice.call(elements));
    if (missing.length) {
      msg += ', is missing ' + format(missing);
    }
    if (elts.length) {
      msg += ', extra elements ' + format(elts);
    }
    msg += '.';
    this.failureStrategy.fail(msg);
    return InOrder.INSTANCE; // We already failed, no need to fail again.
  }

  if (!inOrder) {
    msg = 'Expected ' + this.describe() + ' to contain exactly elements ' +
      format(Array.prototype.slice.call(elements)) +
      ' in order, but contains only these elements in order: ' +
      format(elementsInOrder) + '.';
    return new NotInOrder(this, msg);
  }

  return InOrder.INSTANCE;
};

/** Ensure that the array contains any of the elements specified.
    @param {Iterable} elements Iterable which produces the elements that the array must contain.
    @return {ArraySubject} `this` for chaining.
*/
ArraySubject.prototype.containsAnyIn = function (elements) {
  for (var key in elements) {
    var el = elements[key];
    var index = this.value.indexOf(el);
    if (index >= 0) {
      return this;
    }
  }
  this.failureStrategy.fail('Expected ' + this.describe() + ' to contain any of ' +
    format(Array.prototype.slice.call(elements)) + '.');
  return this;
};

// TODO: .isOrdered(comparator)
// TODO: .isPartiallyOrdered(comparator)

module.exports = ArraySubject;
