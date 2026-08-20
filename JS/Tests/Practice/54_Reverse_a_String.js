/*
============================================================
54 - Reverse a String
Topic: Strings
============================================================

Practice:
Reverse a given string.

============================================================
*/

// Write your solution below

function stringReverse(inpWord) {
    let retValue = "";
    let inpArr = inpWord.split("");

    for (let i=inpArr.length-1; i >=0; i--) {
        let eleValue=inpArr[i];
        retValue = retValue + eleValue;
    }
    return retValue;
}

console.log(stringReverse("ABC"));
console.log(stringReverse("HDFC"));
