# Deployment Architecture

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define the canonical service deployment topology and environment isolation.

## Scope

Cloud Run services, networking, configuration, discovery, health, scaling, and deployment principles.

## Dependencies

Delivery automation is defined by the CD pipeline; procedures are defined by runbooks.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part VI — Deployment Architecture

---

### 53. Deployment Philosophy

Servexa Warranty AI follows a **cloud-native, container-first** deployment model. Every deployable service is packaged as an immutable Docker image and deployed independently to minimize coupling between services.

Deployment objectives:

* Independent service deployment
* Immutable infrastructure
* Zero application configuration changes between environments
* Automated deployment
* Safe rollback
* Horizontal scalability

---

### 54. High-Level Deployment Topology

```text
                         Internet
                             │
                             ▼
                    Cloudflare (DNS)
                             │
                             ▼
                    HTTPS Load Balancer
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
      Cloud Run                     Cloud Run
      React Web                     Express API
                                            │
                                    Internal HTTP
                                            │
                                            ▼
                                     Cloud Run
                                  FastAPI AI Runtime
                                            │
          ┌───────────────────────┼────────────────────────┐
          ▼                       ▼                        ▼
     PostgreSQL              Redis                 pgvector
```

---

### 55. Service Deployment Model

Each application is deployed independently.

| Service            | Deployment Target    |
| ------------------ | -------------------- |
| React Web          | Cloud Run            |
| Express API        | Cloud Run            |
| FastAPI AI Runtime | Cloud Run            |
| PostgreSQL         | Managed PostgreSQL   |
| Redis              | Managed Redis        |
| pgvector           | PostgreSQL Extension |

Independent deployments reduce deployment risk and enable faster release cycles.

---

### 56. Communication Architecture

Inter-service communication follows strict boundaries.

Frontend

↓

Express

↓

FastAPI

↓

Infrastructure

Rules:

* Frontend never communicates directly with FastAPI.
* AI Runtime never bypasses Express for business data.
* Business services remain the source of truth.
* AI Runtime accesses Knowledge Base directly through pgvector.

---

### 57. Networking Strategy

The deployment architecture separates external and internal traffic.

External Traffic

* React
* Express APIs

Internal Traffic

* Express → FastAPI
* FastAPI → PostgreSQL
* FastAPI → Redis
* Express → PostgreSQL
* Express → Redis

Internal APIs should never be publicly exposed.

---

### 58. Environment Isolation

Each deployment environment maintains isolated resources.

Typical environments:

* Development
* Staging
* Production

Each environment has:

* Separate Cloud Run services
* Separate databases
* Separate Redis instances
* Separate secrets
* Separate monitoring

---

### 59. Runtime Configuration

Runtime behavior is controlled entirely through configuration.

Configuration includes:

* Environment Variables
* Secret Manager
* Cloud Run Runtime Settings
* Database Connections
* Redis Connections
* AI Provider Configuration

The same container image should run in every environment.

---

### 60. Service Discovery

Services communicate using internal service endpoints.

Example:

```text
React
    ↓
Express
    ↓
FastAPI
```

Application code should never hardcode deployment addresses.

All endpoints are configured through environment variables.

---

### 61. Health Check Strategy

Every deployable service exposes health endpoints.

Typical endpoints:

* Liveness
* Readiness
* Startup

Health checks validate:

* Database connectivity
* Redis connectivity
* External service availability
* Internal initialization

Cloud Run should only route traffic to healthy revisions.

---

### 62. Deployment Principles

Every deployment should satisfy the following:

* Immutable containers
* Stateless application services
* Externalized configuration
* Automated validation
* Easy rollback
* Independent scaling

---

### 24. Deployment Architecture

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Planned Evolution | Partial | Local and demo deployment paths exist; staging and production modes are target operating models without HA or multi-region claims. |

#### Overview

