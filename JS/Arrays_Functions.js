let ar = "a, b, c, d";
let arr = ar.split(", ");
console.log(ar);
console.log(arr);


let fruar = [];
fruar = ["apple", "guva"];
console.log(fruar[0]);



let fruit = [];
let browsers = ["chrome", "firefox", "webkit"];
//browsers.Isarray();
// console.log(browsers[0]);
// console.log(browsers.at(-1));
// console.log(browsers.length);
// console.log(fruit.length);



//The zero-based location in the array from which to start removing elements.
//Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
browsers.splice(); 
browsers.sort();
browsers.reverse();


let arr = [10, 20, 30, 40];

console.log(arr.length);

// 0 to 3
console.log(arr[4]); // undefined

let testResults = ["pass", "fail", "pass", "skip"];

let mixed = [1, "hello", true, null];


// Array constructor
let scores = new Array(3); // creates [empty × 3]

let test = Array.of(10, 20, 30, 40, 50);


// Array.from()
let chars = Array.from("hello");









// For the Negative indexed, use the at
console.log(browsers[-1]); // undefined