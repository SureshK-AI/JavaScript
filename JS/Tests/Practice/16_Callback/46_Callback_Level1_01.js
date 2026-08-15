/*
============================================================
46 - Callback | Level 1 | Example 01
Topic: Simple Callback
============================================================
Practice:
Create greet(name, callback) and execute the callback.
Expected:
Hello Suresh
Welcome to JavaScript
============================================================
*/

function greet(name, callback) {
    console.log("Hello " + name);
    callback();
}

// TODO: Call greet() with a callback.
