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
login()
.then(function (msg){
    console.log(msg);
    return getUser();
}).then(function(msg){
    console.log(msg);
    return getOrders();
}).then(function(msg) {
    console.log(msg);
    return generateReport()
}).then(function(msg) {
    console.log(msg);
})
