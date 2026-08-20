/* Find and print all duplicate elements in an array.

Example 1
Input: 1 2 3 4 5
Output
No duplicates found
All elements are unique
Example 2
Input 6 1 2 3 2 4 1
Output  2
        1 */


const arr = [1, 2, 3, 2, 4, 1, 3, 4, 2];

/* let arr1 = arr;
let out = "";

for (let i = 0; i < arr1.length; i++) {

    let eleVal = arr1[i];
    let counter = 1;
    let alreadyChecked = false;

    // Check if this element appeared before
    for (let k = 0; k < i; k++) {
        if (eleVal === arr1[k]) {
            alreadyChecked = true;
            break;
        }
    }

    // Count occurrences after current position
    for (let j = i + 1; j < arr1.length; j++) {
        if (eleVal === arr1[j]) {
            counter += 1;
        }
    }

    // Add only the FIRST occurrence of a duplicate
    if (counter > 1 && !alreadyChecked) {
        out = (`${eleVal}` + " ") + out;
    }
}

if (out === "") {
    console.log("No duplicates found");
} else {
    console.log(out.trim());
}
 */
    //or 

// Write your solution here

let countMap = new Map();
let duplicates = [];

// Count each element
for (let i = 0; i < arr.length; i++) {

    let value = arr[i];

    if (countMap.has(value)) {
        countMap.set(value, countMap.get(value) + 1);
    } else {
        countMap.set(value, 1);
    }
}

// Find duplicate elements
for (let i = 0; i < arr.length; i++) {

    let value = arr[i];

    if (countMap.get(value) > 1 && !duplicates.includes(value)) {
        duplicates.unshift(value);
    }
}

// Print result
if (duplicates.length === 0) {
    console.log("No duplicates found");
} else {
    console.log(duplicates.join(" "));
}