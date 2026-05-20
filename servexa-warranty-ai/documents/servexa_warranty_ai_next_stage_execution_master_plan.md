# Servexa Warranty AI — Next Stage Execution Master Plan

## Project
- Repository: GDGO-2026.Servexa-Warranty-AI
- Current Stage: Hybrid Transitional AI Runtime
- Target Stage: Unified Operational AI Platform

---

# 1. Executive Summary

The current architecture has successfully evolved beyond:

```text
simple backend + LLM integration
```

and is now operating as:

```text
hybrid AI runtime platform
```

The platform currently contains:

- synchronous inference runtime
- asynchronous event-driven runtime
- Redis Streams foundation
- LangGraph orchestration foundation
- coordinator-based routing
- early tool runtime
- retrieval-first RAG foundation
- cloud-native service separation

This is a strong architectural direction.

However, the platform is currently in a:

```text
transitional runtime state
```

where two execution paradigms coexist:

1. Legacy synchronous inference path
2. New asynchronous AI runtime path

The next architectural objective is:

```text
runtime unification and production stabilization
```

before deeper autonomous AI capabilities are introduced.

---

# 2. Current Architecture Reality

# Current Runtime State

```text
Frontend
   ↓
Server/API
   ↓
Auth/Middleware
   ↓
Either:

(A) Direct Runtime
    ↓
    completeUnaryPrompt()
    ↓
    LLM

OR

(B) Async Runtime
    ↓
    Redis Streams
    ↓
    AI Workers
    ↓
    LangGraph Coordinator
    ↓
    Tools/RAG
    ↓
    LLM
```

---

# 3. Primary Architectural Risks

# 3.1 Runtime Fragmentation

## Current Risk
Two orchestration systems currently coexist:

- Node planner/executor orchestration
- Python LangGraph orchestration

This can eventually cause:

- duplicated business logic
- inconsistent AI behavior
- prompt divergence
- orchestration drift
- debugging complexity

## Required Goal

```text
Single Unified Runtime Layer
```

---

# 3.2 RAG Ingestion Gap

## Current Risk
The system currently has:

```text
retrieval runtime
```

but not:

```text
production ingestion runtime
```

This is currently the largest technical gap.

---

# 3.3 Missing Workflow Runtime

## Current Risk
Current orchestration is:

```text
request-oriented
```

not:

```text
workflow-oriented
```

This prevents:

- long-running workflows
- retryable workflows
- compensating actions
- persistent AI state
- enterprise orchestration

---

# 3.4 Governance Gap

## Current Risk
Tools currently execute with limited governance.

Missing:

- tool permissions
- execution scopes
- approval systems
- risk scoring
- audit trails

---

# 3.5 Observability Gap

## Current Risk
Current observability is:

```text
metrics-first
```

not:

```text
distributed AI tracing
```

This limits:

- runtime debugging
- AI quality monitoring
- workflow tracing
- hallucination analysis

---

# 4. Next Strategic Objective

# PRIMARY OBJECTIVE

## Transition From

```text
Hybrid Transitional Runtime
```

## Into

```text
Unified Operational AI Runtime
```

---

# 5. Execution Strategy

# Recommended Scope

## Immediate Detailed Execution

### PHASE 1
Runtime Stabilization

### PHASE 2
Production RAG Runtime

---

## Future Strategic Roadmap

### PHASE 3
Workflow Runtime

### PHASE 4
Governance & Security

### PHASE 5
Observability & Evaluation

### PHASE 6
Autonomous Runtime Evolution

---

# 6. PHASE 1 — Runtime Stabilization

# Objectives

- unify runtime direction
- stabilize event-driven execution
- reduce orchestration fragmentation
- harden Redis runtime
- standardize contracts

---

# 6.1 Runtime Unification

## Goal
Reduce architectural duplication.

## Tasks

### Node Runtime
- [ ] Audit all direct `completeUnaryPrompt()` usages
- [ ] Classify sync vs async execution paths
- [ ] Remove duplicate orchestration logic
- [ ] Move orchestration ownership into ai-services

### Python Runtime
- [ ] Centralize orchestration into LangGraph runtime
- [ ] Define coordinator boundaries
- [ ] Separate orchestration from business logic
- [ ] Define standardized agent interfaces

### Runtime Direction
- [ ] Define single orchestration entrypoint
- [ ] Define runtime execution contracts
- [ ] Standardize request/response payloads
- [ ] Define execution context model

---

# 6.2 Redis Streams Hardening

## Goal
Convert Redis Streams into production-capable runtime infrastructure.

## Tasks

### Reliability
- [ ] Add dead-letter queues
- [ ] Add retry queues
- [ ] Add idempotency keys
- [ ] Add visibility timeout
- [ ] Add poison message handling
- [ ] Add replay support

### Workers
- [ ] Standardize worker lifecycle
- [ ] Add worker heartbeats
- [ ] Add worker concurrency controls
- [ ] Add graceful shutdown handling
- [ ] Add job cancellation support

### Monitoring
- [ ] Add stream metrics
- [ ] Add queue depth metrics
- [ ] Add retry metrics
- [ ] Add failed job metrics

---

# 6.3 Contract Governance

## Goal
Stabilize service boundaries.

## Tasks

### Protobuf
- [ ] Add protobuf versioning
- [ ] Add schema evolution rules
- [ ] Add compatibility checks
- [ ] Standardize event contracts

