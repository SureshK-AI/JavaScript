/* Write a program to count the number of words in a given string.

Example 1
Input: Java Programming Language
Output: 3
Three separate words
Example 2
Input: Hello world! Welcome to Java.
Output: 5 */

/* // using split
let inpWord = "Hello world! Welcome to Java.";
let inpArr = inpWord.split(" ");
console.log(inpArr.length); */

/* // using for loop 
let inpWord = "Hello world! Welcome to Java.";

let count = 0;
let insideWord = false;

for (let char of inpWord) {

    if (char !== " " && !insideWord) {
        count++;
        insideWord = true;
    }
    else if (char === " ") {
        insideWord = false;
    }
}
console.log(count); */

// 3: Using filter() - need to learn
let inpWord = "Hello world! Welcome to Java.";

let count = inpWord
    .split(" ")
    .filter(word => word !== "")
    .length;

console.log(count);