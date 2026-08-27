// Import/Export learning checklist
    // ☑ Named export
    // ☑ Named import
    // ☑ Default export
    // ☑ Default import
    // ☑ Default + named import
    // ☑ Named import aliasing
    // ☑ Default import local naming
    // ☑ Import order
    // ☑ Side-effect import
    // ☑ Export at bottom
    // ☑ Export aliasing
    // ☐ Import * as
    // ☑ Re-export
    // ☑ Re-export default
    // ☐ Barrel/index module
    // ☑ Relative import paths
    // ☑ package.json "type": "module"
    // ☑ CommonJS vs ES Modules
    // ☐ Dynamic import


// Import the named export `findLargest` from `Utilities.js`.
// The `{ }` syntax is used because `findLargest` is a named export.
import { findLargest } from './Utilities.js';

// Call the imported `findLargest` function with an array of numbers.
// The function returns the largest number in the array.
let a = findLargest([10, 25, 15, 30, 20]);
console.log(a); // Output: 30

// ============================================================
// IMPORT ORDER RULE
// ============================================================
//
// 1. Default import comes FIRST.
// 2. Named imports come AFTER the default import.
// 3. Named imports are placed inside { }.
// 4. Default imports do NOT use the `as` keyword for aliasing.
//    The name written after `import` becomes the local name.
// 5. Named imports use `as` when creating an alias.
//
// Syntax:
// import defaultExport, { namedExport } from './module.js';
//
// Example - Default + Named:
// import removeDupInArray, { findLargest } from './Utilities.js';
//
// Example - Default + Named with alias:
// import rn, { findLargest as fl } from './Utilities.js';
//
// Default export aliasing:
//
// Export:
// export default function removeDupInArray(inpArr) { }
//
// Correct:
// import rn from './Utilities.js';
//
// Here:
// removeDupInArray → rn
//
// Incorrect:
// import removeDupInArray as rn from './Utilities.js';
// ❌ `as` cannot be used with a default import.
//
// Named export aliasing:
//
// Export:
// export function findLargest(inpArr) { }
//
// Correct:
// import { findLargest as fl } from './Utilities.js';
//
// Here:
// findLargest → fl
//
// ============================================================

import removeDupInArray, { findLargest as fl } from './Utilities.js';

let uniNumbers = removeDupInArray([10, 25, 15, 30, 20, 10, 15, 30]);
console.log(uniNumbers);

let largestNumber = fl([10, 25, 15, 30, 20]);
console.log(largestNumber);


//7. importing the aliased exports Below import statement used the alias names for the function countVowels 
// and isPrimeNUmber caleed with original names in the Utilities.js file.
import {countVowelsAlias, isPrimeNumber} from './Utilities.js';

console.log(countVowelsAlias("Hello World")); // Output: Vowels: 3 Consonants: 7
console.log(isPrimeNumber(7)); // Output: true


// Re-exporting: This is important once you start working with larger projects.