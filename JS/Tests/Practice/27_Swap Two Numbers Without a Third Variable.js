/* Read two integers and swap them WITHOUT using a third variable. Print the swapped values separated by a space.

Example 1
Input: 3 8
Output: 8 3
a+b / a-b arithmetic swaps the values in place
Example 2
Input: 10 25
Output: 25 10 */

let inpWord = "3 8".split(" ");
let a = Number(inpWord[0]);
let b = Number(inpWord[1]);
a = a+b;
// console.log(a);
// console.log(b);
b = a-b;
// console.log(a);
// console.log(b);
a = a-b;
console.log(a);
console.log(b);