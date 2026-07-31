/* Test Case Result Counter
After a test suite runs, you receive an array of test results (strings: "pass", "fail", "skip"). 
Write a JavaScript program using a for loop that counts how many tests passed, failed, and were skipped. 
Print a test report with total tests, counts, pass rate percentage, and a verdict 
(all passed → ready for release, ≤2 failures → review, >2 failures → block release).

Input Format: An array of strings containing "pass", "fail", or "skip"
Output Format : A test report with counts, pass rate, and verdict

Examples
Input : testResults = ["pass", "pass", "fail", "pass", "skip", "pass", "fail", "pass"]
Output: Total Tests : 8 Passed: 5 Failed: 2 Skipped: 1 Pass Rate: 62.50% VERDICT: Minor failures. Review before release. */
// ===============================================

let testResults = ["pass", "pass", "fail", "pass", "skip", "pass", "fail", "pass"];
let arrEleCount = testResults.length;
let arrPassEleCount = testResults.filter(pRes => pRes === "pass").length;
let arrFailEleCount = testResults.filter(fRes => fRes === "fail").length;
let arrSkipEleCount = testResults.filter(sRes => sRes==="skip").length;

/* // Using for loop we can get the counts
for (let i = 0; i < arrEleCount; i++) {
    if (testResults[i] === "pass") arrPassEleCount++;
    else if (testResults[i] === "fail") arrFailEleCount++;
    else if (testResults[i] === "skip") arrSkipEleCount++;
} */
console.log(`Total Tests : ${arrEleCount} Passed: ${arrPassEleCount} Failed: ${arrFailEleCount} Skipped: ${arrSkipEleCount} Pass Rate: ${((arrPassEleCount/arrEleCount)*100).toFixed(2)}%`);

//all passed → ready for release, ≤2 failures → review, >2 failures → block release - this condition is written in 'nested ternary operator' model
// the same code can be written in IF condition as well 
let verdict = arrEleCount===arrPassEleCount 
             ? "100% scripts are passed and it ready for release"
             : arrFailEleCount<=2 
             ? `${arrFailEleCount} scripts are failed.Review before release`
             :`${arrFailEleCount}  scripts are failed. Block the release`

             console.log(verdict)
/* //Same verdict statement using IF Statement.
if (arrEleCount===arrPassEleCount) {
    console.log("100% scripts are passed and it ready for release");
}
else if (arrFailEleCount<=2) {
    console.log(`${arrFailEleCount} scripts are failed. Review before release`);
}
else if (arrFailEleCount>2) {
    console.log(`${arrFailEleCount} scripts are failed. Block the release`);
 }*/