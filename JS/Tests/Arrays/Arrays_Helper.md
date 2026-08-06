# JavaScript Array Helper Functions

This file contains a comprehensive quick reference for array creation, properties, mutating methods, non-mutating methods, iteration helpers, and static Array functions.

Example array used in many examples:

```js
const arr = [1, 2, 3, 4];
const fruits = ["apple", "banana", "orange"];
```

## 1) Array creation and properties

| Member | Description | Example | Result |
|--------|-------------|---------|--------|
| `new Array()` | Create an array | `new Array(3)` | `[empty × 3]` |
| `Array.of()` | Create an array from values | `Array.of(1, 2, 3)` | `[1, 2, 3]` |
| `Array.from()` | Create an array from an iterable or array-like value | `Array.from("abc")` | `['a', 'b', 'c']` |
| `Array.isArray()` | Check whether a value is an array | `Array.isArray(arr)` | `true` |
| `length` | Get the number of elements | `arr.length` | `4` |
| `at()` | Access an element by positive or negative index | `arr.at(-1)` | `4` |

## 2) Mutating methods

| Method | Description | Example | Result |
|--------|-------------|---------|--------|
| `push()` | Add one or more elements to the end | `arr.push(5)` | `[1, 2, 3, 4, 5]` |
| `pop()` | Remove and return the last element | `arr.pop()` | `4` and `[1, 2, 3]` |
| `shift()` | Remove and return the first element | `arr.shift()` | `1` and `[2, 3, 4]` |
| `unshift()` | Add one or more elements to the beginning | `arr.unshift(0)` | `[0, 1, 2, 3, 4]` |
| `splice()` | Add, remove, or replace elements at a specific index | `arr.splice(1, 1, 9)` | `[1, 9, 3, 4]` |
| `sort()` | Sort elements in place | `arr.sort((a, b) => a - b)` | `[1, 2, 3, 4]` |
| `reverse()` | Reverse the order in place | `arr.reverse()` | `[4, 3, 2, 1]` |
| `fill()` | Fill elements with a static value | `arr.fill(0, 1, 3)` | `[1, 0, 0, 4]` |
| `copyWithin()` | Copy a sequence of elements within the same array | `arr.copyWithin(0, 2, 4)` | `[3, 4, 3, 4]` |

## 3) Non-mutating methods

| Method | Description | Example | Result |
|--------|-------------|---------|--------|
| `slice()` | Return a shallow copy of a portion | `arr.slice(1, 3)` | `[2, 3]` |
| `concat()` | Merge two arrays into a new array | `arr.concat([5, 6])` | `[1, 2, 3, 4, 5, 6]` |
| `join()` | Join array values into a string | `arr.join('-')` | `'1-2-3-4'` |
| `includes()` | Check whether an element exists | `arr.includes(2)` | `true` |
| `indexOf()` | Return the first matching index | `arr.indexOf(2)` | `1` |
| `lastIndexOf()` | Return the last matching index | `arr.lastIndexOf(2)` | `1` |
| `toString()` | Convert array to comma-separated string | `arr.toString()` | `'1,2,3,4'` |
| `toLocaleString()` | Convert array to locale-specific string | `arr.toLocaleString()` | `'1,2,3,4'` |
| `flat()` | Flatten nested arrays by one level | `[1, [2, 3]].flat()` | `[1, 2, 3]` |
| `flatMap()` | Map each element and flatten by one level | `arr.flatMap(x => [x, x * 2])` | `[1, 2, 2, 4, 3, 6, 4, 8]` |

## 4) Search, filter, and iteration helpers

| Method | Description | Example | Result |
|--------|-------------|---------|--------|
| `find()` | Return the first element that passes the test | `arr.find(x => x > 2)` | `3` |
| `findIndex()` | Return the index of the first matching element | `arr.findIndex(x => x > 2)` | `2` |
| `findLast()` | Return the last element that passes the test | `[1, 2, 3, 4].findLast(x => x > 2)` | `4` |
| `findLastIndex()` | Return the index of the last matching element | `[1, 2, 3, 4].findLastIndex(x => x > 2)` | `3` |
| `filter()` | Return all elements that pass a test | `arr.filter(x => x > 2)` | `[3, 4]` |
| `map()` | Transform every element into a new array | `arr.map(x => x * 2)` | `[2, 4, 6, 8]` |
| `forEach()` | Run a callback for every element | `arr.forEach(x => console.log(x))` | `1 2 3 4` |
| `every()` | Check whether every element passes the test | `arr.every(x => x > 0)` | `true` |
| `some()` | Check whether at least one element passes the test | `arr.some(x => x > 3)` | `true` |
| `entries()` | Return key/value pairs as an iterator | `arr.entries()` | `0->1, 1->2, ...` |
| `keys()` | Return indexes as an iterator | `arr.keys()` | `0, 1, 2, 3` |
| `values()` | Return values as an iterator | `arr.values()` | `1, 2, 3, 4` |

## 5) Reduction and modern array helpers

| Method | Description | Example | Result |
|--------|-------------|---------|--------|
| `reduce()` | Reduce the array to one value | `arr.reduce((sum, x) => sum + x, 0)` | `10` |
| `reduceRight()` | Reduce from right to left | `arr.reduceRight((sum, x) => sum + x, 0)` | `10` |
| `with()` | Create a new array with one element replaced | `[1, 2, 3].with(1, 9)` | `[1, 9, 3]` |

### Quick notes

- Mutating methods change the original array.
- Non-mutating methods return a new array or value without changing the original.
- Use `console.log()` to see the output in the browser or in Node.js.
- Methods like `findLast()` and `findLastIndex()` are modern JavaScript features and may need a recent runtime.
