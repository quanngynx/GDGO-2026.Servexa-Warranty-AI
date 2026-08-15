# Servexa Production Completion Roadmap - P0 to P9

> **Approval scope:** Target production release gates<br>
> **Current phase:** P0<br>
> **Current phase status:** `BLOCKED`<br>
> **Scheduling model:** Evidence-gated; no deadline substitutes for an exit gate<br>
> **Production shape:** One enterprise, one isolated environment

## Status semantics

| Status | Meaning |
| --- | --- |
| `NOT_STARTED` | A predecessor gate is still open |
| `IN_PROGRESS` | Authorized work is underway and evidence is incomplete |
| `BLOCKED` | Required enterprise input or proof is unavailable |
| `READY_FOR_SIGN_OFF` | All technical evidence exists; accountable owners have not all approved |
| `CLOSED` | Evidence and required sign-offs prove the exit gate |

A later capability in source code is not evidence that its production phase is
closed. A phase may start only when every predecessor is `CLOSED`.

## Fixed production invariants

- The external warranty system owns customer, product, policy, ASC, and repair-case business records.
- Servexa owns Evidence, recommendations, approval workflow, execution tracking, and immutable audit.
- React communicates only with Express. Express owns authentication,
  authorization, policy execution, enterprise integration, business commands,
  audit, and SSE. FastAPI owns RAG, reasoning, and orchestration.
- AI never auto-approves or mutates the external system.
- The request creator cannot decide the same request, including when holding a wildcard permission.
- Missing, stale, or conflicting critical Evidence produces abstention or escalation.
- Approval is not completion. Completion requires an idempotent external-system confirmation.
- All production data and backups remain in Vietnam.
- Limited production is pre-launch; official launch is a gated full-network cutover.

## Phase summary

| Phase | Outcome | Prerequisite | Current status |
| --- | --- | --- | --- |
| P0 | Enterprise choices, topology, contracts, governance, and signed proof | None | `BLOCKED` |
| P1 | Enterprise identity, ASC authorization, privacy, and maker-checker | P0 closed | `NOT_STARTED` |
| P2 | First-class warranty-decision aggregate and public contracts | P1 closed | `NOT_STARTED` |
| P3 | Deterministic policy and governed Evidence | P2 closed | `NOT_STARTED` |
| P4 | Durable external execution and reconciliation | P3 closed | `NOT_STARTED` |
| P5 | Production golden-workflow UX and manual degraded mode | P4 closed | `NOT_STARTED` |
| P6 | Vietnam-hosted HA platform, audit, SLO, recovery, and CI gates | P5 closed | `NOT_STARTED` |
| P7 | Golden evaluation and mutation-free shadow mode | P6 closed | `NOT_STARTED` |
| P8 | Limited production at one or two ASC centers | P7 closed | `NOT_STARTED` |
| P9 | Full-network big-bang launch and stabilization | P8 closed | `NOT_STARTED` |

## P0 - Production Architecture & Enterprise Readiness

**Objective:** close every enterprise-dependent decision before production
implementation begins.

Deliverables:

- target enterprise, first external system, connector owner, and sandbox;
- entity ownership matrix and query/command/event inventory;
- Vietnam deployment vendor, DPA, AI provider terms, and failure domains;
- topology for HA, network zones, backup, DR, secrets, object storage, and capacity;
- RACI, threat model, data classification, scope register, and accepted ADRs;
- infrastructure proof for network, enterprise identity, AI provider, HA, and backup.

Exit gate: every prerequisite in `p0-gate.json` is `VERIFIED`, every required
sign-off is `APPROVED`, and `pnpm p0:gate` succeeds.

## P1 - Identity, Authorization & Privacy Foundation

**Objective:** establish the trust boundary before implementing the golden
workflow.

Required behavior:

- use OIDC when the selected IdP supports it; use SAML only when OIDC is unavailable;
- use SCIM for provisioning, group mapping, and deprovisioning; enforce MFA at the IdP;
- retain local authentication only for monitored, audited break-glass access;
- separate create, decide, exception-decide, reconcile, compensate,
  policy-approve, and audit-export permissions;
