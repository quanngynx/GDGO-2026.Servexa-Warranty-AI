# Product Vision

> Canonical handbook. The preserved source material remains under `documents/`.

## Purpose

Preserve the product vision and business context that guide roadmap decisions.

## Scope

Industry context, problem definition, product positioning, objectives, success metrics, and product principles.

## Dependencies

Technical feasibility is governed by the architecture and platform master plans.

## Background

### Product Vision & Business Context

#### Industry Background

Các trung tâm bảo hành hiện nay thường phải xử lý một lượng lớn hồ sơ với nhiều nguồn dữ liệu khác nhau.

Một nhân viên xử lý bảo hành có thể phải tra cứu đồng thời:

- chính sách bảo hành;
- lịch sử sửa chữa;
- tài liệu kỹ thuật;
- danh sách linh kiện;
- quy trình nội bộ;
- các trường hợp tương tự.

Những dữ liệu này thường phân tán trên nhiều hệ thống khác nhau và không được kết nối hiệu quả.

Điều này khiến thời gian xử lý kéo dài, chất lượng phục vụ không đồng đều và dễ phát sinh sai sót trong việc áp dụng chính sách.

---

#### Problem Statement

Qua quá trình nghiên cứu và định hướng sản phẩm, nhóm xác định bốn nhóm vấn đề chính.

##### Knowledge Fragmentation

Tri thức của doanh nghiệp tồn tại ở nhiều định dạng và nhiều nguồn khác nhau.

Nhân viên phải tự tổng hợp thông tin trước khi đưa ra quyết định.

---

##### Decision Inconsistency

Hai nhân viên khác nhau có thể đưa ra hai quyết định khác nhau cho cùng một trường hợp vì kinh nghiệm và khả năng tra cứu không giống nhau.

---

##### Long Resolution Time

Việc tìm kiếm tài liệu, xác minh điều kiện bảo hành và đề xuất phương án xử lý tiêu tốn phần lớn thời gian xử lý hồ sơ.

---

##### Lack of Explainability

Khi AI chỉ trả lời bằng văn bản mà không cung cấp căn cứ, người dùng rất khó tin tưởng và cũng không thể kiểm chứng kết quả.

---

#### Product Vision

Servexa Warranty AI hướng tới việc trở thành một trợ lý AI đồng hành cùng nhân viên trong toàn bộ vòng đời của một hồ sơ bảo hành.

AI sẽ không thay thế quy trình hiện có mà đóng vai trò như một lớp hỗ trợ thông minh nằm giữa người dùng và hệ thống nghiệp vụ.

Mọi đề xuất của AI đều phải dựa trên dữ liệu nội bộ và được trình bày một cách minh bạch, giúp người dùng dễ dàng kiểm chứng trước khi thực hiện các hành động tiếp theo.

---

#### Success Metrics

Thành công của dự án không được đánh giá dựa trên số lượng câu trả lời AI tạo ra mà dựa trên giá trị mang lại cho quy trình vận hành.

Các chỉ số mục tiêu bao gồm:

- giảm thời gian xử lý hồ sơ bảo hành;
- giảm thời gian tra cứu tài liệu;
- tăng tỷ lệ quyết định đúng ngay từ lần đầu;
- giảm số lượng thao tác thủ công;
- tăng mức độ tin tưởng của người dùng vào AI;
- chuẩn hóa quy trình xử lý giữa các nhân viên.

---

## Architecture

The canonical architecture is defined in the related handbooks below.

## Design Principles

Apply the approved boundaries, ownership rules, and status classifications preserved in this handbook.

## Implementation

Implementation details remain governed by the architecture and contracts referenced above.

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
