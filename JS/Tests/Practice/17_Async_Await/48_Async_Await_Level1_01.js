/*
============================================================
48 - Async/Await | Level 1 | Example 01
Topic: Basic Async/Await
============================================================
Expected after 2 seconds:
Data received
============================================================
*/

function getData() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("Data received");
        }, 2000);
    });
}

async function main() {
    // TODO: await getData() and print the result.
}

main();
