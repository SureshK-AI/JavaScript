# Array, Stack, and Queue --- A Clear Beginner's Guide

## 1. Purpose of This Guide

This document explains three concepts that are often confused when
learning data structures:

1.  **Array**
2.  **Stack**
3.  **Queue**

The most important idea to remember is:

> **An Array is a way to store data. A Stack and a Queue are ways to
> organize and access that data.**

A JavaScript `Array` can be used to implement a Stack or a Queue.

------------------------------------------------------------------------

# 2. The Big Picture

Before looking at code, understand this relationship:

``` text
                    DATA STRUCTURES
                          |
             +------------+------------+
             |                         |
          ARRAY                    Other structures
             |
       Can be used to
       implement
       +-----------+
       |           |
      STACK       QUEUE
       |           |
      LIFO        FIFO
```

### Remember

``` text
Array  = Storage / collection of values

Stack  = Last In, First Out (LIFO)

Queue  = First In, First Out (FIFO)
```

They are related, but they are **not the same thing**.

------------------------------------------------------------------------

# 3. What Is an Array?

An **Array** is a collection of values stored in an ordered manner.

In JavaScript:

``` javascript
let arr = [10, 20, 30, 40];
```

We can visualize it as:

``` text
Index:     0      1      2      3
          +------+------+------+------+
Array:    |  10  |  20  |  30  |  40  |
          +------+------+------+------+
```

Each value has an index.

``` javascript
arr[0]  // 10
arr[1]  // 20
arr[2]  // 30
arr[3]  // 40
```

So an array answers:

> "Where can I store multiple values?"

------------------------------------------------------------------------

# 4. Is an Array the Same as a Stack?

## No.

This is one of the most important concepts.

``` text
ARRAY
  |
  |-- stores values
  |
  |-- can be accessed in different ways
```

A **Stack** is a rule about how values are inserted and removed.

A JavaScript Array can be used to implement that rule.

For example:

``` javascript
let stack = [];

stack.push(10);
stack.push(20);
stack.push(30);
```

Technically, `stack` is a JavaScript Array.

But because we are using:

``` javascript
push()
pop()
```

according to LIFO rules, we are using the array **as a Stack**.

------------------------------------------------------------------------

# 5. What Is a Stack?

A **Stack** follows:

> **LIFO --- Last In, First Out**

The last item added is the first item removed.

## Real-Life Example: Stack of Plates

Imagine plates placed one on top of another.

``` text
        +---------+
        | Plate 3 |  <- Last plate added
        +---------+
        | Plate 2 |
        +---------+
        | Plate 1 |  <- First plate added
        +---------+
```

You normally remove the top plate first.

Therefore:

``` text
Added:       1 -> 2 -> 3

Removed:     3 -> 2 -> 1
```

That is LIFO.

------------------------------------------------------------------------

# 6. Stack Terminology

A stack commonly has two basic operations:

## PUSH

Add a value to the top.

``` javascript
stack.push(10);
```

## POP

Remove the value from the top.

``` javascript
stack.pop();
```

The top of the stack is the place where insertion and removal happen.

------------------------------------------------------------------------

# 7. Stack Example in JavaScript

``` javascript
let stack = [];

stack.push(10);
stack.push(20);
stack.push(30);
```

The stack looks like:

``` text
        TOP
         |
         v
      +------+
      |  30  |
      +------+
      |  20  |
      +------+
      |  10  |
      +------+
```

Now:

``` javascript
let value = stack.pop();

console.log(value);
```

Output:

``` text
30
```

The stack becomes:

``` text
        TOP
         |
         v
      +------+
      |  20  |
      +------+
      |  10  |
      +------+
```

------------------------------------------------------------------------

# 8. Stack Operations

  Operation   Meaning                        JavaScript Array
  ----------- ------------------------------ ---------------------------
  PUSH        Add to top                     `push()`
  POP         Remove from top                `pop()`
  PEEK        Look at top without removing   `stack[stack.length - 1]`
  SIZE        Number of values               `stack.length`

Example:

``` javascript
let stack = [];

stack.push(10);
stack.push(20);
stack.push(30);

console.log(stack[stack.length - 1]); // 30
console.log(stack.length);             // 3
console.log(stack.pop());              // 30
```

After `pop()`:

``` text
Stack = [10, 20]
```

------------------------------------------------------------------------

# 9. What Is a Queue?

A **Queue** follows:

