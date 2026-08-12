# Regular Expressions (Regex) — Learner Cheat Sheet

## 1. What is a Regular Expression?

A **Regular Expression (Regex)** is a pattern used to **search, validate, extract, or replace text**.

Example:

```javascript
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

---

## 2. Important Regex Symbols

| Symbol | Meaning | Example |
|---|---|---|
| `^` | Start of string | `^abc` |
| `$` | End of string | `abc$` |
| `.` | Any character | `a.c` |
| `\.` | Literal dot `.` | `gmail\.com` |
| `[]` | Character set | `[abc]` |
| `[^]` | Negated character set | `[^0-9]` |
| `-` | Range inside `[]` | `[a-z]` |
| `+` | 1 or more | `[a-z]+` |
| `*` | 0 or more | `[a-z]*` |
| `?` | 0 or 1 / optional | `colou?r` |
| `{n}` | Exactly n | `[0-9]{4}` |
| `{n,}` | At least n | `[a-z]{2,}` |
| `{n,m}` | Between n and m | `[a-z]{2,5}` |
| `()` | Grouping | `(abc)` |
| `|` | OR | `cat|dog` |
| `\d` | Digit | `\d` |
| `\D` | Non-digit | `\D` |
| `\w` | Word character | `\w` |
| `\W` | Non-word character | `\W` |
| `\s` | Whitespace | `\s` |
| `\S` | Non-whitespace | `\S` |

---

# 3. `^` — Start of String

```regex
^abc
```

Means:

> The string must start with `abc`.

Examples:

```text
abc123    ✅
abcdef    ✅
123abc    ❌
```

---

# 4. `$` — End of String

```regex
abc$
```

Means:

> The string must end with `abc`.

Examples:

```text
123abc    ✅
myabc     ✅
abc123    ❌
```

### `^` and `$` Together

```regex
^abc$
```

Means:

> The entire string must be exactly `abc`.

```text
abc       ✅
abc123    ❌
123abc    ❌
```

This is especially important when doing **validation**.

---

# 5. `[]` — Character Set

```regex
[abc]
```

Means:

> Match one character that is either `a`, `b`, or `c`.

```text
a    ✅
b    ✅
c    ✅
d    ❌
```

---

# 6. `[a-z]` — Lowercase Letters

```regex
[a-z]
```

Means:

> Any lowercase letter from `a` through `z`.

```text
a    ✅
m    ✅
z    ✅
A    ❌
5    ❌
```

---

# 7. `[A-Z]` — Uppercase Letters

```regex
[A-Z]
```

Means:

> Any uppercase English letter.

```text
A    ✅
M    ✅
Z    ✅
a    ❌
```

---

# 8. `[a-zA-Z]` — Uppercase or Lowercase

```regex
[a-zA-Z]
```

Means:

> Any uppercase or lowercase English letter.

```text
a    ✅
A    ✅
z    ✅
Z    ✅
5    ❌
@    ❌
```

---

# 9. `[0-9]` — Digit

```regex
[0-9]
```

Means:

> Any single digit from 0 to 9.

```text
0    ✅
5    ✅
9    ✅
a    ❌
```

---

# 10. `+` — One or More

```regex
[0-9]+
```

Means:

> One or more digits.

Examples:

```text
1       ✅
12      ✅
12345   ✅
```

An empty value does not match:

```text
""      ❌
```

### Remember

```text
+ = at least ONE
```

---

# 11. `*` — Zero or More

```regex
[0-9]*
```

Means:

> Zero or more digits.

Therefore:

```text
""       ✅
1        ✅
123      ✅
12345    ✅
```

### Difference

```text
+ = 1 or more
* = 0 or more
```

---

# 12. `?` — Zero or One / Optional

```regex
colou?r
```

Here `u` is optional.

Therefore:

```text
color     ✅
colour    ✅
colouur   ❌
```

### Remember

```text
? = optional
```

---

# 13. `{n}` — Exactly n Times

```regex
[0-9]{4}
```

Means:

> Exactly 4 digits.

```text
1234      ✅
9876      ✅
123       ❌
12345     ❌
```

Example: four-digit year:

```regex
[0-9]{4}
```

---

# 14. `{n,}` — At Least n Times

This is a very important regex concept.

```regex
[a-zA-Z]{2,}
```

Means:

> At least 2 letters.

Examples:

```text
a             ❌
ab            ✅
abc           ✅
company       ✅
international ✅
```

There is **no maximum**.

### Remember

```text
{2,}
 ↑
