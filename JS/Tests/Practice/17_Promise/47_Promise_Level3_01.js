/*
============================================================
47 - Promise | Level 3 | Example 01
Topic: Promise Output Prediction
============================================================
Practice:
Predict the output before executing.
============================================================
*/

console.log("1");

Promise.resolve()
    .then(() => console.log("2"));

console.log("3");

// TODO: Explain why the output is not 1,2,3 synchronously.
