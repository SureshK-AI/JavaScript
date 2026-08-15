/*
============================================================
48 - Async/Await | Level 2 | Example 01
Topic: Sequential API Simulation
============================================================
Flow:
Login
  -> User
      -> Orders
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

async function main() {
    // TODO: Execute all three sequentially using await.
}

main();
