/*
============================================================
60 - Find Largest Number in Array
Topic: Arrays
============================================================

Practice:
Find the largest number in an array.

============================================================
*/

// Write your solution below
function findLargest(inpArr) {
    let retValue = 0;

    for (let i=0; i<inpArr.length; i++) {
        let eleValue=inpArr[i];

        if (retValue < eleValue) {
            retValue = eleValue;
        }
    }
    return retValue;
}

let numbers = [10, 25, 15, 30, 20];
console.log(findLargest(numbers));
console.log(findLargest([1,22,3]));

