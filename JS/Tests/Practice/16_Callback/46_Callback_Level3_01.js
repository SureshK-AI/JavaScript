/*
============================================================
46 - Callback | Level 3 | Example 01
Topic: Callback Execution Order
============================================================
Practice:
Predict the output before executing.
============================================================
*/

console.log("A");

setTimeout(() => {
    console.log("B");
}, 0);

console.log("C");

setTimeout(() => {
    console.log("D");
}, 100);

console.log("E");

// TODO: Predict output and explain the event-loop order.
