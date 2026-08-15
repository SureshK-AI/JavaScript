/*
============================================================
49 - Combined Challenge | Example 02
Topics:
Objects + Arrays + Promises
============================================================
Flow:
getEmployees()
    -> filter QA employees
    -> find experience > 7
    -> generate report
============================================================
*/

const employees = [
    { id: 101, name: "Raj", department: "QA", experience: 8 },
    { id: 102, name: "Priya", department: "Dev", experience: 5 },
    { id: 103, name: "Anil", department: "QA", experience: 10 }
];

function getEmployees() {
    return Promise.resolve(employees);
}

// TODO: Create Promise-based functions:
// filterQAEmployees()
// findExperiencedEmployees()
// generateReport()

// TODO: Build the .then() chain.
