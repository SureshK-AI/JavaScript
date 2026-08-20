//Check whether a number is Even or Odd.

function isNumberOddEven(intNumber) {
    let retBoolean = false;

    if (intNumber % 2 === 0) {
        retBoolean = true;
    }else {
        retBoolean=false;
    }
    return retBoolean;
}

console.log(isNumberOddEven(2)); //true
console.log(isNumberOddEven(3)); //false