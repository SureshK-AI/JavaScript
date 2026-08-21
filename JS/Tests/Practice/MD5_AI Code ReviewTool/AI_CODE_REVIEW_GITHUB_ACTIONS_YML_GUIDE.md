# AI Code Review — GitHub Actions `.yml` Interview Guide

## 1. Purpose

`.github/workflows/code-review.yml` is the orchestration file for the automated AI Pull Request review.

It defines:

- When the workflow runs.
- Required permissions.
- Runner/environment.
- Repository checkout.
- PR metadata.
- Diff generation.
- Review-rule loading.
- Secret injection.
- Node.js review execution.
- Result publishing.
- Quality-gate enforcement.

Key distinction:

> The YAML defines WHEN and HOW the review process runs.

## 2. Location

```text
.github/workflows/code-review.yml
```

GitHub recognizes workflow files under `.github/workflows/`.

## 3. Logical Structure

```text
code-review.yml
│
├── Workflow name
├── Trigger
│   └── pull_request
│       ├── opened
│       ├── synchronize
│       └── reopened
├── Permissions
└── Jobs
    └── code-review
        ├── Runner
        ├── Checkout
        ├── Node.js setup
        ├── Dependencies
        ├── CODE_REVIEW.md
        ├── PR metadata
        ├── BASE_SHA / HEAD_SHA
        ├── Git diff
        ├── Gemini API
        ├── Review processing
        ├── PR comment
        ├── HTML report
        ├── Email
        └── Quality gate
```

## 4. Workflow Name

Conceptually:

```yaml
name: AI Code Review
```

It identifies the automation in the GitHub Actions interface.

## 5. Pull Request Trigger

The current lifecycle uses:

```text
pull_request:
  opened
  synchronize
  reopened
```

Meaning:

- `opened` — run when a new PR is created.
- `synchronize` — run when new commits are pushed to an existing PR.
- `reopened` — run when a closed PR is reopened.

`Synchronize` is especially important because a developer's fixes automatically trigger another review.

## 6. Permissions

The workflow may need permissions for:

- Reading repository contents.
- Accessing PR information.
- Publishing PR comments.
- Producing workflow outputs.

Also check repository Actions permissions and branch protection when troubleshooting.

Interview answer:

> Permissions control what the workflow can access or modify and should follow least-privilege principles.

## 7. Runner and Job

Conceptually:

```yaml
jobs:
  code-review:
    runs-on: ubuntu-latest
```

The runner provides the environment for Git, Node.js, shell commands, review execution, and report generation.

## 8. Checkout

Conceptually:

```yaml
- uses: actions/checkout@v...
```

Purpose:

```text
GitHub repository
       |
       v
Actions runner
       |
       v
Source code + Git history
```

The supplied workflow uses full history because the review needs deterministic base/head comparisons.

## 9. Node.js Setup

The workflow prepares the JavaScript runtime, conceptually using the Node setup action.

Then the review implementation can run:

```text
Node.js
   |
   v
Review application
```

## 10. Dependency Installation

If the review implementation has Node.js dependencies, the workflow installs them, typically from `package.json`.

Conceptually:

```text
package.json
    |
    v
npm ci / npm install
    |
    v
node_modules
```

## 11. Read `CODE_REVIEW.md`

The workflow reads:

```text
CODE_REVIEW.md
```

from the PR base commit.

Relationship:

```text
Workflow YAML
      |
      v
CODE_REVIEW.md
      |
      v
Review instructions
      |
      v
AI prompt
```

The review policy and workflow itself are excluded from the application diff.

## 12. PR Metadata

The workflow obtains PR information such as:

- PR number.
- Base branch.
- Head branch.
- Base SHA.
- Head SHA.
- Repository information.

This metadata is needed to calculate the correct diff and publish the review to the correct PR.

## 13. BASE_SHA and HEAD_SHA

The workflow establishes:

```text
BASE_SHA
HEAD_SHA
```

Conceptually:

```text
BASE_SHA
   |
   | git diff
   v
HEAD_SHA
```

Interview answer:

> BASE_SHA and HEAD_SHA make the PR diff deterministic and prevent unrelated repository content from becoming the primary review input.

