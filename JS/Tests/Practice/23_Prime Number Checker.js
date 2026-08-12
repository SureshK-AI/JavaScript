/* Write a program to check if a given number is prime. A prime number is only divisible by 1 and itself.
Example 1
Input : 2
Output : YES
2 is the smallest prime number
Example 2
Input: 17
Output: YES */

let num = 21;
let isPrime = true;

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
    console.log("Prime");
} else {
    console.log("Not Prime");
}