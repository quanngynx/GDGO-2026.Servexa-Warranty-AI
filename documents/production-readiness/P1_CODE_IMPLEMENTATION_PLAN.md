# P1 Code Implementation Plan

## Gate boundary

This plan converts the approved P1 design into code work without weakening the track gates.

- P1D may be refined and proven now, but it closes only with named, independent Engineering and Security sign-off.
- P1R runtime work starts only when both P0A and P1D are `CLOSED`.
- P1P enterprise adapters start only when P0B, P1D and P1R are `CLOSED`.
- P1R evidence is synthetic conformance evidence, never a production-readiness claim.
- P2-P4 handlers are excluded. P1 may register their stable capabilities, but it must not implement warranty decision, policy or external execution business flows.

The current runtime remains legacy JWT/RBAC until the gated cutover. In particular, `authenticate.middleware.ts` accepts browser bearer tokens, `auth.service.ts` issues local credentials and `require-permission.middleware.ts` permits wildcard `*`; these are migration inputs, not reusable target security semantics.

## Target module seams

| Seam | Target code area | Responsibility | Must not depend on |
| --- | --- | --- | --- |
| Identity boundary | `packages/enterprise-contracts/src/identity/` | `IdentityProviderPort`, canonical principal, provisioning/version contracts | OIDC or SAML SDK types |
| Key boundary | `packages/enterprise-contracts/src/crypto/` | `KeyManagementPort`, envelope metadata and key lifecycle errors | Synthetic key storage |
| Organization boundary | `packages/enterprise-contracts/src/organization/` | ASC hierarchy snapshot port and version/freshness contract | Browser/token claims |
| Identity domain | `apps/server/src/modules/v1/identity/domain/` | Lifecycle, bindings, roles, mappings, assignments and SoD invariants | Express request objects |
| Session domain | `apps/server/src/modules/v1/identity/session/` | Opaque session lifecycle, encrypted grants, expiry and revocation | Browser storage |
| Authorization domain | `apps/server/src/modules/v1/authorization/` | Permission registry, scope resolution, canonical decision and final recheck | Role names and client ASC filters |
| Route policy | `apps/server/src/core/security/routes/` | Typed route policies, inventory reconciliation and default deny | Implicit parent-router security |
| Audit domain | `apps/server/src/modules/v1/security-audit/` | Transactional intent, outbox, partitioned chains and verification | Best-effort logger calls |
| Privacy/export | `apps/server/src/modules/v1/privacy/` | Retention, legal hold and maker-checker export lifecycle | Raw identity payloads |
| Protocol adapters | `apps/server/src/adapters/identity/`, `apps/server/src/adapters/crypto/`, `apps/server/src/adapters/organization/` | Keycloak OIDC/SCIM, synthetic KMS and hierarchy fixtures | Business handlers |

## P1R execution waves

No wave below is authorized until the P1R prerequisites pass machine validation. Each wave lands additive schema and tests before a consumer is cut over.

### R0 — Gate guardrails and contract skeletons

1. Add a P1R gate/orchestrator that refuses `proof`, `up` and runtime feature flags unless P0A and P1D are `CLOSED`.
2. Split `packages/enterprise-contracts/src/index.ts` into protocol-neutral identity, organization, crypto, trace and error exports while retaining compatible root re-exports.
3. Add the canonical `AuthenticatedPrincipal`, `AuthorizationDecision`, `BusinessScope`, `RouteSecurityPolicy`, `IdentityProviderPort`, `KeyManagementPort` and hierarchy snapshot contracts.
4. Add compile-time contract tests proving no adapter-specific Keycloak, OIDC or SAML type crosses the port.

Evidence: contract results plus prerequisite-denial tests. Exit: runtime cannot start from narrative status or `READY_FOR_SIGN_OFF` alone.

### R1 — Additive identity, authorization and audit schema

Create additive Prisma models and migrations under `apps/server/prisma/schema/models/identity.prisma` and new focused schema files where needed:

- canonical identity binding keyed uniquely by `(issuer, externalSubject)`, actorRef and lifecycle;
- named opaque sessions, encrypted provider grant metadata and token-family/revocation state;
- versioned roles, permission registry entries, group mappings and many-to-many `IdentityAscAssignment` records;
- hierarchy snapshots, source versions, idempotency inbox and authorizationVersion state;
- maker-checker change requests/approvals with target digest and effective period;
- security audit intent/outbox, partitioned chain head/event/checkpoint;
- break-glass request, activation, factor reference and post-incident review;
- privacy retention/legal-hold state and audit export request/artifact lifecycle.

