# AI Code Review Troubleshooting

## 1. Workflow does not start

Check:

- workflow file location
- `pull_request` event
- branch protection rules
- repository Actions permissions

The supplied workflow listens for:

```text
opened
synchronize
reopened
```

## 2. CODE_REVIEW.md cannot be read

The workflow reads the file from the Pull Request base SHA.

Check that:

```text
CODE_REVIEW.md
```

exists in the base commit.

## 3. PR diff is empty

Check:

```text
BASE_SHA
HEAD_SHA
```

and inspect the generated diff.

The workflow intentionally excludes the review rules file and the review workflow itself.

## 4. Gemini authentication failure

Check the GitHub Actions secret:

```text
GEMINI_API_KEY
```

Do not print the secret to the logs.

Also verify the current Gemini API key type and restrictions. Google is transitioning away from unrestricted standard keys and documents an authorization-key model. citeturn0search3

## 5. Gemini model error

Check the configured model identifier:

```javascript
const model = "gemini-3.6-flash";
```

Model availability changes over time. Verify the identifier against current Google documentation before changing unrelated workflow code.

## 6. Gemini returns no review

The current implementation checks the returned candidate content and throws an error when no review text is present.

Check:

- API response
- model availability
- request size
- safety/blocking response
- API quota

## 7. Severity counts are zero unexpectedly

The current implementation counts occurrences of patterns equivalent to:

```text
Severity: CRITICAL
Severity: HIGH
Severity: MEDIUM
Severity: LOW
```

If Gemini uses different formatting, the count parser may not recognize the finding.

### Recommended long-term fix

Do not expand the regex indefinitely.

Move to structured output:

```json
{
  "issues": [
    {
      "severity": "HIGH",
      "file": "src/test.js",
      "line": 10,
      "problem": "Example",
      "why_it_matters": "Example",
      "recommended_fix": "Example"
    }
  ],
  "recommendation": "CHANGES REQUESTED"
}
```

## 8. Recommendation is empty

This is a parser/control-plane problem, not necessarily an AI-review problem.

The correct debugging order is:

```text
1. Did provider return?
2. Did provider adapter normalize it?
3. Was normalized result written?
4. Did the next step receive that result?
5. Did validation accept it?
6. Did quality gate consume the validated value?
```

Do not add more `grep` or `awk` expressions before determining which boundary lost the value.

## 9. Quality gate fails even though review says APPROVE

Inspect the normalized result, not the full natural-language review.

Expected contract:

```text
APPROVE
```

or:

```text
CHANGES REQUESTED
```

Anything else should fail closed.

## 10. Quality gate passes when it should fail

This is a serious defect.

The quality gate must never use a broad search such as:

```bash
grep -q "APPROVE" review.txt
```

because the word can occur in explanatory text.

The gate should consume only the validated recommendation field.

## 11. Email report shows UNKNOWN

The current email-report step independently parses the review text to determine the recommendation.

This is another example of duplicated parsing.

### Correct architectural fix

Pass the already validated recommendation into the email-generation step.

Do not parse the AI review again.

## 12. HTML report counts differ from PR review

The same root cause applies.

There should be exactly one normalized result object:

```text
NormalizedReviewResult
```

Every output should consume that object.

## 13. PR comment succeeds but quality gate fails

This can happen if publishing and decision-making use different parsing logic.

The target architecture is:

```text
AI
 |
 v
Normalized result
 |
 +--> comment
 +--> email
 +--> report
 +--> gate
```

## 14. OpenAI provider fails

Check:

- `OPENAI_API_KEY`
- selected model
- API response status
- request size
- structured-output schema
- provider quota

OpenAI recommends keeping API keys secret and loading them from environment variables or secure key management. citeturn1search1

## 15. Large PR

The current workflow limits the diff length.

For a production implementation, prefer:

```text
large diff
   |
   +--> logical file chunks
   |
   +--> provider review
   |
   +--> finding merge
```

rather than silently dropping the remainder of the PR.

## 16. API timeout

Treat provider timeout as a review failure.

Possible improvements:

- bounded retry
- exponential backoff
- provider fallback
- clear retry count
- clear failure message

Do not retry indefinitely.

## 17. Provider outage

With multiple providers:

```text
Primary provider
      |
      X
      |
      v
Fallback provider
```

A fallback should be an explicit policy decision, not an accidental behavior.

## 18. Security incident

If an API key is exposed:

1. Revoke/rotate the key immediately.
2. Check GitHub logs and artifacts.
3. Remove the secret from source/history where applicable.
4. Review provider usage.
5. Replace the GitHub Secret.
6. Restrict the replacement key.

## 19. Debugging rule

When troubleshooting the pipeline, print safe metadata:

```text
provider
model
PR number
BASE_SHA
HEAD_SHA
diff length
review length
issue count
recommendation
```

Never print:

```text
API keys
SMTP passwords
authorization headers
```

## 20. Golden test cases

Maintain test fixtures for:

### Clean PR

```text
issues = []
recommendation = APPROVE
```

### One HIGH issue

```text
issues = [HIGH]
recommendation = CHANGES REQUESTED
```

### Mixed issues

```text
CRITICAL = 1
HIGH = 2
MEDIUM = 1
LOW = 3
recommendation = CHANGES REQUESTED
```

### Invalid response

```text
result = invalid
workflow = FAIL
```

### Provider failure

```text
API failure
workflow = FAIL
```

## 21. Final troubleshooting principle

Do not fix an LLM pipeline by repeatedly adding text parsers.

First establish a deterministic contract:

```text
Provider -> NormalizedReviewResult
```

Then make every downstream component consume that contract.
