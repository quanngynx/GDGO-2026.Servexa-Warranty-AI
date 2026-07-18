# Contributing to Servexa Warranty AI

Thank you for helping improve Servexa Warranty AI. This project is an open source AI-powered warranty platform, built as a monorepo so each part can be developed and tested together while maintaining clear boundaries.

## Start in the right directory

Open issues and pull requests referencing the specific app or package that owns the change:

| Area                                         | Directory          |
| -------------------------------------------- | ------------------ |
| Frontend React/TanStack Router app           | `apps/web`         |
| Express API server                           | `apps/server`      |
| AI Gateway, LangGraph agents, RAG pipelines  | `apps/ai-services` |
| Shared configurations, DB schemas, contracts | `packages/*`       |

For cross-cutting proposals, open a design issue referencing the area with the largest expected implementation impact and link follow-up issues from there.

## What to include

- Explain the problem, expected behavior, and the directory area affected.
- Keep pull requests focused and small enough to review.
- Add or update tests when changing behavior.
- Update documentation when changing setup, APIs, schemas, AI prompts, or operational assumptions.
- Never commit secrets, real customer data, proprietary warranty manuals, API keys (e.g. Gemini/OpenAI), or production logs.

## Safety and data expectations

Servexa Warranty AI relies on Retrieval-Augmented Generation (RAG) and Large Language Models. Contributions must keep these capabilities safe and accurate:

- Evaluate prompt changes against diverse product manuals and scenarios.
- Use synthetic data or public manuals for local testing and development.
- Keep prompt logic and safety filters clearly documented.
- Do not add prompt injection vulnerabilities, unauthorized data scraping, or uncontrolled AI tool calling.
- For AI agents, document tool requirements, system prompt behavior, hallucination mitigations, and context limits.

## Pull request checklist

Before opening a pull request, confirm that:

- The change has a clear issue, motivation, or review note.
- Tests or validation steps (including prompt evaluations if applicable) are included in the pull request description.
- Changes to AI behavior or RAG retrieval have an accuracy or safety note.
- Documentation reflects the new behavior.
- The contribution is compatible with the MIT License.

## License

Unless explicitly stated otherwise, contributions submitted to Servexa Warranty AI are provided under the MIT License.
