// +----------------------+----------------------+----------------------+------------------------------------------------------+
// | Left Value           | value || "Default"  | value ?? "Default"  | Explanation                                          |
// +----------------------+----------------------+----------------------+------------------------------------------------------+
// | 0                    | "Default"           | 0                    | 0 is falsy, but NOT null or undefined.              |
// | "" (empty string)    | "Default"           | ""                   | Empty string is falsy, but still a valid value.      |
// | false                | "Default"           | false                | false is falsy, but still a valid boolean.           |
// | NaN                  | "Default"           | NaN                  | NaN is falsy, but NOT null or undefined.             |
// | null                 | "Default"           | "Default"            | null means no value, so both use the default.        |
// | undefined            | "Default"           | "Default"            | undefined means no value, so both use the default.   |
// | "Hello"              | "Hello"             | "Hello"              | Normal string, so both return the left value.        |
// | 25                   | 25                  | 25                   | Normal number, so both return the left value.        |
// +----------------------+----------------------+----------------------+------------------------------------------------------+

// +-----------+-----------------------------------------------+
// | Operator  | Rule                                          |
// +-----------+-----------------------------------------------+
// | ||        | Replaces if the value is FALSY               |
// | ??        | Replaces ONLY if the value is null/undefined |
// +-----------+-----------------------------------------------+

// Falsy Values
// ------------
// false
// 0
// -0
// 0n
// ""
// null
// undefined
// NaN


// Golden Rule (Interview)
// ----------------------
// ||  → Checks ALL falsy values.
//     Falsy values:
//     false
//     0
//     ""
//     NaN
//     null
//     undefined

// ??  → Checks ONLY:
//     null
//     undefined