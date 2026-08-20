/* Given an array of integers and a target sum, return the indices of two numbers that add up to the target.

Example 1
Input 3 2 4
        6
Output: 1 2
nums[1] + nums[2] = 2 + 4 = 6
Example 2
Input 2 7 11 15
        9
Output 2 7 */

//Given an array of integers and a target sum, return the indices of exactly two numbers that add up to the target.
/* function twoSum(inpArray,inpSum) {
    let outResult = "";

    for (let i=0;i<inpArray.length;i++) {
        let sinEeleValue = inpArray[i];

        for (let j=i+1;j<inpArray.length;j++) {
            if (inpSum === (sinEeleValue+inpArray[j])) {
                //outResult = (`${sinEeleValue} ${inpArray[j]}`) //it return the element value as output
                outResult = (`${i} ${j}`) //it return the element value as output
                break;
            }
        }
    }
        return outResult;
}


let inpValue = [3,2,4];
let tarSum = 6;

console.log(twoSum(inpValue, tarSum)); // 2 4
console.log(twoSum(inpValue, 7)); // 3 4 */

//=============================
/* Target Sum – N Elements
Given an array of integers and a target sum, return the indices of N numbers whose total equals the target.
The solution should support 2, 3, 4, or any number of elements. */

function twoSum(inpArray, inpSum) {

    let outResult = [];

        function findCombination(startIndex, currentSum, indices) {

            // Target reached
            if (currentSum === inpSum) {
                outResult = [...indices];
                return true;
            }

            // Try each remaining element
            for (let i = startIndex; i < inpArray.length; i++) {

                // Add current element
                indices.push(i);

                // Continue searching
                if (findCombination(
                    i + 1,
                    currentSum + inpArray[i],
                    indices
                )) {
                    return true;
                }

                // Remove current element and try next one
                indices.pop();
            }

            return false;
        }

    findCombination(0, 0, []);

    return outResult.join(" ");
}

let inpValue = [3, 2, 4];

// console.log(twoSum(inpValue, 6));
// console.log(twoSum(inpValue, 7));
console.log(twoSum(inpValue, 9));