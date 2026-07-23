# Performance and Cost

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define performance, capacity, scaling, and cost controls.

## Scope

Caching, database and vector optimization, streaming, AI cost, cloud cost, and capacity planning.

## Dependencies

Targets depend on observability and measured production run modes.

## Background

Background is provided by the linked master documentation.

## Architecture

### Part XI — Performance & Cost

---

### 100. Performance Philosophy

Performance optimization focuses on delivering a responsive user experience while maintaining infrastructure efficiency.

Optimization priorities:

* Low latency
* Efficient resource usage
* Predictable scaling
* Cost-aware architecture

---

### 101. Performance Strategy

Performance should be optimized at multiple layers.

Frontend

* Lazy Loading
* Code Splitting
* Asset Optimization

Backend

* Efficient Database Queries
* Connection Pooling
* Response Compression

AI Runtime

* Prompt Optimization
* Context Reduction
* Retrieval Optimization

Infrastructure

* Container Optimization
* Auto Scaling
* Efficient Networking

---

### 102. Caching Strategy

Caching reduces latency and infrastructure cost.

Cache Layers

Browser Cache

↓

Application Cache

↓

Redis Cache

↓

Database

Typical cached data:

* Shared State
* Retrieval Results
* Embeddings
* Session Data
* Frequently Used Queries

---

### 103. Database Optimization

PostgreSQL optimization includes:

* Proper Indexing
* Query Optimization
* Connection Pooling
* Efficient Transactions

pgvector optimization includes:

* Embedding Indexes
* Similarity Search Optimization
* Chunk Size Tuning

---

### 104. AI Cost Optimization

AI workloads represent a significant operational cost.

Optimization techniques include:

* Prompt Compression
* Retrieval Filtering
* Embedding Reuse
* Cached Retrieval
* Token Budget Management
* Smaller Models for Simple Tasks

Model selection should balance capability and cost.

---

### 105. Cloud Cost Management

Cloud infrastructure should be monitored continuously.

Primary cost categories:

* Cloud Run
* PostgreSQL
* Redis
* Storage
* Networking
* LLM Usage

Cost reports should be reviewed regularly to identify optimization opportunities.

---

### 106. Scaling Strategy

Current deployment targets an MVP while remaining horizontally scalable.

Scaling priorities:

* Cloud Run Auto Scaling
* Independent Service Scaling
* Stateless Application Design
* Externalized Shared State

Future scaling strategies include multi-region deployments and distributed AI runtimes.

---

### 28. Performance & Scalability

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Targets are architectural objectives, not measured production SLOs; distributed AI scaling is Enterprise Vision. |

#### Overview

Canonical requirements are defined in [Non-functional Requirements](../architecture/APPENDIX.md#23a-non-functional-requirements). Targets below are architectural design targets, not measured production SLOs.

Hiệu năng của Servexa Warranty AI không chỉ phụ thuộc vào tốc độ của LLM mà còn phụ thuộc vào khả năng tối ưu toàn bộ pipeline từ Retrieval, Tool Calling đến UI Streaming.

Kiến trúc được thiết kế theo hướng **Progressive Performance**, nơi người dùng nhận được giá trị đầu tiên trong thời gian ngắn nhất thay vì chờ kết quả cuối cùng.

---

#### Performance Targets

Architectural targets:

| Metric         | Target  |
| -------------- | ------- |
| First Response | < 2s    |
| First Token    | < 1s    |
| Tool Call      | < 3s    |
| Retrieval      | < 500ms |
| UI Update      | < 100ms |

---

#### Caching Strategy

Áp dụng nhiều tầng cache.

- CDN Cache
- HTTP Cache
- Redis Cache
- Retrieval Cache
- Embedding Cache
- Prompt Cache

Không cache quyết định nghiệp vụ.

---

#### Database Optimization

- Connection Pool
- Index Optimization
- Query Analysis
- Read Replica (Enterprise Vision)

---

#### Vector Search Optimization

- HNSW Index
- Metadata Filter
- Hybrid Search
- Re-ranking

---

#### Streaming Optimization

- Incremental Rendering
- Event Batching
- Token Buffer
- Partial Updates

---

#### AI Cost Optimization

Giảm chi phí thông qua:

- Prompt Compression
- Context Pruning
- Memory Summarization
- Response Caching
- Model Routing

---

#### Horizontal Scaling

Các service có thể scale độc lập:

- AI Runtime
- API
- Retrieval
- OCR Worker
- Embedding Worker

---

#### Enterprise Vision — Future Scalability

Chuẩn bị cho:

- Multi-region Deployment
- Multi-tenant Architecture
- Multi-Agent Runtime
- GPU Pool
- Queue-based Processing

---

#### Capacity Planning

Theo dõi định kỳ:

- Active Users
- Concurrent Conversations
- Token Consumption
- Storage Growth
- Embedding Growth

---

#### Deliverables

- Performance Benchmark
- Load Testing Report
- Capacity Planning Guide
- Cost Optimization Strategy
- Scaling Handbook

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

- [ADR-002: PostgreSQL and Redis state ownership](../adr/ADR-002-postgresql-and-redis-state-ownership.md)
- [ADR-005: Retrieval-Augmented Generation](../adr/ADR-005-retrieval-augmented-generation.md)
- [ADR-011: Cloud Run deployment strategy](../adr/ADR-011-cloud-run-deployment-strategy.md)

## Related Documents

- [DevOps Master Plan](./DEVOPS_MASTER_PLAN.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [Deployment Runbook](../runbooks/deployment.md)
