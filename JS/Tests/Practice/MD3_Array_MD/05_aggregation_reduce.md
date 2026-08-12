# 05 --- Aggregation & Reduction

## Functions in this category

-   `reduce()`
-   `reduceRight()`

------------------------------------------------------------------------

# `reduce()`

## Purpose

Use `reduce()` when you want to turn an array into **one final result**.

Examples:

-   Total
-   Count
-   Maximum
-   Object lookup
-   Grouping
-   Frequency counter
-   Building a summary

### Syntax

``` javascript
array.reduce((accumulator, currentValue) => {
    return updatedAccumulator;
}, initialValue);
```

------------------------------------------------------------------------

# The four callback parameters

``` javascript
array.reduce((accumulator, currentValue, index, array) => {
    // ...
}, initialValue);
```

  Parameter        Meaning
  ---------------- ---------------------
  `accumulator`    Result built so far
  `currentValue`   Current item
  `index`          Current position
  `array`          Original array
  `initialValue`   Starting value

------------------------------------------------------------------------

# Example --- total

``` javascript
const prices = [100, 200, 300];

const total = prices.reduce((sum, price) => {
    return sum + price;
}, 0);

console.log(total); // 600
```

Step-by-step:

``` text
sum = 0, price = 100 → 100
sum = 100, price = 200 → 300
sum = 300, price = 300 → 600
```

------------------------------------------------------------------------

# Arrow-function short form

``` javascript
const total = prices.reduce((sum, price) => sum + price, 0);
```

This is one of the most common `reduce()` patterns.

------------------------------------------------------------------------

# Real-time export example --- total order value

``` javascript
const orders = [
    { product: "Honey", value: 2500 },
    { product: "Turmeric", value: 4000 },
    { product: "Cumin", value: 3500 }
];

const totalValue = orders.reduce(
    (total, order) => total + order.value,
    0
);

console.log(totalValue); // 10000
```

------------------------------------------------------------------------

# Real-time QA example --- count failures

``` javascript
const tests = [
    { status: "PASS" },
    { status: "FAIL" },
    { status: "PASS" },
    { status: "FAIL" }
];

const failedCount = tests.reduce((count, test) => {
    return test.status === "FAIL" ? count + 1 : count;
}, 0);
```

------------------------------------------------------------------------

# Frequency counter

``` javascript
const browsers = ["Chrome", "Edge", "Chrome", "Firefox", "Chrome"];

const frequency = browsers.reduce((result, browser) => {
    result[browser] = (result[browser] || 0) + 1;
    return result;
}, {});

console.log(frequency);
```

Result:

``` javascript
{
    Chrome: 3,
    Edge: 1,
    Firefox: 1
}
```

This pattern is extremely useful for interview questions.

------------------------------------------------------------------------

# `reduceRight()`

Works from the **right side toward the left**.

``` javascript
const letters = ["A", "B", "C"];

const result = letters.reduceRight(
    (result, letter) => result + letter,
    ""
);

console.log(result); // CBA
```

------------------------------------------------------------------------

# `reduce()` mental model

Think:

``` text
Array
  ↓
Accumulator
  ↓
Accumulator
  ↓
Accumulator
  ↓
Final result
```

Unlike `map()` and `filter()`, the final result does not have to be an
array.
