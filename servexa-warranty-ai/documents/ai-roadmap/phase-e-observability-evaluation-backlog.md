# Phase E Backlog Package — Observability & Evaluation

## Scope
- Distributed tracing across API, Redis workers, and AI provider calls.
- Langfuse + OpenTelemetry integration strategy.
- Evaluation corpus and benchmark harness.

## Tracing Targets
- `POST /ai`, `/v1/ai/query`, `/v1/ai/jobs`.
- Retrieval stages (embedding, vector query, rerank).
- Tool invocation lifecycle and failures.
- Workflow transition lifecycle.

## Evaluation Targets
- Retrieval relevance@k and citation correctness.
- Hallucination rate on fixed benchmark prompts.
- Tool success rate and timeout rate.

## Exit Criteria
- Dashboard shows request → worker → AI provider trace chain.
- CI smoke evaluation fails on major regression.
