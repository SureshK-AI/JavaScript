/*
============================================================
47 - Promise | Level 2 | Example 01
Topic: Login Promise
============================================================
Correct credentials:
username = admin
password = 1234
============================================================
*/

function login(username, password) {
    // TODO: Return Promise.
    return new Promise((resolve, reject) => {
    if (username === "admin" && password==="1234"){
        resolve("Correct credentials");
    }
    else {
        reject("Wrong Credentials");
    }
})
}

login("admin", "1234")
    .then(result => console.log(result))
    .catch(error => console.log(error));

login("admin", "wrong")
    .then(result => console.log(result))
    .catch(error => console.log(error));