- derive ASC scope at Express from trusted assignment and hierarchy;
- deny self-approval without a wildcard or administrator bypass;
- enforce classification, minimization, masking, controlled export/deletion,
  and encryption in transit and at rest.

Exit gate: negative authorization tests prove self-approval and cross-ASC access
impossible, SCIM deprovision revokes access, and Security approves the control set.

## P2 - Warranty Decision Domain & Public Contracts

**Objective:** introduce a production aggregate rather than treating generic
HITL persistence as the golden workflow source of truth.

Wire statuses:

```text
PENDING_REVIEW
APPROVED_PENDING_EXECUTION
REJECTED
EXPIRED
SUPERSEDED
EXECUTED
EXECUTION_FAILED
RECONCILIATION_REQUIRED
COMPENSATED
```

Recommendation outcomes are `ELIGIBLE`, `INELIGIBLE`, `ABSTAIN`, and
`ESCALATE`. Manager actions are `APPROVE_RECOMMENDATION`,
`REJECT_RECOMMENDATION`, `OVERRIDE_OUTCOME`, and `ESCALATE_EXCEPTION`.

The aggregate records case, policy, Evidence, workflow, model, prompt,
retriever, and decision versions. Decision mutations require `If-Match`; every
mutation requires `Idempotency-Key`. Audit records are appended in the same
transaction as state transitions.

Required Express routes:

```text
POST /v1/warranty-decisions/evaluations
GET  /v1/warranty-decisions/:id
GET  /v1/warranty-decisions?scope=mine|asc|all&status=...
POST /v1/warranty-decisions/:id/decisions
POST /v1/warranty-decisions/:id/execution/retry
POST /v1/warranty-decisions/:id/reconciliation
POST /v1/warranty-decisions/:id/compensations
```

Exit gate: state-machine, optimistic-locking, idempotency, maker-checker, and
compatibility tests pass; approval never transitions directly to `EXECUTED`.

## P3 - Policy, Knowledge & Evidence Governance

**Objective:** ensure every critical recommendation is deterministic where
rules apply and verifiable where AI contributes.

- Express owns a deterministic policy module.
- Policy lifecycle is `DRAFT -> PENDING_APPROVAL -> ACTIVE -> RETIRED` or
  `ROLLED_BACK`; authors cannot approve their own releases.
- Releases have precedence, effective periods, immutable versions, and rollback targets.
- Evidence includes source/version, locator, content hash, source language, and effective period.
- Unresolved policy conflict, stale sources, and missing critical Evidence abstain or escalate.
- Activation requires versioned golden-dataset regression and business sign-off.

Exit gate: no critical recommendation lacks a valid citation; conflict/stale
tests abstain; rollback restores the selected version without rewriting history.

## P4 - External Integration & Durable Execution

**Objective:** mutate the enterprise system safely and prove the outcome.

The Express integration seam exposes four operations:

```text
getCaseContext
executeWarrantyDecision
getExecutionStatus
reconcileDecision
```

One production adapter implements the selected external system. FastAPI does
not call ERP/WMS in the golden workflow. Workflow state, audit, and a
transactional outbox are written atomically; Redis Streams carries durable
commands. The workflow ID and decision version form the external idempotency
key. Signed webhooks/events use replay protection and inbox deduplication.

Retry exhaustion moves work to DLQ and `RECONCILIATION_REQUIRED`. Only external
confirmation produces `EXECUTED`; reversal creates a compensating workflow.

Exit gate: sandbox contract and fault-injection tests prove duplicates, delay,
reordering, loss, and outages cannot duplicate or erase a decision; reconciliation
and compensation drills pass.

## P5 - Golden Workflow UX & Manual Degraded Mode

**Objective:** deliver the complete operator and manager experience.

