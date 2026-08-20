/*
============================================================
56 - Find Factorial of a Number
Topic: Loops
============================================================

Practice:
Find the factorial of a given number.

============================================================
*/

// Write your solution below

function factorialOfANumber(inpNumber) {
    let retValue = 1;

    for (let i=1; i<=inpNumber; i++) {
        retValue = retValue * i;
    }
    return retValue;
}

console.log(factorialOfANumber(5));
console.log(factorialOfANumber(2));

