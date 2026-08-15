# P0 Security, Data, Threat, and Accountability Baseline

> **Status:** Control baseline approved in principle; enterprise evidence and owners remain open

## Trust zones

1. User device and browser.
2. Public ingress and React delivery.
3. Express trust zone: identity, authorization, policy, business commands, integration, audit, and SSE.
4. FastAPI trust zone: RAG, reasoning, and orchestration without enterprise credentials.
5. Data zone: PostgreSQL/pgvector, Redis, object storage, backup, and WORM audit export.
6. Enterprise zone: IdP and external warranty system.
7. Managed AI-provider zone governed by the selected DPA.

Only Express may cross from application workflow into the enterprise business
zone. Data services are private. Every cross-zone call is authenticated,
authorized, encrypted, observable, and correlated.

## Threat model

| Threat | Required control | P0 proof |
| --- | --- | --- |
| Request creator self-approves | Separate create/decide permissions plus immutable creator/decider check with no wildcard bypass | Negative authorization design and test plan |
| User reads or mutates another ASC | Server-derived ASC assignment/hierarchy on every query and mutation | IdP/group and ASC mapping design |
| Stale case or policy is approved | External version/ETag plus policy/Evidence version checked by `If-Match` | Selected-system concurrency proof |
| Forged or replayed completion event | Signature, timestamp tolerance, nonce/event ID, inbox deduplication | Selected event mechanism proof |
| Duplicate external mutation | Stable idempotency key, outbox, adapter reconciliation | Sandbox fault-injection proof plan |
| AI recommendation lacks valid Evidence | Deterministic policy result, versioned citations, abstain/escalate invariant | Golden-dataset acceptance design |
| Prompt injection causes business action | AI cannot execute business mutation; Express validates typed commands and approval | Tool/command allowlist review |
| Sensitive data leaks to AI provider | Minimization, masking, provider DPA, zero retention/no training, request logging controls | Provider contract and synthetic proof |
| Audit history is altered | Append-only ledger, restricted writer, hash/tamper evidence, WORM export | Storage capability proof |
| Break-glass account is abused | Isolated credential, MFA where supported, time-bound activation, alert, session/audit review | IdP and operations procedure |
| Backup leaves Vietnam | Residency-aware backup target and deny-by-policy configuration | Vendor attestation and restore proof |
| Connector credentials leak | Managed secrets, workload identity where possible, rotation and no application logs | Secret delivery proof |
| Service outage blocks warranty work | Manual mode preserves maker-checker and audit without AI | Business continuity test design |

## Data classification

| Class | Examples | Production handling |
| --- | --- | --- |
| `PUBLIC` | Published product documentation intended for customers | Integrity/version controls; normal encrypted transport |
| `INTERNAL` | Non-sensitive runbooks, operational metadata | Authenticated access; no public storage by default |
| `CONFIDENTIAL` | Warranty policy drafts, case details, Evidence, recommendations, business metrics | Least privilege, encryption, masking in non-production, controlled export |
| `RESTRICTED` | Customer identifiers/contact data, identity claims, tokens, connector secrets, legal-hold exports | Explicit purpose, minimization, field-level masking, audited access, no logs/prompts unless approved |

Rules:

- Customer production data is not used in P0 proofs.
- Evidence preserves source language and version; derived text does not silently replace the source.
- Deletion/anonymization honors legal hold and preserves a non-personal audit proof where legally permitted.
- Retention periods are enterprise-configurable and approved before P8.
- Secret values and signed contracts are referenced, never committed.

## Identity baseline

- Prefer OIDC; use SAML only when the selected IdP lacks OIDC.
- MFA is enforced by the IdP.
- SCIM provisions, maps groups, and deprovisions identities.
- Servexa derives business permissions and ASC scope from trusted mappings, not request input.
- Local accounts are disabled except for monitored break-glass access.

## RACI

Legend: `A` accountable, `R` responsible, `C` consulted, `I` informed.

| Control or decision | Business | Product | Engineering | Security | Operations/SRE | Data/AI |
| --- | --- | --- | --- | --- | --- | --- |
| Policy content and exception authority | A | R | C | C | I | C |
| Golden-workflow acceptance | C | A | R | C | C | C |
| External contract and adapter | C | C | A/R | C | C | I |
| Identity, privacy, threat, and compliance controls | C | I | R | A | C | C |
| Deployment, SLO, recovery, capacity, and incidents | I | C | R | C | A | I |
| Golden dataset and model/prompt/retriever changes | C | C | C | C | I | A/R |
| Production gate evidence | A | C | R | A | A | C |
| Full-network go/no-go | A | R | C | C | C | I |

P0 sign-off requires named people for Business, Security, Engineering, and
Operations. A team name alone is insufficient.

## Open P0 security evidence

- enterprise IdP and SCIM/MFA behavior;
- Vietnam deployment and backup residency;
- AI-provider DPA and data-flow assessment;
- external-system authentication, idempotency, and event security;
- secret manager and rotation mechanism;
- immutable/WORM audit storage capability;
- accountable owner names and controlled evidence references.

