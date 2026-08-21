# Global Code Review Best Practices

This document is intended to be incorporated into the repository `CODE_REVIEW.md` used by the AI Code Review utility.

The purpose is to provide consistent, practical coding and automation standards for JavaScript/TypeScript, Playwright, API testing, Git, security, maintainability, performance, and test automation.

---

## 1. Review Principles

The AI reviewer must:

1. Review the Pull Request changes, not unrelated existing code.
2. Identify real, actionable defects rather than subjective preferences.
3. Follow the rules in this document consistently.
4. Report the exact file and line where possible.
5. Explain why the issue matters.
6. Provide a practical recommended fix.
7. Avoid reporting the same issue multiple times.
8. Do not invent problems when the code is valid.
9. Treat explicitly marked mandatory rules as violations when they are broken.
10. Distinguish mandatory standards from recommendations.

---

# 2. Naming Conventions

## 2.1 Variables

Use `camelCase` for normal variables.

Good:

```javascript
const customerName = "John";
const totalAmount = 1000;
const accountDetails = {};
```

Bad:

```javascript
const customer_name = "John";
const CustomerName = "John";
const CUSTOMERNAME = "John";
```

Rules:

- Variable names must use `camelCase`.
- Names should be meaningful and descriptive.
- Avoid unnecessary abbreviations.
- Avoid single-letter names except simple loop counters such as `i`, `j`, or `k`.
- Boolean variables should communicate a condition.

Good:

```javascript
const isActive = true;
const hasPermission = false;
const shouldRetry = true;
```

Avoid:

```javascript
const active = true;
const flag = false;
const data = true;
```

---

## 2.2 Functions

Use `camelCase` for function names.

Good:

```javascript
function calculateTotal() {}
function getCustomerDetails() {}
function validateLoginResponse() {}
```

Bad:

```javascript
function calculate_total() {}
function CalculateTotal() {}
function GETCUSTOMERDETAILS() {}
```

Rules:

- Function names should describe the action performed.
- Prefer verb-based names.
- Avoid generic names such as `process()`, `handle()`, or `doSomething()` when a more meaningful name is possible.
- Functions should have a focused responsibility.

Good:

```javascript
validateCustomerDetails()
createOrder()
getAccountBalance()
```

---

## 2.3 Constants

Use `UPPER_SNAKE_CASE` for true application constants that are intentionally immutable configuration values.

Good:

```javascript
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT = 30000;
const BASE_URL = "https://example.com";
```

Avoid:

```javascript
const maxRetryCount = 3;
const default_timeout = 30000;
```

Do not force every `const` variable into `UPPER_SNAKE_CASE`. The convention applies to semantic constants, not every JavaScript declaration using `const`.

---

## 2.4 Classes

Use `PascalCase` for class names.

Good:

```javascript
class LoginPage {}
class CustomerService {}
class ApiClient {}
```

Bad:

```javascript
class loginPage {}
class customer_service {}
```

---

## 2.5 File and Script Names

Use `camelCase` for JavaScript/TypeScript script file names where this is the project convention.

Good:

```text
customerLogin.js
apiTestHelper.js
orderValidation.spec.js
loginPage.js
```

Avoid:

```text
customer_login.js
CustomerLogin.js
customer-login.js
```

Exception:

If a framework or repository convention explicitly requires another format, follow that convention consistently.

---

## 2.6 Test Names

Test names should describe the behavior being validated.

Good:

```javascript
test("should display an error when invalid credentials are entered", async () => {});
```

Avoid:

```javascript
test("test1", async () => {});
test("login", async () => {});
test("check", async () => {});
```

A test name should make the expected behavior understandable without opening the implementation.

---

# 3. JavaScript / TypeScript Best Practices

## 3.1 Variable Declarations

Prefer:

```text
const
```

when reassignment is not required.

Use:

```text
let
```

when reassignment is required.

Avoid `var` unless there is a specific legacy requirement.

Bad:

```javascript
var customerName = "John";
```

Preferred:

```javascript
const customerName = "John";
```

---

## 3.2 Avoid Unnecessary Mutable State

Prefer simple immutable data where practical.

Avoid unnecessary reassignment:

