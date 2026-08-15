# Multimodal Architecture

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Define current and future multimodal processing boundaries.

## Scope

Images, documents, structured data, multimodal workflows, retrieval, and user experience.

## Dependencies

Multimodal features use the canonical AI runtime, evidence, and security controls.

## Background

Background is provided by the linked master documentation.

## Architecture

### 14. Multimodal Architecture

#### Architecture Status

| Architecture Horizon | Implementation Status |
| --- | --- |
| Current Decision | Planned |
| Planned Evolution | OCR, document understanding, images and multimodal Evidence |
| Enterprise Vision | Video, live camera, voice, IoT and AR |

#### Design Principles

- Express validates and stores uploads before AI processing.
- Extracted content is evidence, not an automatic business decision.
- Structured business data always comes through Express.
- Processing is asynchronous when it exceeds interactive latency budgets.
- Sensitive media follows the same authorization and audit policy as business records.

#### Overview

Trong môi trường bảo hành thực tế, thông tin không chỉ tồn tại dưới dạng văn bản. Một hồ sơ bảo hành có thể bao gồm ảnh sản phẩm, hóa đơn, phiếu bảo hành, tài liệu PDF, báo cáo kỹ thuật và nhiều loại dữ liệu khác.

Multimodal Architecture mở rộng khả năng của Agent để xử lý đồng thời nhiều loại dữ liệu trong cùng một workflow, giúp AI hiểu đầy đủ bối cảnh nghiệp vụ thay vì chỉ dựa trên văn bản.

Đây là bước tiến từ **Text-first AI** sang **Context-first AI**, nơi mọi nguồn dữ liệu đều có thể trở thành Evidence phục vụ cho quá trình suy luận.

---

#### Design Goals

Kiến trúc Multimodal hướng tới:

- Hỗ trợ nhiều loại dữ liệu đầu vào.
- Kết hợp dữ liệu đa phương tiện trong một ngữ cảnh thống nhất.
- Tăng độ chính xác của Retrieval.
- Giảm thao tác nhập liệu của người dùng.
- Chuẩn bị cho AI Vision trong tương lai.

---

#### Supported Modalities

##### Text

Bao gồm:

- Chat
- Warranty Policy
- SOP
- FAQ
- Notes

---

##### Images

Bao gồm:

- Product Images
- Damage Photos
- Warranty Sticker
- Serial Number
- Invoice Photo

---

##### Documents

Bao gồm:

- PDF
- DOCX
- Invoice
- Warranty Card
- Repair Report

---

##### Structured Data

Bao gồm các business-data projection do Express API cung cấp:

- Product Metadata
- Warranty Record Projection
- Inventory Projection
- Customer Projection

---

##### Enterprise Vision — Future Modalities

- Audio
- Video
- Live Camera
- IoT Sensors

---

#### Multimodal Processing Pipeline

```text
[Data Flow Diagram]
Edge: [Sync Internal HTTP]
Upload

↓

Express Upload API: Auth / Validation / Storage

↓

FastAPI Parser

↓

OCR / Vision

↓

Metadata Extraction

↓

Chunking

↓

Embedding

↓

PostgreSQL + pgvector

↓

Retriever
```

---

#### Image Processing

Image Pipeline bao gồm:

- Image Validation
- Resolution Check
- OCR
- Object Detection
- Feature Extraction

Kết quả được chuyển thành Embedding và Metadata.

---

#### OCR Pipeline

OCR áp dụng cho:

- hóa đơn;
- phiếu bảo hành;
- nhãn sản phẩm;
- tài liệu scan.

Sau OCR:

```text
[Data Flow Diagram]
Image

↓

OCR

↓

Text

↓

Chunk

↓

Embedding
```

---

#### Document Understanding

Đối với PDF hoặc DOCX.

Pipeline sẽ:

- đọc heading;
- nhận diện bảng;
- trích metadata;
- chia semantic chunk;
- lập chỉ mục.

---

#### Unified Context Builder

Một workflow có thể sử dụng đồng thời:

- Conversation
- Product projection từ Express
- Image
- PDF
- Business data qua Express API
- Memory

Unified Context Builder chịu trách nhiệm hợp nhất toàn bộ nguồn dữ liệu trước khi chuyển cho Planner.

---

#### Multimodal Retrieval

Retriever có thể tìm kiếm trên nhiều nguồn cùng lúc.

Ví dụ:

```text
[Data Flow Diagram]
Question

↓

Vector Search

+

Image Search

+

Metadata Filter

↓

Merged Evidence
```

---

#### Cross-modal Reasoning

Reasoning Engine có thể kết hợp:

- ảnh sản phẩm;
- hóa đơn;
- điều khoản bảo hành;
- lịch sử sửa chữa.

để đưa ra một Recommendation thống nhất.

---

#### Evidence Integration

Evidence không chỉ đến từ văn bản.

Có thể bao gồm:

- ảnh đã phân tích;
- vùng được phát hiện;
- đoạn PDF;
- bảng dữ liệu;
- kết quả OCR.

Frontend hiển thị tất cả dưới cùng một Evidence Panel.

---

#### Storage Strategy

Dữ liệu được lưu tách biệt.

| Data Type  | Storage                |
| ---------- | ---------------------- |
| Documents  | Object Storage         |
| Images     | Object Storage         |
| Metadata   | PostgreSQL             |
| Embeddings | PostgreSQL + pgvector  |
| OCR Result | PostgreSQL + pgvector  |

Điều này giúp dễ mở rộng và giảm chi phí lưu trữ.

---

#### Performance Considerations

Multimodal thường có chi phí cao hơn Text-only.

Do đó hệ thống áp dụng:

- Lazy Processing.
- Background Embedding.
- Incremental Indexing.
- File Cache.
- OCR Cache.

---

#### Security

File Upload phải trải qua:

- MIME Validation.
- Virus Scan.
- File Size Limit.
- Metadata Validation.
- Permission Check.

Không có file nào được đưa trực tiếp vào AI Runtime.

---

#### Enterprise Vision — Future Extensions

Trong các giai đoạn tiếp theo, kiến trúc có thể mở rộng:

- Vision-language Models (VLM).
- Real-time Camera Inspection.
- Voice-based Warranty Support.
- Video Damage Analysis.
- IoT Device Diagnostics.
- AR-assisted Technician Workflow.

---

#### Deliverables

- File Upload Pipeline
- OCR Service
- Image Processing Pipeline
- Document Parser
- Unified Context Builder
- Multimodal Embedding Service
- Cross-modal Retriever
- Multimodal Evidence Engine
- Storage Strategy
- Security Framework

### B.8 Multimodal

```text
[Sequence Diagram]
Edges: [Sync HTTPS] · [Sync Internal HTTP]
Upload

↓

Express Upload API

↓

Validation / Authorization / Object Storage

↓

FastAPI Parser

↓

OCR

↓

Embedding

↓

Retriever

↓

Planner

↓

Reasoning

↓

Evidence
```

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

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)
- [ADR-005: Retrieval-Augmented Generation](../adr/ADR-005-retrieval-augmented-generation.md)

## Related Documents

- [Technical Master Plan](./TECHNICAL_MASTER_PLAN.md)
- [Roadmap Master](../roadmap/ROADMAP_MASTER.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
