# JavaScript Callback & Arrow Functions — Interview Practice Guide

## 1. Learning Roadmap

This guide covers:

1. Normal functions
2. Arrow functions
3. Function expressions
4. Functions as values
5. Callbacks
6. Passing functions as arguments
7. Callback with normal functions
8. Callback with arrow functions
9. `forEach()`
10. `map()`
11. `filter()`
12. `find()`
13. `some()`
14. `every()`
15. Callback parameters
16. Returning values from callbacks
17. Custom callback functions
18. Callback-based calculators
19. `setTimeout()` callbacks
20. Nested callbacks
21. Interview questions
22. Practice problems

---

# 2. Normal Functions

A function is a reusable block of code.

```javascript
function greet() {
    console.log("Hello");
}

greet();
```

### Function with parameters

```javascript
function greet(name) {
    console.log("Hello " + name);
}

greet("Suresh");
```

### Function with return

```javascript
function add(a, b) {
    return a + b;
}

let result = add(10, 20);
console.log(result); // 30
```

### Interview Question

**Q: What is the difference between a parameter and an argument?**

**Answer:**

```javascript
function add(a, b) {       // a and b are parameters
    return a + b;
}

add(10, 20);               // 10 and 20 are arguments
```

A parameter is the variable declared by the function. An argument is the actual value supplied during the function call.

---

# 3. Function Expression

A function can be stored inside a variable.

```javascript
const greet = function(name) {
    console.log("Hello " + name);
};

greet("Suresh");
```

The function is anonymous because it has no function name.

### Interview Question

**Q: What is a function expression?**

A function expression creates a function and assigns it to a variable.

```javascript
const add = function(a, b) {
    return a + b;
};
```

---

# 4. Arrow Functions

Arrow functions provide shorter syntax for writing functions.

### Normal function

```javascript
function add(a, b) {
    return a + b;
}
```

### Arrow function

```javascript
const add = (a, b) => {
    return a + b;
};
```

### Implicit return

```javascript
const add = (a, b) => a + b;
```

The expression is automatically returned.

### One parameter

```javascript
const square = num => num * num;
```

Parentheses are optional when there is exactly one parameter.

### Multiple parameters

```javascript
const add = (a, b) => a + b;
```

Parentheses are required for multiple parameters.

### No parameters

```javascript
const greet = () => console.log("Hello");
```

### Multiple statements

```javascript
const calculate = (a, b) => {
    let result = a + b;
    return result;
};
```

### Interview Question

**Q: What is the difference between explicit and implicit return in arrow functions?**

Explicit:

```javascript
const add = (a, b) => {
    return a + b;
};
```

Implicit:

```javascript
const add = (a, b) => a + b;
```

With an expression directly after `=>`, the value is automatically returned.

---

# 5. Arrow Functions and `this`

A major interview point is that arrow functions do not create their own `this`.

Normal function:

```javascript
const user = {
    name: "Suresh",

    greet: function() {
        console.log(this.name);
    }
};

user.greet(); // Suresh
```

Arrow function:

```javascript
const user = {
    name: "Suresh",

    greet: () => {
        console.log(this.name);
    }
};

user.greet();
```

The arrow function does not bind its own `this`; it uses the surrounding lexical `this`.

### Interview Question

**Q: Why are arrow functions often used inside callbacks?**

Because they provide concise syntax and preserve the surrounding lexical `this`, which is useful when working with object/class methods and asynchronous callbacks.

---

# 6. Functions Are First-Class Values

In JavaScript, functions can be:

- stored in variables
- passed as arguments
- returned from functions
- stored in arrays or objects

Example:

```javascript
const greet = function() {
    console.log("Hello");
};

const anotherFunction = greet;

anotherFunction();
```

### Interview Question

**Q: What does "functions are first-class citizens" mean?**

It means JavaScript treats functions like other values. They can be assigned, passed, returned, and stored.

---

# 7. What Is a Callback?

A callback is a function passed to another function so that the receiving function can execute it.

```javascript
function processUser(callback) {
    callback("Suresh");
}

function greet(name) {
    console.log("Hello " + name);
}

processUser(greet);
```

Here `greet` is the callback.

Conceptually:

