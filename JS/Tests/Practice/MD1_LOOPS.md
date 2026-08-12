Which one should YOU use?

For your current JavaScript practice, remember this table:

# Loop	    Best use
# for	        index + value (you control both)
# for...of	Need each value
# for...in	Need object keys/properties
# forEach()	Process every array element, value (+ optional index)
# while	    Repeat while a condition is true
# do...while	Must execute at least once and then check


# JavaScript Loops --- Syntax, Purpose, Benefits & Examples

## Quick Comparison

  -----------------------------------------------------------------------
  Loop                    Best use                Main benefit
  ----------------------- ----------------------- -----------------------
  `for`                   Need index + value and  Complete control over
                          full control            initialization,
                                                  condition, and update

  `for...of`              Need each value         Clean, readable
                                                  value-based iteration

  `for...in`              Need object             Easy property/key
                          keys/properties         iteration

  `forEach()`             Process every array     Simple callback-based
                          element                 processing

  `while`                 Repeat while a          Useful when iteration
                          condition is true       count is unknown

  `do...while`            Must execute at least   Executes first, checks
                          once                    condition afterward
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 1. `for` Loop

## 🎯 Objective / Purpose

> Use `for` when you need **full control over the loop**, especially
> when you need both the **index and value**.

**Think:** `Initialize → Check → Execute → Update → Repeat`

## Syntax

``` javascript
for (initialization; condition; update) {
    // code
}
```

## Example

``` javascript
for (let i = 0; i < 5; i++) {
    console.log(i);
}
```

Output:

``` text
0
1
2
3
4
```

## Array example

``` javascript
let browsers = ["Chrome", "Firefox", "Edge"];

for (let i = 0; i < browsers.length; i++) {
    console.log(i, browsers[i]);
}
```

Output:

``` text
0 Chrome
1 Firefox
2 Edge
```

## Benefits

-   Full control over the index.
-   Can move forward or backward.
-   Can skip positions.
-   Can use custom increments such as `i += 2`.
-   Useful when the index is important.
-   Very common in coding interviews.

## Reverse example

``` javascript
let numbers = [10, 20, 30, 40];

for (let i = numbers.length - 1; i >= 0; i--) {
    console.log(numbers[i]);
}
```

------------------------------------------------------------------------

# 2. `for...of` Loop

## 🎯 Objective / Purpose

> Use `for...of` when you simply need **each value** from an array,
> string, or other iterable.

**Think:** `Give me each value. I don't need the index.`

## Syntax

``` javascript
for (let value of iterable) {
    // code
}
```

## Example

``` javascript
let browsers = ["Chrome", "Firefox", "Edge"];

for (let browser of browsers) {
    console.log(browser);
}
```

Output:

``` text
Chrome
Firefox
Edge
```

## String example

``` javascript
let word = "JavaScript";

for (let char of word) {
    console.log(char);
}
```

## Real-time QA example

``` javascript
let testCases = ["Login", "Search", "Checkout"];

for (let testCase of testCases) {
    console.log(`Executing ${testCase}`);
}
```

## Benefits

-   Cleaner than traditional `for` when index is not required.
-   Very readable.
-   Works directly with values.
-   Works with arrays and strings.
-   Avoids writing `array[i]`.

------------------------------------------------------------------------

# 3. `for...in` Loop

## 🎯 Objective / Purpose

> Use `for...in` primarily to iterate through the **keys/property names
> of an object**.

**Think:** `Give me each property name/key.`

## Syntax

``` javascript
for (let key in object) {
    // code
}
```

## Object example

``` javascript
let user = {
    name: "Suresh",
    role: "Tester",
    experience: 15
};

for (let key in user) {
    console.log(key);
}
```

Output:

``` text
name
role
experience
```

## Get key + value

``` javascript
for (let key in user) {
    console.log(key, user[key]);
}
```

Output:

``` text
name Suresh
role Tester
experience 15
```

## Why `user[key]`?

If:

``` javascript
key = "name";
```

then:

``` javascript
user[key]
```

means:

``` javascript
user["name"]
```

which returns:

``` text
Suresh
```

## Benefits

-   Convenient for object properties.
-   Gives the property/key name directly.
-   Useful for dynamic object/API response data.

## Important warning

Although `for...in` can technically work with arrays, it is generally
**not the preferred loop for array values**.

Prefer:

``` javascript
for (let number of numbers) {
    console.log(number);
}
```

Remember:

> `for...of` → values\
> `for...in` → keys/properties

------------------------------------------------------------------------

# 4. `forEach()`

## 🎯 Objective / Purpose

> Use `forEach()` when you want to **perform an action for every array
> element**.

**Think:** `For each item, do this action.`

## Syntax

``` javascript
array.forEach((value, index, array) => {
    // code
});
```

The callback parameters are optional.

## Simple example

``` javascript
let browsers = ["Chrome", "Firefox", "Edge"];

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

## Callback parameters

``` javascript
browsers.forEach((value, index, array) => {
    console.log(value);
    console.log(index);
    console.log(array);
});
```

  Parameter   Meaning
  ----------- -----------------
  `value`     Current element
  `index`     Current index
  `array`     Original array

You normally use only what you need:

``` javascript
browsers.forEach(browser => {
    console.log(browser);
});
```

## Real-time QA example

``` javascript
let testCases = ["Login", "Search", "Checkout"];

