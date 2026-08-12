/* Extract and print the first letter of each word in a string.

Example 1
Input: Java Programming Language
Output: JPL
First letter of each word: J, P, L
Example 2
Input: Hello World from Java
Output: HWfJ */

/* let inpWord = "Java Programming Language".split(" ");
let result = "";
for (let eachEle of inpWord) {
    result += eachEle.substring(0,1);
    //result += eachEle.charAt(0);
    //result += eachEle[0];
}
console.log(result); */

/* //Approach 2 — for...of directly on the string
You don't necessarily need to create the array with split() first.
We can examine the string character by character and detect when a new word starts.

let str = "Java Programming Language";
let result = "";

for (let i = 0; i < str.length; i++) {
    if (i === 0 || str[i - 1] === " ") {
        result += str[i];
    }
}
console.log(result); */

/* //Approach 4 — Using split() + map()
//This is a very common modern JavaScript approach.

let str = "Java Programming Language";

let result = str
    .split(" ")
    .map(word => word[0])
    .join("");

console.log(result); */

//Approach 5 — Using reduce()
//This is a useful approach for learning reduce().

let str = "Java Programming Language";

let result = str
    .split(" ")
    .reduce((output, word) => output + word[0], "");

console.log(result);