## 14. Git Diff

The workflow generates the changed code, conceptually:

```text
git diff BASE_SHA HEAD_SHA
```

It intentionally excludes:

```text
CODE_REVIEW.md
.github/workflows/code-review.yml
```

because these are review configuration/automation files.

## 15. Diff Size

The current implementation limits diff size before sending it to the model.

Reason:

- Provider context/token limits.
- Avoid oversized requests.
- Reduce unnecessary processing.

Production improvement:

```text
Large diff
   |
   +--> classify files
   +--> logical chunks
   +--> provider calls
   +--> merge findings
```

## 16. Gemini Secret

The workflow supplies:

```text
GEMINI_API_KEY
```

to the required runtime step.

The secret is stored at:

```text
Repository
 -> Settings
 -> Secrets and variables
 -> Actions
```

Runtime flow:

```text
GitHub Secret
      |
      v
Actions environment
      |
      v
Node.js
      |
      v
Gemini API
```

The actual credential is never hard-coded in source.

## 17. Gemini Model and API

Current configured model:

```text
gemini-3.6-flash
```

Current API flow:

```text
Node.js
   |
   +--> GEMINI_API_KEY
   +--> model
   +--> review prompt
   +--> PR diff
   |
   v
Gemini generateContent
   |
   v
Review response
```

The current implementation uses the Gemini `generateContent` endpoint and API-key authentication.

## 18. Review Processing

Gemini returns the review content.

The current implementation processes the natural-language response and calculates:

```text
CRITICAL
HIGH
MEDIUM
LOW
```

Then:

```text
totalIssues > 0
    -> CHANGES REQUESTED

totalIssues == 0
    -> APPROVE
```

## 19. PR Comment

The workflow publishes the processed review back to the Pull Request.

Purpose:

- Immediate developer feedback.
- Findings visible in the normal PR workflow.

The PR comment should not independently determine the quality-gate decision.

## 20. HTML Report

The workflow generates an HTML report from the review.

Target design:

```text
ReviewResult
     |
     v
HTML Generator
     |
     v
HTML Report
```

## 21. Email

The workflow can generate an email report.

SMTP credentials must also be stored as GitHub Actions Secrets.

Target flow:

```text
Validated ReviewResult
       |
       v
Email Generator
       |
       v
SMTP
       |
       v
Recipient
```

The email should consume the validated result rather than independently parsing raw AI text.

## 22. Quality Gate

The final workflow decision is:

```text
APPROVE
    -> PASS

CHANGES REQUESTED
    -> FAIL

Invalid / missing
    -> FAIL
```

This is fail-closed behavior.

The quality gate should consume a validated recommendation rather than searching the complete natural-language review.

## 23. Failure Handling

### Missing API key

```text
Missing secret
    |
    v
Authentication failure
    |
    v
Workflow FAIL
```

### Gemini HTTP error

```text
Provider error
    |
    v
Review step fails
    |
    v
Workflow FAIL
```

### No AI response

```text
No review content
    |
    v
Invalid response
    |
    v
Workflow FAIL
```

### Invalid recommendation

```text
Missing / malformed recommendation
    |
    v
Quality Gate
    |
    v
FAIL
```

## 24. Complete Execution Sequence

```text
1. PR created/updated
2. GitHub generates event
3. GitHub Actions starts
4. Runner allocated
5. Repository checked out
6. Node.js environment prepared
7. Dependencies installed
8. CODE_REVIEW.md read
9. PR metadata obtained
10. BASE_SHA / HEAD_SHA identified
11. git diff generated
12. Review configuration files excluded
13. GEMINI_API_KEY supplied securely
14. Review prompt constructed
15. Gemini API called
16. Gemini analyzes changed code
17. Response returned
18. Node.js processes findings
19. Recommendation calculated
20. PR review/comment published
21. HTML report generated
22. Email generated where configured
23. Quality gate evaluates result
24. Workflow PASS or FAIL
```

## 25. What Each Component Does