### Shared Models
- [ ] Standardize execution context
- [ ] Standardize AI response contracts
- [ ] Standardize workflow event payloads
- [ ] Standardize retrieval payloads

---

# 6.4 Tool Runtime Stabilization

## Goal
Convert tools into governed execution runtime.

## Tasks

### Runtime
- [ ] Standardize tool interfaces
- [ ] Add execution timeout
- [ ] Add tool retry handling
- [ ] Add execution tracing

### Governance
- [ ] Add tool scopes
- [ ] Add role-based permissions
- [ ] Add tenant-aware execution
- [ ] Add audit logging

---

# 6.5 Runtime Acceptance Criteria

## Success Conditions

- [ ] All async flows standardized
- [ ] Redis runtime resilient to failures
- [ ] Single orchestration direction defined
- [ ] AI workers observable
- [ ] Tool runtime standardized
- [ ] Contracts versioned

---

# 7. PHASE 2 — Production RAG Runtime

# Objectives

- build ingestion runtime
- stabilize retrieval quality
- enable enterprise document workflows
- support scalable operational knowledge

---

# 7.1 RAG Ingestion Runtime

## Goal
Build enterprise-grade ingestion pipelines.

## Tasks

### Loaders
- [ ] Build PDF loader
- [ ] Build DOCX loader
- [ ] Build Excel loader
- [ ] Build OCR/image loader
- [ ] Build HTML loader

### Pipelines
- [ ] Build ingestion queues
- [ ] Build async ingestion workers
- [ ] Build retry ingestion flow
- [ ] Build re-index pipeline

### Metadata
- [ ] Extract document metadata
- [ ] Add tenant metadata
- [ ] Add access scope metadata
- [ ] Add source tracking

---

# 7.2 Chunking Runtime

## Goal
Improve retrieval quality.

## Tasks

### Chunking
- [ ] Add semantic chunking
- [ ] Add recursive chunking
- [ ] Add metadata-aware chunking
- [ ] Add hierarchical chunking

### Processing
- [ ] Add chunk deduplication
- [ ] Add chunk hashing
- [ ] Add embedding versioning
- [ ] Add document versioning

---

# 7.3 Retrieval Runtime

## Goal
Improve grounding quality.

## Tasks

### Retrieval
- [ ] Add hybrid retrieval
- [ ] Add reranking
- [ ] Add metadata filtering
- [ ] Add contextual compression
- [ ] Add citation mapping

### Performance
- [ ] Add retrieval caching
- [ ] Add vector indexing optimization
- [ ] Add retrieval metrics

---

# 7.4 Vector Infrastructure

## Goal
Stabilize pgvector production usage.

## Tasks

### Database
- [ ] Add tenant_id
- [ ] Add document_scope
- [ ] Add embedding_version
- [ ] Add chunk_hash
- [ ] Add retrieval indexes

### Maintenance
- [ ] Add vector cleanup jobs
- [ ] Add stale embedding cleanup
- [ ] Add re-embedding workflows

---

# 7.5 RAG Acceptance Criteria

## Success Conditions

- [ ] Documents ingest asynchronously
- [ ] Retrieval quality stable
- [ ] Metadata filtering operational
- [ ] Reranking functional
- [ ] Re-indexing supported
- [ ] Multi-tenant retrieval supported

---

# 8. Future Roadmap (High-Level)

# PHASE 3 — Workflow Runtime

## Goals
- execution graph
- workflow persistence
- state machine orchestration
- long-running workflows

---

# PHASE 4 — Governance & Security

## Goals
- approval workflows
- tool governance
- AI policy enforcement
- enterprise AI controls

---

# PHASE 5 — Observability & Evaluation

## Goals
- distributed tracing
- Langfuse integration
- workflow observability
- hallucination evaluation
- AI quality metrics

---

# PHASE 6 — Autonomous Runtime Evolution

## Goals
- planner agents
- adaptive orchestration
- memory runtime
- autonomous workflows

---

# 9. Recommended Target Architecture

```text
apps/
 ├── server
 ├── ai-services
 │    ├── runtime
 │    ├── orchestration
 │    ├── workflows
 │    ├── retrieval
 │    ├── ingestion
 │    ├── memory
 │    ├── governance
 │    ├── observability
 │    ├── evaluation
 │    └── agents
 │
 ├── workers
 │    ├── ai-worker
 │    ├── ingestion-worker
 │    ├── retrieval-worker
 │    └── workflow-worker
 │
 └── dashboard

packages/
 ├── proto
 ├── contracts
 ├── shared
 ├── database
 └── env
```

---

# 10. Final Assessment

# Current State

```text
Early Operational AI Platform
```

---

# Architecture Direction

Correct.

---

# Strongest Areas

- event-driven direction
- LangGraph adoption
- modular architecture
- service separation
- cloud-native mindset
- tool runtime foundation

---

# Weakest Areas

- runtime fragmentation
- workflow orchestration maturity
- ingestion runtime depth
- governance
- observability depth
- AI evaluation

---

# Final Recommendation

The next engineering focus should NOT prioritize:

- UI complexity
- additional CRUD APIs
- cosmetic frontend improvements

The next focus should prioritize:

1. Runtime Unification
2. Redis Runtime Hardening
3. Production RAG Ingestion
4. Workflow Foundations
5. Governance Foundations
6. AI Observability

These systems determine whether the platform evolves into:

```text
production-grade AI infrastructure
```

instead of remaining:

```text
a partially distributed AI integration system
```

