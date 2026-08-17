# ADR-013: Separate synthetic technical readiness from enterprise production closure

## Status

Accepted for implementation on 2026-08-15.

## Decision

P0 is split into two non-interchangeable control planes:

- **P0A** proves repeatable technical machinery in a synthetic, production-like environment.
- **P0B** remains the authoritative enterprise production gate in `p0-gate.json`.

P0A evidence may authorize only a synthetic P1 reference track. It cannot select a vendor, satisfy a DPA, establish Vietnam residency, approve an enterprise IdP or external system, or authorize production work.

P0A reaches `READY_FOR_SIGN_OFF` only after all seven proof groups have current checksummed evidence. It reaches `CLOSED` only after named Engineering and Security approvals. P0B requires its existing Business, Security, Engineering and Operations sign-offs independently.

## Consequences

- All P0A services, identities, secrets and data are synthetic.
- CI must preserve raw evidence outside Git and bind its registry to the tested source state.
- Evidence registries are signed with an ephemeral synthetic Ed25519 key; this detects mutation but is not an enterprise signing identity or production trust anchor.
- Gate-status and named sign-off documents are the only post-proof source-digest whitelist. Technical source changes invalidate evidence.
- Production claims and P1 production work remain blocked while P0B is not `CLOSED`.
- Direct FastAPI-to-ERP behavior is not promoted or expanded by P0A.
