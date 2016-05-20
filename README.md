# Certainty

## Introduction.

**Certainty** is a JavaScript assertion framework designed to make your tests and their error
messages more readable and discoverable, while being extensible to new types of objects.

Certainty is largely inspired by [Truth](http://google.github.io/truth/), a Java-based testing
framework.

Certainty provides assertions, and is designed to work in conjunction with popular testing
frameworks such as Mocha, or mocking frameworks such as Sinon.

Certainty adopts a fluent style for test propositions, and is extensible in several ways. It
allows different actions to be taken on failure, the default being to throw an exception.

### An example:

```
import { ensure } from 'certainty';

let width = 10;
ensure(width).named('width').isGreaterThan(100);
```

reports:

```
Error: Expected width to be greater than 100.
```

Certainty’s propositions are intended to read (more or less) like English, and thereby be more
obvious in their intent, as well as report meaningful information about the errors.

### Fluent syntax

Each test proposition begins with a function that wraps the test expression and binds to a fluent
context object. This object (called a `Subject`) provides a wealth of assertion methods such
as `.isTrue()` and `.isEqualTo()`:

```
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

```
ensure(10).isGreaterThan(100);                // Prints: 'Expected 10 to be greater than 100.'
ensure(10).named('width').isGreaterThan(100); // Prints: 'Expected width to be greater than 100.'
```

### Type-specific Subjects

The set of assertion methods available depends on the runtime type of the test expression. For
example, passing an array to `ensure()` will return an `ArraySubject`, which has methods for testing
the elements of the array (`.contains()`, `.hasLength()`, and so on). Passing a string will return
a `StringSubject`, passing an ES2015 Map object will return a `MapSubject` and so on. For example:

```
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

```
ensure(someValue).isTrue();
ensure(someValue).isFalse();
ensure(someValue).isTruthy();
ensure(someValue).isFalsey();
```
The distinction between *true* and *truthy* is as follows: A *truthy* value is one that yields
`true` when coerced to a boolean, e.g.:

```
if (someValue) { /* value is truthy. */ } else { /* value is falsey. */ }
```

Whereas a value is only *true* if it is exactly equal to the literal value `true`.

#### Tests for `null` and `undefined`

```
ensure(someValue).isNull();
ensure(someValue).isNotNull();
ensure(someValue).isUndefined();
ensure(someValue).isNotUndefined();
ensure(someValue).isNullOrUndefined();
ensure(someValue).isNotNullOrUndefined();
ensure(someValue).exists();               // Synonym for isNotNullOrUndefined()
```

#### Equality tests
```
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
```
ensure(someValue).isGreaterThan(otherValue);
ensure(someValue).isNotGreaterThan(otherValue);
ensure(someValue).isLessThan(otherValue);
ensure(someValue).isNotLessThan(otherValue);
```
#### Type tests
```
ensure(someValue).isInstanceOf(class);
ensure(someValue).isNotInstanceOf(class);
ensure(someValue).hasType(type);
```

### Array assertions

The following assertions are applicable to array expressions:

#### Array length assertions

```
ensure(someArray).isEmpty();
ensure(someArray).isNotEmpty();
ensure(someArray).hasLength(length);
```

#### Array membership assertions

```
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
