/*
============================================================
46 - Callback | Level 2 | Example 01
Topic: Filter Using Callback
============================================================
Expected:
25
30
============================================================
*/

function filterNumbers(numbers, callback) {
    // TODO: Build and return a new array based on callback result.
}

const result = filterNumbers([10, 15, 20, 25, 30], function (num) {
    return num > 20;
});

console.log(result);
