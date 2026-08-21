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

**AI generates findings. Application code validates the result and owns the CI decision.**

| Configuration           | Where configured                                               | Purpose                          |
| ----------------------- | -------------------------------------------------------------- | -------------------------------- |
| `GEMINI_API_KEY`        | GitHub Repository → Settings → Secrets and variables → Actions | Secure Gemini authentication     |
| Gemini model            | GitHub Actions / Node.js workflow configuration                | Select AI model                  |
| Workflow                | `.github/workflows/code-review.yml`                            | Automate PR review               |
| Workflow trigger        | `pull_request` events                                          | Start review automatically       |
| `CODE_REVIEW.md`        | Repository root                                                | Define AI review rules           |
| `BASE_SHA` / `HEAD_SHA` | GitHub Actions runtime                                         | Identify PR changes              |
| Gemini API call         | Node.js review implementation                                  | Send code/review rules to Gemini |
| Review output           | Workflow files / runtime                                       | Capture AI response              |
| Quality gate            | GitHub Actions                                                 | Decide PASS/FAIL                 |
| PR comment              | GitHub Actions                                                 | Publish review                   |
| HTML report             | Workflow                                                       | Generate detailed report         |
| Email                   | Workflow + SMTP credentials                                    | Send review report               |


1. Developer creates/updates Pull Request
              ↓
2. GitHub detects PR event
              ↓
3. GitHub Actions workflow starts
              ↓
4. Checkout action gets repository source
              ↓
5. Workflow reads CODE_REVIEW.md
              ↓
6. Workflow identifies BASE_SHA and HEAD_SHA
              ↓
7. Git generates PR diff
              ↓
8. Node.js prepares review request
              ↓
9. GEMINI_API_KEY is supplied securely
              ↓
10. Node.js calls Gemini API
              ↓
11. Gemini analyzes changed code
              ↓
12. Review result is returned
              ↓
13. Node.js calculates findings/recommendation
              ↓
14. Review is published to PR
              ↓
15. HTML/email report is generated
              ↓
16. Quality gate evaluates recommendation
              ↓
17. PASS → pipeline continues
    FAIL → pipeline stops


    
“I implemented an AI-based code review quality gate using GitHub Actions and Gemini. The Gemini API key was configured as a GitHub Actions repository secret rather than being stored in the source code. The GitHub Actions workflow is triggered during the Pull Request process, retrieves the changed code, sends it to the Gemini model for review, captures the AI recommendation, and then applies a quality gate. If the response indicates CHANGES REQUESTED, the workflow exits with a non-zero status and prevents the quality gate from passing. If the review is approved, the pipeline continues.”