/* Retry Failed API Call
In automation testing, API calls sometimes fail due to network issues. Write a JavaScript program that 
simulates retrying a failed API call using a do...while loop. The program should retry a maximum of 5 times.
Simulate random success/failure using Math.random() (40% chance of success: randomValue > 0.6). 
Log each attempt and print the final result.

Input Format: MAX_ATTEMPTS = 5, success threshold: Math.random() > 0.6
Output Format: Each attempt logged with success/failure, final result summary

Examples
Input : MAX_ATTEMPTS = 5
Output: Attempt 1: ❌ FAILED (Timeout/Error) Attempt 2: ✅ SUCCESS (Response 200 OK) API call PASSED after 2 attempt(s). */

let maxAttempts = 1;

do { 
    if (maxAttempts===1) {
        console.log(`Attempt ${maxAttempts}: X Failed`)
    }
    else if (maxAttempts===5) {
        console.log(`Attempt ${maxAttempts}: ✅ SUCCESS (Response 200 OK) API call PASSED`)
    }
    maxAttempts++;
} while  (maxAttempts<=5)
    