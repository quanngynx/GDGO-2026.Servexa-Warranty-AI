# P0 Vietnam Infrastructure Assessment

> **Status:** `OPEN` - no deployment vendor or enterprise topology selected

## Non-negotiable requirements

- All production data, replicas, logs containing production data, object
  storage, audit exports, and backups remain physically in Vietnam.
- Application and data planes use at least two independent failure domains in Vietnam.
- PostgreSQL, Redis, FastAPI, workers, and administrative endpoints are private.
- Public traffic reaches only managed ingress/reverse proxy and the approved web/API paths.
- The deployment supports Web, Express, FastAPI, Redis workers, PostgreSQL with
  pgvector, object storage, and WORM/object-lock audit export.
- Backup/PITR design targets RPO <= 5 minutes; tested restoration targets RTO <= 60 minutes.
- Golden-workflow availability target is 99.9% during ASC operating hours;
  priority-1 incident support is on-call 24/7.
- Capacity proof uses expected full-network peak x2 and includes connector quotas and recovery after backlog.

## Candidate assessment matrix

Do not score a candidate until evidence is attached.

| Criterion | Weight | Candidate evidence required |
| --- | ---: | --- |
| Vietnam physical residency and contractual commitment | Gate | DPA, service-region documentation, backup/log residency |
| Independent Vietnam failure domains | Gate | Region/zone or site topology and shared-risk disclosure |
| Managed PostgreSQL/pgvector or operable equivalent | 15 | HA, PITR, encryption, maintenance, metrics, restore workflow |
| Managed Redis or operable equivalent | 10 | HA, persistence policy, failover, TLS/auth, metrics |
| Private network and service identity | 15 | Private endpoints, workload identity, firewall/policy controls |
| Object storage and immutable audit support | 10 | Versioning, object lock/WORM, retention, legal hold, export |
| Secret and key management | 10 | Workload delivery, rotation, audit, customer-managed key options |
| Container runtime and worker scaling | 10 | Health checks, rolling/canary deploy, autoscaling, job semantics |
| Observability and security integration | 10 | OTLP path, log/metric retention, alerting, SIEM export |
| Backup/DR proof and support | 10 | Restore tooling, failure-domain separation, incident escalation |
| Cost, quota, and capacity viability | 10 | Full-network x2 estimate, service quotas, connector egress path |

Any failure of a gate criterion rejects the candidate regardless of numeric score.

## Required proof environment

Use synthetic `CONFIDENTIAL`-equivalent data only. The proof must deploy:

```text
Public ingress
  -> Web
  -> Express
       -> private PostgreSQL/pgvector
       -> private Redis
       -> private FastAPI and worker
       -> private object/audit storage
       -> controlled enterprise-system sandbox path
       -> controlled managed-AI-provider path
```

## Proof cases

| Proof | Pass condition |
| --- | --- |
| Residency | Every configured storage, replica, backup, log sink, and support path is evidenced in Vietnam |
| Network isolation | Direct public access to PostgreSQL, Redis, FastAPI, workers, and admin endpoints is denied |
| Identity | Selected IdP authenticates; SCIM create/update/deprovision and group mapping work; MFA is enforced |
| Secrets | Workloads obtain secrets without repository/plaintext injection; access and rotation are audited |
| AI provider | Synthetic request proves approved endpoint, redaction, logging controls, and contractual mode |
| HA | A single failure-domain loss preserves or restores the golden-workflow dependency set |
| Backup/PITR | Restore point meets RPO target and timed restore meets RTO target |
| Observability | One correlation ID crosses ingress, Express, FastAPI, Redis work, and external sandbox call |
| Capacity | Full-network peak x2 completes within signed latency/backlog thresholds and recovers after a spike |
| Deployment | Immutable artifact promotion and rollback are demonstrated without configuration drift |

## Capacity inputs that must be supplied

- total ASC centers and operating-hour/time-zone pattern;
- named and concurrent intake operators, managers, and exception approvers;
- average and peak cases per minute/hour/day;
- Evidence documents, average size, ingestion/reindex frequency, and retrieval rate;
- AI requests per case, token/embedding assumptions, and provider quotas;
- connector query/command/event volume and vendor limits;
- SSE connections, audit-event volume, retention, and export volume;
- acceptable latency by evaluation, decision, execution, and reconciliation step.

## Decision record

| Field | State |
| --- | --- |
| Selected deployment target | `OPEN` |
| Selected failure domains | `OPEN` |
| Selected PostgreSQL/Redis/storage services | `OPEN` |
| Selected secret/key management | `OPEN` |
| Selected observability stack | `OPEN` |
| Selected AI-provider network path | `OPEN` |
| Approved capacity baseline | `OPEN` |
| Infrastructure proof result | `NOT_RUN` |

The selected design must be captured in a follow-up ADR. Existing Cloud Run or
Docker Compose files are implementation candidates, not a P0 selection.
