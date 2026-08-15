/*
============================================================
45 - Multi-Dimensional Arrays | Level 2 | Example 03
Topic: Student Marks
============================================================
Calculate total marks for each student.
Expected:
Raj   245
Priya 275
Anil  233
============================================================
*/

const students = [
    ["Raj", 80, 75, 90],
    ["Priya", 95, 88, 92],
    ["Anil", 70, 85, 78]
];

// TODO: Calculate and print each student's total.
let finRes="";

for (i=0; i<students.length;i++) {
    let row = students[i];

    let res=0;
    for (j=1; j<row.length;j++) {
        res += row[j];
    }
    finRes = finRes + (row[0] + " " + res) + "\n";
    
}
    console.log(finRes);