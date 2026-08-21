# AI Code Review Architecture

## 1. Objective

Build a provider-neutral AI code-review system for GitHub Pull Requests.

The framework should support:

```text
                 +-- OpenAI
                 |
GitHub PR -------+-- Gemini
                 |
                 +-- Other LLM
```

All providers use the same:

- review rules
- PR diff
- severity model
- result schema
- publishing mechanism
- quality gate

## 2. End-to-end lifecycle

```text
Developer creates/updates PR
            |
            v
GitHub Actions
            |
            +--> Checkout repository
            |
            +--> Read CODE_REVIEW.md
            |
            +--> Calculate BASE_SHA / HEAD_SHA
            |
            +--> Generate PR diff
            |
            v
      Provider Adapter
       /            \
   OpenAI          Gemini
       \            /
        \          /
         v        v
       Normalized ReviewResult
                |
        +-------+--------+
        |       |        |
        v       v        v
      PR      Email    Quality
    Comment    HTML      Gate
```

## 3. Core components

### GitHub Actions

Responsible for:

- triggering the workflow
- checking out code
- obtaining PR metadata
- reading review rules
- preparing the diff
- supplying secrets
- publishing results
- failing or passing the workflow

### Review rules

`CODE_REVIEW.md` is the repository-level policy.

It controls what the AI reviewer should inspect.

### Provider adapter

The provider adapter is responsible only for:

- authentication
- API request
- model selection
- response extraction
- conversion to the common result format

### Result normalizer

This is the most important reliability boundary.

Every provider must produce:

```json
{
  "issues": [
    {
      "severity": "HIGH",
      "file": "file.js",
      "line": 10,
      "problem": "Problem",
      "why_it_matters": "Impact",
      "recommended_fix": "Fix"
    }
  ],
  "recommendation": "CHANGES REQUESTED"
}
```

The framework must validate:

```text
severity ∈ CRITICAL | HIGH | MEDIUM | LOW

recommendation ∈ APPROVE | CHANGES REQUESTED
```

## 4. Quality gate

The quality gate must never search the entire natural-language review for words such as:

```text
APPROVE
CHANGES REQUESTED
```

Instead it should consume the normalized recommendation.

```text
recommendation == APPROVE
        |
        v
      PASS

recommendation == CHANGES REQUESTED
        |
        v
      FAIL

anything else
        |
        v
      FAIL
```

This is fail-closed behavior.

## 5. Provider abstraction

Conceptually:

```javascript
async function runReview(provider, input) {
  switch (provider) {
    case "openai":
      return reviewWithOpenAI(input);

    case "gemini":
      return reviewWithGemini(input);

    default:
      throw new Error(`Unsupported AI provider: ${provider}`);
  }
}
```

The rest of the workflow should not care which provider was selected.

## 6. Configuration

Recommended configuration:

```text
AI_PROVIDER=openai
AI_MODEL=<provider model>
```

or:

```text
AI_PROVIDER=gemini
AI_MODEL=<provider model>
```

Secrets remain provider-specific:

```text
OPENAI_API_KEY
GEMINI_API_KEY
```

## 7. PR lifecycle

### PR opened

Run the review against the initial PR diff.

### PR synchronized

Run again when new commits are pushed.

### PR reopened

Run again when the PR is reopened.

The current workflow uses all three events.

## 8. Diff management

The supplied workflow uses full repository history and compares:

```text
BASE_SHA -> HEAD_SHA
```

It also limits the diff size before sending it to the model.

For larger repositories, the architecture should evolve to:

```text
PR diff
  |
  +--> file classification
  |
  +--> chunking
  |
  +--> provider calls
  |
  +--> merged normalized findings
```

Do not silently drop important files merely because the total diff exceeds a character limit.

## 9. Security architecture

Secrets:

```text
GitHub Secrets
      |
      v
GitHub Actions environment
      |
      v
Provider adapter
      |
      v
HTTPS API
```

Never:

- commit keys
- echo keys
- place keys in prompts
- expose keys in PR comments
- include keys in artifacts

## 10. Multiple-provider comparison

The same PR can optionally be reviewed by multiple providers:

```text
                    +-- OpenAI
                    |
PR diff ------------+-- Gemini
                    |
                    +-- Provider C
                    |
                    v
             Finding normalizer
                    |
                    v
              Comparison layer
```

Possible comparison metrics:

- number of findings
- severity distribution
- overlap between providers
- false-positive rate
- missed-defect rate
- latency
- API cost
- consistency across repeated runs

## 11. Recommended production architecture

```text
GitHub PR
   |
   v
Review Orchestrator
   |
   +--> Input Builder
   |       |
   |       +--> CODE_REVIEW.md
   |       +--> PR metadata
   |       +--> PR diff
   |
   +--> Provider Adapter
   |       |
   |       +--> OpenAI
   |       +--> Gemini
   |       +--> Other LLM
   |
   +--> Result Validator
   |
   +--> Result Store
   |
   +--> Publisher
   |       |
   |       +--> PR comment
   |       +--> HTML report
   |       +--> Email
   |
   +--> Quality Gate
```

## 12. Design principle

**AI generates observations. Application code owns the decision.**

That separation is the key reliability principle for this project.
