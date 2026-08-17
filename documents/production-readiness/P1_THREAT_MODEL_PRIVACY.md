# P1 Identity Threat Model, Privacy and Cryptography

## Assets and trust boundaries

Protected assets include canonical identities, OIDC grants, Servexa sessions, authorization versions, role/mapping/assignment versions, ASC hierarchy snapshots, break-glass activations, audit chains and encrypted exports.

Trust boundaries:

1. browser to Express BFF;
2. Express to enterprise IdP/identity broker;
3. SCIM connector to identity provisioning transaction;
4. Express to ASC hierarchy connector;
5. application to Redis/PostgreSQL/object storage;
6. application to KeyManagementPort;
7. business transaction to audit/outbox and later WORM boundary.

React never becomes an authorization authority. FastAPI does not authenticate users or resolve business permissions. Express owns authentication/session binding, authorization and final business enforcement.

## Threat register

| Threat | Required control | Required proof |
| --- | --- | --- |
| Login CSRF/code interception | state, nonce, PKCE, exact redirect URI | Browser/API negative suite |
| Token substitution | issuer, audience, authorized-party and signature validation | Invalid-token fixtures |
| Session fixation/replay | opaque rotation, server lifecycle, secure cookie, replay detection | Browser/concurrency tests |
| Deprovisioned session use | authorizationVersion check and revoke-all outbox | Revocation fault tests |
| Group-claim privilege union | SCIM-authoritative mapping; mismatch denies | Claim/mapping matrix |
| Cross-ASC access | server resolver, authorized query scope, final recheck | Property/API/E2E tests |
| Wildcard/admin bypass | explicit capability registry; invariant layer | Admin negative tests |
| Self-approval | originating actor and history-based SoD | Direct/concurrent decision tests |
| Indirect self-escalation | privilege-delta maker-checker | Role/mapping/assignment tests |
| Stale authorization/TOCTOU | version check and transactional resolution | Concurrent downgrade tests |
| Break-glass abuse | dual control, expiry, independent MFA and alerting | Activation/revoke tests |
| Audit rewrite/gap | partitioned chain, signed checkpoint and verification | Tamper suite |
| Export exfiltration | independent approval, digest/recipient binding, encryption and TTL | Export invariant tests |
| PII/token leakage | allowlists, masking and artifact scanning | Logs/traces/audit/evidence scan |
| Key compromise/tampering | KeyManagementPort, AES-256-GCM, versioned envelope keys | Rotation/tamper/restore tests |

Critical and High findings block closure. Medium findings require a named owner, remediation deadline, compensating control and explicit Security acceptance. Safety-invariant violations cannot be accepted as risk.

## Data minimization

Canonical identity persists only internal identity ID, issuer, immutable external subject, stable pseudonymous actor reference, lifecycle/status and technical metadata. Allowlisted business profile fields are display name, enterprise email when an approved contact use case exists, and locale. Authorization assignments are stored separately.

Raw OIDC/SAML assertions, raw SCIM payload, access tokens, SSO credentials, national ID, address, personal contact and unrelated HR attributes are not persisted. Unknown ingestion attributes are dropped. Email is never the authoritative identity key. Audit and logs prefer actorRef and opaque references; email is removed or masked.

## Privacy lifecycle

```text
ACTIVE -> DEACTIVATED -> PSEUDONYMIZED -> PURGED
```

Deactivation removes access immediately. In the P1 synthetic profile, profile PII is pseudonymized after a maximum 30-day grace period and export artifacts expire after 24 hours. Stable actorRef and minimum accountability data remain under audit retention. Legal hold pauses only the covered purge/pseudonymization; application and release actions are audited. Restored backups must reapply retention and legal-hold state before serving data.

## Cryptography

Domain code depends on `KeyManagementPort`. P1R uses a versioned synthetic provider; P1P supplies the approved production KMS without changing business code. Sensitive values use AES-256-GCM envelope encryption. Ciphertext stores algorithm, key version, encrypted DEK, nonce, authentication tag and necessary associated-data metadata.

Missing, unknown or revoked keys fail closed. Hardcoded keys, random process fallback keys, plaintext keys in source/log/evidence and unauthenticated AES-CBC are prohibited. Proof covers round-trip, ciphertext/AAD/tag tampering, rotation, old-key compatibility and backup/restore.

## Audit integrity

Audit chains are partitioned by enterprise environment and stream/type, not by ASC by default. Each envelope includes schema version, chain ID, monotonically increasing sequence, canonical payload hash, previous/current hash, timestamp and correlation/trace references. Append serializes per chain while chains progress concurrently.

A signed chain-head manifest periodically checkpoints every active chain and is stored across a different trust/storage boundary. Verification detects modified payload, deletion/sequence gap, reordering, broken linkage and invalid checkpoint. Merkle aggregation may be added later but is not required for P1.

Security-sensitive mutations commit business/security state and durable audit intent/outbox atomically. If required audit integrity is unavailable, high-impact mutations deny. Policy may permit read-only and low-risk operations in an explicitly audited degraded mode.

