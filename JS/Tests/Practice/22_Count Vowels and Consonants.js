/* Write a program to count the number of vowels and consonants in a given string.

Example 1
Input: Programming
Output : 
    Vowels: 3
    Consonants: 8
Vowels: o,a,i and Consonants: P,r,g,r,m,m,n,g
Example 2
Input: Hello World
Output
    Vowels: 3
    Consonants: 7 */
/* let inpWord = "Hello World";
let vowels="aeiou";
let vCnt=0, cCnt=0;
//let inpLength = inpWord.length;

for (let i=0;i<inpWord.length;i++) {
    let letter = inpWord.substring(i,i+1);

    if (letter !==" ")
    {
        let findVowel = vowels.search(letter);

        if (findVowel>=0){ 
            vCnt = vCnt+1;
        }
        else{
            cCnt = cCnt+1;
        }
    }
}
console.log(`Vowels: ${vCnt}`);
console.log(`Consonants: ${cCnt}`); */


// using array and includes function of string.
let inpWord = "Hello World";
let vowels="aeiou";
let vCnt=0, cCnt=0;
//let inpLength = inpWord.length;

for (let i=0;i<inpWord.length;i++) {
    let letter = inpWord[i].toLowerCase();

    if (letter !==" ")
    {
        if (vowels.includes(letter)){ 
            vCnt = vCnt+1;
        }
        else{
            cCnt = cCnt+1;
        }
    }
}
console.log(`Vowels: ${vCnt}`);
console.log(`Consonants: ${cCnt}`);

// // // Print the vowels and consonants
// let str = "JavaScript";
// let vowels = "aeiou";

// for (let i = 0; i < str.length; i++) {

//     let ch = str[i].toLowerCase();

//     if (vowels.includes(ch)) {
//         console.log(ch + " is Vowel");
//     } else {
//         console.log(ch + " is Consonant");
//     }
// }