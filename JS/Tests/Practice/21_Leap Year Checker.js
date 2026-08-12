/* Write a program to check if a given year is a leap year. A leap year is divisible by 4, except for century years which must be divisible by 400.

Example 1
Input: 2023
Output: NO
2023 is not divisible by 4

Example 2
Input: 2024
Output: YES */

let data = 1900;
console.log(`Year: ${data}`);

if (data % 400 === 0) {
    console.log("YES");
}
else if (data % 100 === 0) {
    console.log("NO");
}
else if (data % 4 === 0) {
    console.log("YES");
}
else {
    console.log("NO");
}
    
