# 04 --- Searching & Finding

## Functions in this category

-   `find()`
-   `findIndex()`
-   `findLast()`
-   `findLastIndex()`
-   `includes()`
-   `indexOf()`
-   `lastIndexOf()`

------------------------------------------------------------------------

# `find()`

Returns the **first element** that satisfies a condition.

``` javascript
const users = [
    { id: 1, name: "Ravi" },
    { id: 2, name: "Anu" },
    { id: 3, name: "Kiran" }
];

const user = users.find(user => user.id === 2);

console.log(user);
```

Result:

``` javascript
{ id: 2, name: "Anu" }
```

If nothing matches:

``` javascript
undefined
```

## Real-time QA example

``` javascript
const tests = [
    { id: "TC01", status: "PASS" },
    { id: "TC02", status: "FAIL" },
    { id: "TC03", status: "PASS" }
];

const failedTest = tests.find(test => test.status === "FAIL");
```

------------------------------------------------------------------------

# `findIndex()`

Returns the index of the first matching element.

``` javascript
const index = users.findIndex(user => user.id === 2);
console.log(index);
```

Output:

``` text
1
```

Returns `-1` if no match exists.

------------------------------------------------------------------------

# `findLast()` and `findLastIndex()`

Useful when you want the **last matching item**.

``` javascript
const numbers = [10, 20, 30, 20];

const value = numbers.findLast(n => n === 20);
const index = numbers.findLastIndex(n => n === 20);

console.log(value); // 20
console.log(index); // 3
```

------------------------------------------------------------------------

# `includes()`

Checks whether an array contains a specific value.

``` javascript
const roles = ["Admin", "Tester", "Developer"];

console.log(roles.includes("Tester")); // true
console.log(roles.includes("Manager")); // false
```

No callback is required.

------------------------------------------------------------------------

# `indexOf()`

Finds the first exact value.

``` javascript
const browsers = ["Chrome", "Edge", "Chrome"];

console.log(browsers.indexOf("Chrome")); // 0
```

Returns `-1` when absent.

# `lastIndexOf()`

``` javascript
console.log(browsers.lastIndexOf("Chrome")); // 2
```

------------------------------------------------------------------------

# Which one should I use?

  Requirement                      Method
  -------------------------------- -------------------
  Get first matching object        `find()`
  Get first matching index         `findIndex()`
  Get last matching object         `findLast()`
  Get last matching index          `findLastIndex()`
  Check whether value exists       `includes()`
  Get first exact-value position   `indexOf()`
  Get last exact-value position    `lastIndexOf()`
