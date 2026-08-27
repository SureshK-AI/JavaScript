# Tooling

## Backend & architecture
- Prefers Python (FastAPI/Django) for backend services. Confidence: 0.6
- Prefers a modular microservices architecture with containerized deployment (Docker; Kubernetes/minikube for dev). Confidence: 0.6
- Also works in Node/TypeScript full-stack monorepos (npm workspaces) with an Express 5 backend and a React + Vite frontend, in addition to Python-based services. Confidence: 0.5
- Uses SQL/NoSQL databases such as PostgreSQL/MongoDB. Confidence: 0.5

## Learning & practice exercises
- Maintains a series of JavaScript coding-practice exercises (numbered files, e.g. `47_Promise_Level3_02.js`) with TODO comments to fill in; when completing them, the assistant should follow the existing style of the series and replace each TODO with a working implementation. Confidence: 0.6
- Verifies features end to end via a smoke-test script that exercises every component through the real API (register user → upload data → run each feature with its required context), then typechecks and builds the apps before committing. Confidence: 0.8
- Wants durable documentation of how to test a feature: the assistant writes a practical per-item testing guide (e.g., `docs/agent-testing.md`) with grouped tables, expected outputs, exact curl commands, and troubleshooting entries, and the guide doubles as a checklist the assistant works through. Confidence: 0.7

## IDE & workflow
- Uses VS Code as the primary IDE and expects test-execution instructions tailored to it: when explaining how to run tests/features, the assistant should give VS Code-specific steps (integrated terminal commands, optionally a `.vscode/launch.json` Run/Debug config with F5) rather than generic CLI-only instructions. Confidence: 0.6

## Frontend
- Prefers React for frontend, deployed on free tiers (e.g., Vercel). Confidence: 0.6

## Automation & ML
- Uses browser automation tools (Selenium/Playwright) and NLP/ML libraries (spaCy, HuggingFace, Sentence BERT) for scraping and text processing. Confidence: 0.5
- Wants scraping/data collection to span the general web, not just the major portals or specialized sites: job details should be gathered from any relevant website, with the actual job requirements (skills, experience, education, salary) extracted from each posting — and real live-mode scraping must work end to end, not only demo/sample data. Confidence: 0.6
