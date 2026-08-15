# P0 Source of Truth and Integration Contract

> **Status:** Target contract; external adapter not selected<br>
> **Architecture seam owner:** Express Business/Integration Layer

## Data ownership

| Domain | Authoritative owner | Servexa copy | Allowed Servexa behavior |
| --- | --- | --- | --- |
| Enterprise identity | Selected enterprise IdP | Subject, group mapping, session, audit references | Authenticate, map roles, revoke access |
| Customer | External warranty system | Authorized projection needed for the workflow | Query; never independently mutate |
| Product | External warranty system | Authorized projection and version reference | Query; never independently mutate |
| Warranty policy | External warranty system/business policy owner | Immutable governed release and indexed Evidence copy | Ingest, approve, evaluate, cite; external record remains authoritative |
| ASC master data | External warranty system | ASC ID, hierarchy, assignments required for authorization | Query and enforce scope |
| Repair case | External warranty system | Snapshot, version/ETag, decision linkage | Query; mutate only through an approved idempotent command |
| Evidence | Servexa | Authoritative Servexa record | Version, cite, retain, export |
| Recommendation | Servexa | Authoritative Servexa record | Create, supersede, evaluate |
| Approval workflow | Servexa | Authoritative Servexa record | Enforce maker-checker and state transitions |
| Execution tracking | Servexa | Authoritative tracking plus external receipt | Retry, reconcile, compensate; never claim completion without confirmation |
| Immutable audit | Servexa | Authoritative ledger and WORM export | Append, retain, legal-hold, export; never edit/delete in place |

This matrix supersedes any production interpretation that Servexa PostgreSQL owns
enterprise master data. Existing local tables and seed data remain development
fixtures until the selected adapter and migration policy are approved.

## Integration module interface

The external seam is deliberately small. Callers and contract tests use the same
interface; vendor auth, pagination, rate limits, retries, field mapping, and
transport details remain inside the adapter.

```ts
interface WarrantySystemAdapter {
  getCaseContext(input: GetCaseContextInput): Promise<CaseContextSnapshot>;
  executeWarrantyDecision(input: ExecuteWarrantyDecisionInput): Promise<ExecutionReceipt>;
  getExecutionStatus(input: GetExecutionStatusInput): Promise<ExecutionStatus>;
  reconcileDecision(input: ReconcileDecisionInput): Promise<ReconciliationResult>;
}
```

The seam is considered real only when both a production adapter and an
in-memory/contract-test adapter satisfy the same conformance suite.

## Contract invariants

- Express is the only runtime allowed to call the adapter for business data or mutation.
- FastAPI receives authorized context or tool results from Express; it never receives external credentials.
- Every snapshot includes external record ID, version/ETag, observed-at time, and source-system ID.
- Every mutation includes workflow ID, decision version, external case version, actor, and idempotency key.
- The idempotency key is stable for retry and unique for a new decision version.
- Approval produces `APPROVED_PENDING_EXECUTION`; only a confirmed external receipt produces `EXECUTED`.
- Timeout or ambiguous responses are reconciled before retrying a non-idempotent vendor operation.
- Signed inbound events use timestamp tolerance, replay protection, and inbox deduplication.
- External rejection, rate limiting, unavailability, and schema drift are distinct error classes.
- Connector failure never rewrites an approved business decision as rejected.

## Query, command, and event inventory

P0 cannot close until the selected system fills every `OPEN` cell.

| Capability | Direction | Required contract facts | State |
| --- | --- | --- | --- |
| Case context lookup | Servexa -> external | Endpoint/event, auth, fields, version token, latency, quota, error model | `OPEN` |
| Customer/product/policy context | Servexa -> external | Ownership, identifiers, versioning, batch limits, masking | `OPEN` |
| Warranty decision command | Servexa -> external | Command shape, idempotency support, concurrency rule, receipt | `OPEN` |
| Execution status | Servexa -> external | Polling endpoint or query semantics, terminal states | `OPEN` |
| Completion notification | External -> Servexa | Webhook/event transport, signing, retry, ordering, replay window | `OPEN` |
| Reconciliation | Bidirectional | Search window, authoritative comparison fields, repair procedure | `OPEN` |
| Compensation | Servexa -> external | Supported reversal/adjustment operation, authorization, accounting effect | `OPEN` |

## P0 evidence required from the selected system

- versioned API/event documentation and a named technical owner;
- non-production sandbox with synthetic test data;
- authentication and credential-rotation procedure;
- quotas, availability, maintenance, support, and incident contacts;
- idempotency and optimistic-concurrency behavior;
- webhook/event verification and retry behavior;
- data classification and residency path;
- schema/version change policy;
- reconciliation export or query capability;
- evidence that compensation is supported, or an approved manual control when it is not.

## Rejected integration shapes

- FastAPI calling ERP/WMS directly;
- browser calling the external system or FastAPI;
- database-level dual writes;
- treating Redis as the business source of truth;
- marking a workflow complete when a request was merely accepted for processing;
- a generic connector framework with no first production adapter and no contract proof.