minimum
```

---

# 15. `{n,m}` — Minimum and Maximum

```regex
[a-zA-Z]{2,5}
```

Means:

> Minimum 2 and maximum 5 letters.

```text
a        ❌
ab       ✅
abc      ✅
abcd     ✅
abcde    ✅
abcdef   ❌
```

### Easy Memory Trick

```text
{2}      → exactly 2
{2,}     → 2 or more
{2,5}    → 2 to 5
```

---

# 16. `.` — Any Character

```regex
a.c
```

The `.` means:

> Any single character.

So:

```text
abc     ✅
a1c     ✅
a-c     ✅
a@c     ✅
```

But:

```text
ac      ❌
abbc    ❌
```

---

# 17. `\.` — Literal Dot

This is especially important for email validation.

Normally:

```regex
.
```

means:

> Any character.

But:

```regex
\.
```

means:

> An actual dot `.`

Example:

```regex
gmail\.com
```

matches:

```text
gmail.com    ✅
gmailXcom    ❌
gmail-com    ❌
```

---

# 18. `\d` — Digit

Instead of:

```regex
[0-9]
```

you can use:

```regex
\d
```

Both represent a digit.

```regex
\d+
```

means:

> One or more digits.

Example:

```text
12345    ✅
```

---

# 19. `\D` — Not a Digit

```regex
\D
```

Means:

> Any character that is NOT a digit.

---

# 20. `\s` — Whitespace

```regex
\s
```

Matches whitespace such as spaces, tabs, etc.

Example:

```regex
hello\sworld
```

matches:

```text
hello world
```

---

# 21. `\S` — Non-Whitespace

```regex
\S
```

Means:

> Any character that is NOT whitespace.

---

# 22. `\w` — Word Character

```regex
\w
```

Generally matches:

```text
a-z
A-Z
0-9
_
```

Example:

```regex
\w+
```

can match:

```text
hello
hello123
user_name
```

---

# 23. `\W` — Non-Word Character

```regex
\W
```

Means:

> A character that is NOT a word character.

Examples include:

```text
@
#
$
%
```

---

# 24. `()` — Grouping

Parentheses allow you to group part of a pattern.

Example:

```regex
(ab)+
```

Means:

> The group `ab` should occur one or more times.

Matches:

```text
ab       ✅
abab     ✅
ababab   ✅
```

---

# 25. `|` — OR

```regex
cat|dog
```

Means:

> Match either `cat` OR `dog`.

```text
cat      ✅
dog      ✅
cow      ❌
```

---

# 26. Email Regex — Complete Example

For emails such as:

```text
abc@gmail.com
test@rediffmail.com
```

we can use:

```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

## Break the Regex Into Parts

```text
^
│
├── [a-zA-Z0-9._%+-]+
│
├── @
│
├── [a-zA-Z0-9.-]+
│
├── \.
│
├── [a-zA-Z]{2,}
│
└── $
```

### Part 1 — `^`

```regex
^
```

Start of string.

### Part 2 — Username

```regex
[a-zA-Z0-9._%+-]+
```

The username can contain letters, numbers, and commonly allowed special characters.

Examples:

```text
abc
test
john123
john.doe
```

### Part 3 — `@`

```regex
@
```

The email must contain the `@` symbol.

### Part 4 — Domain

```regex
[a-zA-Z0-9.-]+
```

The domain portion.

Examples:

```text
gmail
rediffmail
company
```

### Part 5 — Literal Dot

```regex
\.
```

Matches an actual dot:

```text
.
```

### Part 6 — Domain Extension

```regex
[a-zA-Z]{2,}
```

Means:

> At least 2 alphabetic characters.

Examples:

```text
com
in
org
net
```

### Part 7 — `$`

```regex
$
```

End of string.

---

# 27. JavaScript Usage

```javascript
let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

console.log(emailRegex.test("abc@gmail.com"));       // true
console.log(emailRegex.test("test@rediffmail.com")); // true
console.log(emailRegex.test("abc@gmail"));           // false
console.log(emailRegex.test("abcgmail.com"));        // false
```

---

# 28. `.test()` Method

In JavaScript:

```javascript
regex.test(value)
```

returns:

```text
true
```

if the pattern matches.

Otherwise:

```text
false
```

Example:

```javascript
let pattern = /^[0-9]+$/;

console.log(pattern.test("12345")); // true
console.log(pattern.test("abc"));   // false
```

---

# 29. Quick Reference Table

| Regex | Meaning |
|---|---|
| `^` | Start |
| `$` | End |
| `[]` | Character set |
| `.` | Any character |
| `\.` | Actual dot |
| `+` | 1 or more |
| `*` | 0 or more |
| `?` | Optional / 0 or 1 |
| `{n}` | Exactly n |
| `{n,}` | At least n |
| `{n,m}` | Between n and m |
| `\d` | Digit |
| `\D` | Not digit |
| `\w` | Word character |
| `\W` | Not word |
| `\s` | Whitespace |
| `\S` | Not whitespace |
| `()` | Group |
| `|` | OR |

---

# 30. Recommended Learning Order

Don't try to memorize every regex symbol at once.

### Level 1 — Learn these first

```text
^
$
[]
+
*
{}
```

### Level 2 — Character shortcuts

```text
\d
\D
\w
\W
\s
\S
```

### Level 3 — Pattern control

```text
?
()
|
```

### Level 4 — Special characters

```text
.
\.
```

---

# 31. Most Important Concepts to Remember

```text
^       → Start
$       → End
[]      → Allowed characters
+       → One or more
*       → Zero or more
?       → Optional
{n}     → Exactly n
{n,}    → At least n
{n,m}   → Between n and m
\d      → Digit
\w      → Word character
\s      → Whitespace
```

## ⭐ One-Line Memory Trick

```text
^  = START
$  = END
[] = CHOICES
+  = 1+
*  = 0+
?  = OPTIONAL
{} = COUNT
\d = DIGIT
\w = WORD
\s = SPACE
```

---

# 32. Practice Examples

### Only digits

```regex
^[0-9]+$
```

### Exactly 10 digits

```regex
^[0-9]{10}$
```

### Only lowercase letters

```regex
^[a-z]+$
```

### Username: letters and numbers

```regex
^[a-zA-Z0-9]+$
```

### 6 to 12 characters

```regex
^.{6,12}$
```

### Basic email

```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

---

# 33. Final Mental Model

When reading a regex, read it **from left to right**.

For:

```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

think:

```text
START
  ↓
username
  ↓
@
  ↓
domain
  ↓
.
  ↓
2 or more letters
  ↓
END
```

This is much easier than trying to memorize the entire regex as one pattern.
