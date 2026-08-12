/* Write a program to remove duplicate characters from a string.

Example 1
Input: programming
Output: progamin
Duplicates removed: r, m, g
Example 2
Input: Hello World
Output: Helo Wrd */

let inpWord = "programming";
let uniLetWord="";

for (let i = 0; i<inpWord.length;i++){
    let sinLet = inpWord[i];

    if (!uniLetWord.includes(sinLet)) {
        uniLetWord += sinLet;
    }
}
console.log(uniLetWord);