> **FIFO --- First In, First Out**

The first item added is the first item removed.

## Real-Life Example: People Waiting in Line

Imagine people waiting at a ticket counter:

``` text
FRONT                                      BACK
  |                                          |
  v                                          v

+---------+    +---------+    +---------+
| Person1 | -> | Person2 | -> | Person3 |
+---------+    +---------+    +---------+
```

Person1 arrived first.

Therefore Person1 gets served first.

``` text
Added:       1 -> 2 -> 3

Removed:     1 -> 2 -> 3
```

That is FIFO.

------------------------------------------------------------------------

# 10. Queue Terminology

A queue has two important ends:

``` text
FRONT                         BACK
  |                             |
  v                             v

  10  ->  20  ->  30  ->  40
```

### ENQUEUE

Add a value at the back.

``` text
ENQUEUE 50

10 -> 20 -> 30 -> 40 -> 50
```

### DEQUEUE

Remove the value from the front.

``` text
DEQUEUE

10 -> 20 -> 30 -> 40
^^
removed
```

### PEEK

Look at the front value without removing it.

### SIZE

Number of values currently in the queue.

------------------------------------------------------------------------

# 11. Queue Example in JavaScript

A simple queue can be implemented with an array:

``` javascript
let queue = [];

queue.push(10);
queue.push(20);
queue.push(30);
```

The queue logically looks like:

``` text
FRONT                     BACK
  |                         |
  v                         v

+----+    +----+    +----+
| 10 | -> | 20 | -> | 30 |
+----+    +----+    +----+
```

To remove the oldest value:

``` javascript
let value = queue.shift();

console.log(value);
```

Output:

``` text
10
```

The queue becomes:

``` text
20 -> 30
```

------------------------------------------------------------------------

# 12. Stack vs Queue

This comparison is extremely important.

  Feature             Stack               Queue
  ------------------- ------------------- ------------------------
  Rule                LIFO                FIFO
  Full form           Last In First Out   First In First Out
  Add operation       PUSH                ENQUEUE
  Remove operation    POP                 DEQUEUE
  Add location        Top                 Back
  Remove location     Top                 Front
  Real-life example   Stack of plates     People waiting in line

## Stack

``` text
Added:

1 -> 2 -> 3

Removed:

3 -> 2 -> 1
```

## Queue

``` text
Added:

1 -> 2 -> 3

Removed:

1 -> 2 -> 3
```

------------------------------------------------------------------------

# 13. Array vs Stack vs Queue

This is the distinction to memorize.

``` text
ARRAY
-----
A container/collection for storing values.

STACK
-----
A data structure with LIFO access rules.

QUEUE
-----
A data structure with FIFO access rules.
```

Therefore:

``` text
Array != Stack
Array != Queue
Stack != Queue
```

But:

``` text
Array can be used to implement a Stack.

Array can be used to implement a Queue.
```

------------------------------------------------------------------------

# 14. A Simple Analogy

Think about a row of storage boxes.

The boxes themselves are like an **Array**.

You decide how people are allowed to use those boxes.

### Rule 1: Stack

Only use the top.

``` text
      TOP
       |
       v
     [30]
     [20]
     [10]
```

Last item added is removed first.

### Rule 2: Queue

Add at the back and remove from the front.

``` text
FRONT                  BACK
  |                      |
  v                      v

[10] -> [20] -> [30]
```

First item added is removed first.

------------------------------------------------------------------------

# 15. JavaScript Array as a Stack

``` javascript
let stack = [];

stack.push(10);
stack.push(20);
stack.push(30);

console.log(stack.pop()); // 30
console.log(stack.pop()); // 20
console.log(stack.pop()); // 10
```

Output:

``` text
30
20
10
```

Why?

Because:

``` text
10 entered first
20 entered second
30 entered last

30 leaves first
20 leaves second
10 leaves last
```

LIFO.

------------------------------------------------------------------------

# 16. JavaScript Array as a Queue

``` javascript
let queue = [];

queue.push(10);
queue.push(20);
queue.push(30);

console.log(queue.shift()); // 10
console.log(queue.shift()); // 20
console.log(queue.shift()); // 30
```

Output:

``` text
10
20
30
```

Why?

Because:

``` text
10 entered first
20 entered second
30 entered last

10 leaves first
20 leaves second
30 leaves last
```

FIFO.

------------------------------------------------------------------------

# 17. Important JavaScript Methods

## `push()`

