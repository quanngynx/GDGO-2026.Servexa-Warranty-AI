# Servexa Warranty AI — Architecture Gap Report & Execution Checklists

## Project
- Repository: GDGO-2026.Servexa-Warranty-AI
- Type: Agentic AI Warranty Platform
- Architecture Direction:
  - Monorepo
  - NodeJS/Express ecosystem
  - FastAPI AI Service
  - gRPC
  - Redis
  - PostgreSQL + pgvector
  - Cloud Run deployment

---

# 1. Executive Summary

The current codebase already demonstrates a strong engineering mindset and a scalable architectural direction compared to typical hackathon projects.

The project already includes:

- Monorepo architecture
- Shared packages
- gRPC separation
- AI service boundary
- Infrastructure-oriented deployment mindset
- Cloud Run deployment preparation
- Documentation-oriented workflow
- Initial operational architecture

However, the system is still primarily an:

```text
AI Platform Foundation
```

rather than a:

```text
Production-Grade Agentic AI System
```

The largest missing areas are:

1. AI Runtime Core
2. RAG Ingestion Pipeline
3. Workflow Orchestration
4. Redis Streams Event Architecture
5. AI Observability
6. Tool Governance
7. AI Evaluation Framework
8. Multi-Tenant Isolation
9. AI Security Layer
10. Agent Runtime Architecture

---

# 2. Current Architecture Assessment

| Area | Status | Assessment |
|---|---|---|
| Monorepo Structure | Good | Well-organized |
| Shared Packages | Good | Scalable direction |
| FastAPI AI Service | Partial | Skeleton only |
| gRPC Contracts | Partial | Missing governance/versioning |
| PostgreSQL | Good | Needs AI schema improvements |
| pgvector | Partial | Missing production metadata |
| Redis | Partial | Streams architecture missing |
| Cloud Run | Good | Operational setup started |
| Documentation | Excellent | Enterprise-oriented mindset |
| AI Runtime | Weak | Mostly missing |
| Agentic Workflow | Weak | Missing orchestration |
| AI Security | Weak | Traditional API security only |
| AI Observability | Missing | Critical gap |
| AI Evaluation | Missing | Critical gap |

---

# 3. Critical Missing Systems

# 3.1 AI Runtime Core

## Current State
Infrastructure exists, but actual AI runtime architecture is mostly absent.

## Missing

### Retrieval Layer
- semantic retrieval
- hybrid retrieval
- reranking
- contextual compression
- metadata filtering

### Agent Layer
- planner agent
- executor agent
- retrieval agent
- audit agent

### Memory Layer
- short-term memory
- semantic memory
- episodic memory
- persistent memory

### Tool Layer
- tool registry
- tool execution
- tool schemas
- tool governance

---

# 3.2 RAG Ingestion Pipeline

## Current Risk
The system appears retrieval-focused but not ingestion-focused.

Production RAG systems fail mainly because ingestion is weak.

## Missing

### Document Loaders
- PDF loader
- DOCX loader
- Excel loader
- OCR/image loader
- HTML loader

### Chunking
- semantic chunking
- recursive chunking
- metadata-aware chunking
- hierarchical chunking

### Metadata Extraction
- document source
- warranty ID
- customer scope
- timestamps
- access scopes

### Versioning
- chunk hash
- embedding version
- document version
- invalidation strategy

### Pipelines
- async ingestion
- re-index pipeline
- batch ingestion
- retry handling

---

# 3.3 Redis Streams Event Architecture

## Current Risk
Without event-driven AI processing, synchronous AI requests will become bottlenecks.

## Missing

### Stream Architecture
- producer services
- consumer workers
- consumer groups
- retry queues
- dead-letter queues
- delayed jobs

### Reliability
- idempotency
- retry policy
- poison message handling
- timeout handling
- job status tracking

### Recommended Flow

```text
Client
  -> API Gateway
      -> Redis Stream
          -> AI Worker
              -> Tool Execution
                  -> Result Event
```

---

# 3.4 Workflow Orchestration

## Current Risk
Business logic may eventually spread into prompts and services.

## Missing

### Workflow Engine
- workflow state machine
- orchestration engine
- workflow transitions
- compensating actions
- rollback handling

### Warranty Workflows
- claim intake workflow
- policy validation workflow
- escalation workflow
- technician assignment workflow
- fraud detection workflow

---

# 3.5 AI Observability

## Current Risk
No visibility into AI behavior.

## Missing

### Tracing
- prompt tracing
- retrieval tracing
- tool execution tracing
- latency tracing
- token tracing

