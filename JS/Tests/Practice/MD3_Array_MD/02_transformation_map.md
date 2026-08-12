# 02 --- Transformation & Projection

## Functions in this category

-   `map()`

------------------------------------------------------------------------

# `map()`

## Purpose

Use `map()` when you want to **convert every element into another
value** and receive a **new array**.

### Syntax

``` javascript
const newArray = array.map(callback);
```

Callback form:

``` javascript
array.map((element, index, array) => {
    return newValue;
});
```

## Core rule

**One input element → one output element**

``` javascript
const numbers = [1, 2, 3];

const doubled = numbers.map(n => n * 2);

console.log(doubled);
```

Output:

``` text
[2, 4, 6]
```

The original array remains unchanged.

------------------------------------------------------------------------

## Callback parameters

``` javascript
numbers.map((element, index, array) => {
    return element * 2;
});
```

### `element`

The current item.

### `index`

The current position.

### `array`

The original array.

Usually you only need `element`.

------------------------------------------------------------------------

# Arrow functions with `map()`

### Short form

``` javascript
const result = numbers.map(n => n * 2);
```

### Parentheses around parameter

``` javascript
const result = numbers.map((n) => n * 2);
```

Both are valid.

### Multiple parameters

``` javascript
const result = numbers.map((value, index) => {
    return `${index}: ${value}`;
});
```

### Explicit return

``` javascript
const result = numbers.map(n => {
    return n * 2;
});
```

### Implicit return

``` javascript
const result = numbers.map(n => n * 2);
```

------------------------------------------------------------------------

# Real-time QA example --- extract test case names

``` javascript
const testCases = [
    { id: 101, name: "Login", status: "Pass" },
    { id: 102, name: "Search", status: "Pass" },
    { id: 103, name: "Checkout", status: "Fail" }
];

const testNames = testCases.map(test => test.name);

console.log(testNames);
```

Output:

``` text
["Login", "Search", "Checkout"]
```

# Real-time API example --- extract user emails

``` javascript
const users = [
    { id: 1, name: "Ravi", email: "ravi@test.com" },
    { id: 2, name: "Anu", email: "anu@test.com" }
];

const emails = users.map(user => user.email);
```

# Real-time export example --- prepare buyer names

``` javascript
const buyers = [
    { company: "Dubai Foods", country: "UAE" },
    { company: "Riyadh Imports", country: "Saudi Arabia" }
];

const buyerLabels = buyers.map(buyer =>
    `${buyer.company} - ${buyer.country}`
);
```

------------------------------------------------------------------------

# `map()` versus `forEach()`

``` javascript
const numbers = [1, 2, 3];

const a = numbers.map(n => n * 2);

const b = numbers.forEach(n => n * 2);

console.log(a); // [2, 4, 6]
console.log(b); // undefined
```

### Interview rule

> `map()` transforms and returns a new array.\
> `forEach()` performs an action and returns `undefined`.

------------------------------------------------------------------------

# Common mistake

This does not transform the original array:

``` javascript
numbers.map(n => {
    n * 2;
});
```

Because there is no `return`.

Correct:

``` javascript
numbers.map(n => {
    return n * 2;
});
```

Or:

``` javascript
numbers.map(n => n * 2);
```
