/*
============================================================
45 - Multi-Dimensional Arrays | Level 2 | Example 01
Topic: Find Maximum
============================================================
Expected maximum: 60
============================================================
*/

const numbers = [
    [10, 25, 8],
    [45, 12, 30],
    [18, 60, 22]
];

// TODO: Find the maximum value using nested loops.
let res=0;

for (i=0; i<numbers.length;i++) {
    let row = numbers[i];

    for (j=0; j<row.length;j++) {

        if (res< row[j]){
        res = row[j];
        }
    } 
}
    console.log(res);