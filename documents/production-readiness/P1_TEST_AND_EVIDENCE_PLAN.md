# P1 Test, Evidence and Exit-Gate Specification

## Test layers

| Layer | Required coverage |
| --- | --- |
| Unit/table | Capability registry, scopes, reason codes, static/dynamic SoD, state transitions |
| Property-based | Role/mapping/assignment combinations, hierarchy traversal, privilege monotonicity |
| Contract | OIDC/SAML boundary, SCIM idempotency/versioning, KMS, hierarchy connector |
| Integration | PostgreSQL/Redis/outbox, version invalidation, session revocation, audit atomicity |
| Concurrency | TOCTOU, simultaneous approve/revoke, privilege change during final mutation |
| API | Direct calls, client tampering, cross-ASC read/list/export/mutation, unknown policies |
| Browser | OIDC BFF, cookies, CSRF, logout, no browser token storage, deprovisioned session |
| Fault | IdP/connector/cache/audit/KMS outage, stale snapshots and revocation backlog recovery |
| Migration | Binding reconciliation, parity, two cutover/rollback rehearsals, legacy-login denial |
| Performance | Cached, uncached and transactional authorization profiles at synthetic peak x2 |

## Negative authorization hard gate

The suite covers horizontal/vertical escalation, all ASC access shapes, multi-assignment/hierarchy, stale and retired state, indirect privilege expansion, unknown route/resolver failure, self-approval by privileged identities and TOCTOU. Deterministic tables, property tests, API/integration tests and concurrency/browser E2E are all required. Safety tolerance is zero and cannot be waived.

## Protocol, session and crypto security

OIDC tests state/nonce/PKCE mismatch, issuer/audience/authorized-party errors, redirect manipulation, login CSRF, session fixation, cookie theft/replay, refresh replay, per-session/account revocation and active deprovision. Browser storage, logs, traces and evidence must contain no OAuth credential.

SAML conformance tests valid signed, unsigned, invalid-signature, wrong-audience/recipient, expired and replayed fixtures. WebAuthn boundary tests challenge uniqueness, origin, RP ID, signature and replay/risk behavior. Synthetic TOTP tests clock window, replay and rate limits. None of these fixtures are production-integration evidence.

AES-GCM tests round-trip, payload/AAD/tag tampering, missing/unknown/revoked key, rotation, old-key decrypt and backup/restore. Every verification failure fails closed.

## Quantitative synthetic thresholds

| Measure | Threshold |
| --- | --- |
| Authorization safety bypass | 0 |
| Cross-ASC leakage | 0 |
| Privileged mutation committed after authoritative revoke | 0 |
| Stale/unknown authorization accepted | 0 |
| authorizationVersion propagation | <=2 seconds |
| Cache invalidation | <=2 seconds |
| All sessions revoked after deprovision | <=5 seconds |
| Revocation backlog recovery after injected fault | <=30 seconds |
| Cached evaluation | p95 <50 ms; p99 <100 ms |
| Cache miss/full resolution | p95 <250 ms |
| Transactional final recheck | p95 <150 ms |
| Harness error rate | <1%; decision timeout is DENY |
| Mutation without durable audit intent | 0 |
| Tamper fixture detection | 100% |
| Raw token, credential or forbidden PII leakage | 0 |
| Export invariant violation | 0 |

The load profile is at least the current synthetic peak x2. These values prove only the fixed P1R profile and are not production capacity/SLO evidence.

## Audit and privacy scenarios

Tamper fixtures cover modification, deletion, reordering, chain break and invalid checkpoint. Retention, expiry, pseudonymization, legal hold, legal-hold release and backup/restore must pass. Scanning covers logs, traces, audit, outbox, exports and test/evidence artifacts.

Audit verification failure raises a P1 alert. High-impact or security-sensitive mutations deny when durable audit intent or required integrity cannot be guaranteed. Policy-approved read-only/low-risk operations may continue degraded.

## Evidence bundle

Each track gate is a compact index/attestation. Raw results stay in its evidence bundle:

```text
.p1d/evidence/ or CI artifact
|-- registry.json
|-- architecture/results.json
|-- authorization/results.json
|-- route-inventory/results.json
|-- migration/results.json
|-- threat-privacy/results.json
|-- testing/results.json
`-- backlog/results.json
```

P1R later adds OIDC, SCIM, audit tamper, migration rehearsal and performance artifacts. Each registry binds the historical subject commit/tree, an ownership-scope digest, scope identity/version/manifest/file count, scenario/schema versions, tool/environment versions, workflow run/attempt, artifact SHA-256 and an Ed25519 signature. Changes to owned files, the scope manifest or declared dependencies invalidate evidence. Later-track files outside the scope do not invalidate a closed predecessor. Gate status/timestamp/sign-off fields remain the only normalized metadata.

## Sign-off and progression

| Gate | Required sign-offs | Prerequisites |
| --- | --- | --- |
| P1D | Engineering and independent Security | Complete signed design evidence |
| P1R | Engineering and independent Security | P0A CLOSED and P1D CLOSED |
| P1P | Engineering, Security, Operations and Product/Business | P0B, P1D and P1R CLOSED |

P1D may stop at `READY_FOR_SIGN_OFF` while the Security approver is absent. P2D/P2R/P2P open only after the corresponding P1 track is closed. Critical/High findings block closure. Medium findings require named ownership, deadline, compensating control and Security acceptance; no safety violation can be accepted.
