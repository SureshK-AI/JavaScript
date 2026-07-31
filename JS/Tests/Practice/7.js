/* Bug Severity Classifier
As a QA engineer, classify bugs based on two factors: frequency ("always", "often", "rarely") and impact ("blocker", "major", "minor"). Write a JavaScript program using nested if-else that prints the bug severity level.

Classification Matrix:
- always + blocker → P0 | always + major → P1 | always + minor → P2
- often + blocker → P1 | often + major → P2 | often + minor → P3
- rarely + blocker → P2 | rarely + major → P3 | rarely + minor → P4


Input Format
Two string variables: frequency ("always"/"often"/"rarely") and impact ("blocker"/"major"/"minor")

Output Format
Bug severity report with title, frequency, impact, and priority level

Examples
Input
frequency = "always", impact = "blocker"
Output
Bug Title: Checkout page crashes on applying coupon Frequency: always Impact: blocker Severity: P0 - Critical: Stop release immediately

 */