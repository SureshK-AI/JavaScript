/* Build a FIRST IN FIRST OUT QUEUE using only two stacks. Push arriving values on to an inbox stack, 
and when a value is needed move everything across to an outbox stack, which reverses the order. 
ENQUEUE adds a value and prints nothing. DEQUEUE removes the oldest value and prints it. 
PEEK prints the oldest value without removing it. SIZE prints how many values are held. 
DEQUEUE or PEEK on an empty queue prints EMPTY.

Example 1
Input:  ENQUEUE 1
        ENQUEUE 2
        PEEK
        DEQUEUE
        SIZE
Output: 1
        1
        1
The queue returns 1 first because it arrived first, which is what makes it a queue and not a stack.
Example 2
Input: DEQUEUE
Output: EMPTY */

let commands = [
    ['ENQUEUE', '1'],
    ['ENQUEUE', '2'],
    ['PEEK'],
    ['DEQUEUE'],
    ['SIZE']
];

let inbox = [];
let outbox = [];

for (let line of commands) {

    const command = line[0];

    // ENQUEUE
    if (command === "ENQUEUE") {

        const value = Number(line[1]);

        inbox.push(value);
    }

    // DEQUEUE
    else if (command === "DEQUEUE") {

        // If outbox is empty, transfer everything from inbox
        if (outbox.length === 0) {

            while (inbox.length > 0) {
                outbox.push(inbox.pop());
            }
        }

        if (outbox.length === 0) {
            console.log("EMPTY");
        } 
        else {
            console.log(outbox.pop());
        }
    }

    // PEEK
    else if (command === "PEEK") {

        // If outbox is empty, transfer everything from inbox
        if (outbox.length === 0) {

            while (inbox.length > 0) {
                outbox.push(inbox.pop());
            }
        }

        if (outbox.length === 0) {
            console.log("EMPTY");
        } 
        else {
            console.log(outbox[outbox.length - 1]);
        }
    }

    // SIZE
    else if (command === "SIZE") {

        console.log(inbox.length + outbox.length);
    }
}