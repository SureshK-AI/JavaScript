# JavaScript Interview Preparation Notes

## Topics: Objects, Multidimensional Arrays, Callbacks, Promises, Async/Await

> Purpose: Quick theoretical revision notes for JavaScript interviews,
> especially for QA/SDET and test automation roles.

------------------------------------------------------------------------

# 14 - Objects

## 1. What is an Object?

An object is a collection of related data and functionality stored as
**key-value pairs**.

``` javascript
const user = {
    name: "Suresh",
    role: "QA Engineer",
    experience: 15
};
```

-   `name`, `role`, and `experience` are properties.
-   `"Suresh"`, `"QA Engineer"`, and `15` are property values.

## 2. Why are Objects Important?

Objects are heavily used in:

-   API request and response data
-   Test data
-   Page Object Model
-   Configuration
-   JSON
-   User/session information
-   Database records
-   Automation framework utilities

## 3. Accessing Object Properties

### Dot notation

``` javascript
console.log(user.name);
```

### Bracket notation

``` javascript
console.log(user["name"]);
```

Bracket notation is useful when the property name is dynamic.

``` javascript
let key = "role";
console.log(user[key]);
```

## 4. Adding and Updating Properties

``` javascript
user.location = "Bangalore";
user.experience = 16;
```

## 5. Deleting Properties

``` javascript
delete user.location;
```

## 6. Object Methods

A function stored inside an object is called a method.

``` javascript
const user = {
    name: "Suresh",

    greet: function () {
        console.log("Hello " + this.name);
    }
};

user.greet();
```

## 7. What is `this`?

`this` generally refers to the object associated with the current method
call.

``` javascript
const employee = {
    name: "Raj",
    showName() {
        console.log(this.name);
    }
};

employee.showName();
```

Output:

``` text
Raj
```

> Interview warning: the value of `this` depends on how a function is
> called. Arrow functions do not create their own `this`.

## 8. Object Destructuring

Destructuring extracts properties into variables.

``` javascript
const user = {
    name: "Suresh",
    role: "SDET"
};

const { name, role } = user;
```

## 9. Spread Operator with Objects

``` javascript
const user1 = {
    name: "Suresh",
    role: "SDET"
};

const user2 = {
    ...user1,
    location: "India"
};
```

## 10. Common Interview Questions

### Q: Is an object mutable?

Yes. Objects declared with `const` can still have their properties
changed.

``` javascript
const user = { name: "Raj" };
user.name = "Kumar";
```

The variable cannot be reassigned, but the object's contents can be
modified.

### Q: How do you check whether a property exists?

``` javascript
"name" in user
```

or:

``` javascript
user.hasOwnProperty("name")
```

------------------------------------------------------------------------

# 15 - Multidimensional Arrays

## 1. What is a Multidimensional Array?

A multidimensional array is an array containing other arrays.

``` javascript
const numbers = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
];
```

Think of it as a table:

``` text
        Col 0  Col 1  Col 2

Row 0    10     20     30
Row 1    40     50     60
Row 2    70     80     90
```

## 2. Accessing Values

``` javascript
console.log(numbers[0][1]);
```

Output:

``` text
20
```

The first index represents the row and the second represents the column.

``` javascript
array[row][column]
```

## 3. Traversing a 2D Array

The traditional approach uses nested loops.

``` javascript
for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers[i].length; j++) {
        console.log(numbers[i][j]);
    }
}
```

## 4. Using `for...of`

``` javascript
for (let row of numbers) {
    for (let value of row) {
        console.log(value);
    }
}
```

## 5. QA/Test Automation Example

A multidimensional array can represent test data:

``` javascript
const testData = [
    ["Chrome", "Windows", "PASS"],
    ["Firefox", "Linux", "PASS"],
    ["Safari", "macOS", "FAIL"]
];
```

You can iterate through each test combination.

## 6. Searching a 2D Array

``` javascript
const searchValue = 50;

for (let row = 0; row < numbers.length; row++) {
    for (let col = 0; col < numbers[row].length; col++) {
        if (numbers[row][col] === searchValue) {
            console.log(`Found at row ${row}, column ${col}`);
        }
    }
}
```

## 7. Interview Questions

### Q: What is the difference between a normal array and a multidimensional array?

A normal array stores values directly:

``` javascript
[10, 20, 30]
```

A multidimensional array stores arrays as elements:

``` javascript
[[10, 20], [30, 40]]
```

