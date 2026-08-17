# P1 Traceable Implementation Backlog

This backlog is design output. Items marked P1R or P1P are not authorized to begin while their prerequisite gates remain blocked.

The ordered code waves, module seams, migrations and per-wave exit evidence are defined in [P1_CODE_IMPLEMENTATION_PLAN.md](./P1_CODE_IMPLEMENTATION_PLAN.md). This table remains the stable traceability index.

| ID | Track | Capability | Target code area | Required tests | Evidence | Exit condition |
| --- | --- | --- | --- | --- | --- | --- |
| P1D-01 | P1D | Trust boundary | ADR-014 and P1 design docs | Document/gate validation | Architecture artifact | Boundaries and prerequisites consistent |
| P1D-02 | P1D | Capability and SoD model | Permission/SoD matrix | Matrix/schema lint | Authorization design artifact | No wildcard; conflicts complete |
| P1D-03 | P1D | Route classification | Route inventory contract | Completeness-rule tests | Route inventory artifact | All requirements machine-checkable |
| P1D-04 | P1D | Migration | Migration/cutover plan | Gate-invariant lint | Migration artifact | Single-authority/rollback defined |
| P1D-05 | P1D | Security/privacy | Threat model | Threat/control/evidence mapping validation | Threat/privacy artifact | Every high-risk threat has proof |
| P1D-06 | P1D | Quality gate | Test/evidence plan | Threshold/schema validation | Test specification artifact | Quantitative thresholds complete |
| P1R-01 | P1R | Identity ports | `packages/enterprise-contracts`, Express identity module | Contract tests | Identity contract results | Protocol-neutral principal accepted |
| P1R-02 | P1R | OIDC BFF | Express auth/session and Web login flow | Browser/API OIDC negative suite | OIDC results | No browser OAuth credential |
| P1R-03 | P1R | SCIM provisioning | Express identity provisioning module | Idempotency, stale/reordered, deprovision tests | SCIM results | Preprovision-only and revoke SLA pass |
| P1R-04 | P1R | Canonical sessions | PostgreSQL/Redis session repositories | Replay, expiry, logout/revoke tests | Session results | Named sessions and version checks pass |
| P1R-05 | P1R | Authorization state | Prisma identity models and resolver/cache | Table/property/concurrency tests | Authorization results | Zero safety bypass |
| P1R-06 | P1R | ASC hierarchy | Express Integration Layer and snapshot repository | Contract/fault/freshness tests | Hierarchy results | 15-minute synthetic freshness enforced |
| P1R-07 | P1R | Route pipeline | Express router registration/middleware/repositories | Inventory, API and cross-ASC tests | Route results | 100% classified; unknown denies |
| P1R-08 | P1R | Maker-checker | Shared decision-policy layer and generic HITL | Direct/admin/concurrent self-decision tests | SoD results | Originator final decisions = 0 |
| P1R-09 | P1R | Break-glass | Independent auth/activation/session modules | Dual-control, expiry, MFA and alert tests | Break-glass results | No invariant bypass |
| P1R-10 | P1R | Key management | `KeyManagementPort` and synthetic provider | GCM tamper/rotation/restore tests | Crypto results | Fail-closed key lifecycle passes |
| P1R-11 | P1R | Security audit | Audit envelope, chain, outbox and verifier | Atomicity/tamper/privacy tests | Audit results | Zero mutation without audit intent |
| P1R-12 | P1R | Privacy lifecycle/export | Identity retention and export workflow | Retention/hold/export tests | Privacy results | All privacy scenarios pass |
| P1R-13 | P1R | Migration tooling | Backfill/reconciliation/shadow/cutover tools | Two rehearsal/rollback runs | Migration results | All cutover invariants pass |
| P1R-14 | P1R | Performance/fault harness | P1 proof orchestrator and CI | Peak x2 and injected faults | Benchmark/environment results | All synthetic thresholds pass |
| P1P-01 | P1P | Enterprise identity | Approved IdP/broker and SCIM connector | Sandbox/contract/security tests | Enterprise identity evidence | P0B identity decisions closed |
| P1P-02 | P1P | Production KMS | Approved Vietnam-compatible KMS | Rotation/recovery/access tests | KMS evidence | Security/Operations approval |
| P1P-03 | P1P | ASC source | First production hierarchy connector | Sandbox/failure/reconciliation tests | Connector evidence | Freshness SLA approved |
| P1P-04 | P1P | Production migration | Enterprise identity/ASC cutover | Full rehearsal and rollback | Signed migration evidence | P1P quantitative gates pass |

## Explicit non-goals

- No warranty decision aggregate/state machine implementation (P2).
- No deterministic policy/Evidence governance implementation (P3).
- No production warranty connector/outbox execution implementation (P4).
- No native SAML runtime without a confirmed enterprise constraint.
- No production claim from P1D documents or P1R synthetic evidence.