```text
greet
  ↓
passed to processUser
  ↓
callback
  ↓
callback("Suresh")
  ↓
greet("Suresh")
```

### Important

`callback` is not a special JavaScript keyword.

It is simply a parameter name.

This is also valid:

```javascript
function processUser(myFunction) {
    myFunction("Suresh");
}
```

---

# 8. Callback Using an Arrow Function

```javascript
function processUser(callback) {
    callback("Suresh");
}

processUser(name => {
    console.log("Hello " + name);
});
```

Short form:

```javascript
processUser(name => console.log("Hello " + name));
```

### Interview Question

**Q: What is a callback function?**

A callback is a function passed as an argument to another function and invoked by that function at an appropriate time.

---

# 9. Why Use Callbacks?

Callbacks allow us to pass behavior into a function.

```javascript
function calculate(a, b, operation) {
    return operation(a, b);
}

console.log(calculate(10, 5, (a, b) => a + b));
console.log(calculate(10, 5, (a, b) => a * b));
console.log(calculate(10, 5, (a, b) => a - b));
```

Output:

```text
15
50
5
```

The `calculate()` function does not need to know which operation to perform.

The callback provides the behavior.

### Interview Question

**Q: What is the main advantage of callbacks?**

Callbacks allow a function to be customized by passing different behavior without modifying the function itself.

---

# 10. `forEach()`

`forEach()` executes a callback once for every array element.

```javascript
const numbers = [10, 20, 30];

numbers.forEach(num => {
    console.log(num);
});
```

Output:

```text
10
20
30
```

### Callback parameters

`forEach()` callback can receive:

```javascript
array.forEach((element, index, array) => {
});
```

Example:

```javascript
const fruits = ["Apple", "Banana", "Mango"];

fruits.forEach((fruit, index, arr) => {
    console.log(fruit);
    console.log(index);
    console.log(arr);
});
```

### Interview Question

**Q: What parameters does a `forEach()` callback receive?**

It can receive:

1. current element
2. current index
3. original array

```javascript
arr.forEach((element, index, array) => {});
```

### Important

`forEach()` is generally used for performing an action. It does not create a new transformed array.

---

# 11. `map()`

`map()` executes a callback for every element and returns a new array containing the callback's returned values.

```javascript
const numbers = [1, 2, 3, 4];

const result = numbers.map(num => num * 10);

console.log(result);
```

Output:

```text
[10, 20, 30, 40]
```

Conceptually:

```text
1 → callback → 10
2 → callback → 20
3 → callback → 30
4 → callback → 40
```

### Example

```javascript
const names = ["suresh", "ravi", "kiran"];

const upperNames = names.map(name => name.toUpperCase());

console.log(upperNames);
```

Output:

```text
["SURESH", "RAVI", "KIRAN"]
```

### Interview Question

**Q: What is the difference between `forEach()` and `map()`?**

`forEach()` is generally used for side effects/actions.

`map()` transforms each element and returns a new array.

```javascript
numbers.forEach(num => console.log(num * 2));

const result = numbers.map(num => num * 2);
```

---

# 12. `filter()`

`filter()` returns a new array containing elements for which the callback returns a truthy value.

```javascript
const numbers = [10, 15, 20, 25, 30];

const result = numbers.filter(num => num > 20);

console.log(result);
```

Output:

```text
[25, 30]
```

The callback:

```javascript
num => num > 20
```

returns `true` or `false`.

### Interview Question

**Q: What should the callback of `filter()` return?**

It should return a value that can be evaluated as truthy or falsy.

```javascript
const result = numbers.filter(num => num % 2 === 0);
```

---

# 13. `find()`

`find()` returns the first element that satisfies the callback condition.

```javascript
const numbers = [10, 15, 20, 25, 30];

const result = numbers.find(num => num > 18);

console.log(result);
```

Output:

```text
20
```

If no element matches, `find()` returns `undefined`.

### Interview Question

**Q: Difference between `find()` and `filter()`?**

`find()` returns the first matching element.

`filter()` returns all matching elements in a new array.

```javascript
numbers.find(num => num > 18);
// 20

numbers.filter(num => num > 18);
// [20, 25, 30]
```

---

# 14. `some()`

`some()` checks whether at least one element satisfies the callback condition.