Migrations are additive only. `User.ascCenterId`, password and legacy key-token tables remain compatibility fields until the later cutover wave; no new path may write them after its authority switch.

Tests: Prisma uniqueness, stale source version, idempotency, lifecycle and transaction rollback tests. Exit: a security-sensitive fixture cannot commit state without audit intent.

### R2 — SCIM authority and versioned authorization state

Implement SCIM create/update/deactivate through an application service that commits identity state, assignments/mappings, source version, idempotency record, authorizationVersion increment, audit intent and revoke-session outbox command atomically.

- Duplicate events return the prior result.
- Stale/reordered versions conflict and never overwrite newer state.
- Unknown SCIM attributes are dropped by an allowlist.
- OIDC group claims remain a consistency signal only; mismatch denies and audits.
- Static SoD evaluates effective capabilities across role, mapping, assignment and hierarchy versions before activation.

Tests: table/property tests plus PostgreSQL concurrency tests for duplicate, stale, reordered and conflicting provisioning. Exit: privilege removal is effective immediately; propagation is at most 2 seconds and injected-fault backlog recovers within 30 seconds.

### R3 — OIDC BFF and canonical sessions

Implement the synthetic Keycloak adapter behind `IdentityProviderPort` and Express BFF routes for authorization start, callback, logout and reauthentication.

- Authorization Code + PKCE, state, nonce, issuer, audience and authorized-party checks are mandatory.
- The browser receives only an opaque `__Host-` HttpOnly/Secure/SameSite cookie.
- Provider grants remain AES-256-GCM encrypted server-side.
- Authentication binds only to an active pre-provisioned `(issuer, externalSubject)` identity; no JIT or email binding.
- Session idle expiry is 30 minutes, absolute expiry 12 hours and privileged freshness 4 hours, all server-enforced.
- Each protected request verifies current authorizationVersion before using a cached snapshot.

Keep signed/invalid/replay SAML fixtures as boundary conformance tests only. Do not add a native SAML runtime adapter.

Tests: browser and API suites for PKCE/state/nonce/login CSRF, fixation, cookie flags, no browser tokens, refresh replay, per-session logout and deprovision. Exit: all required browser/API cases pass and deprovision revokes all sessions within 5 seconds.

### R4 — Central authorization engine and route registry

Implement a single authorization application service producing `AuthorizationDecision` from explicit permission, authoritative identity/session state, organizational scope, version metadata and invariants.

- Replace the wildcard branch in `require-permission.middleware.ts`; unknown permissions deny.
- Replace `RolesScope.SYSTEM` on business paths with OWN, ASSIGNED_ASC, DESCENDANT_ASC, REGION or COMPANY.
- Generate typed permissions from versioned configuration; business code never checks role names.
- Introduce an unforgeable `AuthorizedResourceScope` consumed by ASC-bound repositories.
- Register every Express route with `RouteSecurityPolicy`; compare mounted routes with the registry in CI and at startup.
- A client ASC/query parameter can only intersect the authorized set.
- Unknown policy, stale hierarchy, resolver failure or freshness timeout denies and creates sanitized security audit/telemetry.

Migrate route groups in risk order: identity/security administration; repair-case and document read/export/mutation; generic HITL; remaining ASC-bound modules; authenticated non-ASC routes. A route is not cut over until its repository accepts authorized scope rather than `User.ascCenterId`.

Tests: deterministic matrix, property-based role/scope composition, direct API tampering, horizontal/vertical escalation, cross-ASC read/list/export/mutation and startup inventory failure. Exit: 100% classified routes and zero safety bypass.

### R5 — Runtime SoD and generic HITL repair

Add a shared decision-policy service for dynamic/history-based SoD and apply it to every existing final-decision endpoint.

- Remove the creator allow path from `HitlService.assertCanDecide`.
- Preserve an explicit originatingActor for system/AI-created HITL.
- Require creator/decider, normal-decider/exception-approver, role/assignment author-approver and export requester-approver separation.
- High-impact decisions re-resolve authorization and invariants inside the transaction/final execution gate and persist the authorization decision digest with audit intent.
- Admin, custom roles and break-glass cannot bypass the invariant.

This wave repairs authorization around existing HITL only; it does not add the P2 `warranty_decision` aggregate or P2-P4 handlers.

Tests: direct API, manipulated client state, wildcard/privileged identity, concurrent revoke/decision and cross-assignment cases. Exit: originating actor final decisions and post-revoke privileged commits both equal zero.

### R6 — Tamper-evident security audit

Replace security-sensitive best-effort logging with a transactional audit-intent API. A worker serializes events per `(enterprise environment, stream type)` chain, verifies monotonically increasing sequence/linkage and creates independently signed chain-head checkpoints.

