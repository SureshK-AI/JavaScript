// Phase 1: Arrays (30)
// Phase 2: Strings (25)
// Phase 3: JavaScript Fundamentals (25)
// Phase 4: Playwright Coding (20)
// Phase 5: Objects (15)
// Phase 6: Numbers & Math (20)
// Phase 7: Patterns (15)

//1. Write a program to swap two numbers without using their temp variable.
//2. Write a program to reverse a number in any language.
//3. Find the palindrome substrings of a given string.
    //Ans. In this situation, you'll need to locate all non-single letter palindrome substrings. You can start by extending to the left and right for each letter in the input string, testing for even and odd-length palindromes. If you see that there isn't a palindrome, you must continue on to the following letter. We can start by enlarging and comparing one character to the left and right. You print out the palindrome substring if both are equal.

/* 4. Determine if the sum of any three integers in an array is equal to the given value.
Ans. In order to solve this problem, you will be required to sort the array. You will be required to fix one element e and find a pair (a, b) in the remaining array so that required_sum – e is a+b. 
You can begin with the first element "e" in the array and then try to find such a pair (a, b) in that remaining array (i.e., A[i + 1] to A[n-1]) which satisfies the condition: a + b = required_sum – e. If you happen to find the pair, it means that you have found the solution: a, b and e. 
Consequently, you can stop the iteration. 
On the other hand, if you do not find the pair, then you will have to repeat the steps for all elements e at index i=1 to n-3 until we find the specific pair which meets the condition. 
 */
// 1. Arrays (30 Questions)
// ------------------------

// 1. Find the largest element in an array.
// 2. Find the second largest element.
// 3. Find the smallest element.
// 4. Find the second smallest element.
// 5. Reverse an array.
// 6. Rotate an array left by K positions.
// 7. Rotate an array right by K positions.
// 8. Remove duplicates from an array.
// 9. Merge two sorted arrays.
// 10. Find duplicate elements.
// 11. Find missing number (1 to N).
// 12. Move all zeros to the end.
// 13. Move all negative numbers to one side.
// 14. Count even and odd numbers.
// 15. Find maximum difference.
// 16. Find minimum difference.
// 17. Sort an array without using sort().
// 18. Check if an array is sorted.
// 19. Find intersection of two arrays.
// 20. Find union of two arrays.
// 21. Find common elements in three arrays.
// 22. Find frequency of each element.
// 23. Find the majority element.
// 24. Find leaders in an array.
// 25. Kadane's Algorithm (Maximum Subarray Sum).
// 26. Product of array except self.
// 27. Two Sum problem.
// 28. Three Sum problem.
// 29. Find pair with given sum.
// 30. Flatten nested arrays.



// 2. Strings (25 Questions)
// -----------------------------------

// 31. Reverse a string.
// 32. Check palindrome.
// 33. Count vowels and consonants.
// 34. Remove duplicate characters.
// 35. Find first non-repeating character.
// 36. Find first repeating character.
// 37. Count occurrences of a character.
// 38. Check if two strings are anagrams.
// 39. Reverse words in a sentence.
// 40. Find longest word.
// 41. Find longest common prefix.
// 42. Check if one string is rotation of another.
// 43. Compress a string.
// 44. Expand compressed string.
// 45. Count words.
// 46. Remove whitespace.
// 47. Toggle character case.
// 48. Capitalize each word.
// 49. Find duplicate words.
// 50. Check balanced parentheses.
// 51. Validate brackets.
// 52. Check substring.
// 53. Find all substrings.
// 54. Longest palindrome substring.
// 55. String permutations.



// 3. Numbers & Math (20 Questions)
// -----------------------------------

// 56. Check prime number.
// 57. Generate prime numbers.
// 58. Check Armstrong number.
// 59. Check palindrome number.
// 60. Reverse number.
// 61. Count digits.
// 62. Sum of digits.
// 63. Factorial.
// 64. Fibonacci.
// 65. GCD.
// 66. LCM.
// 67. Swap numbers without temp.
// 68. Power without Math.pow().
// 69. Decimal to Binary.
// 70. Binary to Decimal.
// 71. Check leap year.
// 72. Count trailing zeros in factorial.
// 73. Perfect number.
// 74. Strong number.
// 75. Happy number.


// 4. Loops & Patterns (15 Questions)
// -----------------------------------

// 76. Multiplication table.
// 77. Pyramid pattern.
// 78. Inverted pyramid.
// 79. Floyd's triangle.
// 80. Pascal's triangle.
// 81. Diamond pattern.
// 82. Hollow square.
// 83. Hollow pyramid.
// 84. Butterfly pattern.
// 85. X pattern.
// 86. Number pyramid.
// 87. Character pyramid.
// 88. Spiral matrix.
// 89. Zigzag pattern.
// 90. Snake pattern.


// 5. JavaScript Fundamentals (25 Questions)
// -----------------------------------

// 91. Hoisting.
// 92. Scope.
// 93. Closures.
// 94. Callbacks.
// 95. Promises.
// 96. Async/Await.
// 97. Event Loop.
// 98. this keyword.
// 99. Arrow functions.
// 100. Destructuring.
// 101. Spread operator.
// 102. Rest operator.
// 103. Optional chaining.
// 104. Nullish coalescing.
// 105. Template literals.
// 106. Default parameters.
// 107. Object cloning.
// 108. Shallow vs Deep copy.
// 109. Prototype.
// 110. Prototypal inheritance.
// 111. Map.
// 112. Set.
// 113. WeakMap.
// 114. WeakSet.
// 115. Generators.



// 6. Objects (15 Questions)
// -----------------------------------

// 116. Merge objects.
// 117. Deep clone object.
// 118. Freeze object.
// 119. Seal object.
// 120. Object iteration.
// 121. Convert object to array.
// 122. Convert array to object.
// 123. Nested object traversal.
// 124. Flatten object.
// 125. Compare two objects.
// 126. Count object properties.
// 127. Remove property.
// 128. Sort object keys.
// 129. Group objects.
// 130. Find duplicate objects.


// 7. Playwright / Automation Coding (20 Questions)
// -----------------------------------

// 131. Find duplicate locators.
// 132. Retry failed test logic.
// 133. Dynamic locator creation.
// 134. Wait until element appears.
// 135. Wait for API response.
// 136. Read data from JSON.
// 137. Read CSV.
// 138. Read Excel.
// 139. API status validation.
// 140. Screenshot on failure.
// 141. Retry API request.
// 142. Parallel execution logic.
// 143. Dynamic test generation.
// 144. Count passed/failed tests.
// 145. Custom assertion.
// 146. File upload.
// 147. Download verification.
// 148. Date picker automation.
// 149. Infinite scroll handling.
// 150. Pagination handling.



// Top 25 Most Frequently Asked (Must Practice)
// ---------------------------------------------
// If you only have time to focus on the highest-impact questions, prioritize these:

// 1. Reverse String
// 2. Palindrome
// 3. Anagram
// 4. Fibonacci
// 5. Factorial
// 6. Prime Number
// 7. Largest Number in Array
// 8. Second Largest
// 9. Remove Duplicates
// 10. Frequency Counter
// 11. Missing Number
// 12. Move Zeros
// 13. Two Sum
// 14. Maximum Subarray Sum
// 15. Flatten Array
// 16. Deep Copy vs Shallow Copy
// 17. Closures
// 18. Promises
// 19. Async/Await
// 20. Event Loop
// 21. this Keyword
// 22. Hoisting
// 23. Object vs Map
// 24. Array Methods (map, filter, reduce)
// 25. Playwright Dynamic Locator
