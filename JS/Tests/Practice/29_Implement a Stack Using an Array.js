/* Build a stack yourself on top of a plain array or list, then run a stream of commands against it. PUSH adds a value and prints nothing. POP removes the top value and prints it. PEEK prints the top value without removing it. SIZE prints how many values the stack holds. POP or PEEK on an empty stack prints EMPTY and changes nothing.

Example 1
Input
        PUSH 10
        PUSH 20
        PEEK
        POP
        SIZE
Output
        20
        20
        1
        PEEK reports the top without removing it, POP then removes the same value, leaving one item.
Example 2
Input : POP
Output : EMPTY */


let commands = [
  [ 'PUSH', '10' ],
  [ 'PUSH', '20' ],
  [ 'PEEK' ],
  [ 'POP' ],
  [ 'SIZE' ]
];

let stack = [];

for (let line of commands) {

    //line = line.trim();

    if (line === "") {
        continue;
    }

    const command = line[0];

    // PUSH
    if (command === "PUSH") {

        const value = Number(line[1]);

        stack.push(value);
    }

    // POP
    else if (command === "POP") {

        if (stack.length === 0) {
            console.log("EMPTY");
        } 
        else {
            const value = stack.pop();

            console.log(value);
        }
    }

    // PEEK
    else if (command === "PEEK") {

        if (stack.length === 0) {
            console.log("EMPTY");
        } 
        else {
            const topValue = stack[stack.length - 1];

            console.log(topValue);
        }
    }

    // SIZE
    else if (command === "SIZE") {

        console.log(stack.length);
    }
}