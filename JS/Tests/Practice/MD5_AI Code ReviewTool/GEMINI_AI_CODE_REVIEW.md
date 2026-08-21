# Gemini AI Code Review

## Purpose

This document describes the Gemini implementation in the supplied GitHub Actions workflow and how it fits into the common AI review framework.

## Current implementation

The workflow uses:

```text
GEMINI_API_KEY
gemini-3.6-flash
```

The current workflow calls:

```text
https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent
```

with the API key supplied in the `x-goog-api-key` header.

Google's documentation confirms the `generateContent` endpoint and the `x-goog-api-key` authentication pattern. citeturn0search0turn0search1

## Review input

The workflow reads:

```text
CODE_REVIEW.md
```

from the PR base commit and creates a diff between:

```text
BASE_SHA
HEAD_SHA
```

The workflow excludes:

```text
CODE_REVIEW.md
.github/workflows/code-review.yml
```

from the PR diff.

This keeps the review focused on application changes rather than the review instructions or workflow itself.

## Prompt

The prompt contains:

1. Senior software engineer role.
2. Repository review rules.
3. Pull Request diff.
4. Explicit instruction to review only changed code.
5. Correctness and bug checks.
6. JavaScript quality.
7. Playwright reliability.
8. Async/await handling.
9. Locator stability.
10. Assertions.
11. API testing.
12. Error handling.
13. Security.
14. Secrets.
15. Duplicate code.
16. Maintainability.
17. Performance.
18. Flaky-test risk.

The model is instructed to report:

- Severity
- File
- Line
- Problem
- Why it matters
- Recommended fix

Severity levels are:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

## Gemini API flow

The current implementation is:

```text
GitHub PR
   |
   v
GitHub Actions
   |
   +--> CODE_REVIEW.md
   |
   +--> git diff
   |
   v
Node.js
   |
   v
Gemini generateContent
   |
   v
Gemini review text
```

Google's current documentation also provides JavaScript examples using the Google GenAI SDK and supports structured JSON output. citeturn0search0turn0search5

## Current model configuration

The supplied workflow contains:

```javascript
const model = "gemini-3.6-flash";
```

This document intentionally records the model configured in the supplied workflow. Model availability and recommended API versions can change; verify the model against Google's current model documentation before production rollout.

Google currently recommends newer Gemini API patterns for new projects, while documenting the legacy `generateContent` API used by the current implementation. citeturn0search1

## Current result calculation

The workflow receives Gemini's natural-language review and then Node.js calculates:

```text
Critical
High
Medium
Low
```

It determines:

```text
totalIssues > 0
    -> CHANGES REQUESTED

totalIssues == 0
    -> APPROVE
```

This is a useful design principle because the final recommendation is not supposed to depend on Gemini remembering to write the exact machine-readable block.

## Current weakness

The supplied implementation has multiple parsing points:

```text
Gemini review
     |
     +--> severity parser
     |
     +--> review.txt
            |
            +--> email parser
            |
            +--> shell quality-gate parser
```

This creates avoidable failure modes.

The target architecture should instead produce one normalized result:

```text
Gemini
  |
  v
Provider adapter
  |
  v
Normalized ReviewResult
  |
  +--> review.txt
  +--> GitHub output
  +--> email
  +--> quality gate
```

## Security

Google documents API keys as credentials for Gemini API access and is transitioning toward authorization keys with stronger controls. Current Google documentation states that unrestricted standard keys are rejected and advises migration before September 2026. citeturn0search3

Therefore:

- Keep `GEMINI_API_KEY` in GitHub Secrets.
- Do not print it.
- Restrict the key according to Google's current guidance.
- Review key status before production use.

## Failure handling

The current Node.js implementation fails when:

- `GEMINI_API_KEY` is missing.
- Gemini returns a non-success HTTP response.
- Gemini returns no review text.

Those are correct fail-closed behaviors.

The quality gate should also fail closed if the normalized recommendation is missing or invalid.

## Recommended future improvement

Use structured output rather than natural-language severity parsing.

Preferred normalized object:

```json
{
  "issues": [],
  "recommendation": "APPROVE"
}
```

This removes the need to count text patterns such as:

```text
Severity: HIGH
```

and makes Gemini and OpenAI interchangeable.
