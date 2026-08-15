/*
============================================================
48 - Async/Await | Level 3 | Example 02
Topic: Parallel Execution with Promise.all()
============================================================
Independent operations:
- Get User Details
- Get Notifications
- Get Orders

Practice:
Compare sequential await with Promise.all().
============================================================
*/

function getUserDetails() {
    return new Promise(resolve => {
        setTimeout(() => resolve("User details"), 1000);
    });
}

function getNotifications() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Notifications"), 1000);
    });
}

function getOrders() {
    return new Promise(resolve => {
        setTimeout(() => resolve("Orders"), 1000);
    });
}

async function sequential() {
    // TODO: Execute one after another and observe total time.
}

async function parallel() {
    // TODO: Execute all three using Promise.all().
}

async function main() {
    console.log("Sequential:");
    await sequential();

    console.log("Parallel:");
    await parallel();
}

main();
