/*
============================================================
53 - Find the Largest of 3 Numbers
Topic: Conditional Statements
============================================================

Practice:
Find the largest among three given numbers.

============================================================
*/

// Write your solution below
function findLargest(firNumber, secNumber, thiNumber) {
    let retValue = firNumber;

    if (secNumber>retValue) {
        retValue = secNumber;
    }
    
    if (retValue<thiNumber) {
        retValue = thiNumber;
    }
    return retValue;
}

console.log(findLargest(1,2,3));
console.log(findLargest(1,22,3));

