/*
============================================================
61 - Remove Duplicate Values from Array
Topic: Arrays
============================================================

Practice:
Remove duplicate values from an array.

============================================================
*/

// Write your solution below

function removeDupInArray(inpArr) {
    let retValue = [];
    // retValue.push(inpArr[0]);
    // let counter=1;

    for (let i=0; i<inpArr.length; i++) {
        let eleValue=inpArr[i];

        if (!retValue.includes(eleValue)) {
            retValue.push(eleValue);
            // counter +=1;
        }
    }
    return retValue;
}


console.log(removeDupInArray([1,3,1,4]));
console.log(removeDupInArray([3,5,6,5]));
