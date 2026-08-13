/* Build a singly linked list from the values given, then reverse it by rewiring the next pointers. Do not just print the values backwards: walk the list once, pointing each node at the one before it. Print the values of the reversed list.

Example 1
Input: 1 2 3 4 5
Output: 5 4 3 2 1
The tail becomes the head, and every next pointer now points at the previous node.
Example 2
Input: -1 0 1
Output:1 0 -1 */

let head = { value: 1, next: { value: 2, next: { value: 3, next: { value: 4, next: { value: 5, next: null} } }}};
let tail = { value: 5, next: null };
let prev = null;
let current = head;

while (current !== null) {

    let next = current.next;

    current.next = prev;

    prev = current;
    current = next;
}

head = prev;

let result = [];
current = head;

while (current !== null) {
    result.push(current.value);
    current = current.next;
}

console.log(result.join(" "));