# 08 --- Combining, Flattening & Converting

## Functions in this category

-   `concat()`
-   `flat()`
-   `flatMap()`
-   `join()`
-   `Array.from()`
-   `Array.isArray()`

------------------------------------------------------------------------

# `concat()`

Combines arrays without modifying the originals.

``` javascript
const qa = ["Selenium", "Playwright"];
const languages = ["Java", "JavaScript"];

const skills = qa.concat(languages);

console.log(skills);
```

------------------------------------------------------------------------

# `flat()`

Flattens nested arrays.

``` javascript
const data = [1, [2, 3], [4, 5]];

console.log(data.flat());
```

Result:

``` text
[1, 2, 3, 4, 5]
```

### Depth

``` javascript
const data = [1, [2, [3, [4]]]];

console.log(data.flat(2));
```

Default depth is `1`.

------------------------------------------------------------------------

# Real-time API example

API data can sometimes contain nested arrays:

``` javascript
const responses = [
    ["TC01", "TC02"],
    ["TC03", "TC04"]
];

const allTests = responses.flat();

console.log(allTests);
```

------------------------------------------------------------------------

# `flatMap()`

`flatMap()` is effectively:

``` javascript
map()
+
flat(1)
```

Example:

``` javascript
const words = ["hello", "world"];

const chars = words.flatMap(word => word.split(""));

console.log(chars);
```

Result:

``` text
["h", "e", "l", "l", "o", "w", "o", "r", "l", "d"]
```

------------------------------------------------------------------------

# Real-time QA example

Create test steps from test cases:

``` javascript
const tests = [
    { name: "Login", steps: ["Open", "Enter Credentials", "Submit"] },
    { name: "Logout", steps: ["Open Menu", "Click Logout"] }
];

const allSteps = tests.flatMap(test => test.steps);
```

------------------------------------------------------------------------

# `join()`

Converts array elements into a string.

``` javascript
const letters = ["J", "P", "L"];

const result = letters.join("");

console.log(result); // JPL
```

With separator:

``` javascript
const result = ["Java", "JavaScript", "Python"].join(" | ");

console.log(result);
```

------------------------------------------------------------------------

# Real-time reporting example

``` javascript
const failedTests = ["TC02", "TC08", "TC15"];

const report = failedTests.join(", ");

console.log(`Failed tests: ${report}`);
```

------------------------------------------------------------------------

# `Array.from()`

Creates an array from an iterable or array-like value.

``` javascript
const text = "HELLO";

const chars = Array.from(text);

console.log(chars);
```

Result:

``` text
["H", "E", "L", "L", "O"]
```

It also accepts a mapping callback:

``` javascript
const numbers = Array.from("123", n => Number(n));

console.log(numbers); // [1, 2, 3]
```

------------------------------------------------------------------------

# `Array.isArray()`

Checks whether a value is an array.

``` javascript
console.log(Array.isArray([1, 2, 3])); // true
console.log(Array.isArray("hello"));   // false
```

Useful when validating API response data.

------------------------------------------------------------------------

# `flatMap()` vs `map()`

``` javascript
const data = [[1, 2], [3, 4]];

console.log(data.map(x => x));
// [[1, 2], [3, 4]]

console.log(data.flatMap(x => x));
// [1, 2, 3, 4]
```