### Monitoring
- hallucination monitoring
- retrieval accuracy
- failed tool calls
- queue monitoring
- token cost tracking

### Recommended Stack
- Langfuse
- OpenTelemetry
- Grafana
- Loki
- Prometheus

---

# 3.6 Tool Governance

## Current Risk
AI tools can become unsafe without authorization and execution boundaries.

## Missing

### Security
- tool permissions
- role-based tool access
- tenant-aware execution
- execution timeout
- sandboxing

### Governance
- audit logs
- execution tracking
- approval workflows
- restricted tools

---

# 3.7 AI Evaluation Framework

## Current Risk
No systematic way to evaluate AI quality.

## Missing

### Evaluation Types
- retrieval evaluation
- hallucination evaluation
- prompt regression testing
- tool execution testing
- citation correctness

### Benchmarks
- latency benchmarks
- grounding accuracy
- claim-processing accuracy
- workflow completion rate

---

# 3.8 Multi-Tenant Isolation

## Current Risk
Future scaling to multiple warranty centers/vendors may cause data leakage.

## Missing

### Isolation
- tenant-aware retrieval
- tenant-aware memory
- tenant-aware vector search
- scoped tools
- scoped workflows

### Required Fields

```text
tenant_id
access_scope
document_scope
memory_scope
```

---

# 3.9 AI Security Layer

## Current Risk
Traditional API security is insufficient for AI systems.

## Missing

### AI Security
- prompt injection defense
- unsafe tool execution prevention
- hallucination blocking
- PII masking
- confidence thresholds
- AI response validation

---

# 3.10 Operational Dashboard

## Missing

### AI Operations Dashboard
- workflow monitor
- retrieval monitor
- queue monitor
- token usage dashboard
- failed jobs dashboard
- AI trace viewer

---

# 4. Recommended Target Architecture

```text
apps/
 ├── api-gateway
 ├── erp-core
 ├── ai-services
 │    ├── runtime
 │    ├── retrieval
 │    ├── ingestion
 │    ├── agents
 │    ├── memory
 │    ├── workflows
 │    ├── tools
 │    ├── evaluation
 │    └── observability
 │
 ├── workers
 │    ├── ingestion-worker
 │    ├── retrieval-worker
 │    ├── workflow-worker
 │    └── notification-worker
 │
 └── dashboard

packages/
 ├── proto
 ├── shared
 ├── database
 ├── env
 └── event-contracts
```

---

# 5. Production Readiness Checklist

# 5.1 Core Platform Checklist

## Infrastructure
- [ ] Standardize monorepo conventions
- [ ] Create environment strategy
- [ ] Create staging environment
- [ ] Create production environment
- [ ] Implement CI/CD pipelines
- [ ] Add container health checks
- [ ] Add graceful shutdown handling

## Database
- [ ] Add pgvector production schema
- [ ] Add embedding_version
- [ ] Add chunk_hash
- [ ] Add tenant_id
- [ ] Add document_scope
- [ ] Add retrieval indexes

## Contracts
- [ ] Add protobuf versioning
- [ ] Add API contract governance
- [ ] Add typed AI response contracts
- [ ] Add internal event contracts

---

# 5.2 RAG Checklist

## Ingestion
- [ ] Build document ingestion pipeline
- [ ] Build PDF loader
- [ ] Build DOCX loader
- [ ] Build OCR loader
- [ ] Build metadata extractor
- [ ] Build semantic chunker
- [ ] Build async indexing pipeline

## Retrieval
- [ ] Build hybrid search
- [ ] Build reranking
- [ ] Build metadata filtering
- [ ] Build citation mapping
- [ ] Build retrieval caching

## Vector Infrastructure
- [ ] Add embedding versioning
- [ ] Add chunk deduplication
- [ ] Add re-index pipeline
- [ ] Add vector cleanup strategy

---

# 5.3 AI Runtime Checklist

## Runtime
- [ ] Build runtime abstraction
- [ ] Add provider abstraction
- [ ] Add Gemini adapter
- [ ] Add model fallback
- [ ] Add structured outputs
- [ ] Add prompt templates
- [ ] Add prompt versioning

## Agents
- [ ] Create planner agent
- [ ] Create execution agent
- [ ] Create retrieval agent
- [ ] Create audit agent

## Memory
- [ ] Implement short-term memory
- [ ] Implement semantic memory
- [ ] Implement persistent memory
- [ ] Implement memory pruning

---

# 5.4 Redis Streams Checklist

