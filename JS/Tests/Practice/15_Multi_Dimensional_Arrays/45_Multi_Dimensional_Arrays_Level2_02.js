/*
============================================================
45 - Multi-Dimensional Arrays | Level 2 | Example 02
Topic: Search Element
============================================================
Search for 30.
Expected: 30 found at row 1, column 2
============================================================
*/

const numbers = [
    [10, 20, 25],
    [40, 50, 30],
    [70, 80, 90]
];

const searchValue = 30;
let col = -1;
let row1 = -1;

for (let i = 0; i < numbers.length; i++) {

    let row = numbers[i];

    for (let j = 0; j < row.length; j++) {

        if (searchValue === row[j]) {
            row1 = i;
            col = j;
            break;
        }
    }

    // If value was found, stop outer loop as well
    if (row1 !== -1) {
        break;
    }
}

if (row1 !== -1) {
    console.log(`${searchValue} found at row ${row1}, column ${col}`);
} else {
    console.log(`${searchValue} not found`)};