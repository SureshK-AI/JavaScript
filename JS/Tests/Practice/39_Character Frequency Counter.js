/* Read a string and print each character with its frequency, one per line in order of first appearance, in the format ch=count.

Example 1
Input:: test
Output
        t=2
        e=1
        s=1
t appears twice, e and s once each
Example 2
Input: hello
Output
        h=1
        e=1
        l=2
        o=1 */

let inpWord = "prop";
let inpArr = [... inpWord]; //using Spread operator 
let res = "";

for (let i=0; i <inpArr.length;i++) {

    // Skip character if it was already processed
    if (inpArr[i] === "") {
        continue;
    }

    let filLtr = inpArr[i];
    let counter=1;

    for (j=i+1;j<=inpArr.length-i;j++) {
        if (filLtr === inpArr[j]) {
            counter +=1;
            inpArr[j]="";
        }
    }
    //   res = res + (` ${filLtr}=${counter}`);
    res = res + `${filLtr}=${counter}\n`;
}
console.log(res);