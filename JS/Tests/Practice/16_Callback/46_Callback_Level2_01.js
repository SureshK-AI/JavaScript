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
    // Build and return a new array based on callback result.
    let result = [];

    for (let num of numbers) {
        if (callback(num)) {
            result.push(num);
        }
    }

    return result;
}

const result = filterNumbers([10, 15, 20, 25, 30], function (num) {
    return num > 20;
});

console.log(result);
