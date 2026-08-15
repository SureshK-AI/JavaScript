/*
============================================================
45 - Multi-Dimensional Arrays | Level 1 | Example 03
Topic: Calculate Sum
============================================================
Expected total: 210
============================================================
*/

const numbers = [
    [10, 20],
    [30, 40],
    [50, 60]
];

// TODO: Calculate the sum of all values.
let res=0;

for (i=0; i<numbers.length;i++) {
    let row = numbers[i];

    for (j=0; j<row.length;j++) {
        res += row[j];
    } 
}
    console.log(res);