# OpenAI AI Code Review

## Purpose

This document describes how OpenAI can be added as an AI provider to the GitHub Pull Request code-review framework.

The existing implementation is provider-oriented in concept: GitHub Actions prepares the review rules and PR diff, sends a prompt to an LLM, receives a review, calculates a controlled recommendation, publishes the review, and enforces a quality gate.

## Current project baseline

The current workflow is implemented around Gemini. It:

1. Runs on `pull_request` events: `opened`, `synchronize`, and `reopened`.
2. Checks out the repository with full history.
3. Reads `CODE_REVIEW.md` from the PR base commit.
4. Creates a PR diff while excluding the review rules and the workflow itself.
5. Sends the review rules and diff to Gemini.
6. Produces a detailed review.
7. Calculates severity counts.
8. Produces `APPROVE` or `CHANGES REQUESTED`.
9. Posts the review to the PR.
10. Generates an HTML report and email.
11. Applies the AI quality gate.

The OpenAI implementation should preserve this lifecycle and replace only the provider-specific model invocation.

## Recommended provider abstraction

Use a provider interface conceptually equivalent to:

```text
reviewProvider.review({
  reviewRules,
  diff,
  model
}) -> {
  reviewText,
  provider,
  model
}
```

The rest of the pipeline should not know whether the provider is OpenAI or Gemini.

A practical provider configuration is:

```text
AI_PROVIDER=openai
AI_MODEL=<approved OpenAI model>
OPENAI_API_KEY=<GitHub Actions secret>
```

For Gemini:

```text
AI_PROVIDER=gemini
AI_MODEL=<approved Gemini model>
GEMINI_API_KEY=<GitHub Actions secret>
```

## OpenAI API

OpenAI's current developer documentation recommends the Responses API for direct model requests. The JavaScript SDK uses `client.responses.create(...)` and exposes generated text through `response.output_text`. citeturn1search0turn1search3

A provider implementation can therefore follow this conceptual flow:

```text
GitHub Actions
   |
   v
Node.js provider
   |
   +-- OPENAI_API_KEY
   |
   v
OpenAI Responses API
   |
   v
review text
```

The API key must remain server-side and should be supplied through an environment variable or secret store, not embedded in source code. citeturn1search1

## Prompt design

The provider should receive exactly the same logical prompt used by Gemini:

- repository review rules
- PR diff
- review scope
- severity definitions
- required issue fields
- recommendation rules

This is important because provider comparison should measure model behavior rather than different instructions.

## Structured output recommendation

For a production multi-provider design, the review decision should not depend on parsing natural-language output.

The preferred contract is:

```json
{
  "issues": [
    {
      "severity": "HIGH",
      "file": "src/example.js",
      "line": 42,
      "problem": "Description",
      "why_it_matters": "Impact",
      "recommended_fix": "Fix"
    }
  ],
  "recommendation": "CHANGES REQUESTED"
}
```

The workflow can then calculate counts from `issues` and independently enforce the recommendation.

OpenAI's current Responses API supports structured JSON-schema output for supported models. citeturn1search5

## Security

Never commit:

- `OPENAI_API_KEY`
- Gemini API keys
- Gmail app passwords
- other credentials

Use GitHub Actions Secrets.

OpenAI documentation explicitly treats API keys as secrets and recommends secure environment-variable or key-management handling. citeturn1search1

## Important data consideration

Before using OpenAI for repository code, review the applicable OpenAI API data-control settings for your organization. The Responses API has documented application-state retention behavior, so data-handling requirements should be evaluated before production deployment. citeturn1search2

## Provider-neutral result contract

The most important design rule is:

```text
LLM output
    |
    v
Provider adapter
    |
    v
Normalized ReviewResult
    |
    +--> PR comment
    +--> Email
    +--> HTML report
    +--> Quality gate
```

Only the provider adapter should understand the provider's API response format.

## Testing OpenAI

Test these cases:

1. No issues -> `APPROVE`.
2. One LOW issue -> `CHANGES REQUESTED`.
3. One HIGH issue -> `CHANGES REQUESTED`.
4. Multiple severities -> correct counts.
5. Empty provider response -> workflow failure.
6. Provider HTTP error -> workflow failure.
7. Malformed structured output -> workflow failure.
8. Missing API key -> workflow failure.
9. Very large diff -> deterministic truncation or chunking.
10. Secrets never appear in logs.

## Implementation status

This document describes the OpenAI provider architecture. It does not claim that an OpenAI provider is already installed in the current workflow. The current supplied workflow is Gemini-based.
