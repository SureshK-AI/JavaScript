/* Write a program to check if a given string is a palindrome (reads the same forwards and backwards).

Example 1
Input: madam
Output: YES
madam reads the same forwards and backwards
Example 2
Input: racecar
Output: YES */

let inpWord = "madamS";
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


// // using while loop and small logic difference - 2

// let word = "madam";

// let left = 0;
// let right = word.length - 1;

// let isPalindrome = true;

// while (left < right) {

//     if (word[left] !== word[right]) {
//         isPalindrome = false;
//         break;
//     }

//     left++;
//     right--;
// }

// console.log(isPalindrome ? "YES" : "NO");

//// simplest way - 3
// let word = "madam";
// let reversed = word.split("").reverse().join("");
// console.log(word === reversed ? "YES" : "NO");
