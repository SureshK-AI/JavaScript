/* Print a pyramid pattern using stars. For input n, print n rows where row i has (n-i) leading spaces and (2*i-1) stars.
Centered pyramid pattern
Example 1
Input: 3
Output:   *
         ***
        *****

Example 2
Input : 4
Output : *
        ***
       *****
      ******* */



// for (let i=1;i<=inpNum;i++){
//     let fullStr="";
//     for (let j=1; j<=i;j++){
//         fullStr =  fullStr +"*";
//     }
//     console.log(fullStr);
// }

let inpNum=3;
let i =1;
while (i<=inpNum) {

        if (i%2) {
        let fullStr="";
        for (let j=1; j<=i;j++){
                fullStr =  fullStr +"*";
        }
        i = i + 1
        console.log(fullStr);
        }
   
}
