/*
============================================================
15 - Multi-Dimensional Arrays | Level 1 | Example 01
Topic: Print All Elements
============================================================
Expected:
1 2 3 4 5 6 7 8 9
============================================================
*/

const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

// TODO: Use nested loops to print every element.
let res="";
for (i=0; i<numbers.length;i++) {
    let row = numbers[i];

    for (j=0; j<row.length;j++) {
        res += row[j] + " ";
    } 
}

console.log(res);