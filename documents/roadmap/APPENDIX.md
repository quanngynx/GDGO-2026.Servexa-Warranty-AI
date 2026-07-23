# Roadmap Appendix

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Preserve roadmap governance and supporting reference material.

## Scope

Design-principle recap, document maintenance, and roadmap references.

## Dependencies

Canonical terminology is maintained in the central glossary.

## Background

Background is provided by the linked master documentation.

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

### Appendix

#### Key Design Principles

Trong suốt vòng đời của dự án, mọi quyết định về sản phẩm và kỹ thuật đều cần tuân thủ các nguyên tắc sau:

1. AI phải luôn có căn cứ (Grounded AI).
2. AI phải hoạt động trong ngữ cảnh nghiệp vụ.
3. AI hỗ trợ con người thay vì thay thế con người.
4. Mọi quyết định quan trọng đều phải minh bạch.
5. Giao diện và AI phải chia sẻ cùng một trạng thái.
6. Kiến trúc phải ưu tiên khả năng mở rộng và bảo trì.
7. Mọi workflow đều phải có khả năng kiểm toán.
8. Trải nghiệm người dùng luôn được ưu tiên hơn độ phức tạp của công nghệ.

---

#### Document Maintenance

`ROADMAP_MASTER.md` là tài liệu sống (Living Document) và sẽ được cập nhật khi có thay đổi về:

- tầm nhìn sản phẩm;
- roadmap phát triển;
- kiến trúc tổng thể;
- chiến lược triển khai;
- các quyết định thiết kế quan trọng.

Mọi thay đổi lớn cần được xem xét cùng với `TECHNICAL_MASTER_PLAN.md` để đảm bảo tính nhất quán giữa định hướng sản phẩm và kiến trúc kỹ thuật.

Governance workflow:

1. Architecture Working Group reviews both master documents quarterly.
2. A change affecting service boundaries, protocols, data ownership or enterprise technology requires an ADR.
3. Implementation status must cite current repository evidence and snapshot date.
4. Approved changes update Version, Last Updated and Change History in both documents.
5. OpenWiki remains a source map; live source code and approved architecture decisions take precedence.

---

#### End of Document

Tài liệu này mô tả lộ trình phát triển tổng thể của Servexa Warranty AI từ nền tảng ban đầu đến một hệ thống Agentic AI hoàn chỉnh. Mọi phase, quyết định thiết kế và chiến lược triển khai trong roadmap đều hướng tới mục tiêu xây dựng một AI Copilot đáng tin cậy, minh bạch và có khả năng cộng tác hiệu quả với con người trong các quy trình bảo hành và hậu mãi của doanh nghiệp.

## Best Practices

Keep current decisions separate from Planned Evolution and Enterprise Vision material.

## Future Evolution

Future changes require the review and ADR controls described in the related documents.

## References

- [Legacy source](../../documents/ROADMAP_MASTER.md)

## Related ADRs

- [ADR-001: AI-native architecture](../adr/ADR-001-ai-native-architecture.md)

## Related Documents

- [Roadmap Master](./ROADMAP_MASTER.md)
- [Technical Master Plan](../architecture/TECHNICAL_MASTER_PLAN.md)
- [DevOps Master Plan](../platform/DEVOPS_MASTER_PLAN.md)
- [Glossary](../glossary/GLOSSARY.md)
