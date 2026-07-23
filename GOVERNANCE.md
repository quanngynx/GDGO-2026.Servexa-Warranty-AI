# Governance

Servexa Warranty AI is maintained by the Servexa Warranty AI Maintainers and community contributors.

## Project goals

- Provide an open, inspectable AI-powered warranty platform.
- Keep RAG logic, AI agents, and prompt responses explainable, accurate, and safe by default.
- Support customer service optimization, accurate technical lookup, and AI application research.

## Roles

| Role | Responsibility |
|---|---|
| Maintainers | Review and merge changes, set project direction, manage releases, and protect community standards. |
| AI Reviewers | Review prompt changes, RAG pipeline optimizations, agent tool access, and safety/hallucination mitigations. |
| Contributors | Improve code, documentation, tests, UI/UX, AI prompts, data ingestion paths, and user experience. |

## Decision process

Routine changes can be accepted by maintainer review in the affected directory. Cross-app architecture changes, public API changes, data privacy policy changes, AI agent capability changes, and license/governance changes should be discussed in an issue before implementation.

Decisions affecting AI safety and data privacy should include evaluation metrics, hallucination tradeoffs, fallback plans, and auditability. When maintainers disagree, prefer the option that preserves user data privacy, least privilege for AI tools, and deterministic fallback operations.

## Maintainer expectations

Maintainers should:

- review contributions with specific and actionable feedback;
- keep unsafe defaults and unvalidated AI behavior out of the project;
- document major decisions in issues, pull requests, or README updates;
- disclose known limitations of the AI models or RAG system clearly;
- protect contributor safety and responsible data handling.
