/*
============================================================
47 - Promise | Level 1 | Example 02
Topic: Resolve / Reject
============================================================
Rule:
age >= 18 -> Eligible
age < 18  -> Not Eligible
============================================================
*/

function checkAge(age) {
    // TODO: Return a Promise.
    return new Promise((resolve, reject) => {

        if (age >= 18) {
            resolve("Eligible");
        } else {
            reject("Not Eligible");
        }

    });
}

checkAge(20)
    .then(result =>
        console.log(result))
    .catch(error => 
        console.log(error));

checkAge(15)
    .then(result =>
        console.log(result))
    .catch(error => 
        console.log(error));