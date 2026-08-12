# 01 --- Iteration & Callback Execution

## Functions in this category

-   `forEach()`

------------------------------------------------------------------------

## 1. `forEach()`

### Purpose

Use `forEach()` when you want to **perform an action for every element**
without creating a new array.

### Syntax

``` javascript
array.forEach(callback);
```

More explicitly:

``` javascript
array.forEach((element, index, array) => {
    // action
});
```

### Callback parameters

``` javascript
numbers.forEach((element, index, array) => {
    console.log(element);
    console.log(index);
    console.log(array);
});
```

  Parameter   Meaning
  ----------- ------------------
  `element`   Current value
  `index`     Current position
  `array`     Original array

### Simple example

``` javascript
const browsers = ["Chrome", "Firefox", "Edge"];

browsers.forEach(browser => {
    console.log(browser);
});
```

Output:

``` text
Chrome
Firefox
Edge
```

### Real-time QA example --- execute test cases

``` javascript
const testCases = [
    "Login",
    "Logout",
    "Search Product",
    "Add To Cart"
];

testCases.forEach(testCase => {
    console.log(`Executing: ${testCase}`);
});
```

### Real-time export example --- process buyers

``` javascript
const buyers = [
    "Dubai Foods LLC",
    "Saudi Trading Co",
    "Qatar Imports"
];

buyers.forEach((buyer, index) => {
    console.log(`${index + 1}. Contact ${buyer}`);
});
```

### `forEach()` does NOT return a new array

``` javascript
const numbers = [1, 2, 3];

const result = numbers.forEach(n => n * 2);

console.log(result);
```

Output:

``` text
undefined
```

If you need a transformed array, use `map()`.

### Important callback concept

This:

``` javascript
numbers.forEach(n => console.log(n));
```

means:

``` javascript
numbers.forEach(function(n) {
    console.log(n);
});
```

The arrow function is simply a shorter function syntax.

### When to use

Use `forEach()` for:

-   Logging
-   Calling an API/action for every item
-   Updating external state
-   Printing data
-   Triggering test steps
-   Performing side effects

Do not use it when your main goal is to create a transformed, filtered,
searched, or reduced result.
