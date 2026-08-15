/*
============================================================
47 - Promise | Level 3 | Example 03
Topic: Promise.all() Failure
============================================================
Practice:
Understand why Promise.all() goes to catch().
============================================================
*/

const p1 = Promise.resolve("A");
const p2 = Promise.reject("B");
const p3 = Promise.resolve("C");

Promise.all([p1, p2, p3])
    .then(result => console.log(result))
    .catch(error => console.log("Error:", error));

// TODO: Explain what happens to p1 and p3 when p2 rejects.
