TODO:

* A way for objects to be tagged with a more readable description (as opposed to [Object object]).
* Element subjects, such as hasAttribute.

```
expect(value) -- reports error but does not fail the test.

// Numbers
// .isNaN
// .isInfinite
// .isFinite
// .isInteger

// Maps
// .containsKey(value)
// .doesNotContainKey(value)
// .containsEntry(key, value)

// Sets
// .contains
// .containsAnyOf / .containsAnyIn / .containsAny
// .containsAllOf
// .containsExactly
// .containsNoneOf
// .doesNotContain

// Arrays
// .isOrdered(opt_comparator)
// .isPartiallyOrdered(opt_comparator)

// RegExp
// .accepts?

// DOM
// .hasAttribute(name).withValue(value)
// .hasTagName(name)
// .isElement()
// .isParentOf(node)
// .hasClass(className)
// .hasClasses(classList)
// .doesNotHaveClass(className)
// .doesNotHaveClasses(classNames)
// .hasChildCount(count)
// .hasId(id)
// .hasTabIndex()
// .matches(selector)

// Date?


```