## Streams
- [ ] Create producer layer
- [ ] Create consumer workers
- [ ] Create consumer groups
- [ ] Create retry queue
- [ ] Create dead-letter queue

## Reliability
- [ ] Add idempotency
- [ ] Add retry policies
- [ ] Add poison message handling
- [ ] Add timeout handling
- [ ] Add event replay support

---

# 5.5 Workflow Engine Checklist

## Core Workflow
- [ ] Build workflow orchestrator
- [ ] Build state machine engine
- [ ] Add workflow persistence
- [ ] Add retry transitions
- [ ] Add compensating actions

## Business Workflows
- [ ] Claim intake workflow
- [ ] Policy validation workflow
- [ ] Technician assignment workflow
- [ ] Escalation workflow
- [ ] Fraud detection workflow

---

# 5.6 Tool Governance Checklist

## Tool Runtime
- [ ] Create tool registry
- [ ] Create tool schemas
- [ ] Create tool execution runtime
- [ ] Add execution timeout
- [ ] Add sandboxing

## Security
- [ ] Add RBAC for tools
- [ ] Add tenant-aware tools
- [ ] Add approval workflows
- [ ] Add audit logging

---

# 5.7 Observability Checklist

## Tracing
- [ ] Integrate Langfuse
- [ ] Integrate OpenTelemetry
- [ ] Add prompt tracing
- [ ] Add retrieval tracing
- [ ] Add workflow tracing

## Monitoring
- [ ] Add Grafana dashboards
- [ ] Add queue metrics
- [ ] Add token metrics
- [ ] Add hallucination metrics
- [ ] Add latency metrics

---

# 5.8 AI Security Checklist

## Security
- [ ] Add prompt injection detection
- [ ] Add output validation
- [ ] Add confidence thresholds
- [ ] Add PII masking
- [ ] Add unsafe tool blocking

## Governance
- [ ] Add AI audit logs
- [ ] Add moderation layer
- [ ] Add restricted-action approval

---

# 5.9 AI Evaluation Checklist

## Testing
- [ ] Add retrieval evaluation
- [ ] Add hallucination evaluation
- [ ] Add prompt regression tests
- [ ] Add tool execution tests
- [ ] Add workflow simulation tests

## Benchmarking
- [ ] Add latency benchmark
- [ ] Add throughput benchmark
- [ ] Add retrieval accuracy benchmark
- [ ] Add workflow completion benchmark

---

# 5.10 Frontend Operations Checklist

## Dashboard
- [ ] Build AI operations dashboard
- [ ] Build workflow monitor
- [ ] Build queue monitor
- [ ] Build AI trace viewer
- [ ] Build token usage dashboard

---

# 6. Suggested Development Phases

# Phase 1 — Foundation Stabilization

## Goals
Stabilize infrastructure and AI runtime boundaries.

## Tasks
- Redis Streams architecture
- pgvector production schema
- AI runtime abstraction
- ingestion pipeline foundation
- protobuf governance

---

# Phase 2 — Production RAG

## Goals
Build robust retrieval system.

## Tasks
- semantic chunking
- hybrid retrieval
- reranking
- metadata filtering
- citation system
- retrieval observability

---

# Phase 3 — Agentic Workflows

## Goals
Introduce orchestrated AI workflows.

## Tasks
- workflow engine
- planner/executor architecture
- tool runtime
- workflow persistence
- audit workflows

---

# Phase 4 — Operational Excellence

## Goals
Production-grade operational maturity.

## Tasks
- observability stack
- evaluation framework
- AI dashboards
- cost tracking
- governance systems

---

# Phase 5 — Advanced AI Platform

## Goals
Advanced autonomous capabilities.

## Tasks
- multi-agent coordination
- autonomous planning
- advanced memory systems
- self-healing workflows
- adaptive orchestration

---

# 7. Final Assessment

## Engineering Mindset
Strong.

## Architecture Direction
Correct for long-term scaling.

## Documentation Culture
Excellent.

## AI Runtime Maturity
Still early-stage.

## Production Readiness
Moderate.

## Long-Term Potential
High.

---

# Final Recommendation

The highest priority should NOT be:

- frontend polish
- more CRUD APIs
- more UI features

The highest priority should be:

1. AI Runtime Core
2. Event-Driven Architecture
3. Workflow Orchestration
4. AI Observability
5. AI Governance
6. Evaluation Framework

These systems determine whether the platform can evolve into a true production-grade Agentic AI platform or remain a traditional backend with LLM integration.

