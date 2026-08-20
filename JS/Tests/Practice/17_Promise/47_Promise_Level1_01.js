/*
============================================================
47 - Promise | Level 1 | Example 01
Topic: Basic Promise
============================================================
Expected after 2 seconds:
Promise completed successfully
============================================================
*/

const promise = new Promise((resolve, reject) => {
    // TODO: Resolve after 2 seconds.
    let success = false;

    setTimeout(() => {

        if (success) {
                resolve("Operation successful");
        } else {
            reject("Operation failed");
        }

    }, 2000);
});

// TODO: Consume the promise using then().
promise
    .then (result => {
        console.log(result);
    })
    .catch(error => {
        console.log(error);
    })

// "setTimeout() is a timer API provided by the runtime environment, such as the browser or Node.js.
// It is not part of the ECMAScript language specification itself."

// console.log(typeof Promise);
// console.log(typeof setTimeout);

// console.log(Promise);
// console.log(setTimeout);
