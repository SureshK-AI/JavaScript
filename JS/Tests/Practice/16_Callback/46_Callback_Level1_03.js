/*
============================================================
46 - Callback | Level 1 | Example 03
Topic: Callback with Array
============================================================
Expected:
2
4
6
8
10
============================================================
*/

function processNumbers(numbers, callback) {
    // TODO: Execute callback for every number.
}

processNumbers([1, 2, 3, 4, 5], function (num) {
    console.log(num * 2);
});
