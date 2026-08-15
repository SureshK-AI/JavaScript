/*
============================================================
46 - Callback | Level 1 | Example 01
Topic: Simple Callback
============================================================
Practice:
Create greet(name, callback) and execute the callback.
Expected:
Hello Suresh
Welcome to JavaScript
============================================================
*/

function greet(name, callback) {
    console.log("Hello " + name);
    callback();
}

// TODO: Call greet() with a callback.
greet("Suresh",function() {
    console.log("Welcome to JavaScript");
});

//Same example using an arrow function
greet("Suresh", () => {
    console.log("Welcome to JavaScript");
});

//==== real time CALLBACK scenaris 

/* Real-time QA example: Test execution + callback

Imagine you have a function that executes a test case. After the test finishes, you want to perform another action:

Log the result
Take a screenshot if failed
Update the report
Send notification

The function that executes the test doesn't need to know what you want to do after execution. You pass that behavior as a callback parameter.
 */
    function executeTestCase(testCaseName, callback) {

        console.log("Executing: " + testCaseName);

        // Simulating test execution
        let status = "PASS";

        console.log("Test Status: " + status);

        // Execute whatever action was passed
        callback(status);
    }


    // Callback function
    function generateReport(status) {
        console.log("Generating test report...");
        console.log("Final Status: " + status);
    }


// Why is this useful in QA? Suppose you have 100 test cases. You may want different actions after execution:
// Scenario 1 — Generate report
function generateReport(status) {
    console.log("Generating report: " + status);
}


executeTestCase("TC_Login_001", generateReport);

//Scenario 2 — Take screenshot
function takeScreenshot(status) {
    if (status === "FAIL") {
        console.log("Taking screenshot...");
    }
}

executeTestCase("TC_Login_002", takeScreenshot);

//Scenario 3 — Send notification
function sendNotification(status) {
    console.log("Sending notification: " + status);
}

executeTestCase("TC_Login_003", sendNotification);

//The important point: executeTestCase() doesn't change. 
//Only the callback changes.

//                  executeTestCase()
//                         |
//             +-----------+-----------+
//             |           |           |
//         Report      Screenshot   Notification
//         callback     callback       callback

// That's one of the major reasons callbacks are useful in automation frameworks.

///**************** MULTIPLE CALL BACKS
/* For a QA automation scenario, suppose after a test we want to:
Log the result
Generate a report
Take a screenshot

We can do this: */

function runTest(testName, logCallback, reportCallback, screenshotCallback) {
    console.log("Running: " + testName);
    let result = "FAIL";

    // Callback 1
    logCallback(result);

    // Callback 2
    reportCallback(result);

    // Callback 3
    screenshotCallback(result);
}

runTest(
    "Login Test",

    // Callback 1 - Logging
    (result) => {
        console.log("Logging result: " + result);
    },

    // Callback 2 - Report
    (result) => {
        console.log("Generating report: " + result);
    },

    // Callback 3 - Screenshot
    (result) => {

        if (result === "FAIL") {
            console.log("Taking screenshot...");
        }
    }
);
// Output
// Running: Login Test
// Logging result: FAIL
// Generating report: FAIL
// Taking screenshot...

// So yes:

// // runTest(
// //     "Login Test",
// //     callback1,
// //     callback2,
// //     callback3
// // );

// is perfectly valid JavaScript.




//99999999999999999 IMPORTANT 99999999999999999999999

// One more important point for your QA learning
// Callbacks don't have to execute immediately one after another.
// They are particularly powerful when something is asynchronous:

// loginUser("Suresh", () => {
//     searchProduct(() => {
//         validateResult(() => {
//             console.log("Test completed");
//         });
//     });
// });

/* This is where you will start seeing the famous callback hell problem.

And that leads naturally to:

                    Callback
                    ↓
                    Callback with parameters
                    ↓
                    Multiple callbacks
                    ↓
                    Callback Hell
                    ↓
                    Promises
                    ↓
                    async / await

For your JavaScript QA practice, this is exactly the progression I'd recommend. */