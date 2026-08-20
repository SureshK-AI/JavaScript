/*
============================================================
59 - Count Vowels in a String
Topic: Strings
============================================================

Practice:
Count the vowels in a given string.

============================================================
*/

// Write your solution below

function countVowels(inpWord) {
    let vowels="aeiou";
    let vCnt=0, cCnt=0;
    let retValue ="";

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
    retValue=(`Vowels: ${vCnt} Consonants: ${cCnt}`);
    return retValue;
}

console.log(countVowels("Bangalore"));
console.log(countVowels("INDIA"));