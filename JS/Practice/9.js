/* Login Brute-Force Detection
Write a JavaScript program that simulates a login system with brute-force detection. The system should lock the account after 3 consecutive failed attempts. Use a do...while loop to process login attempts from an array. Demonstrate var (global counter), let (loop variables), and const (credentials and threshold). Validate using strict equality (===) and logical operators (&&).

Input Format
An array of login attempt objects with username and password, plus valid credentials

Output Format
Each attempt result logged, plus summary with lock status and login result

Examples
Input
Valid: admin@testingacademy.com / Test@1234 Attempts: [wrong, wrong, wrong, correct]
Output
Attempt 1: ❌ FAILED - Strike 1/3 Attempt 2: ❌ FAILED - Strike 2/3 Attempt 3: ❌ FAILED - Strike 3/3 🚨 ACCOUNT LOCKED Attempt 4: 🔒 ACCOUNT LOCKED - Rejected

 */