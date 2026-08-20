/*
============================================================
46 - Callback | Level 3 | Example 02
Topic: Callback Hell
============================================================
Scenario:
Login
  -> Get User
      -> Get Orders
          -> Get Payment
              -> Generate Report

Practice:
Implement this flow using callbacks and observe callback nesting.
============================================================
*/

function login(callback) {
    setTimeout(() => {
        console.log("Login successful");
        callback();
    }, 500);
}

function getUser(callback) {
    setTimeout(() => {
        console.log("User received");
        callback();
    }, 500);
}

function getOrders(callback) {
    setTimeout(() => {
        console.log("Orders received");
        callback();
    }, 500);
}

function getPayment(callback) {
    setTimeout(() => {
        console.log("Payment received");
        callback();
    }, 500);
}

function generateReport(callback) {
    setTimeout(() => {
        console.log("Report generated");
        callback();
    }, 500);
}

// TODO: Create the nested callback chain.
login(function () {
    getUser(function () {
        getOrders(function () {
            getPayment(function () {
                generateReport(function () {
                    console.log("Process completed");
                });
            });
        });
    });
});



/* As the number of asynchronous operations increases, callbacks keep getting nested inside callbacks.

For example:

login
 └── getUser
      └── getOrders
           └── getPayment
                └── generateReport
                     └── completed

This is called Callback Hell or sometimes the Pyramid of Doom. */