```javascript
const numbers = [1, 3, 5, 8];

const result = numbers.some(num => num % 2 === 0);

console.log(result);
```

Output:

```text
true
```

Because `8` is even.

### Interview Question

**Q: What does `some()` return?**

A boolean:

```text
true
```

if at least one element satisfies the condition, otherwise:

```text
false
```

---

# 15. `every()`

`every()` checks whether all elements satisfy the callback condition.

```javascript
const numbers = [2, 4, 6, 8];

const result = numbers.every(num => num % 2 === 0);

console.log(result);
```

Output:

```text
true
```

### Interview Question

**Q: Difference between `some()` and `every()`?**

`some()` asks:

> Is at least one element true?

`every()` asks:

> Are all elements true?

---

# 16. Callback Parameters in Array Methods

Most array iteration methods provide:

```javascript
(element, index, array)
```

Example:

```javascript
const numbers = [10, 20, 30];

numbers.map((num, index, arr) => {
    console.log("Number:", num);
    console.log("Index:", index);
    console.log("Array:", arr);

    return num * 2;
});
```

### Interview Question

**Q: Can we use only the first callback parameter?**

Yes.

```javascript
numbers.map(num => num * 2);
```

You do not need to declare parameters you do not use.

---

# 17. Returning Values From Callbacks

Consider:

```javascript
const numbers = [1, 2, 3];

const result = numbers.map(num => num * 2);
```

The callback returns:

```javascript
num * 2
```

Therefore `map()` collects the returned values.

With braces, remember to explicitly return:

```javascript
const result = numbers.map(num => {
    return num * 2;
});
```

This is different:

```javascript
const result = numbers.map(num => {
    num * 2;
});
```

The callback returns `undefined`, because there is no `return`.

### Interview Question

**Q: What happens if you use braces in an arrow function but forget `return`?**

The function returns `undefined`.

---

# 18. Build Your Own Callback Processor

We can implement a simplified `map()`.

```javascript
function processArray(arr, callback) {

    const result = [];

    for (let i = 0; i < arr.length; i++) {
        result.push(callback(arr[i]));
    }

    return result;
}

const numbers = [1, 2, 3, 4];

const result = processArray(
    numbers,
    num => num * 10
);

console.log(result);
```

Output:

```text
[10, 20, 30, 40]
```

### Interview Question

**Q: How would you implement a basic custom `map()` using a callback?**

Key steps:

1. Create an empty result array.
2. Loop through the input.
3. Call the callback for each element.
4. Push the returned value into result.
5. Return result.

---

# 19. Build Your Own Filter

```javascript
function myFilter(arr, callback) {

    const result = [];

    for (let i = 0; i < arr.length; i++) {

        if (callback(arr[i])) {
            result.push(arr[i]);
        }

    }

    return result;
}

const numbers = [1, 2, 3, 4, 5, 6];

const result = myFilter(
    numbers,
    num => num % 2 === 0
);

console.log(result);
```

Output:

```text
[2, 4, 6]
```

### Interview Question

**Q: How would you implement a custom `filter()`?**

Call the callback for each element. If it returns a truthy value, push that element into the result array.

---

# 20. Callback-Based Calculator

```javascript
function calculate(a, b, operation) {
    return operation(a, b);
}

const addition = calculate(10, 5, (a, b) => a + b);

const subtraction = calculate(10, 5, (a, b) => a - b);

const multiplication = calculate(10, 5, (a, b) => a * b);

const division = calculate(10, 5, (a, b) => a / b);

console.log(addition);
console.log(subtraction);
console.log(multiplication);
console.log(division);
```

### Interview Question

**Q: Why pass the operation as a callback instead of using if/else inside `calculate()`?**

Because callbacks make the function more reusable and extensible. New operations can be supplied without modifying the `calculate()` implementation.

---

# 21. `setTimeout()` Callback

Callbacks are also used in asynchronous programming.

```javascript
setTimeout(() => {
    console.log("Hello after 2 seconds");
}, 2000);
```

The arrow function is a callback.

It is passed to `setTimeout()` and executed later.

### Interview Question

**Q: Is the callback in `setTimeout()` executed immediately?**

No.

The callback is scheduled to execute after the specified delay. The exact execution also depends on the JavaScript runtime and event loop.

---

# 22. Callback and Asynchronous Execution

