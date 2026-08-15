/*
============================================================
14 - Objects | Level 2 | Example 03
Topic: Calculate Total Salary
============================================================
Practice:
Calculate the total salary of all employees.
Expected: 280000
============================================================
*/

const employees = [
    { name: "Raj", salary: 50000 },
    { name: "John", salary: 75000 },
    { name: "Priya", salary: 65000 },
    { name: "Anil", salary: 90000 }
];

/* // TODO: Use reduce() to calculate total salary.

let totSal = employees.reduce((sumSal, employee) => {
    return sumSal + employee.salary;
}, 0);
console.log(totSal); */

// TODO: Use reduce() to calculate Average salary.

const totalSalary = employees.reduce((sum, employee) => {
    return sum + employee.salary;
}, 0);

const avgSalary = totalSalary / employees.length;

console.log("Average Salary:", avgSalary);