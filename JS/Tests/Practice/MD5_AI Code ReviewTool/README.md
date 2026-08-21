# AI Code Review Documentation

This folder contains the documentation for the multi-provider GitHub AI code-review framework.

## Documents

- `OPENAI_AI_CODE_REVIEW.md` — OpenAI provider design and API integration.
- `GEMINI_AI_CODE_REVIEW.md` — Current Gemini implementation.
- `AI_CODE_REVIEW_ARCHITECTURE.md` — Provider-neutral architecture and PR lifecycle.
- `AI_CODE_REVIEW_INTERVIEW_QA.md` — Interview questions and model answers.
- `AI_CODE_REVIEW_TROUBLESHOOTING.md` — Failure modes and troubleshooting guidance.

## Current state

The supplied GitHub Actions workflow is Gemini-based.

The OpenAI document describes the provider integration target; it does not claim that OpenAI is already wired into the current workflow.

## Target architecture

```text
                 +-- OpenAI
                 |
GitHub PR -------+-- Gemini
                 |
                 +-- Other LLM
                       |
                       v
                Normalized Result
                       |
             +---------+---------+
             |         |         |
             v         v         v
            PR       Email      Gate
```

## Key principle
    
“I implemented an AI-based code review quality gate using GitHub Actions and Gemini. The Gemini API key was configured as a GitHub Actions repository secret rather than being stored in the source code. The GitHub Actions workflow is triggered during the Pull Request process, retrieves the changed code, sends it to the Gemini model for review, captures the AI recommendation, and then applies a quality gate. If the response indicates CHANGES REQUESTED, the workflow exits with a non-zero status and prevents the quality gate from passing. If the review is approved, the pipeline continues.”

"We didn't hard-code every coding rule into the AI prompt or the GitHub Actions YAML. We separated our review policy into CODE_REVIEW.md. This allows the team to change coding standards independently of the CI workflow. For example, if our project requires camelCase for variables, functions, and script names, we add that rule to CODE_REVIEW.md. GitHub Actions reads the file and supplies those rules along with the PR diff to the AI reviewer."