### Q: Are JavaScript arrays fixed-size?

No. JavaScript arrays are dynamic and can grow or shrink.

------------------------------------------------------------------------

# 16 - Callback Functions

## 1. What is a Callback?

A callback is a function passed as an argument to another function and
executed later by that function.

``` javascript
function processNumber(num, callback) {
    callback(num);
}

processNumber(10, function (num) {
    console.log(num * 2);
});
```

## 2. Why Use Callbacks?

Callbacks are useful when:

-   An operation needs customized behavior.
-   We want to execute something after another operation.
-   Working with asynchronous operations.
-   Processing arrays.
-   Building reusable functions.

## 3. Basic Callback Flow

``` text
Main Function
     |
     | calls
     v
Callback Function
     |
     | returns result
     v
Main Function continues
```

## 4. Callback with an Array

``` javascript
function processNumbers(numbers, callback) {
    for (let num of numbers) {
        callback(num);
    }
}
```

Call:

``` javascript
processNumbers([1, 2, 3], function (num) {
    console.log(num * 2);
});
```

## 5. Callback Returning a Value

``` javascript
function myMap(numbers, callback) {
    let result = [];

    for (let num of numbers) {
        let newValue = callback(num);
        result.push(newValue);
    }

    return result;
}
```

The important point is:

``` javascript
let newValue = callback(num);
```

The callback's return value is captured and used.

## 6. Callback vs Function Call

Passing a function:

``` javascript
processData(myFunction);
```

Calling a function:

``` javascript
processData(myFunction());
```

These are different.

-   `myFunction` passes the function itself.
-   `myFunction()` immediately executes the function and passes its
    return value.

## 7. Synchronous Callback

``` javascript
[1, 2, 3].forEach(function (num) {
    console.log(num);
});
```

The callback runs as part of the current synchronous flow.

## 8. Asynchronous Callback

``` javascript
setTimeout(function () {
    console.log("Executed later");
}, 1000);
```

The callback executes later.

## 9. Callback Hell

Callback Hell occurs when multiple asynchronous operations are nested
deeply.

``` javascript
login(function () {
    getUser(function () {
        getOrders(function () {
            getPayment(function () {
                generateReport(function () {
                    console.log("Done");
                });
            });
        });
    });
});
```

Problems:

-   Difficult to read
-   Difficult to maintain
-   Error handling becomes complicated
-   Deep nesting
-   Difficult debugging

This problem led to cleaner patterns such as **Promises** and
**async/await**.

------------------------------------------------------------------------

# 17 - Promises

## 1. What is a Promise?

A Promise is an object representing the eventual completion or failure
of an asynchronous operation.

A Promise has three states:

``` text
Pending
   |
   +----> Fulfilled
   |
   +----> Rejected
```

## 2. Creating a Promise

``` javascript
const promise = new Promise((resolve, reject) => {

    let success = true;

    if (success) {
        resolve("Operation successful");
    } else {
        reject("Operation failed");
    }

});
```

## 3. Consuming a Promise

Use `.then()` for success and `.catch()` for failure.

``` javascript
promise
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });
```

## 4. `resolve()` and `reject()`

``` javascript
resolve(value);
```

means the asynchronous operation succeeded.

``` javascript
reject(error);
```

means it failed.

## 5. Promise Example

``` javascript
function login() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Login successful");
        }, 500);
    });
}

login()
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    });
```

## 6. Promise Chaining

Promises can eliminate deeply nested callbacks.

``` javascript
login()
    .then(getUser)
    .then(getOrders)
    .then(getPayment)
    .then(generateReport)
    .catch(error => {
        console.log(error);
    });
```

The next `.then()` can receive the value returned by the previous
Promise.

## 7. Important Rule

If a `.then()` callback returns a Promise:

``` javascript
.then(() => {
    return getUser();
})
```

the next `.then()` waits for that Promise.

## 8. Promise Error Handling

``` javascript
login()
    .then(getUser)
    .then(getOrders)
    .catch(error => {
        console.log("Error:", error);
    });
```

A rejection can be handled by `.catch()`.

## 9. `finally()`

`finally()` runs regardless of success or failure.

``` javascript
promise
    .then(result => console.log(result))
    .catch(error => console.log(error))
    .finally(() => {
        console.log("Cleanup completed");
    });
```

Useful for:

-   Closing resources
-   Hiding loading indicators
-   Cleanup
-   Logging

## 10. Promise.all()

Runs multiple Promises and waits for all of them.

