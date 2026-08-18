# Code Review Guidelines

## General Code Quality

Review all changed code for:

- Correctness
- Readability
- Maintainability
- Reusability
- Error handling
- Security
- Performance

## JavaScript

Check:

- Use `const` and `let` appropriately.
- Avoid unnecessary `var`.
- Use meaningful variable and function names.
- Avoid duplicate code.
- Handle errors properly.
- Avoid unnecessary console statements.
- Follow modern JavaScript practices.

## Playwright

Check:

- Prefer stable locators.
- Avoid unnecessary hard waits such as `page.waitForTimeout()`.
- Use proper assertions.
- Follow Page Object Model where appropriate.
- Avoid duplicated test code.
- Keep test data maintainable.
- Ensure tests are independent.
- Check proper error handling.

## API Testing

Check:

- Status codes.
- Response body.
- Headers where applicable.
- Authentication.
- Error responses.
- Timeout handling.
- Test data.

## Review Severity

Classify issues as:

- CRITICAL
- HIGH
- MEDIUM
- LOW

## Review Output

For each issue report:

1. Severity
2. File
3. Line
4. Problem
5. Why it matters
6. Recommended fix

At the end provide:

### Summary

Critical:
High:
Medium:
Low:

### Final Recommendation

APPROVE

or

CHANGES REQUESTED