```javascript
let result = [];
result = getData();
```

Prefer:

```javascript
const result = getData();
```

The reviewer should identify unnecessary mutable state when it materially reduces clarity or increases defect risk.

---

## 3.3 Avoid Magic Numbers and Strings

Avoid unexplained values embedded in logic.

Bad:

```javascript
if (retryCount > 3) {}
```

Preferred:

```javascript
const MAX_RETRY_COUNT = 3;

if (retryCount > MAX_RETRY_COUNT) {}
```

Exceptions are acceptable for obvious values where introducing a constant would reduce readability.

---

## 3.4 Avoid Deep Nesting

Avoid excessive nested:

```text
if
  if
    for
      if
        try
```

Prefer:

- Guard clauses.
- Small functions.
- Early returns.
- Clear helper methods.

---

## 3.5 Function Responsibility

A function should have a clear primary responsibility.

Flag functions that are unnecessarily large or perform unrelated tasks.

Example of excessive responsibility:

```text
login()
  -> prepare test data
  -> call API
  -> create browser
  -> login
  -> validate database
  -> generate report
  -> send email
```

Prefer focused functions/components.

---

## 3.6 Avoid Duplicate Logic

Identify meaningful duplicate logic.

Prefer reusable helpers when duplication:

- Is substantial.
- Is repeated.
- Has the same business meaning.
- Creates maintenance risk.

Do not report trivial repetition simply because two lines look similar.

---

## 3.7 Avoid Dead Code

Flag:

- Unused variables.
- Unreachable code.
- Commented-out old implementations.
- Unused functions.
- Unused imports.

Do not remove code merely because it appears unused if the framework or runtime may require it; report uncertainty when appropriate.

---

## 3.8 Avoid Unnecessary Comments

Comments should explain:

- Why something unusual is required.
- Business rules.
- Non-obvious technical decisions.

Avoid comments that merely restate the code.

Bad:

```javascript
// Increment counter
counter++;
```

Preferred:

```javascript
// Retry only three times because the downstream service has a strict rate limit.
counter++;
```

---

# 4. Async / Await Best Practices

## 4.1 Await Required Asynchronous Operations

Flag missing `await` when it can cause:

- Race conditions.
- Incorrect assertions.
- Test execution before an operation completes.
- Unhandled promise behavior.

Bad:

```javascript
page.click("#login");
expect(await page.locator("#home")).toBeVisible();
```

Preferred:

```javascript
await page.click("#login");
await expect(page.locator("#home")).toBeVisible();
```

---

## 4.2 Avoid Unnecessary Sequential Awaits

Where operations are independent, consider parallel execution.

Instead of unnecessarily waiting for each independent operation:

```javascript
const user = await getUser();
const account = await getAccount();
```

Consider:

```javascript
const [user, account] = await Promise.all([
    getUser(),
    getAccount()
]);
```

Only recommend this when the operations are genuinely independent.

---

## 4.3 Handle Promise Failures

Important asynchronous operations should have appropriate error handling where failure requires special treatment.

Avoid silently ignoring rejected promises.

---

# 5. Playwright Best Practices

## 5.1 Prefer Stable Locators

Prefer:

```javascript
page.getByRole()
page.getByLabel()
page.getByText()
page.getByTestId()
```

when appropriate.

Avoid fragile selectors such as:

```javascript
page.locator("div:nth-child(4) > span > button")
```

unless there is a justified reason.

---

## 5.2 Avoid XPath When a Better Locator Exists

XPath is not automatically a defect.

Report it when:

- It is unnecessarily complex.
- A stable Playwright locator is clearly available.
- It makes the test fragile.

---

## 5.3 Avoid Hard Waits

Avoid:

```javascript
await page.waitForTimeout(5000);
```

when a deterministic synchronization mechanism is available.

Prefer:

```javascript
await expect(page.getByText("Dashboard")).toBeVisible();
```

or an appropriate locator/navigation/API wait.

Hard waits may create:

- Slow tests.
- Flaky tests.
- Unnecessary delays.

---

## 5.4 Prefer Auto-Waiting

Use Playwright's built-in waiting behavior where possible.

