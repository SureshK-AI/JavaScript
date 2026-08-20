/*
============================================================
55 - Check String Palindrome
Topic: Strings
============================================================

Practice:
Check whether a given string is a palindrome.

============================================================
*/

// Write your solution below

let inpWord = "madam";
let len = inpWord.length;
let isPo = true;


for (let i=0; i <= inpWord.length/2;i++){

    if (inpWord[i] !== inpWord[len - 1 - i]) {
        isPo = false;
        break;
    }
}

if (isPo) {
    console.log("YES");
}
else{
    console.log("NO");
}

