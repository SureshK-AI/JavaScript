/*
============================================================
46 - Callback | Level 2 | Example 02
Topic: Implement Custom map()
============================================================
Expected:
[10, 20, 30, 40]
============================================================
*/

function myMap(numbers, callback) {
    // TODO: Implement your own map().
    let result = [];
    for (let num of numbers) {
        let retValue = callback(num);
        result.push(retValue);
    }
    return result;
}

const result = myMap([1, 2, 3, 4], function (num) {
    return num * 10;
});

console.log(result);
