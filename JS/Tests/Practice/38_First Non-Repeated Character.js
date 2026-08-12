/* Read a string and print the first character that does not repeat anywhere in the string. Print 'None' if every character repeats. This is one of the most frequently asked SDET interview questions.

Example 1
Input: programming
Output: p
p appears only once and comes first among unique characters
Example 2
Input: swiss
Output: w */

/* // 1 way - using array filter and length functions
let inpWord = "programming";
let inpArr = inpWord.split("");
    // inpArr = Array.from(inpWord); //using Array.from
    // inpArr = [... inpWord]; //using Spread operator 

for (ltr of inpArr) {
    let counter = inpArr.filter(letr => letr ===ltr).length;

    if (counter===1){
        console.log(` ${ltr} - ${counter}`);
        break;
    }
} */

/* // 2 - way using reduce array function
let inpWord = "programming";
let inpArr = Array.from(inpWord); //using Array.from

let frequency = inpArr.reduce((result, char) => {

    if (result[char]) {
        result[char] = result[char] + 1;
    } else {
        result[char] = 1;
    }

    return result;
}, {});
console.log(frequency); */


// 3 - way using loop
let inpWord = "programming";
let inpArr = [... inpWord]; //using Spread operator 
let counter=1;

for (let i=0;i <inpArr.length;i++) {
    let filLtr = inpArr[i];
    for (j=i+1;j<=inpArr.length-i;j++) {
        if (filLtr === inpArr[j]){
            counter +=1;
        }
    }

    if (counter===1){
        console.log(` ${filLtr} - ${counter}`);
        break;
    }
}