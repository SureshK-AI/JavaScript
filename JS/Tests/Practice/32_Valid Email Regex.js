/* Write a program to validate an email address using regex pattern matching.

Example 1
Input: test@example.com
Output: Valid
Proper email format with @ and domain
Example 2
Input: pramod@live.com
Output: Valid */

let emails = [
    "test@example.com",
    "pramod@live.com"
];

let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

for (let email of emails) {

    if (emailRegex.test(email)) {
        console.log("Valid");
    } else {
        console.log("Invalid");
    }
}