# ADR-014: Separate P1 design, reference and production identity tracks

## Status

Accepted for P1D implementation on 2026-08-16.

## Context

P0A is `READY_FOR_SIGN_OFF` but cannot close without independent Engineering and Security approvals. P0B remains `BLOCKED`. The repository therefore cannot begin identity runtime work without violating the production gate hierarchy, but it can complete the design control plane needed for review.

The current application uses local username/password authentication, JavaScript-readable tokens, coarse wildcard RBAC, a single legacy ASC field and authorization paths that can bypass maker-checker. Those behaviors are audit inputs, not approved P1 architecture.

## Decision

P1 is split into three non-interchangeable tracks:

- **P1D — Design:** ADRs, contracts, matrices, inventories, threat model, migration plan, test specifications and implementation backlog. P1D may be implemented now.
- **P1R — Reference:** Keycloak-backed synthetic runtime and conformance evidence. P1R is blocked until both P0A and P1D are `CLOSED`.
- **P1P — Production:** enterprise IdP, SCIM, KMS and ASC connector integrations. P1P is blocked until P0B, P1D and P1R are `CLOSED`.

Express will be the OIDC BFF and the only business authorization authority. Browser code will hold only an opaque secure session cookie. Identity is SCIM-preprovisioned; OIDC claims do not directly grant permissions. Authorization is the conjunction of explicit permission, resource scope, current organizational assignment/hierarchy, active identity/session state and non-bypassable business invariants.

P1D may reach `READY_FOR_SIGN_OFF` from signed design evidence. It reaches `CLOSED` only after different named Engineering and Security approvers sign the exact evidence bundle. No P1D or P1R result is production evidence.

## Consequences

- No P1 runtime, Prisma, UI or business-behavior change is authorized by this ADR.
- Normal local login will eventually be retired, not retained as an SSO fallback.
- Wildcard permission and `SYSTEM` business scope are not part of the target model.
- P2D/P2R/P2P cannot open until the corresponding P1 track is closed.
- Machine-readable gate state and signed evidence override narrative progress claims.

