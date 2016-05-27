TODO:

* A way for objects to be tagged with a more readable description (as opposed to [Object object]).
* Refactor .withValue()
* Extend subjects to formatting.

```
expect(value) -- reports error but does not fail the test.

// General
// .isIn(array or set)

// Numbers
// .isNaN
// .isInfinite
// .isFinite
// .isInteger

// Maps
// .containsKey(value)
// .doesNotContainKey(value)
// .containsEntry(key, value)

// Arrays
// .isOrdered(opt_comparator)
// .isPartiallyOrdered(opt_comparator)

// RegExp
// .accepts?

// DOM
// .isParentOf(node)
// .isChildOf(node)
// .hasClasses(classList) all ? any ? none ?
// .doesNotHaveClasses(classNames)
// .hasId(id)
// .hasTabIndex()

// Date?

```