Adds to the end of an array.

``` javascript
let arr = [10, 20];

arr.push(30);

console.log(arr);
```

Result:

``` text
[10, 20, 30]
```

------------------------------------------------------------------------

## `pop()`

Removes from the end.

``` javascript
let arr = [10, 20, 30];

let value = arr.pop();

console.log(value);
```

Result:

``` text
30
```

Array becomes:

``` text
[10, 20]
```

------------------------------------------------------------------------

## `shift()`

Removes from the beginning.

``` javascript
let arr = [10, 20, 30];

let value = arr.shift();

console.log(value);
```

Result:

``` text
10
```

Array becomes:

``` text
[20, 30]
```

------------------------------------------------------------------------

## `unshift()`

Adds to the beginning.

``` javascript
let arr = [20, 30];

arr.unshift(10);

console.log(arr);
```

Result:

``` text
[10, 20, 30]
```

------------------------------------------------------------------------

# 18. Visualizing the Four Methods

For:

``` text
[10, 20, 30]
```

### `push(40)`

``` text
[10, 20, 30, 40]
                 ^
                ADD
```

### `pop()`

``` text
[10, 20, 30, 40]
                 ^
               REMOVE
```

### `unshift(5)`

``` text
      ADD
       |
       v
[5, 10, 20, 30]
```

### `shift()`

``` text
       REMOVE
          |
          v
[10, 20, 30]
```

------------------------------------------------------------------------

# 19. Stack Using Array

The normal JavaScript implementation is:

``` javascript
let stack = [];

stack.push(10);
stack.push(20);
stack.push(30);

stack.pop();
```

Here we use:

``` text
push() + pop()
```

Therefore:

``` text
ARRAY + LIFO RULE = STACK
```

------------------------------------------------------------------------

# 20. Queue Using Array

A simple JavaScript implementation is:

``` javascript
let queue = [];

queue.push(10);
queue.push(20);
queue.push(30);

queue.shift();
```

Here we use:

``` text
push() + shift()
```

Therefore:

``` text
ARRAY + FIFO RULE = QUEUE
```

------------------------------------------------------------------------

# 21. Why Does the Two-Stack Queue Problem Exist?

Your original problem says:

> Build a FIFO queue using only two stacks.

At first this sounds confusing.

We want:

``` text
QUEUE
FIFO
```

But we are allowed to use:

``` text
STACK
LIFO
```

So we use two stacks.

``` text
INBOX STACK                 OUTBOX STACK

    3                            1
    2                            2
    1                            3
```

The second stack reverses the order.

------------------------------------------------------------------------

# 22. Two-Stack Queue --- Step by Step

Suppose:

``` text
ENQUEUE 1
ENQUEUE 2
ENQUEUE 3
```

Put everything into the inbox stack:

``` text
INBOX

    3  <- TOP
    2
    1
```

But the queue needs `1` first.

So move everything to the outbox stack.

### Move 3

``` text
INBOX              OUTBOX

  2                  3
  1
```

### Move 2

``` text
INBOX              OUTBOX

  1                  2
                     3
```

### Move 1

``` text
INBOX              OUTBOX

                     1  <- TOP
                     2
                     3
```

Now the oldest value, `1`, is on top of the outbox stack.

Therefore:

``` javascript
outbox.pop();
```

returns:

``` text
1
```

This gives us FIFO behavior using two LIFO stacks.

------------------------------------------------------------------------

# 23. Why Two Stacks Reverse the Order

This is the key idea behind the problem.

Start:

``` text
INBOX

1
2
3
```

Top is `3`.

When you repeatedly `pop()` from the inbox:

``` text
3
2
1
```

and push each value into the outbox, the order becomes:

``` text
OUTBOX

3
2
1
```

The top is now `1`.

Therefore the second stack reverses the order.

``` text
Original order:

1 -> 2 -> 3

After moving through another stack:

3 -> 2 -> 1
```

That reversal is what allows a queue to be built from stacks.

------------------------------------------------------------------------

# 24. The Correct Two-Stack Queue Structure

``` javascript
let inbox = [];
let outbox = [];
```

Both are JavaScript Arrays.

But conceptually:

``` text
inbox  = Stack
outbox = Stack
```

Together:

``` text
inbox + outbox = Queue
```

More accurately:

``` text
Two stacks
    |
    v
FIFO behavior
    |
    v
Queue
```

------------------------------------------------------------------------