``` javascript
Promise.all([
    getUsers(),
    getProducts(),
    getOrders()
])
.then(results => {
    console.log(results);
})
.catch(error => {
    console.log(error);
});
```

Important:

> `Promise.all()` rejects when one of the input Promises rejects.

## 11. Promise.allSettled()

Waits for all operations regardless of success or failure.

``` javascript
Promise.allSettled([
    getUsers(),
    getProducts(),
    getOrders()
])
.then(results => {
    console.log(results);
});
```

Useful when you need the result of every operation.

## 12. Promise.race()

Returns when the first Promise settles.

``` javascript
Promise.race([
    request1(),
    request2()
]);
```

The first fulfilled or rejected Promise determines the result.

## 13. Promise.any()

Returns the first **fulfilled** Promise.

Rejected Promises are ignored until all inputs reject.

If all reject, `Promise.any()` rejects with an `AggregateError`.

## 14. Promise vs Callback

  -----------------------------------------------------------------------
  Callback                            Promise
  ----------------------------------- -----------------------------------
  Can become deeply nested            Supports chaining

  Error handling can be scattered     `.catch()` provides centralized
                                      handling

  Harder to compose                   Easier to compose

  Can lead to callback hell           Helps avoid callback hell
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 18 - Async/Await

## 1. What is `async`?

An `async` function always returns a Promise.

``` javascript
async function test() {
    return "Success";
}
```

This effectively produces a fulfilled Promise.

## 2. What is `await`?

`await` pauses execution of the surrounding async function until the
Promise settles.

``` javascript
async function test() {
    const result = await login();
    console.log(result);
}
```

Important:

> `await` can normally be used inside an `async` function, with modern
> JavaScript also supporting top-level await in appropriate module
> contexts.

## 3. Callback Hell Converted to Async/Await

Instead of:

``` javascript
login(function () {
    getUser(function () {
        getOrders(function () {
            getPayment(function () {
                generateReport(function () {
                    console.log("Done");
                });
            });
        });
    });
});
```

we can write:

``` javascript
async function runProcess() {
    await login();
    await getUser();
    await getOrders();
    await getPayment();
    await generateReport();

    console.log("Done");
}

runProcess();
```

This is much easier to read.

## 4. Error Handling with Async/Await

Use `try...catch`.

``` javascript
async function runProcess() {
    try {
        await login();
        await getUser();
        await getOrders();
        await getPayment();

        console.log("Success");
    } catch (error) {
        console.log("Error:", error);
    }
}
```

## 5. `async/await` Does Not Make an Operation Synchronous

This is a common interview question.

`await` does not block the entire JavaScript runtime.

It pauses the execution of the current async function while allowing
other JavaScript work to continue.

## 6. Sequential vs Parallel Execution

### Sequential

``` javascript
const users = await getUsers();
const orders = await getOrders();
```

`getOrders()` starts after `getUsers()` completes.

### Parallel

``` javascript
const usersPromise = getUsers();
const ordersPromise = getOrders();

const users = await usersPromise;
const orders = await ordersPromise;
```

Or commonly:

``` javascript
const [users, orders] = await Promise.all([
    getUsers(),
    getOrders()
]);
```

Use parallel execution when the operations are independent.

------------------------------------------------------------------------

# Callback vs Promise vs Async/Await

## Callback

``` text
Operation
   |
   v
callback()
   |
   v
Next operation
```

## Promise

``` text
Operation
   |
   v
.then()
   |
   v
Next operation
```

## Async/Await

``` text
async function
     |
     v
await operation
     |
     v
next statement
```

### Interview Summary

  ------------------------------------------------------------------------
  Feature           Callback           Promise           Async/Await
  ----------------- ------------------ ----------------- -----------------
  Readability       Low for deep       Good              Excellent
                    nesting                              

  Chaining          Nested callbacks   `.then()`         Sequential
                                                         statements

  Error handling    Often manual       `.catch()`        `try/catch`

  Callback Hell     Possible           Reduced           Mostly avoided

  Based on          Functions          Promise object    Promises

  Best use          Simple             Async composition Clean async
                    callbacks/events                     workflows
  ------------------------------------------------------------------------

------------------------------------------------------------------------

# Important Interview Questions

## Q1. What is a callback?

A callback is a function passed to another function as an argument and
invoked by the receiving function.

## Q2. What is Callback Hell?

Callback Hell is deeply nested callback-based asynchronous code that
becomes difficult to read, maintain, debug, and maintain.