testCases.forEach(testCase => {
    console.log(`Executing test: ${testCase}`);
});
```

## Benefits

-   Very readable.
-   Excellent for simple array processing.
-   Callback automatically receives the current element.
-   Optional access to index.
-   No need to manage initialization, condition, or increment.

## Important limitation

`forEach()` does not create a transformed array.

``` javascript
let numbers = [1, 2, 3];

let result = numbers.forEach(number => number * 2);

console.log(result);
```

Output:

``` text
undefined
```

If your objective is to transform the array, use `map()`:

``` javascript
let result = numbers.map(number => number * 2);
```

------------------------------------------------------------------------

# 5. `while` Loop

## 🎯 Objective / Purpose

> Use `while` when you want to **keep repeating code as long as a
> condition is true**, especially when you do not know the number of
> iterations in advance.

**Think:** `Check first → Execute if true.`

## Syntax

``` javascript
while (condition) {
    // code
}
```

## Example

``` javascript
let count = 1;

while (count <= 5) {
    console.log(count);
    count++;
}
```

Output:

``` text
1
2
3
4
5
```

## Real-time QA example

Retry an operation until it succeeds or maximum retries are reached:

``` javascript
let retry = 1;
let success = false;

while (retry <= 3 && !success) {
    console.log(`Attempt ${retry}`);

    if (retry === 3) {
        success = true;
    }

    retry++;
}
```

## Benefits

-   Good when the number of iterations is unknown.
-   Useful for retry/polling logic.
-   Condition can depend on changing runtime data.
-   Gives explicit control over when the loop stops.

## Important warning

Always make sure the condition can eventually become false.

Bad:

``` javascript
let count = 1;

while (count <= 5) {
    console.log(count);
}
```

`count` never changes, so the loop never ends.

------------------------------------------------------------------------

# 6. `do...while` Loop

## 🎯 Objective / Purpose

> Use `do...while` when the code **must execute at least once**, and
> only after that should the condition be checked.

**Think:** `Execute first → Check later.`

## Syntax

``` javascript
do {
    // code
} while (condition);
```

Notice the semicolon after `while (condition);`.

## Example

``` javascript
let count = 1;

do {
    console.log(count);
    count++;
} while (count <= 5);
```

Output:

``` text
1
2
3
4
5
```

## Key difference from `while`

### `while`

``` javascript
let count = 10;

while (count < 5) {
    console.log(count);
}
```

Output:

``` text
Nothing
```

The condition is checked first.

### `do...while`

``` javascript
let count = 10;

do {
    console.log(count);
} while (count < 5);
```

Output:

``` text
10
```

The code executes once before the condition is checked.

## Real-time example --- input/menu validation

``` javascript
let choice;

do {
    choice = getUserChoice();
} while (choice !== "exit");
```

The user gets at least one chance to make a choice.

## Benefits

-   Guarantees at least one execution.
-   Useful for menus.
-   Useful for input validation.
-   Useful when an action must happen before deciding whether to repeat.

------------------------------------------------------------------------

# 7. Side-by-Side Array Comparison

Suppose:

``` javascript
let browsers = ["Chrome", "Firefox", "Edge"];
```

## Need index + value → `for`

``` javascript
for (let i = 0; i < browsers.length; i++) {
    console.log(i, browsers[i]);
}
```

## Need only values → `for...of`

``` javascript
for (let browser of browsers) {
    console.log(browser);
}
```

## Need value + optional index → `forEach()`

``` javascript
browsers.forEach((browser, index) => {
    console.log(index, browser);
});
```

## Need object keys → `for...in`

``` javascript
let user = {
    name: "Suresh",
    role: "Tester"
};

for (let key in user) {
    console.log(key);
}
```

------------------------------------------------------------------------

# 8. Interview Cheat Sheet

  -----------------------------------------------------------------------
  Requirement             Best choice             Objective
  ----------------------- ----------------------- -----------------------
  Need index + value      `for`                   Control the iteration

  Need only values        `for...of`              Get each value

  Need object keys        `for...in`              Get each property/key

  Process every array     `forEach()`             Perform an action on
  item                                            every item

  Transform every item    `map()`                 Create a changed array

  Keep matching items     `filter()`              Select elements

  Repeat while true       `while`                 Check first, then
                                                  execute

  Execute at least once   `do...while`            Execute first, then
                                                  check
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 9. 🧠 Fast Memory Rules

### `for`

> **I need control over the iteration.**

``` javascript
for (let i = 0; i < arr.length; i++) {}
```

### `for...of`

> **I need values.**

``` javascript
for (let value of arr) {}
```

### `for...in`

> **I need keys.**

``` javascript
for (let key in obj) {}
```

### `forEach()`

> **I want to perform an action for every item.**

``` javascript
arr.forEach(value => {});
```

### `while`

> **Check → execute → repeat.**

``` javascript
while (condition) {}
```

### `do...while`

> **Execute → check → repeat.**

``` javascript
do {} while (condition);
```

------------------------------------------------------------------------

# 10. Final Mental Model

``` text
for
  ↓
"I control the index and iteration"

for...of
  ↓
"Give me each VALUE"

for...in
  ↓
"Give me each KEY"

forEach()
  ↓
"Perform an ACTION for every array item"

while
  ↓
"Keep going WHILE condition is true"

do...while
  ↓
"DO it once, THEN check"
```

This objective-first approach is especially useful when learning because
you can identify the loop from the **problem requirement** before
thinking about syntax.