# 25. ENQUEUE in Two-Stack Queue

When a new value arrives:

``` javascript
inbox.push(value);
```

Example:

``` text
ENQUEUE 10
ENQUEUE 20
ENQUEUE 30
```

Result:

``` text
INBOX

    30
    20
    10
```

Nothing needs to be moved immediately.

------------------------------------------------------------------------

# 26. DEQUEUE in Two-Stack Queue

When we need the oldest value:

1.  Check whether `outbox` is empty.
2.  If it is empty, move everything from `inbox` to `outbox`.
3.  Pop from `outbox`.

Example:

``` javascript
if (outbox.length === 0) {
    while (inbox.length > 0) {
        outbox.push(inbox.pop());
    }
}

let value = outbox.pop();
```

------------------------------------------------------------------------

# 27. Why Check `outbox.length === 0`?

Suppose:

``` text
ENQUEUE 1
ENQUEUE 2
ENQUEUE 3
DEQUEUE
```

After transferring:

``` text
OUTBOX

1
2
3
```

After removing `1`:

``` text
OUTBOX

2
3
```

Now another `DEQUEUE` comes.

We already have the correct order.

So we simply do:

``` javascript
outbox.pop();
```

We don't need to transfer everything again.

This is why:

``` javascript
if (outbox.length === 0)
```

is important.

------------------------------------------------------------------------

# 28. PEEK in Two-Stack Queue

`PEEK` means:

> Show the oldest value without removing it.

After transferring:

``` text
OUTBOX

    1  <- TOP
    2
    3
```

We use:

``` javascript
outbox[outbox.length - 1]
```

to look at the value without removing it.

Do NOT use:

``` javascript
outbox.pop();
```

for PEEK, because `pop()` removes the value.

------------------------------------------------------------------------

# 29. SIZE in Two-Stack Queue

The values may be split between the two stacks.

For example:

``` text
INBOX                  OUTBOX

  5                      1
  6                      2
```

Total queue size:

``` text
2 + 2 = 4
```

Therefore:

``` javascript
console.log(inbox.length + outbox.length);
```

------------------------------------------------------------------------

# 30. Empty Queue

If both stacks are empty:

``` text
INBOX  = []
OUTBOX = []
```

then the queue is empty.

For `DEQUEUE` or `PEEK`:

``` text
EMPTY
```

The important condition is:

``` javascript
if (inbox.length === 0 && outbox.length === 0) {
    console.log("EMPTY");
}
```

------------------------------------------------------------------------

# 31. Complete Two-Stack Queue Example

``` javascript
let inbox = [];
let outbox = [];

function transfer() {
    if (outbox.length === 0) {
        while (inbox.length > 0) {
            outbox.push(inbox.pop());
        }
    }
}

function enqueue(value) {
    inbox.push(value);
}

function dequeue() {
    transfer();

    if (outbox.length === 0) {
        console.log("EMPTY");
        return;
    }

    console.log(outbox.pop());
}

function peek() {
    transfer();

    if (outbox.length === 0) {
        console.log("EMPTY");
        return;
    }

    console.log(outbox[outbox.length - 1]);
}

function size() {
    console.log(inbox.length + outbox.length);
}
```

Example:

``` javascript
enqueue(1);
enqueue(2);
peek();
dequeue();
size();
```

Output:

``` text
1
1
1
```

------------------------------------------------------------------------

# 32. Common Confusion: "But inbox and outbox are Arrays!"

Yes!

That is correct.

``` javascript
let inbox = [];
let outbox = [];
```

Both are JavaScript Arrays.

But we are using them as stacks.

Think of it this way:

``` text
JavaScript Array
       |
       |  We choose how to use it
       |
       +---------> Stack behavior
       |
       +---------> Queue behavior
```

The variable name `stack` does not magically turn an Array into a
special Stack.

This:

``` javascript
let stack = [];
```

is still an Array.

It becomes conceptually a Stack because of the operations and rules we
apply.

------------------------------------------------------------------------

# 33. Data Structure vs Implementation

This distinction is useful in interviews.

## Data Structure

Describes how data is organized and what rules apply.

Examples:

``` text
Stack
Queue
Linked List
Tree
Graph
Hash Table
```

## Implementation

Describes how we build that data structure.

For example, a Stack can be implemented using:

``` text
Array
Linked List
```

A Queue can also be implemented using:

``` text
Array
Linked List
Two Stacks
```

