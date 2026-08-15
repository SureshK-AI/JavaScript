/*
============================================================
49 - Combined Challenge | Example 01
Topics:
Objects + Arrays + Callbacks
============================================================
Flow:
getEmployees()
    -> filter QA employees
    -> find experience > 7
    -> print report

Practice:
Implement the flow using callbacks first.
============================================================
*/

const employees = [
    { id: 101, name: "Raj", department: "QA", experience: 8 },
    { id: 102, name: "Priya", department: "Dev", experience: 5 },
    { id: 103, name: "Anil", department: "QA", experience: 10 }
];

function getEmployees(callback) {
    setTimeout(() => {
        callback(employees);
    }, 500);
}

// TODO: Create filterQAEmployees(employees, callback).
// TODO: Create findExperiencedEmployees(employees, callback).
// TODO: Create generateReport(employees, callback).
// TODO: Build the complete callback flow.
