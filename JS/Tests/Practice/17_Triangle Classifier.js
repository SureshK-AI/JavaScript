/* Triangle Classifier
Write a program that takes three sides of a triangle and classifies it as Equilateral, Isosceles, or Scalene.

Example 1
Input : 10 10 15
Output : Isosceles Two sides are equal (10 and 10)

Example 2
Input 5 5 5
Output : Equilateral */

let newArr1 = "9 10 12".split(" ");
let newArr1Num = newArr1.map(Number); //it converts all string values to numbers 
let side1 = newArr1Num[0];
let side2 = newArr1Num[1];
let side3 = newArr1Num[2];

    if (
    side1 + side2 <= side3 ||
    side1 + side3 <= side2 ||
    side2 + side3 <= side1
) {

    console.log("Not a Valid Triangle");

}
else if (side1 === side2 && side2 === side3) {

    console.log("Equilateral");

}
else if (
    side1 === side2 ||
    side1 === side3 ||
    side2 === side3
) {

    console.log("Isosceles");

}
else {

    console.log("Scalene");

}
