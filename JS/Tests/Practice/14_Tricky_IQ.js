/*//Q1. [Tricky] What is the output?
var sum = 0;
for (var i = 1; i <= 5; i++);
  sum += i;
console.log(sum);

/*A) 15
B) 6
C) 0
D) SyntaxError

Answer: B) 6 */

/* //Q2 [Tricky] What is the output?
let i = 0;
while (i < NaN) {
  i++;
}
console.log(i);

/* A) 0
B) Infinite loop
C) NaN
D) 1
Answer: A) 0 */

//Q3. [Medium] What is the output?

let i = 3, count = 0;
do {
  count++;
} while (i-- > 0);
console.log(count + " " + i);

/*A) 3 0
B) 4 0
C) 4 -1
D) 3 -1 

Answer: C) 4 -1 */