# 06 --- Ordering & Reversal

## Functions in this category

-   `sort()`
-   `toSorted()`
-   `reverse()`
-   `toReversed()`

------------------------------------------------------------------------

# `sort()`

Sorts an array.

### Important

By default, JavaScript converts elements to strings and sorts
lexicographically.

``` javascript
const numbers = [10, 2, 5, 1];

numbers.sort();

console.log(numbers);
```

Result:

``` text
[1, 10, 2, 5]
```

For numeric sorting, provide a comparator.

``` javascript
numbers.sort((a, b) => a - b);
```

Descending:

``` javascript
numbers.sort((a, b) => b - a);
```

------------------------------------------------------------------------

# Comparator callback

``` javascript
(a, b) => a - b
```

Meaning:

-   negative → `a` comes before `b`
-   zero → keep equivalent ordering
-   positive → `b` comes before `a`

------------------------------------------------------------------------

# Real-time QA example --- sort execution times

``` javascript
const executionTimes = [450, 120, 900, 300];

executionTimes.sort((a, b) => a - b);
```

------------------------------------------------------------------------

# Real-time export example --- sort orders by value

``` javascript
orders.sort((a, b) => b.value - a.value);
```

Highest-value order first.

------------------------------------------------------------------------

# Sorting objects by text

``` javascript
buyers.sort((a, b) =>
    a.company.localeCompare(b.company)
);
```

------------------------------------------------------------------------

# `toSorted()`

`sort()` changes the original array.

`toSorted()` returns a sorted copy.

``` javascript
const numbers = [3, 1, 2];

const sorted = numbers.toSorted((a, b) => a - b);

console.log(numbers); // [3, 1, 2]
console.log(sorted);  // [1, 2, 3]
```

This is safer when you want immutable-style code.

------------------------------------------------------------------------

# `reverse()`

Reverses the array **in place**.

``` javascript
const values = [1, 2, 3];

values.reverse();

console.log(values); // [3, 2, 1]
```

# `toReversed()`

Returns a reversed copy.

``` javascript
const values = [1, 2, 3];

const reversed = values.toReversed();

console.log(values);   // [1, 2, 3]
console.log(reversed); // [3, 2, 1]
```

------------------------------------------------------------------------

# Interview distinction

  Method             Mutates original?   New array?
  ---------------- ------------------- ------------
  `sort()`                         Yes           No
  `toSorted()`                      No          Yes
  `reverse()`                      Yes           No
  `toReversed()`                    No          Yes
