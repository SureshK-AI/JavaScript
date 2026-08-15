/*
============================================================
49 - Combined Challenge | Example 03
Topics:
Objects + Arrays + Promises + Async/Await
============================================================
Flow:
getEmployees()
    -> filter QA employees
    -> find experience > 7
    -> get employee details
    -> generate report

Expected experienced QA employees:
Raj
Anil
============================================================
*/

const employees = [
    { id: 101, name: "Raj", department: "QA", experience: 8 },
    { id: 102, name: "Priya", department: "Dev", experience: 5 },
    { id: 103, name: "Anil", department: "QA", experience: 10 }
];

async function getEmployees() {
    return employees;
}

async function filterQAEmployees(employees) {
    // TODO: Return only QA employees.
}

async function findExperiencedEmployees(employees) {
    // TODO: Return QA employees with experience > 7.
}

async function getEmployeeDetails(employees) {
    // TODO: Return/print employee details.
}

async function generateReport(employees) {
    // TODO: Generate a readable report.
}

async function main() {
    // TODO: Build the complete async/await workflow.
}

main();
