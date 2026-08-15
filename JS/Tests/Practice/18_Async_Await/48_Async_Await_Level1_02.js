/*
============================================================
48 - Async/Await | Level 1 | Example 02
Topic: Async Login with try/catch
============================================================
Practice:
Create an async login function and handle success/failure.
============================================================
*/

function login(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (username === "admin" && password === "1234") {
                resolve("Login successful");
            } else {
                reject("Invalid username/password");
            }
        }, 500);
    });
}

async function main() {
    // TODO: Call login() with await.
    // TODO: Use try/catch.
}

main();
