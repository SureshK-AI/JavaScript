/* Test Case Result Counter
After a test suite runs, you receive an array of test results (strings: "pass", "fail", "skip"). Write a JavaScript program using a for loop that counts how many tests passed, failed, and were skipped. Print a test report with total tests, counts, pass rate percentage, and a verdict (all passed → ready for release, ≤2 failures → review, >2 failures → block release).


Input Format
An array of strings containing "pass", "fail", or "skip"

Output Format
A test report with counts, pass rate, and verdict

Examples
Input
testResults = ["pass", "pass", "fail", "pass", "skip", "pass", "fail", "pass"]
Output
Total Tests : 8 Passed: 5 Failed: 2 Skipped: 1 Pass Rate: 62.50% VERDICT: Minor failures. Review before release.
 */