# 03 --- Filtering & Selection

## Functions in this category

-   `filter()`

------------------------------------------------------------------------

# `filter()`

## Purpose

Use `filter()` when you want to keep **only elements that satisfy a
condition**.

### Syntax

``` javascript
const result = array.filter(callback);
```

### Core rule

**One input element → either kept or rejected**

The callback must return a truthy/falsy value.

``` javascript
const numbers = [10, 15, 20, 25];

const result = numbers.filter(n => n > 18);

console.log(result);
```

Output:

``` text
[20, 25]
```

------------------------------------------------------------------------

# Callback

``` javascript
numbers.filter((element, index, array) => {
    return condition;
});
```

Usually:

``` javascript
numbers.filter(element => condition);
```

------------------------------------------------------------------------

# Real-time QA example --- failed test cases

``` javascript
const testCases = [
    { id: 1, status: "PASS" },
    { id: 2, status: "FAIL" },
    { id: 3, status: "FAIL" },
    { id: 4, status: "PASS" }
];

const failedTests = testCases.filter(test => test.status === "FAIL");

console.log(failedTests);
```

# Real-time export example --- UAE buyers

``` javascript
const buyers = [
    { company: "ABC Foods", country: "UAE" },
    { company: "XYZ Imports", country: "Saudi Arabia" },
    { company: "Gulf Traders", country: "UAE" }
];

const uaeBuyers = buyers.filter(buyer => buyer.country === "UAE");
```

# Multiple conditions

``` javascript
const highValueOrders = orders.filter(order =>
    order.value > 10000 && order.status === "Confirmed"
);
```

# Combining `filter()` and `map()`

A very common real-world pattern:

``` javascript
const emails = users
    .filter(user => user.active)
    .map(user => user.email);
```

Read it as:

1.  Keep active users.
2.  Extract their emails.

------------------------------------------------------------------------

# `filter()` vs `map()`

  Method       Question
  ------------ -------------------------------
  `map()`      What should each item become?
  `filter()`   Which items should remain?

Example:

``` javascript
numbers.map(n => n * 2);
```

changes values.

``` javascript
numbers.filter(n => n > 10);
```

changes which elements remain.
