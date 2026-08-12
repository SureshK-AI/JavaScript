# JavaScript Array Functions --- Category-Based Guide

This guide groups JavaScript array methods by **what they do** rather
than alphabetically.

## Categories

1.  **Iteration & Callback Execution** --- `forEach()`
2.  **Transformation & Projection** --- `map()`
3.  **Filtering & Selection** --- `filter()`
4.  **Searching & Finding** --- `find()`, `findIndex()`, `findLast()`,
    `findLastIndex()`, `includes()`, `indexOf()`
5.  **Aggregation & Reduction** --- `reduce()`, `reduceRight()`
6.  **Ordering & Reversal** --- `sort()`, `toSorted()`, `reverse()`,
    `toReversed()`
7.  **Adding, Removing & Copying** --- `push()`, `pop()`, `shift()`,
    `unshift()`, `slice()`, `splice()`, `toSpliced()`
8.  **Combining, Flattening & Converting** --- `concat()`, `flat()`,
    `flatMap()`, `join()`, `Array.from()`, `Array.isArray()`

## Callback pattern

Many array methods accept a callback:

``` javascript
array.method((element, index, array) => {
    // logic
});
```

The callback parameters are:

-   `element` --- current array item
-   `index` --- current item's position
-   `array` --- the original array being processed

Not every method requires all three parameters.

## Arrow function basics

``` javascript
const add = (a, b) => a + b;
```

For one parameter:

``` javascript
const double = n => n * 2;
```

For multiple statements:

``` javascript
const double = n => {
    const result = n * 2;
    return result;
};
```

The important distinction is **implicit return** versus **explicit
return**.

``` javascript
const result = numbers.map(n => n * 2); // implicit return

const result = numbers.map(n => {
    return n * 2;                       // explicit return
});
```

## Recommended learning order

`forEach()` → `map()` → `filter()` → `find()` → `reduce()` → `sort()` →
`slice()/splice()` → `flat()/flatMap()`

These methods appear constantly in UI automation, API response
processing, test-data preparation, reporting, and business applications.
