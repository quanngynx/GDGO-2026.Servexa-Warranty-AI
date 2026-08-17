# P1 Identity and Authorization Migration, Cutover and Rollback

## Single-authority invariant

At every stage one source is authoritative for authentication and one source is authoritative for new ASC assignment writes. Dual-read is allowed only for parity evidence. Dual-write, union-of-rights and runtime JIT reconciliation are prohibited.

## Staged migration

1. **Additive schema:** introduce canonical identity, external binding, sessions, authorization version, versioned roles/mappings, many-to-many ASC assignments, hierarchy snapshots, idempotency and durable audit/outbox structures.
2. **SCIM import:** load identities and assignments without granting production access.
3. **Binding reconciliation:** bind each active legacy identity uniquely to `(issuer, externalSubject)`. Email, username and display name are evidence only.
4. **ASC backfill:** create `IdentityAscAssignment` records from authoritative source data; retain `User.ascCenterId` for comparison only.
5. **Shadow authorization:** evaluate old and target decisions without changing user-visible behavior. Unknown, unexplained privilege expansion and scope mismatch enter reconciliation.
6. **Route cutover:** move one classified route group at a time to the new authorization pipeline and prove negative parity.
7. **Authentication cutover:** require every active privileged identity to be BOUND or EXPLICITLY_DISABLED, revoke legacy sessions, disable normal local login, then activate OIDC BFF.
8. **Legacy removal:** stop legacy ASC reads and credential use; remove legacy fields/credentials in later contract migrations after evidence proves no dependency.
9. **Stabilization:** monitor subject mismatch, authorization mismatch, failed revocation, audit gaps and reconciliation backlog.

## Reconciliation states

```text
PENDING -> BOUND
PENDING -> AMBIGUOUS
PENDING -> CONFLICT
PENDING -> EXPLICITLY_DISABLED
AMBIGUOUS/CONFLICT -> BOUND or EXPLICITLY_DISABLED through named review
```

Authentication is denied for PENDING, AMBIGUOUS and CONFLICT. Binding is one-to-one and immutable through ordinary administration. Post-cutover rebinding is a privileged maker-checker change with authoritative evidence, target digest and audit.

## Cutover gates

```text
Active privileged identities BOUND or EXPLICITLY_DISABLED = 100%
PENDING, AMBIGUOUS or CONFLICT                              = 0
Unexplained privilege expansion                            = 0
ASC_SCOPED routes reading/writing User.ascCenterId          = 0
Normal local-login success after cutover                    = 0
Failed session revocation                                   = 0
Security-sensitive mutation without audit intent            = 0
Successful full rehearsal and rollback                      >= 2 consecutive
```

## Rollback

Rollback uses the last-known-good OIDC-capable artifact/configuration while preserving canonical identity, SCIM lifecycle, authorization versions, revocation and audit state. It never re-enables normal legacy login, legacy credentials, deprovisioned accounts or `User.ascCenterId` as an authorization source.

During IdP outage, new normal authentication fails closed. Existing sessions follow approved lifetime and risk policy. Emergency operational access uses only a named, independently activated break-glass identity. Database rollback must not destroy identity or audit continuity.

