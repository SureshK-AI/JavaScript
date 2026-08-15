/*
============================================================
46 - Callback | Level 1 | Example 02
Topic: Calculator Callback
============================================================
Practice:
Use callbacks for addition, subtraction, multiplication and division.
============================================================
*/

function calculate(a, b, operation) {
    // TODO: Call operation(a, b) and return the result.
    let result = operation(a, b);
    console.log("Result:", result);
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}

// TODO: Test calculate() with all four operations.

calculate(2, 3, add);
calculate(2, 3, subtract);
calculate(2, 3, multiply);
calculate(2, 3, divide);