Example:

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Callback");
}, 2000);

console.log("End");
```

Output:

```text
Start
End
Callback
```

Why?

The synchronous statements execute first. The timer callback is scheduled for later.

### Interview Question

**Q: Why does `End` print before `Callback`?**

Because `setTimeout()` schedules the callback asynchronously. JavaScript continues executing the current synchronous code before the timer callback gets its turn.

---

# 23. Nested Callbacks

Example:

```javascript
setTimeout(() => {

    console.log("Step 1");

    setTimeout(() => {

        console.log("Step 2");

        setTimeout(() => {
            console.log("Step 3");
        }, 1000);

    }, 1000);

}, 1000);
```

This can become difficult to maintain.

This pattern is commonly called **callback hell** when nesting becomes deep and complicated.

### Interview Question

**Q: What is callback hell?**

Callback hell is deeply nested callback-based code that becomes difficult to read, maintain, test, and maintain.

Modern JavaScript often uses Promises and `async/await` to make asynchronous workflows easier to manage.

---

# 24. Callback vs Higher-Order Function

A higher-order function is a function that either:

- accepts another function as an argument, or
- returns a function.

Example:

```javascript
function process(callback) {
    callback();
}
```

`process()` is a higher-order function.

The function passed to it is the callback.

### Interview Question

**Q: Is every higher-order function a callback?**

No.

A higher-order function is a function that accepts or returns functions.

A callback is the function passed to another function for later execution.

---

# 25. Common Interview Traps

## Trap 1 — Calling instead of passing

Wrong:

```javascript
processUser(greet());
```

This calls `greet()` immediately.

Usually you want:

```javascript
processUser(greet);
```

This passes the function itself.

---

## Trap 2 — Forgetting return

Wrong:

```javascript
const result = numbers.map(num => {
    num * 2;
});
```

Correct:

```javascript
const result = numbers.map(num => {
    return num * 2;
});
```

Or:

```javascript
const result = numbers.map(num => num * 2);
```

---

## Trap 3 — Confusing `map()` and `forEach()`

```javascript
const result = numbers.forEach(num => num * 2);
```

Do not expect `result` to contain the transformed array.

Use:

```javascript
const result = numbers.map(num => num * 2);
```

---

# 26. Interview Question Set — Beginner

### Q1. What is an arrow function?

An arrow function is a concise syntax for defining functions.

```javascript
const add = (a, b) => a + b;
```

### Q2. What is a callback?

A function passed to another function and invoked by it.

### Q3. What is a higher-order function?

A function that accepts another function as an argument or returns a function.

### Q4. What is implicit return?

An arrow function can automatically return an expression without using the `return` keyword.

```javascript
const square = num => num * num;
```

### Q5. What happens if an arrow function uses `{}` without `return`?

It returns `undefined`.

---

# 27. Interview Question Set — Intermediate

### Q6. Difference between `map()` and `filter()`?

`map()` transforms elements.

`filter()` selects elements.

### Q7. Difference between `find()` and `filter()`?

`find()` returns the first matching element.

`filter()` returns all matching elements in an array.

### Q8. Difference between `some()` and `every()`?

`some()` requires at least one match.

`every()` requires all elements to satisfy the condition.

### Q9. Can a callback receive parameters?

Yes.

```javascript
numbers.forEach((element, index, array) => {});
```

### Q10. Can a callback return a value?

Yes.

For example, `map()` uses callback return values to build the resulting array.

---

# 28. Interview Question Set — Advanced

### Q11. Why doesn't an arrow function have its own `this`?

Arrow functions use lexical `this`; they inherit `this` from the surrounding scope.

### Q12. Why should you not always use arrow functions for object methods?

Because arrow functions do not create their own `this`. When a method needs the object as its dynamic `this`, a normal function/method syntax is generally appropriate.

### Q13. What is callback hell?

Deeply nested callback code that becomes difficult to maintain.

### Q14. How can callback hell be improved?

Promises and `async/await` are common approaches.

### Q15. What is the difference between passing a function and invoking a function?

Passing:

```javascript
process(greet);
```

Invoking:

```javascript
process(greet());
```

The second version executes `greet()` immediately and passes its return value.

---

# 29. Real Interview Coding Problems

## Problem 1 — Double Every Number

Input:

```javascript
[1, 2, 3, 4, 5]
```

Expected:

```javascript
[2, 4, 6, 8, 10]
```

Use `map()` and an arrow callback.

---

## Problem 2 — Extract Even Numbers

Input:

```javascript
[10, 15, 20, 25, 30]
```

Expected:

```javascript
[10, 20, 30]
```

Use `filter()`.

---

## Problem 3 — Find First Number Greater Than 50

Input:

```javascript
[10, 20, 55, 80, 100]
```

Expected:

```text
55
```

Use `find()`.

---

## Problem 4 — Check Whether Any Number Is Negative

Input:

```javascript
[10, 20, -5, 30]
```

Expected:

```text
true
```

Use `some()`.

---

## Problem 5 — Check Whether All Numbers Are Positive

Input:

```javascript
[10, 20, 30, 40]
```

Expected:

```text
true
```

Use `every()`.

---

## Problem 6 — Custom Callback

Create:

```javascript
function processNumbers(numbers, callback) {
    // your code
}
```

Then support:

```javascript
processNumbers([1, 2, 3], num => num * 2);
```

Expected:

```javascript
[2, 4, 6]
```

---

## Problem 7 — Custom Filter

Create:

```javascript
function myFilter(arr, callback) {
    // your code
}
```

Test:

```javascript
myFilter([1, 2, 3, 4, 5], num => num % 2 === 0);
```

Expected:

```javascript
[2, 4]
```

---

## Problem 8 — Callback Calculator

Create:

```javascript
function calculate(a, b, callback) {
    // your code
}
```

It should support:

```javascript
calculate(10, 5, (a, b) => a + b);
calculate(10, 5, (a, b) => a * b);
calculate(10, 5, (a, b) => a - b);
```

---

## Problem 9 — String Transformation

Input:

```javascript
["hello", "world", "javascript"]
```

Expected:

```javascript
["HELLO", "WORLD", "JAVASCRIPT"]
```

Use `map()`.

---

## Problem 10 — Object Array

Input:

```javascript
const users = [
    { name: "Suresh", age: 35 },
    { name: "Ravi", age: 25 },
    { name: "Kiran", age: 40 }
];
```

Find users whose age is greater than 30.

Expected:

```javascript
[
    { name: "Suresh", age: 35 },
    { name: "Kiran", age: 40 }
]
```

Use `filter()`.

---

# 30. Quick Comparison Table

| Method | Purpose | Returns |
|---|---|---|
| `forEach()` | Perform action | `undefined` |
| `map()` | Transform | New array |
| `filter()` | Select | New array |
| `find()` | Find first match | Element / `undefined` |
| `some()` | Check any match | Boolean |
| `every()` | Check all match | Boolean |

---

# 31. One-Minute Interview Revision

Remember:

```text
Arrow function
    ↓
