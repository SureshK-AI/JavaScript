/* Print a right triangle pattern using stars. For input n, print n rows where row i has i stars.

Example 1
Input : 3
Output : ***
         **
         *
         
Row 1 has 1 star, row 2 has 2 stars, row 3 has 3 stars
Example 2
Input: 4
Output  ****
        ***
        **
        *
         */

let inpNum=8;

for (let i=inpNum;i>=1;i--){
    let fullStr="";
    for (let j=1; j<=i;j++){
        fullStr =  fullStr +"*";
    }
    console.log(fullStr);
}