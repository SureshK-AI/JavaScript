# AI Code Review Interview Q&A

## 1. What problem does this project solve?

It automates Pull Request code review using an LLM while integrating the result into GitHub Actions and the Pull Request lifecycle.

## 2. Why use GitHub Actions?

It provides an event-driven CI/CD environment that can automatically review PRs when they are opened, updated, or reopened.

## 3. What is the role of CODE_REVIEW.md?

It acts as repository-level review policy. It tells the AI what to inspect and what constitutes an actionable issue.

## 4. Why use BASE_SHA and HEAD_SHA?

They provide deterministic boundaries for the Pull Request diff.

## 5. Why exclude CODE_REVIEW.md from the diff?

Because the document contains review instructions rather than application changes.

## 6. Why exclude the workflow itself?

To prevent the review from focusing on changes to the review automation rather than the application code.

## 7. Why truncate a large diff?

To avoid exceeding provider context or token limits. A production design should eventually chunk large diffs rather than simply truncating them.

## 8. What is the provider adapter?

It isolates provider-specific API calls from the rest of the review framework.

## 9. Why support multiple AI providers?

It reduces vendor lock-in and allows comparison of quality, cost, latency, and reliability.

## 10. What should be common between providers?

The review prompt, severity model, result schema, publishing flow, and quality gate.

## 11. What should be provider-specific?

API authentication, endpoint, SDK/API request format, model identifier, and response extraction.

## 12. Why should the AI not control the final CI decision?

Natural-language output is not a reliable control interface. Application code should validate the structured result and make the pass/fail decision.

## 13. What is fail-closed behavior?

If the recommendation is missing, malformed, or unsupported, the workflow fails instead of allowing the Pull Request to pass.

## 14. How are secrets protected?

Provider API keys and SMTP credentials are stored as GitHub Actions Secrets and exposed only to the steps that require them.

## 15. What happens if the Gemini API fails?

The provider call throws an error and the review step fails.

## 16. What happens if the provider returns no text?

The review implementation treats the response as invalid and fails the review step.

## 17. How should structured output improve the current implementation?

Instead of parsing natural-language text such as `Severity: HIGH`, the model returns a validated JSON object with an `issues` array and recommendation.

## 18. How would you add OpenAI?

Implement an OpenAI provider adapter that receives the same review input and returns the same normalized result.

OpenAI's current API supports the Responses API for model requests and structured JSON-schema output for supported models. citeturn1search0turn1search5

## 19. How would you add another provider?

Create another adapter implementing the same provider contract:

```text
review(input) -> NormalizedReviewResult
```

No changes should be required to the PR publishing or quality-gate logic.

## 20. How would you test the system?

Use deterministic test fixtures:

- clean PR
- LOW issue
- MEDIUM issue
- HIGH issue
- CRITICAL issue
- multiple findings
- malformed output
- empty output
- provider timeout
- authentication failure
- large diff

## 21. How do you prevent false positives?

Require actionable issues, restrict the review to changed code, provide severity definitions, and avoid manufacturing issues when no real defect exists.

## 22. How do you prevent false negatives?

Use explicit review rules, targeted prompts, structured findings, multiple-provider comparison, and regression test fixtures.

## 23. How do you measure AI reviewer quality?

Use labeled PR fixtures and calculate:

```text
Precision = correct findings / all findings
Recall = correct findings / all known issues
```

Also measure false-positive rate and false-negative rate.

## 24. What is the biggest architectural lesson?

Keep AI reasoning separate from deterministic CI/CD control.

The AI proposes findings; the application validates them and controls the build result.

## 25. How would you explain this project in an interview?

A concise answer:

> I built a GitHub Actions-based AI code-review framework that reads repository review rules and Pull Request diffs, sends them to an LLM, normalizes the findings into a deterministic result, publishes the review to GitHub and email, and enforces a CI quality gate. I designed the provider layer so Gemini can be replaced or run alongside OpenAI without changing the review lifecycle.

## 26. How does the current implementation use Gemini?

The supplied workflow directly calls Gemini's `generateContent` endpoint from Node.js and supplies `GEMINI_API_KEY` through the GitHub Actions environment. Google's documentation confirms the endpoint and API-key authentication approach. citeturn0search0turn0search1

## 27. What would you improve first?

I would replace natural-language parsing with structured provider output and create a single normalized result object consumed by the PR comment, report, email, and quality gate.

## 28. Why is that improvement important?

It eliminates multiple independent parsers and prevents small formatting differences in an LLM response from breaking CI behavior.