Short function syntax

Callback
    ↓
Function passed to another function

Higher-order function
    ↓
Accepts or returns a function

forEach
    ↓
Do something

map
    ↓
Transform

filter
    ↓
Select

find
    ↓
First match

some
    ↓
At least one?

every
    ↓
All?
```

## Most Important Syntax

```javascript
const add = (a, b) => a + b;

const square = num => num * num;

numbers.forEach(num => console.log(num));

const doubled = numbers.map(num => num * 2);

const even = numbers.filter(num => num % 2 === 0);

const first = numbers.find(num => num > 50);

const hasEven = numbers.some(num => num % 2 === 0);

const allPositive = numbers.every(num => num > 0);
```

---

# 32. Recommended Practice Order

Practice in this exact order:

1. Arrow function syntax
2. Parameters and return
3. Callback concept
4. Passing functions
5. `forEach()`
6. `map()`
7. `filter()`
8. `find()`
9. `some()`
10. `every()`
11. Custom `map()`
12. Custom `filter()`
13. Callback calculator
14. Callback + `setTimeout()`
15. Callback hell
16. Interview coding problems

The goal is not to memorize syntax. The goal is to understand:

```text
Who calls the function?
When is it called?
What arguments are passed?
What does the callback return?
What does the outer function do with that return value?
```

That mental model will make callbacks, `map()`, `filter()`, Promises, and `async/await` much easier.
