/* Write a Java program to reverse a given string.

Example 1
Input: Java
Output: avaJ
Each character is taken from end to beginning
Example 2
Input: hello
Output: olleh */

let inpWord = "hello";
let revWord ="";
for (let i = inpWord.length-1; i>=0; i--){
    revWord = revWord+inpWord[i];
}
console.log(revWord);