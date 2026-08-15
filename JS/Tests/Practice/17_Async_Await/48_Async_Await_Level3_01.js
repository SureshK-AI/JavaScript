/*
============================================================
48 - Async/Await | Level 3 | Example 01
Topic: Login Workflow - Automation Style
============================================================
Flow:
Open Browser
  -> Open Website
      -> Enter Username
          -> Enter Password
              -> Click Login
                  -> Verify Dashboard
                      -> Logout

Practice:
Implement each step as an async function and execute
them sequentially using await.
============================================================
*/

async function openBrowser() {
    console.log("Browser opened");
}

async function openWebsite() {
    console.log("Website opened");
}

async function enterUsername() {
    console.log("Username entered");
}

async function enterPassword() {
    console.log("Password entered");
}

async function clickLogin() {
    console.log("Login clicked");
}

async function verifyDashboard() {
    console.log("Dashboard verified");
}

async function logout() {
    console.log("Logged out");
}

async function main() {
    // TODO: Call each function in sequence using await.
}

main();