Avoid unnecessary explicit waits when the locator/action already provides reliable synchronization.

---

## 5.5 Assertions Must Validate Outcomes

A test should verify the expected behavior.

Bad:

```javascript
await page.getByRole("button", { name: "Submit" }).click();
```

without validating the expected result.

Preferred:

```javascript
await page.getByRole("button", { name: "Submit" }).click();
await expect(page.getByText("Order created")).toBeVisible();
```

---

## 5.6 Avoid Overly Broad Assertions

Assertions should be specific enough to prove the intended behavior.

Avoid validating an entire page when only one business outcome matters.

---

## 5.7 Avoid Test Interdependence

Tests should be independently executable where practical.

Avoid:

```text
Test 1 creates data
    |
Test 2 depends on Test 1
    |
Test 3 depends on Test 2
```

Prefer isolated setup/fixtures.

---

## 5.8 Use Fixtures for Shared Setup

Use Playwright fixtures or reusable helpers for common setup rather than duplicating setup code across many tests.

---

## 5.9 Avoid Unnecessary Browser Context Reuse

Tests should have appropriate isolation.

Do not share mutable browser state across tests unless there is a deliberate and documented reason.

---

## 5.10 Avoid Excessive Retries

Retries should not be used to hide flaky tests.

If retries are configured, the underlying cause of flakiness should be investigated.

---

# 6. API Testing Best Practices

## 6.1 Validate HTTP Status

API tests should validate expected status codes.

Example:

```javascript
expect(response.status()).toBe(200);
```

---

## 6.2 Validate Response Body

Do not only validate the status code when the response body contains important business information.

Validate relevant fields.

---

## 6.3 Validate Error Responses

Negative scenarios should verify:

- Expected status.
- Error structure.
- Error message where appropriate.
- Business error code where applicable.

---

## 6.4 Avoid Hard-Coded Dynamic Data

Avoid hard-coding values that change between environments or executions.

Use:

- Configuration.
- Test data builders.
- Fixtures.
- Environment variables.
- Controlled test data.

---

## 6.5 Validate Request Payloads

API tests should ensure required request fields are present and correctly formed.

---

# 7. Test Data Best Practices

## 7.1 Avoid Production Sensitive Data

Never commit:

- Production passwords.
- Access tokens.
- API keys.
- Personal sensitive information.
- Real customer credentials.

---

## 7.2 Use Controlled Test Data

Prefer:

- Test fixtures.
- Generated data.
- Data builders.
- Environment-specific configuration.

---

## 7.3 Avoid Test Data Dependencies

Tests should not depend unnecessarily on data created by another test.

---

# 8. Security Best Practices

## 8.1 Never Hard-Code Secrets

Never commit:

```javascript
const password = "MyPassword123";
const apiKey = "secret-key";
```

Use secure configuration.

---

## 8.2 Never Log Secrets

Do not log:

- Passwords.
- API keys.
- Access tokens.
- Authorization headers.
- Session tokens.

---

## 8.3 Avoid Sensitive Data in Screenshots and Reports

Test artifacts should not unnecessarily expose:

- Passwords.
- Tokens.
- Personal data.
- Confidential business information.

---

## 8.4 Validate External Input

Do not trust external data blindly.

Validate:

- API responses.
- Environment variables.
- User-controlled values.
- File inputs.

---

## 8.5 Avoid Unsafe Dynamic Execution

Flag unnecessary use of:

```javascript
eval()
```

or equivalent dynamic code execution.

---

# 9. Error Handling

## 9.1 Do Not Swallow Errors

Avoid:

```javascript
try {
    await operation();
} catch (error) {
}
```

unless intentionally justified.

---

## 9.2 Preserve Useful Error Information

Errors should provide enough context to diagnose failures.

Avoid replacing useful errors with generic messages.

---

## 9.3 Fail Clearly

Automation should fail when an important expected condition is not met.

Do not convert a real failure into a successful test result simply to keep the pipeline green.

---

# 10. Logging

Logs should help diagnose failures without exposing secrets.

Good:

```text
Login API failed with status 401 for test user.
```

Bad:

```text
Login failed for user=john password=MyPassword123 token=abc...
```

---