Servexa Warranty AI được thiết kế theo hướng **Container-first**, từ môi trường phát triển cá nhân và Demo đến các run mode Staging/Production đã định nghĩa. Production hiện không mặc định đồng nghĩa với nhiều node, HA, multi-region hay distributed AI Runtime.

Các service được đóng gói độc lập. Khả năng scale riêng là Planned Evolution và chỉ được công bố sau khi state externalization, load test và failure recovery tương ứng đã được xác minh.

Mục tiêu của Deployment Architecture là:

- đơn giản hóa việc triển khai;
- giảm thời gian release;
- tăng khả năng mở rộng;
- hỗ trợ CI/CD tự động;
- giảm downtime.

---

#### Deployment Principles

- Container-first
- Immutable Infrastructure
- Infrastructure as Code
- Stateless Services
- Externalized Configuration
- Automated Deployment

---

#### Environment Strategy

Hệ thống hỗ trợ nhiều môi trường.

```text
[Deployment Diagram]
Local Development

↓

Demo

↓

Staging

↓

Production
```

Mỗi môi trường có:

- Environment Variables
- Database riêng
- Redis riêng
- Object Storage riêng
- AI API Key riêng

---

#### High-level Deployment

```text
[Deployment Diagram]
Internet
                    │
                    ▼
            Reverse Proxy / CDN
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
 React Frontend        Express Gateway / Business API / [SSE]
                                  │
                      ┌───────────┼─────────────┐
                      ▼           ▼             ▼
        [Sync Internal HTTP] PostgreSQL       Redis
                      │      Business Data  State/Streams/PubSub
                      ▼
             FastAPI AI Runtime
                │            │
                ▼            ▼
             pgvector   PostgreSQL Checkpointer

 Object Storage ← Express Upload API
```

---

#### Container Strategy

Mỗi service được đóng gói thành Docker Image độc lập.

Ví dụ:

- frontend
- api
- ai-runtime
- worker
- nginx

Điều này giúp:

- scale riêng;
- rollback nhanh;
- deploy độc lập.

---

#### Configuration Management

Không hardcode bất kỳ cấu hình nào.

Mọi cấu hình đều được quản lý thông qua:

- Environment Variables
- Secret Manager
- Config File

Ví dụ:

```text
DATABASE_URL

REDIS_URL

GEMINI_API_KEY

AI_RUNTIME_URL

PGVECTOR_DATABASE_URL
```

---

#### Secret Management

Secret bao gồm:

- API Keys
- Database Password
- JWT Secret
- OAuth Secret

Không commit lên Git.

Production nên sử dụng:

- Infisical
- Doppler
- AWS Secrets Manager
- Google Secret Manager

---

#### Reverse Proxy

Reverse Proxy chịu trách nhiệm:

- HTTPS
- Compression
- Static Assets
- Cache
- SSE Forwarding

Có thể sử dụng:

- Nginx
- Caddy
- Traefik

---

#### Scaling Strategy

##### Horizontal Scaling

Scale:

- AI Runtime
- Backend API
- Frontend

Độc lập.

---

##### Vertical Scaling

Ưu tiên cho:

- Embedding Worker
- OCR
- Vision

---

#### Zero Downtime Deployment

Deployment hỗ trợ:

```text
[Deployment Diagram]
Current

↓

New Version

↓

Health Check

↓

Traffic Switch

↓

Old Version Removed
```

---

#### Disaster Recovery

Bao gồm:

- Database Backup
- Object Storage Replication
- Configuration Backup
- Infrastructure Backup

---

#### Deliverables

- Docker Architecture
- Deployment Guide
- Environment Strategy
- Secret Management
- Scaling Strategy
- Disaster Recovery Plan

---

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

Implementation details remain governed by the architecture and contracts referenced above.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)
- [Legacy source](../../documents/TECHNICAL_MASTER_PLAN.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-011: Cloud Run deployment strategy](../adr/ADR-011-cloud-run-deployment-strategy.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
