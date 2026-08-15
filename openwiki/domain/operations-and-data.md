# Operations and data domains

## Domain summary

Servexa models a warranty-service operation, not just an AI chatbot. The backend and UI organize around a service network that includes:

- customers and internal users
- ASC centers and technicians
- product catalog and warranty policies
- repair cases and case histories
- accessories and warehouse/stock workflows
- purchase locations / purchase channels
- payments, quotations, and pending-payment flows
- documents and AI knowledge assets

The strongest domain sources are:

- backend route modules (`/apps/server/src/modules/route-version-api.ts`)
- Prisma schema (`/apps/server/prisma/schema/schema.prisma`)
- seed orchestration (`/apps/server/prisma/seeds/index.ts`)
- web feature directories and sidebar taxonomy (`/apps/web/src/components/layout/data/sidebar-data.ts`)

## Main business areas

### Repair-case operations

Repair cases are the operational center of the product.

Evidence:

- dedicated web module: `/apps/web/src/features/(GENERAL)/repair-cases-management`
- dedicated backend service stack: `/apps/server/src/modules/v1/asc-center/services/repair-case.service.ts`
- many related Prisma models: `RepairCase`, `RepairCaseStatusHistory`, `RepairCaseFieldHistory`, `RepairCaseImage`, `RepairCaseAccessory`, `RepairCasePaymentDetail`, etc.

The UI page for repair cases supports:

- search
- filtering by status
- filtering by ASC center
- pagination
- refresh actions

(`/apps/web/src/features/(GENERAL)/repair-cases-management/index.tsx`)

The schema confirms a deep lifecycle around repair execution, accessories, payments, case images, and satisfaction tracking.

### ASC centers and service network

ASC centers are first-class business entities. They represent the operational repair network and connect to technicians, stock, repair cases, and financial workflows.

Evidence:

- web admin module: `/apps/web/src/features/(SYSTEM-ADMINISTRATION)/asc-centers-management`
- backend module: `/apps/server/src/modules/v1/asc-center`
- schema models such as `AscCenter`, `AscAccessoryStock`, `AscStocktake`, `RepairAppointment`, `WarrantyCoordination`

This is more than simple store management; it reflects a service-operations topology.

### Product catalog and warranty policy

The product side includes:

- categories
- models
- accessories
- error phenomena
- solutions
- warranty policies
- total warehouse data

Evidence:

- backend module: `/apps/server/src/modules/v1/product-catalog`
- schema enums/models around product types, solutions, warranty forms, and warranty services

This catalog supports both standard operations and AI use cases by structuring the products, failure modes, and policy context that the copilot can reference.

### Purchase channels and locations

The repository contains a dedicated purchase-channel domain focused on purchase locations and groups.

Evidence:

- backend routes: `/apps/server/src/modules/v1/purchase-channels`
- web module: `/apps/web/src/features/(SYSTEM-ADMINISTRATION)/purchase-locations-management`
- recent git history around commits `36d847f`, `a43523d`, `883bf4f`

The UI description says this area is for managing **purchase channel locations and store codes** (`/apps/web/src/features/(SYSTEM-ADMINISTRATION)/purchase-locations-management/index.tsx`).

This domain matters because warranty and error reporting often depend on where a product was purchased.

### Identity, roles, and permissions

Identity is not an afterthought. The repo has a real RBAC subsystem.

Capabilities include:

- login / refresh / logout
- user management
- role management
- permission catalog
- hierarchical role inheritance
- route permission enforcement

Key sources:

- `/apps/server/src/modules/v1/identity/services/auth.service.ts`
- `/apps/server/src/modules/v1/identity/services/permission-resolver.service.ts`
- `/apps/server/src/modules/v1/identity/__tests__/*`

Important behavior: permission resolution walks **ancestor roles** in a closure table so ancestor roles grant permissions down to descendants (`permission-resolver.service.ts`). Admin-style roles short-circuit to wildcard permission `*`.

### Documents and reference knowledge

The product includes both classical document management and AI-ingestable knowledge.

Evidence:

- backend document module: `/apps/server/src/modules/v1/document`
- web page: `/apps/web/src/features/(REFERENCES-DOCUMENTATION)/references-documentation`
- AI knowledge endpoints live separately in `/apps/server/src/modules/v1/ai`

That split is useful:

- **document module** handles document/business records
- **AI knowledge module** handles chunking, embeddings, and retrieval-oriented copies

## Data model highlights

## Warranty/repair status complexity

The Prisma schema shows substantial workflow depth.

Examples:

- `RepairCaseStatus` has many stages, including intake, repair, waiting for accessories, customer/company review, completion, delivery, and cancellation
- `PaymentPendingStatus` tracks a separate pending-payment sub-workflow
- accessory request, issue, supply voucher, and purchase order statuses each have their own state models

This implies the application is designed for nuanced operational transitions rather than a simple ticket queue.

## AI data in the same database

The schema also includes AI-specific tables such as:

- `AiKnowledgeDocument`
- `AiKnowledgeChunk`
- `AiHumanApprovalRequest`
- `AiReasoningTrace`
- `AiReasoningTraceEvent`
- `AiCustomerResponseDraft`

That is a strong design signal: AI is integrated into the core operational database model rather than bolted on externally.

## Seed data as domain documentation

The seed orchestrator (`/apps/server/prisma/seeds/index.ts`) is a valuable domain map. It seeds, in order:

- identity user and permissions
- location hierarchy
- product catalog
- ASC centers
- human resources
- purchase channels
- repair cases
- product warranties
- accessory stock and operations
- repair-case details
- financials
- recalls

This ordering explains many domain dependencies and is useful for future test setup.

## UI taxonomy as a product map

The sidebar groups are a compact product map:

- **GENERAL** — dashboard, repair cases, operations intelligence, pending payments
- **REPORTS** — quality/error, finance, service/out-of-warranty reporting
- **SYSTEM ADMINISTRATION** — organization, users, products, master data, reference docs, roles/permissions

(`/apps/web/src/components/layout/data/sidebar-data.ts`)

Future agents should use this file when they need a quick mental model of intended user-facing capabilities.

## Known incompleteness / caution points

- Some admin/reporting surfaces may be ahead of backend completeness; the sidebar can describe intent as much as live support.
- Some enums and models are very detailed, but not every one is necessarily surfaced end-to-end yet.
- Use the Prisma schema and route/service implementation together before claiming behavior is fully operational.

## Source anchors

- `/apps/web/src/components/layout/data/sidebar-data.ts`
- `/apps/web/src/features/(GENERAL)/repair-cases-management/index.tsx`
- `/apps/web/src/features/(SYSTEM-ADMINISTRATION)/purchase-locations-management/index.tsx`
- `/apps/server/src/modules/route-version-api.ts`
- `/apps/server/prisma/schema/schema.prisma`
- `/apps/server/prisma/seeds/index.ts`
- `/apps/server/src/modules/v1/identity/services/auth.service.ts`
- `/apps/server/src/modules/v1/identity/services/permission-resolver.service.ts`
- `/apps/server/src/modules/v1/workflows/warranty-claim-intake.ts`
