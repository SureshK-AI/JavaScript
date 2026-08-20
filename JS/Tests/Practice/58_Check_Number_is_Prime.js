/*
============================================================
58 - Check Number is Prime
Topic: Numbers
============================================================

Practice:
Check whether a given number is prime or not.

============================================================
*/

// Write your solution below

function isPrimeNUmber(num) {
    let isPrime = true;
    let retValue = false;

    if (num <= 1) {
        isPrime = false;
    } else {
        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
    }

    if (isPrime) {
        retValue= true;
    } else {
        retValue= false;
    }
    return retValue;
}

console.log(isPrimeNUmber(4)); //false
console.log(isPrimeNUmber(3)); //true
