/*
============================================================
47 - Promise | Level 1 | Example 03
Topic: Promise with then() and catch()
============================================================
Practice:
Create getUser() that resolves with a username.
============================================================
*/

function getUser() {
    return new Promise((resolve, reject) => {
        // TODO: Resolve with "Suresh".
    });
}

getUser()
    .then(user => console.log("User:", user))
    .catch(error => console.log("Error:", error));