# 11. Configuration Management

## 11.1 Avoid Environment-Specific Hard Coding

Avoid:

```javascript
const baseUrl = "https://production.example.com";
```

when the same test must run in multiple environments.

Prefer configuration:

```text
BASE_URL
```

or an environment configuration mechanism.

---

## 11.2 Keep Configuration Separate

Separate:

```text
Code
Test data
Environment configuration
Secrets
```

Do not mix credentials into source code.

---

# 12. Maintainability

## 12.1 Prefer Reusable Components

For automation projects, consider:

- Page Objects.
- API clients.
- Fixtures.
- Utility functions.
- Test data builders.

Use abstractions when they reduce duplication and improve clarity.

---

## 12.2 Avoid Over-Engineering

Do not create abstractions merely to make the code look architectural.

Flag complexity when it does not provide meaningful value.

---

## 12.3 Keep Tests Readable

A test should make the business scenario understandable.

Prefer:

```text
Arrange
Act
Assert
```

or:

```text
Given
When
Then
```

where appropriate.

---

# 13. Performance Best Practices

Review for meaningful performance problems such as:

- Unnecessary repeated API calls.
- Repeated expensive browser operations.
- Unnecessary page reloads.
- Serial execution where safe parallelization is possible.
- Excessive waits.
- Processing large data sets inefficiently.

Do not report theoretical micro-optimizations unless they have a meaningful impact.

---

# 14. Git and Pull Request Best Practices

## 14.1 Small Focused PRs

Prefer Pull Requests that represent a focused change.

## 14.2 Meaningful Commit Messages

Commit messages should describe the change clearly.

## 14.3 Do Not Commit Generated or Sensitive Files

Avoid committing:

```text
.env
credentials
API keys
large temporary files
unnecessary generated artifacts
```

unless explicitly required.

## 14.4 Review Workflow Changes Carefully

Changes to:

```text
.github/workflows/
```

should receive additional scrutiny because workflow changes can affect CI/CD behavior and security.

---

# 15. Test Reliability

The reviewer should identify potential flaky-test causes:

- Hard waits.
- Unstable selectors.
- Race conditions.
- Shared mutable state.
- Test ordering dependencies.
- Uncontrolled external dependencies.
- Excessive retries.
- Random data without controlled cleanup.

The goal is to prevent a test suite from becoming unreliable.

---

# 16. Test Isolation

Tests should be isolated wherever practical.

Avoid:

```text
Test A creates state
       |
       v
Test B requires state from A
```

Prefer:

```text
Test A -> independent setup
Test B -> independent setup
Test C -> independent setup
```

This improves parallel execution and failure diagnosis.

---

# 17. Assertions and Validation

Assertions should verify the business outcome rather than implementation details where possible.

Prefer:

```text
User sees successful payment confirmation
```

over unnecessarily checking internal implementation details that can change without changing behavior.

---

# 18. Code Complexity

Review for unnecessarily complex:

- Conditions.
- Loops.
- Functions.
- Nested logic.
- Boolean expressions.

Prefer simpler logic when it improves readability without changing behavior.

Do not flag complexity merely because an alternative implementation exists.

---

# 19. Documentation

Documentation should be added when behavior is:

- Non-obvious.
- Business-critical.
- Operationally important.
- Dependent on a special workaround.

Avoid documenting obvious code line-by-line.

---

# 20. Dependency Management

Review dependency changes for:

- Unnecessary packages.
- Duplicate libraries.
- Deprecated packages where known.
- Unexpected major-version upgrades.
- Security implications.

Do not claim a dependency is vulnerable unless there is reliable evidence.

---

# 21. AI Review Behavior

The AI reviewer must:

1. Focus primarily on changed code.
2. Avoid unrelated repository-wide criticism.
3. Avoid duplicate findings.
4. Avoid subjective style comments unless the project explicitly defines the style as mandatory.
5. Treat mandatory project rules as actionable violations.
6. Distinguish LOW-severity style/standard violations from functional defects.
7. Provide exact locations where possible.
8. Explain the impact.
9. Suggest a concrete fix.
10. Do not invent test failures or runtime behavior that cannot be inferred from the code.

---

