# 07 --- Adding, Removing & Copying

## Functions in this category

-   `push()`
-   `pop()`
-   `shift()`
-   `unshift()`
-   `slice()`
-   `splice()`
-   `toSpliced()`

------------------------------------------------------------------------

# `push()`

Adds elements to the end.

``` javascript
const browsers = ["Chrome", "Firefox"];

browsers.push("Edge");

console.log(browsers);
```

Returns the **new array length**.

------------------------------------------------------------------------

# `pop()`

Removes the last element.

``` javascript
const browsers = ["Chrome", "Firefox", "Edge"];

const removed = browsers.pop();

console.log(removed); // Edge
```

Returns the removed element.

------------------------------------------------------------------------

# `shift()`

Removes the first element.

``` javascript
const queue = ["User1", "User2", "User3"];

const first = queue.shift();

console.log(first); // User1
```

------------------------------------------------------------------------

# `unshift()`

Adds elements to the beginning.

``` javascript
queue.unshift("User0");
```

------------------------------------------------------------------------

# Real-time QA example --- browser execution queue

``` javascript
const executionQueue = ["TC01", "TC02"];

executionQueue.push("TC03");
executionQueue.push("TC04");

const currentTest = executionQueue.shift();

console.log(currentTest); // TC01
```

This is a simple queue-like pattern.

------------------------------------------------------------------------

# `slice()`

Returns a portion of an array **without changing the original**.

``` javascript
const tests = ["TC01", "TC02", "TC03", "TC04"];

const selected = tests.slice(1, 3);

console.log(selected); // ["TC02", "TC03"]
console.log(tests);    // unchanged
```

Start index is included.

End index is excluded.

``` text
slice(start, end)
          ↑
       excluded
```

------------------------------------------------------------------------

# `splice()`

Adds, removes, or replaces elements **and changes the original array**.

``` javascript
const tests = ["TC01", "TC02", "TC03"];

tests.splice(1, 1);

console.log(tests);
```

Result:

``` text
["TC01", "TC03"]
```

Syntax:

``` javascript
splice(start, deleteCount, item1, item2, ...)
```

Example:

``` javascript
tests.splice(1, 0, "TC99");
```

Adds without deleting.

------------------------------------------------------------------------

# `toSpliced()`

Returns a modified copy without changing the original.

``` javascript
const tests = ["TC01", "TC02", "TC03"];

const updated = tests.toSpliced(1, 1, "TC99");

console.log(tests);   // original
console.log(updated); // modified copy
```

------------------------------------------------------------------------

# Interview comparison

  Method          Purpose                        Mutates?
  --------------- ---------------------------- ----------
  `push()`        Add at end                          Yes
  `pop()`         Remove at end                       Yes
  `shift()`       Remove at beginning                 Yes
  `unshift()`     Add at beginning                    Yes
  `slice()`       Copy/extract portion                 No
  `splice()`      Insert/delete/replace               Yes
  `toSpliced()`   Insert/delete/replace copy           No
