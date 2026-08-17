# P1 Route Security Inventory and Classification Contract

## Purpose

P1D inventories every currently mounted Express endpoint in `p1-route-security-inventory.json`. The inventory is generated from the TypeScript AST and reconciled against the committed policy-rule registry. It is a migration contract, not a claim that P1R runtime enforcement already exists.

## Required inventory fields

| Field | Requirement |
| --- | --- |
| Method and canonical path | Unique route identity |
| Owning module | Named code owner/module |
| Classification | PUBLIC, AUTHENTICATED_NON_ASC, ASC_SCOPED or SECURITY_PRIVILEGED |
| Permission | Required except PUBLIC and explicitly approved authenticated-only routes |
| Resource type | Required for ASC_SCOPED |
| Resolver | Server-side resource/query-scope resolver |
| Allowed scopes | Non-empty for ASC_SCOPED |
| Fresh authentication | Explicit boolean for privileged routes |
| Maker-checker | Explicit boolean where applicable |
| Transactional recheck | Required for high-impact mutations |
| Audit event | Stable event type and failure policy |
| Migration owner/status | Route-by-route cutover evidence |

## Hard invariants

```text
Every route classified                      = 100%
Unknown route policy                        = DENY
ASC_SCOPED without permission               = invalid
ASC_SCOPED without resolver/query scope     = invalid
ASC_SCOPED without allowedScopes            = invalid
Client ASC parameter grants access          = impossible
Missing policy in CI                        = FAIL
Missing policy at startup                   = FAIL
Missing/unknown policy at runtime           = DENY
Authorization failure                       = audited
```

## Route discovery and reconciliation

`node scripts/generate-p1-route-inventory.mjs` generates the inventory from mounted Express routers and compares every endpoint with exactly one committed policy rule. Missing policies, duplicate matches, unresolved paths or duplicate resolved routes fail generation. Dynamic paths are normalized before comparison. Public routes require explicit allowlisting and cannot inherit public status from a parent router accidentally.

The current generated inventory contains 203 classified routes. Runtime enforcement and route-by-route resolver migration remain P1R work and cannot be inferred from this design inventory.

ASC-bound repositories receive only an `AuthorizedResourceScope` created by the server policy resolver. Raw `ascCenterId`, `scope=all`, user-supplied filters and token claims cannot construct it. List queries intersect client filters with the authorized set. Single-resource mutations resolve the authoritative resource ASC before enforcement and repeat relevant checks at the transaction boundary.

## Current-risk migration groups

The implementation inventory must explicitly cover:

1. repair-case list, detail, export and mutation routes;
2. generic HITL creation, visibility, decision and resume routes;
3. identity, role, permission and session administration;
4. policy/knowledge administration and publishing;
5. execution retry, reconciliation and compensation routes as they are introduced;
6. audit read/export lifecycle;
7. P0A-only proof endpoints, which must remain disabled outside their isolated topology.

P1 exit requires zero ASC_SCOPED route reads/writes that depend on `User.ascCenterId` and zero route missing an owner, policy or negative test reference.

