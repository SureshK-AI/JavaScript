/*
============================================================
14 - Objects | Level 2 | Example 02
Topic: Filter Employees by Salary
============================================================
Practice:
Find employees whose salary is greater than 60000.
Expected: John, Priya, Anil
============================================================
*/

const employees = [
    { name: "Raj", salary: 50000 },
    { name: "John", salary: 75000 },
    { name: "Priya", salary: 65000 },
    { name: "Anil", salary: 90000 }
];

// TODO: Use filter() to find employees with salary > 60000.
let newEmployees = employees.filter(employee => employee.salary>60000);
console.log(newEmployees);

//or 

let newEmployees1 = employees.filter(function(employee) {
    return employee.salary > 60000;
});

console.log(newEmployees1);
