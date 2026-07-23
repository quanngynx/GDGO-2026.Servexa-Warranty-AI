# Security Architecture

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Consolidate application and platform security responsibilities.

## Scope

Authentication, authorization, secrets, network security, AI security, data protection, and monitoring.

## Dependencies

Repository disclosure and contributor rules remain in the root SECURITY.md.

## Background

Background is provided by the linked master documentation.

## Architecture

### 18. Authentication & Authorization

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Implemented | Express owns the public authentication and authorization boundary; subsystem exceptions remain governed by Cross-cutting Concerns. |

#### Overview

Canonical cross-service policy is defined in [Cross-cutting Concerns](./APPENDIX.md#23c-cross-cutting-concerns). This chapter specifies identity, RBAC and approval-specific behavior.

Authentication và Authorization được tách biệt.

Authentication trả lời:

> Người dùng là ai?

Authorization trả lời:

> Người dùng được phép làm gì?

---

#### Authentication

Sử dụng JWT.

Bao gồm:

- Access Token
- Refresh Token

Future:

- SSO
- OAuth2
- OpenID Connect

---

#### Authorization

Sử dụng RBAC.

Vai trò:

- Customer
- Staff
- Technician
- Manager
- Admin

---

#### Tool Permission

Mỗi Tool khai báo:

```yaml
permission:
risk_level:
approval_required:
```

Planner có thể kiểm tra metadata để tránh lời gọi không phù hợp. Express luôn xác thực JWT, phân quyền và áp dụng approval/business policy có thẩm quyền trước khi thực thi Tool.

---

#### Resource Authorization

Ví dụ:

Customer

↓

Own Warranty

Staff

↓

Assigned Cases

Manager

↓

Department

Admin

↓

Everything

---

#### Approval Permission

Không phải ai cũng được:

- Approve
- Reject
- Close Case

---

#### Session Management

Quản lý:

- Login
- Logout
- Refresh
- Device

---

#### Planned Evolution — Future Extensions

- Attribute-based Access Control (ABAC)
- Organization Hierarchy
- Delegation
- Temporary Permission

---

#### Deliverables

- JWT
- RBAC
- Permission Engine
- Tool Authorization
- Session Manager

---

### 19. Security

#### Architecture Status

| Architecture Horizon | Implementation Status | Note |
| --- | --- | --- |
| Current Decision | Partial | Core controls exist, while complete rate-limit, tracing and AI-governance enforcement remains incomplete. |

#### Overview

Canonical security requirements are defined in [Cross-cutting Concerns](./APPENDIX.md#23c-cross-cutting-concerns) and [AI Safety & Governance](./APPENDIX.md#23d-ai-safety--governance). This chapter records security-specific controls and deviations.

AI đưa thêm nhiều bề mặt tấn công mới cho hệ thống.

Do đó Security không chỉ tập trung vào Backend mà còn bao gồm Prompt, Knowledge, Tool và Workflow.

---

#### Security Principles

- Zero Trust
- Least Privilege
- Defense in Depth
- Secure by Default
- Audit First

---

#### Prompt Security

Ngăn chặn:

- Prompt Injection
- Jailbreak
- Data Leakage
- Instruction Override

Planner không bao giờ thực thi trực tiếp Prompt của người dùng.

---

#### RAG Security

Retriever chỉ được phép truy cập dữ liệu mà người dùng có quyền xem.

Business-data retrieval luôn đi qua Express authorization. Knowledge retrieval trực tiếp từ pgvector dùng tenant/ACL scope đã được Express xác thực và truyền cho FastAPI; FastAPI áp dụng Permission Filter bắt buộc trên scope đó.

---

#### Tool Security

Mỗi Tool đều có:

- Permission
- Validation
- Timeout
- Audit

Không Tool nào được gọi trực tiếp từ Frontend.

---

#### File Security

File Upload phải trải qua:

- MIME Validation
- Virus Scan
- OCR Sandbox
- Size Limit

---

#### Secret Management

Secrets:

- không hardcode;
- quản lý bằng Secret Manager;
- phân tách theo Environment.

---

#### Audit Logging

Audit bao gồm:

- Login
- Tool Call
- Approval
- Workflow
- Security Event

---

#### Monitoring

Theo dõi:

- Failed Login
- Prompt Attack
- Tool Failure
- Retrieval Failure
- Approval Anomaly

---

#### Compliance

Kiến trúc hướng tới khả năng đáp ứng:

- GDPR (nếu mở rộng quốc tế)
- ISO 27001
- OWASP ASVS
- OWASP Top 10

---

#### Planned Evolution — Security Roadmap

- AI Firewall
- Prompt Firewall
- Model Gateway
- Content Safety Layer
- Security Policy Engine

---

#### Deliverables

- Security Architecture
- Prompt Security
- RAG Security
- Tool Security
- File Security
- Secret Management
- Audit Framework
- Security Monitoring

### Part X — Security

---

### 92. Security Philosophy

Security is implemented as a cross-cutting concern throughout the platform.

Core principles include:

* Least Privilege
* Zero Trust
* Defense in Depth
* Secure by Default
* Principle of Explicit Access

Security controls should protect infrastructure, services, data, and AI workflows.

---

### 93. Identity & Authentication

Authentication is handled by the Express backend.

Responsibilities include:

* User Authentication
* JWT Validation
* Session Management
* Refresh Token Management

FastAPI trusts authenticated requests forwarded by Express and does not perform end-user authentication directly.

---

### 94. Authorization

Authorization is enforced within Express.

Capabilities include:

* Role-Based Access Control (RBAC)
* Permission Validation
* Resource Ownership
* Workflow Authorization

AI Runtime only executes operations that have already passed authorization checks.

---

### 95. Secret Management

Secrets should never be stored in source code or container images.

Examples include:

* Database Credentials
* Redis Credentials
* JWT Secrets
* API Keys
* LLM Provider Keys
* Cloud Credentials

Secrets are injected at runtime using environment-specific secret management.

---

### 96. Network Security

Networking follows the principle of minimum exposure.

Public Services:

* React Web
* Express API

Private Services:

* FastAPI
* PostgreSQL
* Redis

Internal communication should occur over private networking wherever possible.

---

### 97. AI Security

AI-specific protections include:

* Prompt Injection Mitigation
* Evidence-based Responses
* Tool Permission Validation
* Context Isolation
* Workflow Authorization

The AI Runtime should never bypass business authorization rules.

---

### 98. Data Protection

Sensitive information should be protected throughout its lifecycle.

Measures include:

* Encrypted communication (HTTPS)
* Secure secret storage
* Input validation
* Output sanitization
* Access auditing

Personal and business data should only be retained when necessary.

---

### 99. Security Monitoring

Security events should be monitored continuously.

Examples include:

* Authentication failures
* Unauthorized access attempts
* Invalid JWT usage
* Privilege escalation attempts
* Suspicious API activity

Security incidents should be traceable through centralized logging.

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

- [Legacy source](../../documents/TECHNICAL_MASTER_PLAN.md)
- [Legacy source](../../documents/4.platform/DEVOPS_MASTER_PLAN.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-002: PostgreSQL and Redis state ownership](../adr/ADR-002-postgresql-and-redis-state-ownership.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
- [Repository Security Policy](../../SECURITY.md)
