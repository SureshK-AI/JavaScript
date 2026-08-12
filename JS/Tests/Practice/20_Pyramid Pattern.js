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
let n = 7;

for (let i = 1; i <= n; i++) {
    let fullStr = "";
    // Spaces
    for (let j = 1; j <= n - i; j++) {
        fullStr += " ";
    }
    // Stars
    for (let j = 1; j <= (2 * i - 1); j++) {
        fullStr += "*";
    }
    console.log(fullStr);
}