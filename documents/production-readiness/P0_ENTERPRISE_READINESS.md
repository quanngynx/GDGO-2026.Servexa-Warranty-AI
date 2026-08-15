# P0 Enterprise Readiness Gate

> **Status:** `BLOCKED`<br>
> **Authoritative state:** [`p0-gate.json`](./p0-gate.json)<br>
> **Rule:** P1 may not start until this gate is `CLOSED`

## Decision register

`OPEN` is intentional: no customer, vendor, identity platform, external system,
or AI provider has been authorized in the repository context.

| Decision | Current state | Required evidence | Accountable approver |
| --- | --- | --- | --- |
| Target enterprise | `OPEN` | Legal entity, business sponsor, network/ASC scope, operating hours | Business |
| First external warranty system | `OPEN` | Product/version, technical owner, sandbox, API/event documentation | Business + Engineering |
| Production connector | `OPEN` | Supported operations, auth, limits, idempotency, webhook/event capability, support owner | Engineering |
| Vietnam deployment target | `OPEN` | Physical residency attestation, DPA, failure domains, managed service availability | Security + Operations |
| Enterprise IdP | `OPEN` | OIDC capability or documented SAML fallback, MFA, SCIM, group claims, deprovision SLA | Security |
| AI and embedding provider | `OPEN` | DPA, zero-retention/no-training terms, residency path, encryption, deletion, incident terms | Security + Data/AI |
| Production topology | `OPEN` | Network diagram, HA proof, private data services, backup separation, secrets design | Engineering + Operations |
| Capacity baseline | `OPEN` | ASC count, concurrent users, business-hour peak, case volume, document volume, connector quotas | Business + Operations |

## Required proof sequence

1. Name the enterprise, accountable owners, and first system of record.
2. Complete the source-of-truth and integration inventory.
3. Shortlist only deployment and AI vendors that satisfy Vietnam residency and contractual controls.
4. Select the IdP protocol: OIDC when supported, otherwise SAML; confirm SCIM and MFA.
5. Run an isolated proof using synthetic data. Do not use customer production data.
6. Prove private connectivity, secret delivery, AI-provider controls, HA behavior, and backup/restore feasibility.
7. Record accepted choices in ADRs and attach immutable evidence references to the gate manifest.
8. Obtain all required sign-offs and run `pnpm p0:gate`.

## Evidence quality rules

- A marketing page is not residency, retention, or availability evidence.
- A configured feature is not proof until exercised in the selected environment.
- Evidence references must be immutable or versioned and accessible to reviewers.
- Secret values, tokens, customer records, and signed legal documents must not be committed.
- Legal evidence is referenced by controlled document ID and version, not copied into Git.
- Every proof records executor, date, environment, input class, result, and reviewer.

## Sign-off record

| Role | State | Named approver | Evidence reference |
| --- | --- | --- | --- |
| Business | `PENDING` | Not assigned | Not available |
| Security | `PENDING` | Not assigned | Not available |
| Engineering | `PENDING` | Not assigned | Not available |
| Operations | `PENDING` | Not assigned | Not available |

The table is explanatory. Update `p0-gate.json` in the same change when a state
changes. A named approver and evidence reference are mandatory for `APPROVED`.

## Explicit non-approval

Current Docker Compose, Cloud Run manifests, local JWT authentication, and the
FastAPI ERP helper are implementation evidence only. They do not select the P0
deployment target, IdP, connector, provider, topology, or production control set.
