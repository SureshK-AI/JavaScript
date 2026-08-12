/* Write a program to check if two strings are anagrams of each other.

Example 1
Input: evil live
Output : YES
Both words contain the same letters
Example 2
Input
    silent
    listen
Output
    YES */

/* // 1st way both the string length is same and with sort and join of array functions.
let s1 = "silent";
let s2 = "listen";

let s1Arr = s1.split("").sort().join("");
let s2Arr = s2.split("").sort().join("");

console.log(s1Arr);
console.log(s2Arr);

if (s1Arr.length === s2Arr.length) {
    if (s1Arr === s2Arr)
    {
        console.log("YES");
    }
else{
    console.log("NO");
}
} */

// 2nd way with both the string length is same and each char frequency should be sam in both the strings.
let s1 = "aab";
let s2 = "abb";
let s1Arr = s1.split("");
let s2Arr = s2.split("");
let charCounter = 0;

if (s1Arr.length === s2Arr.length) {

    for (let i = 0; i<s1Arr.length;i++) {
        let index = s2Arr.findIndex(element => element === s1Arr[i]);
        
        if (index>=0) {
            s2Arr.splice(index,1);
            charCounter ++;
        }
        else {
            break;
        }
    }

    if (charCounter === s1Arr.length) {
        console.log("YES");
    }
    else {
        console.log("NO");
    }
}
else {
    console.log("NO");
}



//============================================================
// Approach 3: Frequency Counter
// ------------------------------------------------------------
// Logic:
// 1. Check whether both strings have the same length.
// 2. Count the frequency of each character in the first string.
// 3. Traverse the second string and decrease the corresponding
//    character frequency.
// 4. If a character is missing or its frequency is already zero,
//    the strings are NOT anagrams.
// 5. If all characters match with the same frequency, they are
//    anagrams.
// ============================================================
let s1 = "silent";
let s2 = "listen";

let charCounter = {};
let isAnagram = true;

// Step 1: Length check
if (s1.length !== s2.length) {

    isAnagram = false;

} else {

    // Step 2: Count characters in first string
    for (let char of s1) {

        if (charCounter[char]) {
            charCounter[char]++;
        } else {
            charCounter[char] = 1;
        }
    }

    // Step 3: Check characters against second string
    for (let char of s2) {

        // Character doesn't exist or count is already zero
        if (!charCounter[char]) {
            isAnagram = false;
            break;
        }

        // Consume one occurrence
        charCounter[char]--;
    }
}

// Step 4: Final result
if (isAnagram) {
    console.log("YES");
} else {
    console.log("NO");
}