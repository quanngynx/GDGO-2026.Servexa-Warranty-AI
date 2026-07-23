# Servexa Warranty AI Engineering Handbook

This directory is the canonical maintained engineering knowledge base. The original source documents remain preserved under [`documents/`](../documents/README.md), while [OpenWiki](../openwiki/quickstart.md) remains the generated, code-derived companion.

## Documentation Map

| Area                     | Entry point                                                      | Purpose                                                                      |
| ------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Product and delivery     | [Roadmap Master](./roadmap/ROADMAP_MASTER.md)                    | Vision, phases, demos, and future roadmap                                    |
| Application architecture | [Technical Master Plan](./architecture/TECHNICAL_MASTER_PLAN.md) | Runtime boundaries, contracts, data, AI, security, and observability         |
| Platform engineering     | [DevOps Master Plan](./platform/DEVOPS_MASTER_PLAN.md)           | Development, delivery, deployment, infrastructure, recovery, and performance |
| Decisions                | [ADRs](./adr/)                                                   | Proposed and approved architecture decisions                                 |
| Operations               | [Runbooks](./runbooks/)                                          | Deployment, rollback, recovery, and incident response                        |
| Terminology              | [Glossary](./glossary/GLOSSARY.md)                               | Canonical terms and definitions                                              |

## Reading Order

1. [Roadmap Master](./roadmap/ROADMAP_MASTER.md)
2. [Technical Master Plan](./architecture/TECHNICAL_MASTER_PLAN.md)
3. [DevOps Master Plan](./platform/DEVOPS_MASTER_PLAN.md)
4. Architecture handbooks
5. Platform handbooks
6. ADRs
7. Runbooks

## Intended Audience

| Audience                          | Start with                                                   |
| --------------------------------- | ------------------------------------------------------------ |
| Product and delivery leads        | Roadmap Master and Development Phases                        |
| Application engineers             | Technical Master Plan and the relevant architecture handbook |
| AI engineers                      | AI Runtime, Event Architecture, Shared State, and Reasoning  |
| Platform engineers                | DevOps Master Plan and platform handbooks                    |
| Operators and incident responders | Runbooks, Disaster Recovery, and Observability               |
| Reviewers and new contributors    | System Overview, ADRs, and Glossary                          |

## Source-of-Truth Rules

- `docs/` is canonical for maintained engineering guidance.
- `documents/` is preserved legacy/source material and is not edited as part of handbook maintenance.
- `openwiki/` is generated from repository code; do not hand-edit generated pages.
- The Fumadocs application is a separate documentation product and is not the canonical source for these handbooks.
- Source code, schemas, and runtime configuration override stale prose when implementation evidence differs.

## Relationships

- Roadmap handbooks define why and when capabilities evolve.
- Architecture handbooks define service responsibilities and technical behavior.
- Platform handbooks define how the system is built, delivered, deployed, and operated.
- ADRs record major decisions without duplicating complete handbook chapters.
- Runbooks contain operational procedures and link back to their governing architecture.
- The glossary centralizes terminology used by every area.
