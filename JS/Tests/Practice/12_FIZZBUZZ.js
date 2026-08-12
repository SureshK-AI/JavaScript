// FizzBuzz: Print numbers from 1 to n. For multiples of 3, print 'Fizz'. For multiples of 5, print 'Buzz'. For multiples of both 3 and 5, print 'FizzBuzz'.

//const data = require('fs').readFileSync(0, 'utf8');
//Write your solution here
    let data=15;
    let finalOutput;

    for (i = 1; i <= data; i++){
        finalOutput = i;

        if (i % 3 === 0  && i % 5 === 0){
            finalOutput="FizzBuzz";
        }
        else if (i % 3 === 0){
            finalOutput="Fizz";
        }
        else if (i % 5 === 0) {
            finalOutput="Buzz";
        }
    console.log(finalOutput);
    }