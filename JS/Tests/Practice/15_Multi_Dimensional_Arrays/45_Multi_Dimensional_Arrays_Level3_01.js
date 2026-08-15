/*
============================================================
45 - Multi-Dimensional Arrays | Level 3 | Example 01
Topic: Test Case Matrix - QA Automation
============================================================
Tasks:
- Count passed test cases
- Count failed test cases
- Print failed test case IDs
- Calculate pass percentage
Expected:
Passed: 3
Failed: 1
Pass Percentage: 75%
Failed TC: TC002
============================================================
*/

const testCases = [
    ["TC001", "Login", "Pass"],
    ["TC002", "Search", "Fail"],
    ["TC003", "Checkout", "Pass"],
    ["TC004", "Logout", "Pass"]
];

// TODO: Solve using loops.
let finRes="";
let passCnt=0,failCnt=0;failTCName="", percentage=0;
let totNoOfTCs = testCases.length;

for (i=0; i<testCases.length;i++) {
    let row = testCases[i]
    let status = row[2];

    switch (status){
    case "Pass":
        passCnt += 1;
        break;
    case "Fail":
        failCnt += 1;
        failTCName += row[0] + " ";
        break;
    default:

    }

}
// console.log(` Passed: ${passCnt} \n Failed: ${failCnt} \n Pass Percentage: ${(passCnt/totNoOfTCs)*100} % \n Failed TC: ${failTCName}`);

console.log(
    `Passed: ${passCnt} 
Failed: ${failCnt} 
Pass Percentage: ${(passCnt / totNoOfTCs) * 100}
Failed TC: ${failTCName}`
);