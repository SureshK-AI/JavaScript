/*
============================================================
45 - Multi-Dimensional Arrays | Level 1 | Example 02
Topic: Print Matrix
============================================================
Expected:
10 20 30
40 50 60
70 80 90
============================================================
*/

const matrix = [
    [10, 20, 30],
    [40, 50, 60],
    [70, 80, 90]
];

// TODO: Print the matrix row by row.
let res="";

for (i=0; i<matrix.length;i++) {
    let row = matrix[i];

    for (j=0; j<row.length;j++) {
        res += row[j] + " ";
    } 
    console.log(res);
    res="";
}

