/* Read a postfix expression and print its value. In postfix the operator comes after its two operands, so 2 3 + means 2 plus 3. Push each number on a stack, and when an operator arrives pop two values, apply it and push the result back. Division is integer division that truncates toward zero.

Example 1
Input
2 3 + 4 *
Output
20
2 3 + gives 5, then 5 4 * gives 20.
Example 2
Input
5 1 2 + 4 * + 3 -
Output
14 */

let inpValue = "2 3 + 4 *";

let tokens = inpValue.split(" ");
let stack = [];

for (let token of tokens) {

    if (!isNaN(token)) {

        // Number → Push
        stack.push(Number(token));

    } else {

        // Operator → Pop two values
        let right = stack.pop();
        let left = stack.pop();

        let result;

        switch (token) {

            case "+":
                result = left + right;
                break;

            case "-":
                result = left - right;
                break;

            case "*":
                result = left * right;
                break;

            case "/":
                result = Math.trunc(left / right);
                break;
        }

        // Push calculated result
        stack.push(result);
    }
}

console.log(stack.pop());