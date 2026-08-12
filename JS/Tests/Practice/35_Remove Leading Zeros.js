/* Write a program to remove leading zeros from a string representation of a number.

Example 1
Input: 000100
Output: 100
Only leading zeros removed, not trailing
Example 2
Input: 00012345
Output: 12345 */

/* //1 way with nested loops
let str = "001000", finOut = "";

for (let i =0;i<=str.length; i++) {

    if (Number(str[i])>0) {

        for (j=0; j< str.length-i;i++) {
            finOut += str[i];
        }
    }
}
console.log(finOut); */


//2 way with POP method
let str = "001000", finOut = "", a="";
let strArr = str.split("");

for (let i =0;i<=str.length-1; i++) {

    if (Number(strArr[i])===0) {
        a = strArr.splice(i)
    }
    else {
        finOut = strArr.join("");
        break;
    }
}
console.log(a);