So:

``` text
Stack = concept / behavior
Array = one possible implementation tool
```

------------------------------------------------------------------------

# 34. Stack Can Be Implemented Using Array

``` text
STACK
  |
  +---- Array
  |
  +---- Linked List
```

For example:

``` javascript
let stack = [];

stack.push(10);
stack.push(20);
stack.pop();
```

------------------------------------------------------------------------

# 35. Queue Can Be Implemented Using Array

``` text
QUEUE
  |
  +---- Array
  |
  +---- Linked List
  |
  +---- Two Stacks
```

For example:

``` javascript
let queue = [];

queue.push(10);
queue.shift();
```

Or, for your problem:

``` javascript
let inbox = [];
let outbox = [];
```

------------------------------------------------------------------------

# 36. Important Interview Vocabulary

### Stack

``` text
LIFO
Last In First Out
```

Operations:

``` text
PUSH
POP
PEEK
```

### Queue

``` text
FIFO
First In First Out
```

Operations:

``` text
ENQUEUE
DEQUEUE
PEEK
```

### Array

``` text
Indexed collection of values
```

Common JavaScript operations:

``` text
push()
pop()
shift()
unshift()
```

------------------------------------------------------------------------

# 37. Quick Memory Trick

## STACK = Plates

``` text
Last plate placed
        ↓
     comes out
      first
```

Therefore:

``` text
STACK = LIFO
```

## QUEUE = People in Line

``` text
First person arrived
        ↓
     gets served
       first
```

Therefore:

``` text
QUEUE = FIFO
```

## ARRAY = Boxes

``` text
+----+----+----+----+
| 10 | 20 | 30 | 40 |
+----+----+----+----+
```

Array is simply the storage structure.

------------------------------------------------------------------------

# 38. One-Page Cheat Sheet

``` text
====================================================
              ARRAY / STACK / QUEUE
====================================================

ARRAY
-----
Collection of values.

Example:
let arr = [10, 20, 30];

Purpose:
Store data.


STACK
-----
LIFO = Last In First Out

Real life:
Stack of plates

Add:
PUSH

Remove:
POP

Look at top:
PEEK

Example:

push(10)
push(20)
push(30)

pop() -> 30


QUEUE
-----
FIFO = First In First Out

Real life:
People waiting in line

Add:
ENQUEUE

Remove:
DEQUEUE

Look at front:
PEEK

Example:

enqueue(10)
enqueue(20)
enqueue(30)

dequeue() -> 10


KEY DIFFERENCE
--------------

STACK:

10 -> 20 -> 30
          |
          +--> removed first

LIFO


QUEUE:

10 -> 20 -> 30
|
+--> removed first

FIFO


JAVASCRIPT ARRAY
----------------

Array can implement a Stack:

push() + pop()


Array can implement a Queue:

push() + shift()


TWO-STACK QUEUE
---------------

inbox  = Stack
outbox = Stack

inbox:
1, 2, 3

move to outbox:

3, 2, 1

Now 1 is on top of outbox.

Therefore:

outbox.pop() -> 1


MOST IMPORTANT IDEA
-------------------

Array = storage/container

Stack = LIFO rule

Queue = FIFO rule

Array can be used to implement Stack.
Array can be used to implement Queue.
Two Stacks can be used to implement Queue.
====================================================
```

------------------------------------------------------------------------

# 39. Final Mental Model

Whenever you see a problem involving these terms, ask three questions:

### Question 1: What is storing the data?

Possibilities:

``` text
Array
Linked List
```

### Question 2: What behavior is required?

If:

``` text
Last In -> First Out
```

think:

``` text
STACK
```

If:

``` text
First In -> First Out
```

think:

``` text
QUEUE
```

### Question 3: What operations am I allowed to use?

For a Stack:

``` text
push
pop
peek
```

For a Queue:

``` text
enqueue
dequeue
peek
```

For the two-stack queue problem:

``` text
push
pop
```

on two separate stacks.

------------------------------------------------------------------------

# 40. The One Sentence to Remember

> **An Array is a container for storing values; a Stack and a Queue are
> data structures defined by the rules used to add and remove those
> values.**

And:

``` text
STACK = LIFO = Last In First Out = Plates

QUEUE = FIFO = First In First Out = People in Line

ARRAY = Storage / Collection
```

Once this distinction is clear, problems involving **Stack, Queue, and
Two Stacks** become much easier to understand.
