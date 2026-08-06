/* Calculate the letter grade based on a numeric score. A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: below 60.

Example 1
Input: 85
Output : B
Score 85 falls in the B range (80-89)

Example 2
Input: 95
Output: A */
let data = 90;

console.log(`Marks: ${data}`);

if (data >= 90 && data <= 100) {
    console.log("A");
}
else if (data > 80 && data <= 89) {
    console.log("B");
} else if (data > 70 && data <= 79) {
    console.log("C");
} else if (data > 60 && data <= 69) {
    console.log("D");
}
