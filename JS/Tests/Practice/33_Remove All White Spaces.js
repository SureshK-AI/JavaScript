/* Write a program to remove all white spaces from a given string.

Example 1
Input: Hello World Java
Output: HelloWorldJava
All whitespace characters removed
Example 2
Input: Geeks for Geeks 
Output: GeeksforGeeks */

let inpWord = "Hello World Java";
let wordArr = inpWord.split(" ");
let wordWithoutSapces="";

for (let eachword of wordArr) {
    wordWithoutSapces = wordWithoutSapces + eachword;
}

console.log(wordWithoutSapces);

/* // 2nd way - compare the " "
let inpWord = "Hello World Java";
let wordWithoutSapces="";

for (let eachltr of inpWord) {
    if (eachltr !== " "){
        wordWithoutSapces += eachltr;
}
}
console.log(wordWithoutSapces); */

//3rd way - Best/simple approach — replace()

let inpWord = "Hello World Java";
let result = inpWord.replaceAll(" ", "");

console.log(result);

/* // 4th way - Regex approach — replace() But \s covers whitespace such as: space, tab, newline, carriage return

let inpWord = "Hello World Java";
let inpWord = "Hello \t World\nJava";
let result = inpWord.replace(/\s/g, "");
console.log(result);

//Note: \s - whitespace character and 'g' - stands for global — find all occurrences, not just the first one. */

/* // 5th way - Another way — split() + join()
let inpWord = "Hello World Java";
let result = inpWord.split(" ").join("");
console.log(result); */