# 22. Mandatory vs Recommended Rules

The review policy should distinguish:

### Mandatory

A violation should be reported.

Examples:

```text
Variables must use camelCase.
Function names must use camelCase.
Classes must use PascalCase.
Secrets must never be hard-coded.
Playwright tests must not use arbitrary hard waits unless justified.
```

### Recommended

The AI should report only when there is meaningful engineering impact.

Examples:

```text
Prefer smaller functions.
Prefer reusable helpers.
Consider parallelizing independent operations.
Consider simplifying complex conditions.
```

This distinction is important because otherwise the AI may generate excessive low-value findings.

---

# 23. Severity Guidance

Use the following general model.

## CRITICAL

A severe issue that could cause:

- Major security exposure.
- Severe data loss/corruption.
- Critical production failure.
- Credential compromise.
- Dangerous CI/CD behavior.

## HIGH

A significant defect likely to cause:

- Incorrect application behavior.
- Significant test instability.
- Major security weakness.
- Important production failure.

## MEDIUM

A meaningful issue that:

- Creates maintainability risk.
- Can cause failures in realistic scenarios.
- Creates moderate reliability/performance problems.
- Violates an important project standard.

## LOW

A lower-impact issue such as:

- Naming-standard violation.
- Minor maintainability concern.
- Small readability issue.
- Minor consistency problem.

Do not assign HIGH or CRITICAL merely because a rule is violated. Severity must reflect impact.

---

# 24. Example Naming Review

Given:

```javascript
const customer_name = "John";

function get_customer_details() {
    return customer_name;
}
```

The AI should identify:

```text
Severity: LOW

Problem:
Variable `customer_name` and function `get_customer_details` do not follow the mandatory camelCase naming convention.

Recommended fix:
Rename them to `customerName` and `getCustomerDetails`.
```

---

# 25. Example Playwright Review

Given:

```javascript
await page.waitForTimeout(5000);
await page.locator("div:nth-child(4) > button").click();
```

Potential findings:

```text
Severity: MEDIUM

Problem:
The test uses an arbitrary five-second hard wait and a fragile CSS selector.

Why it matters:
The test may become slow or flaky when application timing or DOM structure changes.

Recommended fix:
Use a stable Playwright locator and synchronize on the expected application state.
```

The AI should not report two duplicate findings if they are part of the same underlying reliability problem unless separate fixes are required.

---

# 26. Example Security Review

Given:

```javascript
const apiKey = "123456789";
```

Report:

```text
Severity: CRITICAL or HIGH depending on context

Problem:
A credential is hard-coded in source code.

Why it matters:
The credential can be exposed through source control and may allow unauthorized access.

Recommended fix:
Move the credential to secure secret management such as GitHub Actions Secrets or the approved environment configuration.
```

Severity should reflect the actual impact and context.

---

# 27. What the AI Should NOT Do

The reviewer should not:

- Complain about every stylistic difference.
- Report unchanged legacy code unless it directly affects the changed code.
- Invent vulnerabilities.
- Invent test failures.
- Treat every naming difference as HIGH severity.
- Recommend unnecessary rewrites.
- Duplicate the same finding several times.
- Fail a PR merely because the code could be written differently.
- Expose credentials in the review output.

---

# 28. Recommended Review Output

Each actionable finding should contain:

```text
Severity:
File:
Line:
Problem:
Why it matters:
Recommended fix:
```

Then provide:

```text
Recommendation:
APPROVE
```

or:

```text
Recommendation:
CHANGES REQUESTED
```

---

# 29. Final Review Principle

The AI should follow this hierarchy:

```text
1. Correctness
2. Security
3. Reliability
4. Test validity
5. Maintainability
6. Performance
7. Project coding standards
8. Readability/style
```

A functional or security defect is more important than a naming preference.

The reviewer must prioritize impact rather than the number of rules violated.

---

# 30. Core Principle for This Project

> AI generates observations. Application code validates the result and owns the final CI/CD decision.

The review policy defines what the AI should inspect.

The GitHub Actions workflow defines when and how the review runs.

The Node.js/provider layer communicates with the AI provider.

The quality gate makes the deterministic PASS/FAIL decision.
