# P0A Synthetic Technical Readiness

P0A is an executable reference environment. It is **not** production certification and does not replace the enterprise P0B gate.

## Boundaries

The stack uses synthetic identities, cases, policy identifiers, provider responses and credentials. Reference SCIM, warranty and AI services implement internal contracts and controlled failure modes only. They must never be configured with enterprise endpoints or real customer data.

P0A may end at `READY_FOR_SIGN_OFF`. `CLOSED` additionally requires named Engineering and Security approvers. Even when closed, only a synthetic P1 reference track is allowed; `documents/production-readiness/p0-gate.json` remains authoritative for production progression.

## Commands

- `pnpm p0a:up` creates isolated secrets and starts project `servexa-p0a`.
- `pnpm p0a:smoke` runs identity, reference-service, network and telemetry checks.
- `pnpm p0a:load` runs the fixed 10-VU baseline and 20-VU peak profile.
- `pnpm p0a:proof` runs all seven proof groups and writes a checksummed, Ed25519-signed `.p0a/evidence/registry.json` with tool and image versions.
- `pnpm p0a:test` runs gate/evidence validator regression tests, including stale source, artifact tampering, GitHub provenance and approval-boundary cases.
- `pnpm p0a:check` validates static governance and keeps P0B blocked.
- `pnpm p0a:gate` validates current checksummed evidence and the requested P0A state.
- `pnpm p0a:down` stops only the fixed `servexa-p0a` Compose project and removes only the named volumes declared by `docker-compose.p0a.yml`. Development and production projects/data are not addressed.

Raw reports, the ephemeral evidence-signing private key, generated Keycloak realm and all synthetic credentials live under `.p0a/` and are ignored by Git. CI uploads only `.p0a/evidence/` with 30-day retention; it does not upload the private key or runtime credentials. The public verification key is embedded in the signed registry; it is a synthetic integrity proof, not a production trust anchor. The committed schema and template define the durable evidence format.

The source digest is defined by `evidence-scopes/p0a.json`. It binds P0A-owned proof definitions, topology, code, schemas and explicitly declared shared dependencies while normalizing only gate status/timestamp/sign-off metadata. Later-phase files outside that ownership scope do not invalidate historical P0A evidence; a change to any owned file, scope manifest or declared dependency does. The signed registry records the scope identity, version, manifest path and file count. Approved sign-off evidence must stay under `documents/production-readiness/signoffs/p0a/`.

Telemetry proof triggers an actual P0A-only request path across Express, FastAPI, the AI reference provider and a Redis-backed AI worker, then verifies one W3C trace and correlation ID in Jaeger. P0A-only endpoints and worker behavior require `P0A_ENABLED=true` and are selected only by `docker-compose.p0a.yml`.

AI data-handling proof sends a uniquely marked forbidden field to a P0A-only FastAPI provider boundary. The boundary constructs an allowlisted request, the strict reference provider accepts only the sanitized payload, and the runner verifies that the marker is absent from provider output, application logs, traces and retained evidence. A direct restricted request is also required to fail closed.

Recovery proof writes a marker, archives WAL to TLS-enabled MinIO Object Lock storage, creates a full pgBackRest backup, deletes the primary marker to simulate loss and restores into a separate database volume. Measured synthetic RPO/RTO are recorded without claiming the production targets.

## Synthetic capacity profile

The baseline is 10 VUs for 60 seconds. Peak is 20 VUs for 60 seconds. Each closed-loop VU waits one second between iterations, bounding the reference profile to approximately 600 baseline and 1,200 peak iterations instead of turning the VU count into an unbounded throughput test. Each request has a three-second timeout and each k6 Compose command has a three-minute process timeout. Required results are error rate below 1%, p95 below 1500 ms, no unexpected status/dropped iterations and backlog recovery within 60 seconds. These figures validate the harness only; the enterprise capacity baseline remains open in P0B.
