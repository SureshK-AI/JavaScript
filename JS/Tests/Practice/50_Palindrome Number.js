/* Palindrome Number
Determine whether an integer is a palindrome without converting it to a string.

Example 1
Input: 12321
Output: true
Reads the same forwards and backwards
Example 2
Input: 121
Output: true */

/* Interview explanation
You can explain it like this:

First, I check whether the number is negative. If it is negative, I immediately return false because the negative 
sign cannot appear on both sides. For a positive number, I reverse the number mathematically using % 10 to extract 
the last digit and Math.floor(num / 10) to remove the last digit. Finally, I compare the reversed number with the 
original number. */

let inpNumber = 12321;

function isPalindrome(num) {

    // Negative numbers are not palindromes
    if (num < 0) {
        return false;
    }

    let original = num;
    let reversed = 0;

    while (num > 0) {
        let digit = num % 10;
        reversed = reversed * 10 + digit;
        num = Math.floor(num / 10);
    }

    return original === reversed;
}

console.log(isPalindrome(121));   // true
console.log(isPalindrome(-121));  // false
console.log(isPalindrome(12321)); // true
console.log(isPalindrome(123));   // false