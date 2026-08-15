/* 2. Employee Object

Create:

const employee = {
    id: 101,
    name: "Ravi",
    department: "QA",
    experience: 8,
    salary: 85000
};

Tasks:

Print all keys
Print all values
Print name and department
Check whether salary exists
Add location
Increase salary by 10%
Find the number of properties without manually counting them. */


const employee = {
    id: 101,
    name: "Ravi",
    department: "QA",
    experience: 8,
    salary: 85000
};

// Print all keys
console.log(Object.keys(employee));
// Print all values
console.log(Object.values(employee ));
// Print name and department
console.log(employee.name, employee.department);
// Check whether salary exists

    // Method 1: Using 'in' operator
    console.log("salary" in employee);  // true
    console.log("bonus" in employee);   // false

    // Method 2: Using hasOwnProperty()
    console.log(employee.hasOwnProperty("salary"));  // true
    console.log(employee.hasOwnProperty("bonus"));   // false

    // Method 3: Using Object.hasOwn() (Modern, ES2022)
    console.log(Object.hasOwn(employee, "salary"));  // true
    console.log(Object.hasOwn(employee, "bonus"));   // false

    // Method 5: Using Object.keys().includes()
    console.log(Object.keys(employee).includes("salary"));  // true
    console.log(Object.keys(employee).includes("bonus"));   // false

    // Method 6: Using getOwnPropertyNames()
    console.log(Object.getOwnPropertyNames(employee).includes("salary"));  // true


// Add location
employee["location"]="Bangalore";

// Increase salary by 10%
//employee.salary = employee.salary + employee.salary*10/100
employee.salary = employee.salary + employee.salary * 10 / 100;
console.log(employee.salary);  // 93500

// Find the number of properties without manually counting them.
console.log(Object.keys(employee).length);