- intake shows case context, policy result, Evidence, confidence, and recommendation;
- manager review shows immutable snapshot/version, approve/reject, override reason, and exception escalation;
- stale recommendations are locked and must be evaluated again;
- manual mode preserves authorization, maker-checker, and audit and records `AI_ASSISTED=false`;
- Express SSE projects execution, reconciliation, and completion state;
- golden workflow supports the latest two Chrome/Edge versions, desktop/tablet,
  WCAG 2.1 AA, Vietnamese business UI, and English operations/admin UI;
- non-production modules are hidden or explicitly labelled outside production scope.

Exit gate: browser tests pass for happy path, ineligible, abstain, override,
exception, stale data, connector failure, and manual mode; no browser traffic
targets FastAPI directly; Product and business representatives approve the UX.

## P6 - Production Platform, Audit & Reliability

**Objective:** meet the agreed Vietnam-hosted operating baseline.

- IaC deploys Web, Express, FastAPI, workers, Redis, PostgreSQL/pgvector, and object storage;
- HA remains within Vietnam; PostgreSQL and Redis are private; backups use a separate failure domain without leaving Vietnam;
- PITR/backup automation meets RPO <= 5 minutes and tested restore meets RTO <= 60 minutes;
- OpenTelemetry correlates logs, metrics, and traces across the workflow;
- dashboards separate core workflow, AI assistance, connector, queue/DLQ, and business metrics;
- append-only audit exports to WORM/object-lock storage with retention, legal hold, and export;
- CI/CD includes full-stack tests, migration rehearsal, SAST, SCA, secret/container/IaC scanning, SBOM, and rollback artifacts;
- load and soak tests use expected full-network peak x2 and prove backlog recovery;
- runbooks, alerting, priority-1 incident on-call, and incident ownership are operational.

Exit gate: end-to-end golden-workflow SLO is 99.9% during ASC operating hours;
restore, failover, queue recovery, and incident simulations pass; Security and
Operations approve production readiness.

## P7 - Golden Evaluation & Shadow Mode

**Objective:** establish real-data quality without external mutation.

Shadow mode measures latency, override, abstention, escalation, Evidence
validity, and connector simulation against actual business decisions. It creates
a signed numeric threshold register before P8. Every model, prompt, retriever,
and policy change is canaried and retains a rollback artifact. Penetration,
privacy, and AI abuse testing are included.

The following invariants must remain at zero violations: self-approval,
cross-scope mutation, critical recommendation without Evidence, and external
mutation during shadow mode.

Exit gate: Business, Security, Operations, and Data/AI approve the evaluation
and threshold register; no safety violation remains.

## P8 - Limited Production

**Objective:** prove real operation at one or two ASC centers.

Selected centers run the real workflow, manual mode, exceptions, and
reconciliation. Before starting, the signed threshold register states minimum
case counts for happy path, ineligible, abstain, exception, connector failure,
and manual mode. The phase runs for at least two complete business cycles and
repeats restore, connector recovery, and rollback exercises.

Exit gate: numeric thresholds and SLO pass; safety and authorization violations
remain zero; no Sev-1 remains; Business, Product, Security, and Operations issue
the full-network go/no-go decision.

## P9 - Full-Network Big-Bang Launch & Stabilization

**Objective:** enable every ASC in one controlled cutover.

The team performs a full-scale peak-x2 rehearsal, migrates open cases, active
policies, and minimum validated history, then uses a freeze window, maintenance
window, and before/after reconciliation. Quantitative rollback triggers cover
authorization breach, wrong mutation, audit gap, connector backlog, prolonged
SLO breach, and manual-mode failure. A trigger invokes the approved manual or
legacy rollback path; it is not decided during the incident.

Exit gate: all ASC centers use the golden workflow, reconciliation has no
unresolved mismatch, SLO/security/support/business metrics remain stable through
the signed hypercare window, and the Executive Business Owner accepts launch.

## Verification policy

Every phase stores its evidence artifact and sign-off. Narrow unit tests cannot
prove an end-to-end gate. Required coverage across the roadmap includes state
and policy property tests, contract and integration tests, browser E2E,
golden-dataset regression, security isolation, immutable-audit validation,
performance/soak/fault injection, backup/restore, failover, and cutover rehearsal.
