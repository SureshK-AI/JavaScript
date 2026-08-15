/*
============================================================
14 - Objects | Level 2 | Example 01
Topic: Find Highest Salary
============================================================
Practice:
Find the employee having the highest salary.
Expected employee: Anil
Expected salary: 90000
============================================================
*/

const employees = [
    { name: "Raj", salary: 50000 },
    { name: "John", salary: 75000 },
    { name: "Priya", salary: 65000 },
    { name: "Anil", salary: 90000 }
];

/* // TODO: Find the employee with the highest salary.
let highestEmployee = employees[0];

for (const employee of employees) {

    if (employee.salary > highestEmployee.salary) {
        highestEmployee = employee;
    }
}

console.log("Highest salary employee:", highestEmployee.name);
console.log("Salary:", highestEmployee.salary); */

//or

// 2nd way - Try solving the same problem without using a for loop, using reduce():
const highestEmployee = employees.reduce((highest, employee) => {

    if (highest.salary > employee.salary) {
        return highest;
    } else {
        return employee;
    }
});

console.log("Highest Employee:", highestEmployee);

/* //Shorter version of above code

const highestEmployee = employees.reduce(
    (highest, employee) =>
        highest.salary > employee.salary ? highest : employee
); 

console.log(highestEmployee); */