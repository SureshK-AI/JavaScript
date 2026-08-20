/*
============================================================
57 - Print Fibonacci Series
Topic: Loops
============================================================

Practice:
Print the Fibonacci series up to N terms.

============================================================
*/

// Write your solution below
let preValue=0;
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
  console.log(outPut);

