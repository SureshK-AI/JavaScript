/*
============================================================
48 - Async/Await | Level 2 | Example 02
Topic: Error Handling
============================================================
Expected:
Payment failed
============================================================
*/

function getPaymentStatus() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject("Payment failed");
        }, 500);
    });
}

async function main() {
    // TODO: Use try/catch with await.
}

main();
