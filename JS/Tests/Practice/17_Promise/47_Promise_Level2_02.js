/*
============================================================
47 - Promise | Level 2 | Example 02
Topic: Promise Chain
============================================================
Flow:
login()
  -> getUser()
      -> getOrders()
          -> generateReport()
============================================================
*/

function login() {
    return Promise.resolve("Login successful");
}

function getUser() {
    return Promise.resolve("User received");
}

function getOrders() {
    return Promise.resolve("Orders received");
}

function generateReport() {
    return Promise.resolve("Report generated");
}

// TODO: Build the complete .then() chain and .catch().
