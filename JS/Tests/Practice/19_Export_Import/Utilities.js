// use export keyword to export the function and variable from this file.
export let URL = "https://api.example.com";

    // Write your solution below
    export function findLargest(inpArr) {
        let retValue = 0;

        for (let i=0; i<inpArr.length; i++) {
            let eleValue=inpArr[i];

            if (retValue < eleValue) {
                retValue = eleValue;
            }
        }
        return retValue;
    }

    export default function  removeDupInArray(inpArr) {
        let retValue = [];

        for (let i=0; i<inpArr.length; i++) {
            let eleValue=inpArr[i];

            if (!retValue.includes(eleValue)) {
                retValue.push(eleValue);        }
        }
        return retValue;
    }


    //2. Export all functions at the bottom of the file

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

function isPrimeNUmber(num) {
    let isPrime = true;
    let retValue = false;

    if (num <= 1) {
        isPrime = false;
    } else {
        for (let i = 2; i < num; i++) {
            if (num % i === 0) {
                isPrime = false;
                break;
            }
        }
    }

    if (isPrime) {
        retValue= true;
    } else {
        retValue= false;
    }
    return retValue;
}

export { countVowels, isPrimeNUmber };


// 7. Aliasing while exporting
export { countVowels as countVowelsAlias, 
        isPrimeNUmber as isPrimeNumberAlias };
