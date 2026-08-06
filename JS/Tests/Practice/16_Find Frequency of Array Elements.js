/* Find Frequency of Array Elements.Find and print the frequency of each element in an array.

Example 1
Input 4 5 5 3 3
Output : 5 appears 2 times
3 appears 2 times
Each unique element and its count
Example 2
Input 5 1 2 1 3 2
Output : 1 appears 2 times
2 appears 2 times
3 appears 1 times */

// this code without any existing array functions.
/* let arr = [5, 1, 2, 1, 3, 2, 5, 5];

for (let i = 0; i < arr.length; i++) {

    // Skip if this element has already been counted
    let alreadyCounted = false;

    for (let j = 0; j < i; j++) {
        if (arr[i] === arr[j]) {
            alreadyCounted = true;
            break;
        }
    }

    if (alreadyCounted) {
        continue;
    }

    // Count occurrences
    let count = 0;

    for (let j = 0; j < arr.length; j++) {
        if (arr[i] === arr[j]) {
            count++;
        }
    }

    console.log(arr[i] + " appears " + count + " time(s)");
} */

// this code with existing array function array.forEach method with object

/* let arr = [5, 1, 2, 1, 3, 2, 5, 5];

let frequency = {}; //its an object

arr.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
});

console.log(frequency);

for (let key in frequency) {
    console.log(`${key} -> ${frequency[key]}`);
} */

// this code with existing array function array.forEach method with Filter method

let arr = [5, 1, 2, 1, 3, 2, 5, 5];

let unique = [...new Set(arr)];

unique.forEach(value => {
    let count = arr.filter(item => item === value).length;
    console.log(`${value} -> ${count}`);
});