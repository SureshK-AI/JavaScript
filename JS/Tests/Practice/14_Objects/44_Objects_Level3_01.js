/*
============================================================
14 - Objects | Level 3 | Example 01
Topic: Group Employees by Department
============================================================
Expected:
{
    QA: ["Raj", "Priya"],
    Dev: ["John", "Anil"],
    HR: ["Sita"]
}
============================================================
*/

const employees = [
    { name: "Raj", dept: "QA" },
    { name: "John", dept: "Dev" },
    { name: "Priya", dept: "QA" },
    { name: "Anil", dept: "Dev" },
    { name: "Sita", dept: "HR" }
];

// TODO: Group employee names by department.
const groupedEmployees = employees.reduce((result, employee) => {

    if (!result[employee.dept]) {
        result[employee.dept] = [];
    }

    result[employee.dept].push(employee.name);

    return result;

}, {});

console.log(groupedEmployees);