/* Read a number n and print the first n terms of the Fibonacci series (starting 0, 1) separated by spaces.

Example 1
Input: 5
Output: 0 1 1 2 3
Each term is the sum of the previous two, starting from 0 and 1
Example 2
Input: 7
Output: 0 1 1 2 3 5 8 */

/* let preValue=0;
let curValue=1;
let noOfTimes = 7;
let res=0, outPut="";

for (i=0;i<=noOfTimes-1;i++){

    if (i>1){
        res = preValue + curValue;
        preValue=curValue;
        curValue=res;
        //console.log(res);
        outPut = outPut + res+ " ";
    }else{
        //console.log(i);
        outPut = outPut + i + " ";
    }

}
  console.log(outPut); */

let preValue = 0;
let curValue = 1;
let noOfTimes = 7;
let output = "";

for (let i = 0; i < noOfTimes; i++) {
    output += preValue + " ";

    let nextValue = preValue + curValue;
    preValue = curValue;
    curValue = nextValue;
}

console.log(output);