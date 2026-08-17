# Servexa Production Readiness

> **Current gate:** P0 - Production Architecture & Enterprise Readiness<br>
> **Gate status:** `BLOCKED`<br>
> **Next phase allowed:** No<br>
> **Last reviewed:** 2026-08-12

This directory is the control center for the production roadmap. The existing
AI capability phases remain useful implementation maturity markers, but they do
not certify production readiness. Production progression is governed by the
hard-gated P0-P9 roadmap in
[`PRODUCTION_COMPLETION_ROADMAP.md`](./PRODUCTION_COMPLETION_ROADMAP.md).

## Production scope

The only production-certified product slice in this roadmap is:

```text
Eligibility -> Evidence -> Recommendation -> Manager decision
            -> External-system mutation -> Immutable audit
```

Required supporting capabilities are identity, ASC authorization,
policy/knowledge governance, enterprise integration, audit, observability,
recovery, and operations. Every other sidebar or administration module remains
outside the production claim until it passes a separately approved gate.

## Why P0 is blocked

The repository cannot select or fabricate enterprise facts. P0 remains blocked
until all of the following are named, assessed, evidenced, and approved:

1. target enterprise and first external system;
2. production connector and its sandbox/contract owner;
3. deployment target physically hosted in Vietnam;
4. enterprise identity provider and OIDC-or-SAML capability;
5. managed AI/embedding provider with an approved DPA and zero-retention/no-training terms;
6. production topology proof for HA, networking, backup, and failure-domain separation;
7. sign-off from Business, Security, Engineering, and Operations.

No P1-P9 implementation may be represented as production work while this gate
is open. Experiments may continue only when explicitly labelled non-production.

## P0 evidence set

| Artifact | Purpose |
| --- | --- |
| [`P0_ENTERPRISE_READINESS.md`](./P0_ENTERPRISE_READINESS.md) | Decision register, evidence requirements, and sign-off record |
| [`P0_SOURCE_OF_TRUTH_AND_INTEGRATION.md`](./P0_SOURCE_OF_TRUTH_AND_INTEGRATION.md) | Entity ownership, integration seam, and external contract inventory |
| [`P0_SECURITY_DATA_AND_RACI.md`](./P0_SECURITY_DATA_AND_RACI.md) | Threat model, data classification, privacy baseline, and accountable owners |
| [`P0_INFRASTRUCTURE_ASSESSMENT.md`](./P0_INFRASTRUCTURE_ASSESSMENT.md) | Vietnam residency, HA/DR, network, secrets, capacity, and proof criteria |
| [`p0-gate.json`](./p0-gate.json) | Machine-readable gate state and evidence index |

## Gate commands

```bash
pnpm p0:check
pnpm p0:gate
```

- `p0:check` validates the manifest, required artifacts, roles, and consistency.
  It succeeds while the gate is correctly recorded as blocked.
- `p0:gate` additionally requires P0 to be closed. It must fail until every
  prerequisite is verified and every required sign-off is approved.

The gate manifest is authoritative for current progression state. Narrative
documents explain evidence; they do not override the manifest.

## P1 track control plane

P1 is separated into design, synthetic reference and production tracks so that
architecture work cannot be mistaken for a production identity rollout:

| Track | Current authority | Runtime allowed |
| --- | --- | --- |
| P1D | Design artifacts and signed design evidence | No |
| P1R | Requires P0A and P1D CLOSED | No while prerequisites are open |
| P1P | Requires P0B, P1D and P1R CLOSED | No while prerequisites are open |

The P1D artifacts are indexed by [`p1d-gate.json`](./p1d-gate.json). The
blocked runtime and production tracks are recorded in
[`p1r-gate.json`](./p1r-gate.json) and [`p1p-gate.json`](./p1p-gate.json).
Use `pnpm p1:check` for hierarchy validation, `pnpm p1d:proof` to generate a
signed design evidence bundle and `pnpm p1d:gate` for strict readiness checks.
Use `pnpm p1r:preflight` to inspect runtime blockers. `pnpm p1r:up`,
`pnpm p1r:proof` and `pnpm p1r:gate` fail closed until both P0A and P1D are
machine-validated as `CLOSED`; documentation cannot override this guardrail.
