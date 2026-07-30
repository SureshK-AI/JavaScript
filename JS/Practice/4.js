/* Element Visibility Checker
In UI automation (Cypress/Playwright), you often need to validate element states before interacting with them. Write a JavaScript program that checks an element's properties (isPresent, isDisplayed, isEnabled) and prints the appropriate action a QA engineer should take. Use strict equality (===), logical operators (&&, ||), and the ternary operator for severity level.

States: READY (all true), DISABLED (present+displayed but not enabled), HIDDEN (present but not displayed), NOT FOUND (not present).
Severity: CRITICAL (not present), WARNING (not displayed or not enabled), OK (all good).


Input Format
Three boolean variables: isPresent, isDisplayed, isEnabled

Output Format
Element status, severity level, and recommended action

Examples
Input
isPresent = true, isDisplayed = true, isEnabled = false
Output
Status: DISABLED Severity: WARNING Action: Element is visible but disabled. Wait for enable state or check preconditions.
 */