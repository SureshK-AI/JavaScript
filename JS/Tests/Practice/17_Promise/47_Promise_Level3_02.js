/*
============================================================
47 - Promise | Level 3 | Example 02
Topic: Promise.all()
============================================================
Expected:
["Login", "User", "Orders"]
============================================================
*/

const p1 = Promise.resolve("Login");
const p2 = Promise.resolve("User");
const p3 = Promise.resolve("Orders");

Promise.all([p1, p2, p3])
    .then(results => console.log(results))
    .catch(error => console.log(error));