- Detect modified, deleted, reordered and broken events plus invalid checkpoints.
- Keep tokens, credentials and unnecessary PII out of audit/outbox/log/trace/evidence surfaces.
- Deny high-impact mutations when durable intent or required integrity cannot be guaranteed; allow only policy-approved low-risk/read-only degraded behavior.
- Record canonical decision digests and version references sufficient to reconstruct authorization at decision time.

Tests: atomic rollback, tamper fixtures, concurrent append, checkpoint rewrite and leakage scans. Exit: mutation without audit intent is zero and tamper detection is 100%.

### R7 — Break-glass, crypto, privacy and export

Implement `KeyManagementPort` with a versioned synthetic envelope-encryption provider. Unknown/revoked keys and AES-GCM authentication failures deny. Prove rotation, old-key decrypt and backup/restore without changing domain code.

Implement at most two disabled named emergency identities, dual-control activation, maximum 60-minute expiry, independent MFA boundary and full session revocation on expiry/revoke. WebAuthn fixtures test challenge/origin/RP ID/signature/replay; TOTP is CI-only synthetic fallback.

Implement identity lifecycle retention and audit export as separate workflows. Export request, independent approval, system generation, named-recipient download, expiry and revoke enforce the agreed digest/status/identity invariants. Artifacts are encrypted and expire after 24 hours; deactivated profile PII uses the 30-day synthetic grace period unless legal hold applies.

Tests: crypto tamper/rotation, break-glass dual control and non-bypass, retention/legal-hold/release, export invariants and artifact purge. Exit: zero export violations and all privacy lifecycle scenarios pass.

### R8 — Legacy migration and synthetic cutover rehearsal

Implement tooling for additive import, fail-closed issuer/subject reconciliation, authorization shadow comparison and route-by-route ASC assignment parity.

1. Backfill identity candidates and `IdentityAscAssignment` without granting new access.
2. Put unmatched, ambiguous and conflicting identities into a reviewed reconciliation queue.
3. Require every active privileged identity to be BOUND or EXPLICITLY_DISABLED.
4. Run new authorization in shadow mode; unexplained privilege expansion must be zero.
5. At rehearsal cutover, revoke legacy sessions, disable normal `/login`, then enable OIDC BFF.
6. Rehearse rollback only to a last-known-good OIDC-capable artifact; never revive legacy credentials.
7. Stop all writes and then reads of `User.ascCenterId`; remove the field only in a later migration after parity evidence.

Tests: at least two cutover/rollback rehearsals, one-to-one binding constraints, login denial after rollback, session/audit continuity and ASC parity. Exit: legacy login cannot be re-enabled by configuration or rollback.

### R9 — Negative gate, performance and signed evidence

Build the P1R evidence bundle as a compact signed manifest referencing authorization, OIDC/SCIM, audit/privacy, migration, performance and provenance artifacts by SHA-256.

Run the complete negative suite and synthetic peak x2 profile. Required performance thresholds are cached authorization p95 below 50 ms and p99 below 100 ms, cache-miss resolution p95 below 250 ms, transactional final recheck p95 below 150 ms and error rate below 1%; every decision timeout denies.

P1R stops at `READY_FOR_SIGN_OFF`. It becomes `CLOSED` only after independent Engineering and Security approval and only if Critical/High findings are zero, Medium findings meet the accepted-remediation contract and every safety invariant remains at zero violations.

## P1P adapter plan

After P0B and P1R close, replace only ports/adapters:

1. Enterprise IdP/SCIM: verify real issuer, client, group mappings, deprovision SLA and MFA policy; evaluate SAML-to-OIDC broker first if OIDC is unavailable.
2. Production KMS: bind the existing `KeyManagementPort` to the selected Vietnam-compatible KMS and rerun rotation/recovery/access proofs.
3. ASC hierarchy: implement the first production connector, approved freshness/degraded-mode policy and reconciliation.
4. Production identity cutover: repeat full reconciliation, shadow parity, rollback and sign-off with enterprise data and operations evidence.

P1P closes only with Engineering, Security, Operations and Product/Business sign-off. No synthetic threshold or reference adapter substitutes for enterprise evidence.

## Pull-request slicing

Each pull request should contain one independently reversible vertical proof: contracts/schema, adapter, application service, enforcement consumer, tests and evidence schema update. Schema changes land before cutover code; enforcement lands before legacy-path removal. Do not combine route-wide authorization migration with identity cutover or irreversible field removal.

Every PR records its backlog IDs, threat/control mapping, migrations, rollback path, negative tests and evidence artifact owner. A PR cannot mark a later wave complete merely because its types or stubs exist.

