/* Level 1 — Basic Object Practice

Create an object and do some operations on object

1. Student Details object 

Print student name
Print age
Print marks
Add a new property school
Change marks to 90
Delete age
*/


const stuDet = {name: "Sahasra",
                class: "4A",
                age: 10,
                location: "Bangalore",
                marks: 98
                };

Tasks:
// Print student name
console.log(stuDet.name);
// Print age
console.log(stuDet.age);
// Print marks
console.log(stuDet.marks);
// Add a new property school
stuDet.school = "Insight";
stuDet["Area"]="Marthahalli";
// Change marks to 90
stuDet.marks=50;
// Delete age
delete stuDet.age;
// Print the object
console.log(stuDet);