| Component | Responsibility |
|---|---|
| Developer | Creates/updates PR |
| GitHub PR | Stores PR metadata and changes |
| GitHub Actions | Orchestrates automation |
| Checkout | Gets repository source/history |
| Node.js setup | Provides JavaScript runtime |
| Dependency step | Installs required packages |
| `CODE_REVIEW.md` | Defines review policy |
| Git metadata | Provides BASE_SHA/HEAD_SHA |
| Git diff | Identifies changed code |
| Gemini | Performs AI code analysis |
| Node.js review logic | Calls AI and processes response |
| PR publisher | Shows findings in GitHub |
| HTML generator | Creates report |
| Email | Sends report |
| Quality gate | Makes CI PASS/FAIL decision |

## 26. `CODE_REVIEW.md` vs `.yml`

This is a key interview question.

### `CODE_REVIEW.md`

Answers:

> **What should the AI review?**

Contains:

- Reviewer role.
- Review scope.
- Review categories.
- Severity definitions.
- Finding format.
- Recommendation rules.

### `.github/workflows/code-review.yml`

Answers:

> **When and how should the automation run?**

Contains:

- Pull Request triggers.
- Permissions.
- Runner.
- Checkout.
- Runtime setup.
- Dependencies.
- Review-rule loading.
- PR metadata.
- Diff preparation.
- Secret injection.
- AI execution.
- Reporting.
- Quality gate.

Simple memory aid:

```text
CODE_REVIEW.md
    = WHAT to review

code-review.yml
    = WHEN + HOW to run it
```

## 27. Interview Questions

### What is the `.yml` file?

> It is the GitHub Actions workflow definition. It orchestrates the complete AI review process from Pull Request trigger through checkout, diff preparation, Gemini execution, reporting, and quality gating.

### Where is the workflow stored?

> `.github/workflows/code-review.yml`.

### What triggers it?

> `pull_request` events: `opened`, `synchronize`, and `reopened`.

### Why `synchronize`?

> It reruns the review when the developer pushes new commits to the existing Pull Request.

### What does checkout do?

> It makes the repository source and history available on the Actions runner.

### Where does the API key come from?

> GitHub Actions Secrets, using `GEMINI_API_KEY`.

### Does the YAML contain the actual API key?

> No. It references the secret; the credential value remains stored securely in GitHub.

### How does it identify changed code?

> It calculates the diff between BASE_SHA and HEAD_SHA.

### What happens after the diff is created?

> Node.js combines the diff and review rules into the AI request and calls Gemini.

### What happens if Gemini fails?

> The provider step fails and the workflow fails closed rather than silently passing the Pull Request.

### Why not put all logic directly in YAML?

> YAML is the orchestration layer. Complex API interaction and review processing are better handled by Node.js.

### What is the biggest design principle?

> GitHub Actions orchestrates, the AI performs reasoning, and deterministic application code owns the final CI decision.

## 28. 60-Second Interview Explanation

> The `.github/workflows/code-review.yml` file is the orchestration layer of my AI code-review utility. It is triggered by Pull Request events such as opened, synchronize, and reopened. GitHub Actions checks out the repository, prepares the Node.js environment, reads `CODE_REVIEW.md`, obtains the PR metadata and BASE_SHA/HEAD_SHA, and generates the changed-code diff. The workflow supplies the `GEMINI_API_KEY` securely from GitHub Actions Secrets to the Node.js review process. Node.js builds the prompt and calls Gemini. The response is processed into findings and an `APPROVE` or `CHANGES REQUESTED` recommendation. The workflow publishes the review, generates reporting outputs, and finally applies the quality gate. So YAML is responsible for orchestration, Node.js handles provider/API logic, and application code owns the deterministic PASS/FAIL decision.

## 29. Final Mental Model

```text
TRIGGER
   ↓
CHECKOUT
   ↓
PREPARE
   ↓
READ RULES
   ↓
BUILD DIFF
   ↓
SUPPLY SECRET
   ↓
CALL AI
   ↓
PROCESS RESULT
   ↓
PUBLISH
   ↓
QUALITY GATE
   ↓
PASS / FAIL
```

And:

```text
CODE_REVIEW.md
        |
        v
"What should the AI look for?"

code-review.yml
        |
        v
"When and how should the automation execute?"

Node.js
        |
        v
"How do we call and process the AI provider?"

Quality Gate
        |
        v
"Should CI pass or fail?"
```
