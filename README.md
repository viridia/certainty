# Certainty ![](https://travis-ci.org/viridia/certainty.svg?branch=master)

<a href="https://github.com/viridia/certainty"><img style="position: absolute; top: 0; right: 0; border: 0;"
  src="https://camo.githubusercontent.com/e7bbb0521b397edbd5fe43e7f760759336b5e05f/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f677265656e5f3030373230302e706e67"
  alt="Fork me on GitHub"
  data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_green_007200.png"></a>

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

 * [GitHub](https://github.com/viridia/certainty)
 * [JSDocs](https://viridia.github.io/certainty)

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
context object. This object (called a [`Subject`](module-certainty-Subject.html)) provides a wealth
of assertion methods such as `.isTrue()` and `.isEqualTo()`:

```javascript
ensure(someValue).isTrue();       // is exactly equal to the value 'true'.
ensure(someValue).isTruthy();     // is true when coerced to a boolean.
ensure(someValue).isEqualTo(10);  // is equal to 10.
```

The wrapper function also associates the Subject with a failure strategy, such as throwing an
exception when an assertion fails. The `ensure` function uses the exception strategy, while the
`expect` function merely prints an error on the console and continues the test.

### Named subjects

The `.named(string)` method can be used to assign a descriptive name to a subject, improving the
readability of failure messages. For example:

```javascript
ensure(10).isGreaterThan(100);                // Prints: 'Expected 10 to be greater than 100.'
ensure(10).named('width').isGreaterThan(100); // Prints: 'Expected width to be greater than 100.'
```

### Type-specific Subjects

The set of assertion methods available depends on the runtime type of the test expression. For
example, passing an array to `ensure()` will return an `ArraySubject`, which has methods for testing
the elements of the array (`.contains()`, `.hasLength()`, and so on). Passing a string will return
a `StringSubject`, passing an ES2015 Map object will return a `MapSubject` and so on. For example:

```javascript
ensure(someArray).hasLength(10);      // is an array of length 10.
ensure(someString).startsWith('abc'); // starts with the characters 'abc'.
ensure(someMap).containsKey('abc');   // contains the key 'abc'.
```

It is relatively easy to create custom subclasses of `Subject` that are associated with non-standard
types (examples might be immutable collections or protocol buffers), and provide assertion methods
that are meaningful for those types.

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
ensure(someValue).exists();               // Synonym for isNotNullOrUndefined()
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

### Array assertions

The following assertions are applicable to array expressions:

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
```

### Object assertions

The following assertions are applicable to object expressions:

```javascript
ensure(someObject).isEmpty();
ensure(someObject).isNotEmpty();
ensure(someObject).hasField(key).withValue(expectedValue);
ensure(someObject).hasOwnField(key).withValue(expectedValue);
```

### String assertions

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

### Promise assertions

Certainty supports assertions on JavaScript Promises if they are available in the environment.
Note that if you are transpiling your application with Babel in order to get Promise support,
you will need to transpile Certainty as well.

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
Note that putting the `.named()` call after `.eventually()` causes the name to be assigned to
the resolved value instead of the promise object.

If you just want to know if the promise succeeded or failed, you can simply call `.succeeds()` or
`.fails()`:

```javascript
ensure(somePromise).succeeds();
ensure(somePromise).fails();

// Does simply equality comparison.
ensure(somePromise).succeedsWith(someValue);
ensure(somePromise).failsWith(someReason);
```

Note that the return value of the assertion methods are 'thenable', so if you are testing using
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

subjectFactory.addType(function(value) { return value instanceof MyType; }, MyTypeSubject);
```

The argument to `addType()` is a factory function which is passed the test expression. If the
factory function recognizes the type, it should return a subclass of `Subject`, otherwise it should
return `null`.

If you plan to make your custom `Subject` class work with promises, there's a little bit of extra
work to be done. See the source for `ArraySubject` for an example.