## Q3. What is a Promise?

A Promise represents the eventual result of an asynchronous operation
and can be pending, fulfilled, or rejected.

## Q4. What is the difference between `then()` and `catch()`?

-   `.then()` handles fulfillment and can continue a Promise chain.
-   `.catch()` handles rejection/errors.

## Q5. Does an async function return a Promise?

Yes. An `async` function always returns a Promise.

## Q6. What happens if an async function returns a normal value?

The value is automatically wrapped in a fulfilled Promise.

``` javascript
async function test() {
    return 10;
}
```

Conceptually:

``` javascript
Promise.resolve(10);
```

## Q7. What happens if an async function throws an error?

Its returned Promise becomes rejected.

``` javascript
async function test() {
    throw new Error("Failed");
}
```

## Q8. What is the difference between `Promise.all()` and `Promise.allSettled()`?

`Promise.all()` fails fast when an input Promise rejects.

`Promise.allSettled()` waits for every input and reports each result.

## Q9. When should you use `Promise.all()`?

When multiple asynchronous operations are independent and can run
concurrently.

## Q10. Why is async/await preferred for many automation scripts?

It often makes asynchronous test code easier to read and maintain
because the code resembles the actual business flow.

Example:

``` javascript
await login();
await searchProduct();
await addToCart();
await checkout();
```

This is easier to understand than deeply nested callbacks.

------------------------------------------------------------------------

# QA / SDET Interview Examples

## Example 1: API Test Flow

A typical test workflow might be:

``` text
Login API
   ↓
Get Token
   ↓
Get User
   ↓
Create Order
   ↓
Get Order
   ↓
Validate Order
```

With async/await:

``` javascript
async function testOrderFlow() {
    const token = await login();
    const user = await getUser(token);
    const order = await createOrder(user, token);
    const response = await getOrder(order.id, token);

    console.log(response);
}
```

## Example 2: Independent API Calls

If these do not depend on each other:

``` javascript
const [users, products, orders] = await Promise.all([
    getUsers(),
    getProducts(),
    getOrders()
]);
```

This can reduce total waiting time compared with running them
sequentially.

## Example 3: UI Automation Concept

A Playwright-style flow commonly looks conceptually like:

``` javascript
await page.goto(url);
await page.locator("#username").fill("user");
await page.locator("#password").fill("password");
await page.locator("#login").click();
await expect(page.locator("#home")).toBeVisible();
```

Each awaited operation represents an asynchronous action.

------------------------------------------------------------------------

# Quick Revision Cheat Sheet

``` text
OBJECT
→ key-value collection

ARRAY
→ ordered collection

2D ARRAY
→ array containing arrays

CALLBACK
→ function passed to another function

CALLBACK HELL
→ deeply nested callbacks

PROMISE
→ eventual success/failure of async operation

PROMISE STATES
→ pending → fulfilled/rejected

.then()
→ handle successful Promise result

.catch()
→ handle Promise rejection

.finally()
→ execute cleanup regardless of result

async
→ function returns a Promise

await
→ wait for a Promise inside async function

Promise.all()
→ wait for all; rejects if one rejects

Promise.allSettled()
→ wait for all regardless of success/failure

Promise.race()
→ first settled Promise wins

Promise.any()
→ first fulfilled Promise wins
```

------------------------------------------------------------------------

# Interview Thinking Pattern

When an interviewer gives you asynchronous JavaScript code, ask these
questions in order:

1.  What function executes first?
2.  Which functions are only being defined?
3.  Which function is actually being called?
4.  Is the callback being passed or executed?
5.  Is the callback synchronous or asynchronous?
6.  What value does the callback return?
7.  Is that return value being used?
8.  Is a Promise returned?
9.  Where does `await` pause the async function?
10. Where can an error/rejection occur?
11. Are operations dependent or independent?
12. Should they run sequentially or with `Promise.all()`?

------------------------------------------------------------------------

# Final Mental Model

``` text
Synchronous Function
        ↓
    executes now

Callback
        ↓
passed to another function
        ↓
called later/by the receiving function

Promise
        ↓
represents future result
        ↓
.then() / .catch()

Async/Await
        ↓
clean syntax built on Promises
        ↓
try/catch for errors
```

> **Interview rule:** Do not just memorize syntax. Be able to explain
> **where execution starts, when the callback executes, what value it
> returns, where the Promise is created/resolved/rejected, and where
> `await` pauses the async function.**
