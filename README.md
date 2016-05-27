# Certainty ![](https://travis-ci.org/viridia/certainty.svg?branch=master)

* [GitHub project page](https://github.com/viridia/certainty)
* [JSDocs](https://viridia.github.io/certainty)
* [npm package](https://www.npmjs.com/package/certainty)
* Extensions:
  * [Certainty-DOM](https://github.com/viridia/certainty-dom)

## Introduction

**Certainty** is a JavaScript assertion framework designed to make your tests and their error
messages more readable and discoverable, while being extensible to new types of objects.

Certainty is largely inspired by [Truth](http://google.github.io/truth/), a Java-based testing
framework.

Certainty provides assertions, and is designed to work in conjunction with popular testing
frameworks such as [Mocha](https://mochajs.org/) or mocking frameworks such as
[Sinon](http://sinonjs.org/).

Certainty adopts a fluent style for test propositions, and is extensible in several ways. It
allows different actions to be taken on failure, the default being to throw an exception.

### A simple example:

```javascript
import { ensure } from 'certainty';

let width = 10;
ensure(width).named('width').isGreaterThan(100);
```

reports:

```sh
Error: Expected width to be greater than 100.
```

Certainty’s propositions are intended to read (more or less) like English, and thereby be more
obvious in their intent, as well as report meaningful information about the errors.

### Fluent syntax

Each test proposition begins with a function that wraps the test expression and binds to a fluent
context object. This object (called a [`Subject`][Subject]) provides a wealth
of assertion methods such as `.isTrue()` and `.isEqualTo()`:

```javascript
ensure(someValue).isTrue();       // is exactly equal to the value 'true'.
ensure(someValue).isTruthy();     // is true when coerced to a boolean.
ensure(someValue).isEqualTo(10);  // is equal to 10.
```

The wrapper function also associates the subject with a failure strategy, such as throwing an
exception when an assertion fails. The `ensure` function uses the exception strategy, while the
`expect` function merely prints an error on the console and continues the test.

### Named subjects

The `.named(string)` method can be used to assign a descriptive name to a subject, improving the
readability of failure messages. For example:

```javascript
// Prints: 'Expected 10 to be greater than 100.'
ensure(10).isGreaterThan(100);

// Prints: 'Expected width to be greater than 100.'
ensure(10).named('width').isGreaterThan(100);
```

### Custom failure messages

You can override the default failure message using `.withFailureMessage()`:

```javascript
// Prints: '10 is not big enough!'
ensure(10).withFailureMessage('10 is not big enough!').isGreaterThan(100);
```

### Type-specific Subjects

The set of assertion methods available depends on the runtime type of the test expression. For
example, passing an array to `ensure()` will return an [`ArraySubject`][ArraySubject], which has
methods for testing the elements of the array (`.contains()`, `.hasLength()`, and so on). Passing a
string will return a [`StringSubject`][StringSubject], passing an ES2015 Map object will return a
`MapSubject` and so on. For example:

```javascript
ensure(someArray).hasLength(10);      // is an array of length 10.
ensure(someString).startsWith('abc'); // starts with the characters 'abc'.
ensure(someMap).containsKey('abc');   // contains the key 'abc'.
```

It is relatively easy to create custom subclasses of [`Subject`][Subject] that are associated with
non-standard types (examples might be immutable collections or protocol buffers), and provide
assertion methods that are meaningful for those types.

## Assertion methods

### Common assertions

The following assertions are applicable to all test expressions regardless of type:

#### Boolean assertions

```javascript
ensure(someValue).isTrue();
ensure(someValue).isFalse();
ensure(someValue).isTruthy();
ensure(someValue).isFalsey();
```
The distinction between *true* and *truthy* is as follows: A *truthy* value is one that yields
`true` when coerced to a boolean, e.g.:

```javascript
if (someValue) { /* value is truthy. */ } else { /* value is falsey. */ }
```

Whereas `isTrue()` only succeeds if the value is exactly equal to the literal value `true`.

#### Tests for `null` and `undefined`

```javascript
ensure(someValue).isNull();
ensure(someValue).isNotNull();
ensure(someValue).isUndefined();
ensure(someValue).isNotUndefined();
ensure(someValue).isNullOrUndefined();
ensure(someValue).isNotNullOrUndefined();

// Synonym for isNotNullOrUndefined()
ensure(someValue).exists();
```

#### Equality tests
```javascript
ensure(someValue).isEqualTo(otherValue);
ensure(someValue).equals(otherValue);     // Synonym for isEqualTo()
ensure(someValue).isNotEqualTo(otherValue);
ensure(someValue).isExactly(otherValue);  // Uses === instead of ==
ensure(someValue).isDeeplyEqualTo(otherValue);
ensure(someValue).isNotDeeplyEqualTo(otherValue);
```

For deep comparison failures, rather than printing the entire value (which may be large), the
comparator will attempt to summarize the difference between the two values. So for example, a
deep comparison of `{ a:1, b:1 }` with `{ a:1 }` will report the fact that it expected a `b`
property to exist but it did not find one.

#### Relational tests
```javascript
ensure(someValue).isGreaterThan(otherValue);
ensure(someValue).isNotGreaterThan(otherValue);
ensure(someValue).isLessThan(otherValue);
ensure(someValue).isNotLessThan(otherValue);
```
#### Type tests
```javascript
ensure(someValue).isInstanceOf(class);
ensure(someValue).isNotInstanceOf(class);
ensure(someValue).hasType(type);
```

#### Other tests
```javascript
// Ensure that the test expression is one of a known set of values.
ensure(someValue).isIn(array);
ensure(someValue).isIn(set);

// Example:
ensure('alpha').isIn(['alpha', 'beta', 'gamma']);
```

### Array assertions

The following assertions methods (provided by [`ArraySubject`][ArraySubject]) are applicable to
array expressions:

#### Array length assertions

```javascript
ensure(someArray).isEmpty();
ensure(someArray).isNotEmpty();
ensure(someArray).hasLength(length);
```

#### Array membership assertions

```javascript
// Accepts a single element value
ensure(someArray).contains(element);
ensure(someArray).doesNotContain(value);

// Accepts multiple arguments
ensure(someArray).containsAllOf(elements...);
ensure(someArray).containsExactly(elements...);
ensure(someArray).containsAnyOf(elements...);
ensure(someArray).containsNoneOf(elements...);

// Accepts a list of elements
ensure(someArray).containsAllIn(elementList);
ensure(someArray).containsExactlyIn(elementList);
ensure(someArray).containsAnyIn(elementList);
ensure(someArray).containsNoneIn(elementList);

// Accepts a verb phrase (such as 'be prime') and a test function.
ensure(someArray).containsAny(verb, testFn);
ensure(someArray).containsAll(verb, testFn);
ensure(someArray).containsNone(verb, testFn);

// Example: Prints 'Error: Expected all elements of [1, 2, 3] to be even.'
ensure([1, 2, 3]).containsAll('be even', (el) => n % 2 == 0));

// .eachElement() applies an assertion method to every element in the array.
ensure(someArray).eachElement().isGreaterThan(3);
ensure(someArray).eachElement().hasType('string');
```

### Object assertions

The following assertion methods (provided by [`ObjectSubject`][ObjectSubject]) are applicable to
object expressions:

```javascript
ensure(someObject).isEmpty();
ensure(someObject).isNotEmpty();
ensure(someObject).hasField(key).withValue(expectedValue);
ensure(someObject).hasOwnField(key).withValue(expectedValue);
```

### String assertions

Assertions on strings are provided by [`StringSubject`][StringSubject]:

```javascript
ensure(someString).isEmpty();
ensure(someString).isNotEmpty();
ensure(someString).includes(subString);
ensure(someString).startsWith(subString);
ensure(someString).endsWith(subString);
ensure(someString).matches(regex);
```

### ES2015 collection assertions

Certainty will detect if the ES2015 `Map` and `Set` classes are present, and if so, it will add
support for these collection types.

#### Set assertions

```javascript
ensure(someSet).isEmpty();
ensure(someSet).isNotEmpty();
ensure(someSet).hasSize(size);

// Accepts a single element value
ensure(someSet).contains(value);
ensure(someSet).doesNotContain(value);

// Accepts multiple arguments
ensure(someSet).containsAllOf(elements...);
ensure(someSet).containsExactly(elements...);
ensure(someSet).containsAnyOf(elements...);
ensure(someSet).containsNoneOf(elements...);

// Accepts a list of elements
ensure(someSet).containsAllIn(elementList);
ensure(someSet).containsExactlyIn(elementList);
ensure(someSet).containsAnyIn(elementList);
ensure(someSet).containsNoneIn(elementList);

// Accepts a verb phrase (such as 'be prime') and a test function.
ensure(someSet).containsAny(verb, testFn);
ensure(someSet).containsAll(verb, testFn);
ensure(someSet).containsNone(verb, testFn);

// .eachMember() applies an assertion method to every member of the set.
ensure(someSet).eachMember().isGreaterThan(3);
ensure(someSet).eachMember().hasType('string');
```

### Promise assertions

Certainty supports assertions on JavaScript Promises if they are available in the environment.

Promises are wrapped in a [`PromiseSubject`][PromiseSubject] which provides assertion methods for
testing the outcome of the promise.

The `PromiseSubject.eventually()` method returns a subject that supports the standard assertions
methods, but waits until the promise has resolved before executing those assertions. The set
of assertion methods available depends on the type of object returned by the promise, so for example
if the promise resolves to an Array, you can call `.contains()` on it.

Examples:

```javascript
ensure(somePromise).eventually().isTrue();
ensure(somePromise).eventually().named('x').equals(someValue);
ensure(somePromise).eventually().contains(someItem);
```
Putting the `.named()` call after `.eventually()` causes the name to be assigned to the resolved
value instead of the promise object.

If you just want to know if the promise succeeded or failed, you can simply call `.succeeds()` or
`.fails()`:

```javascript
ensure(somePromise).succeeds();
ensure(somePromise).fails();

// Does simply equality comparison.
ensure(somePromise).succeedsWith(someValue);
ensure(somePromise).failsWith(someReason);
```

The return value of the assertion methods are 'thenable', so if you are testing using
Mocha, you can return the result of the assertion from your test method, which will cause Mocha
to wait until your promise is resolved.

```javascript
describe('MyTest', function() {
  it('should resolve to 7', function() {
    var promise = methodThatCreatesAPromise();
    return ensure(promise).eventually().equals(7);
  });
});
```

## Extending Certainty

It's relatively easy to add support for additional test expression types. The global singleton
`subjectFactory` creates subjects based on the type of the test expression. To add support for
a new type, you'll need to tell the subjectFactory about your type:

```javascript
import { subjectFactory } from 'certainty';

subjectFactory.addType(
  function(value) { return value instanceof MyType; },
  MyTypeSubject);
```

The first argument to `addType()` is a function that returns true if the type of the value is
recognized. The second argument should be a subclass of Subject.

If you plan to make your custom [`Subject`][Subject] class work with promises, there's a little bit
of extra work to be done. See the source for `ArraySubject` for an example.

  [Subject]: https://viridia.github.io/certainty/module-certainty-Subject.html
  [ArraySubject]: https://viridia.github.io/certainty/module-certainty-ArraySubject.html
  [ObjectSubject]: https://viridia.github.io/certainty/module-certainty-ObjectSubject.html
  [PromiseSubject]: https://viridia.github.io/certainty/module-certainty-PromiseSubject.html
  [StringSubject]: https://viridia.github.io/certainty/module-certainty-StringSubject.html
