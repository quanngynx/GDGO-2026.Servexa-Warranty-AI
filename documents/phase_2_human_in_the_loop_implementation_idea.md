# Phase 2 — Human-in-the-Loop Implementation Plan

## Objective

Implement Human-in-the-Loop (HITL) workflows on top of the existing Phase 1 Agentic Chat foundation.

This phase must allow the AI Copilot to propose operational actions, pause for user confirmation, collect approval/rejection/edit decisions, and then continue the workflow safely.

Target use cases:

- Escalate repair case
- Assign technician
- Order replacement part
- Generate customer response
- Approve warranty exception
- Request additional diagnosis information
- Confirm supply-chain risk mitigation action

---

# Current Codebase Assessment

## Phase 1 Already Implemented

The current codebase already includes a solid Phase 1 foundation.

### apps/web

Existing AI Copilot pieces:

```text
apps/web/src/features/ai-copilot/
 ├── ai-copilot-rail.tsx
 ├── authenticated-copilot-providers.tsx
 ├── components/
 │    ├── copilot-rail-header.tsx
 │    ├── evidence-panel.tsx
 │    ├── servexa-copilot-chat.tsx
 │    ├── suggested-actions.tsx
 │    └── quick-prompt-grid.tsx
 ├── hooks/
 │    ├── use-operational-context.ts
 │    ├── use-servexa-copilot-rail-metadata.ts
 │    └── use-copilot-message-feedback.ts
 └── constants.ts
```

Confirmed implemented:

```text
- CopilotKit Provider
- fixed AI Copilot Rail
- CopilotChat integration
- quick prompts
- useAgentContext integration
- rail metadata subscription
- evidence panel
- suggested actions panel
- retry / feedback UI hooks
```

---

### apps/server

Existing Copilot Gateway pieces:

```text
apps/server/src/modules/copilotkit/
 ├── copilot-runtime.router.ts
 ├── servexa-unary-gateway.agent.ts
 ├── normalize-copilot-unary-completion.ts
 └── adapters/
```

Confirmed implemented:

```text
- /api/copilotkit route
- CopilotRuntime
- ServexaUnaryGatewayAgent
- AG-UI style event emission
- TEXT_MESSAGE_START
- TEXT_MESSAGE_CONTENT
- TEXT_MESSAGE_END
- STATE_SNAPSHOT
- RUN_STARTED
- RUN_FINISHED
- RUN_ERROR
```

---

### packages/ai-contracts

Existing shared AI contract package:

```text
packages/ai-contracts/
 ├── src/copilot-response.ts
 ├── src/metadata-trailer.ts
 ├── src/normalize-unary.ts
 └── src/index.ts
```

Confirmed implemented:

```text
- CopilotResponse schema
- CopilotRailMetadata schema
- evidence source schema
- suggested action schema
- related entity schema
- unary response normalization
```

This means the earlier Phase 1 proposal item `packages/ai-contracts` has already been implemented.

---

# Phase 1 Gaps To Carry Into Phase 2

The following Phase 1 items are still incomplete or only partially implemented. They should be finished as part of Phase 2 because HITL depends on them.

---

## Gap 1 — Operational Context Is Still Mostly Placeholder

Current `useOperationalPageContext()` returns:

```ts
repairCaseId: null,
technicianId: null,
customerId: null,
productModel: null,
warrantyStatus: null,
```

Only route and user role are real.

### Required Phase 2 Fix

Add real context extraction from:

```text
- route params
- loaded repair case data
- selected customer
- selected technician
- selected product/model
- warranty status
```

### Why It Matters

HITL actions must know what object they are approving.

Bad:

```text
Approve escalation
```

Good:

```text
Approve escalation for Repair Case RC-291 with SLA risk HIGH
```

---

## Gap 2 — Suggested Actions Are Prompt-Only

Current `SuggestedActionsPanel` converts action into a prompt event:

```text
prompt:Suggest the next operational action...
```

This is good for Phase 1 chat, but not enough for HITL.

### Required Phase 2 Fix

Support two action types:

```ts
"prompt"
"workflow"
```

Prompt actions continue chat.

Workflow actions create an approval request.

---

## Gap 3 — No Persistent Feedback/Audit Trail

Current message feedback is local React state only.

### Required Phase 2 Fix

Persist:

```text
- thumbs up/down
- approval decision
- rejection reason
- edited payload
- action execution result
```

into server audit records.

---

## Gap 4 — No HITL Contract

Current AI contract only has:

```text
CopilotResponse
CopilotRailMetadata
CopilotSuggestedAction
```

### Required Phase 2 Fix

Add explicit HITL schemas to `packages/ai-contracts`.

---

## Gap 5 — No Server-Side Action Execution Boundary

Current gateway can chat, but does not safely execute workflow actions.

### Required Phase 2 Fix

Add a dedicated workflow approval module in `apps/server`.

The frontend must never directly execute sensitive AI-suggested actions.

---

# Phase 2 Target Architecture

```text
AI Copilot Rail
        ↓
HITL Approval UI
        ↓
/api/v1/ai/hitl/*
        ↓
Server Approval Registry
        ↓
Policy + RBAC Check
        ↓
Domain Service Execution
        ↓
Audit Log
        ↓
Copilot State Update
```

---

# Phase 2 Scope

## In Scope

Implement:

```text
- HITL request contract
- approval card UI
- approval decision API
- server approval registry
- workflow action normalization
- audit logging
- context-aware approval payload
- safe action execution boundary
- mock HITL workflows
- real workflow hooks for 1-2 actions
```

---

## Out of Scope

Do not implement yet:

```text
- full LangGraph interrupt/resume
- autonomous multi-agent orchestration
- complex subgraph visualization
- multimodal approval flows
- free-form generated UI execution
```

Those belong to later phases.

---

# Recommended Phase 2 Use Cases

Start with three concrete HITL workflows.

## Use Case 1 — Escalate Repair Case

AI proposes:

```text
This case is at SLA risk. Escalate to ASC manager?
```

User choices:

```text
[Approve] [Reject] [Edit reason]
```

Server action:

```text
update repair case escalation status
create audit record
notify responsible role later
```

---

## Use Case 2 — Assign Technician

AI proposes:

```text
Assign technician T-102 because workload is low and skill matches compressor issue.
```

User choices:

```text
[Approve] [Reject] [Choose another technician]
```

Server action:

```text
call technician assignment service
update repair case
create audit record
```

---

## Use Case 3 — Generate Customer Response

AI proposes:

```text
Draft response to explain warranty status and expected next step.
```

User choices:

```text
[Approve draft] [Edit] [Reject]
```

Server action:

```text
save response draft
optionally send later after explicit confirmation
```

Important:

Do not auto-send customer messages in Phase 2.

---

# Step 1 — Extend Shared AI Contracts

## Location

```text
packages/ai-contracts/src/
```

---

## Add File

```text
hitl.ts
```

---

## Required Schemas

```ts
export const hitlRequestStatusSchema = z.enum([
  "pending",
  "approved",
  "rejected",
  "edited",
  "expired",
  "executed",
  "failed",
]);

export const hitlActionKindSchema = z.enum([
  "repair_escalation",
  "technician_assignment",
  "customer_response_draft",
  "part_order_request",
  "warranty_exception",
]);

export const hitlApprovalOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  decision: z.enum(["approve", "reject", "edit"]),
});

export const hitlRequestSchema = z.object({
  id: z.string(),
  kind: hitlActionKindSchema,
  title: z.string(),
  description: z.string(),
  status: hitlRequestStatusSchema,
  riskLevel: z.enum(["low", "medium", "high", "critical"]).optional(),
  confidence: z.number().min(0).max(1).optional(),
  payload: z.record(z.string(), z.unknown()),
  approvalOptions: z.array(hitlApprovalOptionSchema),
  evidenceSourceIds: z.array(z.string()).optional(),
  createdAt: z.string(),
});

export const hitlDecisionSchema = z.object({
  requestId: z.string(),
  decision: z.enum(["approve", "reject", "edit"]),
  editedPayload: z.record(z.string(), z.unknown()).optional(),
  reason: z.string().optional(),
});
```

---

## Export From

```text
packages/ai-contracts/src/index.ts
```

---

# Step 2 — Extend Copilot Suggested Actions

## Current Problem

Current `CopilotSuggestedAction` only has:

```ts
id
label
action
```

This forces everything into prompt strings.

---

## Required Change

Update schema:

```ts
export const copilotSuggestedActionSchema = z.object({
  id: z.string(),
  label: z.string(),
  action: z.string(),
  kind: z.enum(["prompt", "workflow"]).default("prompt"),
  workflowKind: hitlActionKindSchema.optional(),
  requiresApproval: z.boolean().default(false),
  payload: z.record(z.string(), z.unknown()).optional(),
});
```

---

## Compatibility Rule

Existing prompt actions must keep working.

If `kind` is missing, treat as:

```ts
kind: "prompt"
```

---

# Step 3 — Build HITL Approval UI

## Location

```text
apps/web/src/features/ai-copilot/components/
```

---

## Add Components

```text
hitl-approval-card.tsx
hitl-approval-list.tsx
hitl-edit-payload-dialog.tsx
hitl-decision-result.tsx
```

---

## Approval Card Should Show

```text
- action title
- action description
- risk level
- AI confidence
- target entity
- evidence links
- approval buttons
- edit option when supported
```

---

## UI Example

```text
AI needs approval

Escalate Repair Case RC-291
Reason: SLA breach predicted within 8 hours.
Confidence: 86%
Risk: High

[Approve] [Reject] [Edit reason]
```

---

# Step 4 — Add HITL State Hook

## Location

```text
apps/web/src/features/ai-copilot/hooks/
```

---

## Add

```text
use-hitl-requests.ts
```

---

## Responsibilities

```text
- hold pending approval requests
- submit approval decisions
- refresh request status
- expose loading/error state
- remove executed/expired requests
```

---

## State Shape

```ts
type HitlState = {
  pending: HitlRequest[];
  decided: HitlRequest[];
  isSubmitting: boolean;
  error: string | null;
};
```

---

# Step 5 — Connect Suggested Actions To HITL

## Current Behavior

```text
Suggested action click → dispatch prompt event
```

---

## New Behavior

```text
Prompt action click → dispatch prompt event
Workflow action click → create HITL request
```

---

## Update File

```text
apps/web/src/features/ai-copilot/components/suggested-actions.tsx
```

---

## Decision Logic

```ts
if (action.kind === "workflow" || action.requiresApproval) {
  createHitlRequest(action);
} else {
  dispatchCopilotActionPrompt(action.action);
}
```

---

# Step 6 — Add HITL API Routes In Server

## Location

```text
apps/server/src/modules/v1/ai/
```

---

## Add Files

```text
controllers/hitl.controller.ts
services/hitl.service.ts
schemas/hitl.schema.ts
router/hitl.route.ts
```

---

## API Endpoints

```http
POST /api/v1/ai/hitl/requests
GET  /api/v1/ai/hitl/requests?status=pending
POST /api/v1/ai/hitl/requests/:id/decision
GET  /api/v1/ai/hitl/requests/:id
```

---

## Create Request Body

```ts
{
  kind: "repair_escalation",
  title: string,
  description: string,
  payload: Record<string, unknown>,
  evidenceSourceIds?: string[],
  confidence?: number,
  riskLevel?: "low" | "medium" | "high" | "critical"
}
```

---

## Decision Body

```ts
{
  decision: "approve" | "reject" | "edit",
  editedPayload?: Record<string, unknown>,
  reason?: string
}
```

---

# Step 7 — Server-Side Action Registry

## Goal

Prevent arbitrary AI actions from executing.

---

## Add

```text
apps/server/src/modules/v1/ai/hitl-action-registry.ts
```

---

## Pattern

```ts
const HITL_ACTION_REGISTRY = {
  repair_escalation: repairEscalationHandler,
  technician_assignment: technicianAssignmentHandler,
  customer_response_draft: customerResponseDraftHandler,
};
```

---

## Rule

Only registered action kinds can execute.

Never execute arbitrary action strings from the LLM.

---

# Step 8 — Permission And Policy Checks

## Goal

Make HITL safe for enterprise use.

---

## Required Checks

Before creating or executing approval:

```text
- authenticated user exists
- user role is allowed
- user can access target repair case
- action kind is registered
- payload passes schema validation
```

---

## Suggested Permission Mapping

```text
repair_escalation        → repair_case:update
technician_assignment    → repair_case:assign
customer_response_draft  → customer_response:create
part_order_request       → accessory_request:create
warranty_exception       → warranty_policy:override
```

---

# Step 9 — Persistence Model

## Goal

Store HITL requests and decisions.

---

## Recommended Table

```text
ai_human_approval_request
```

---

## Fields

```text
id
kind
status
title
description
payload_json
decision_json
created_by_user_id
decided_by_user_id
created_at
decided_at
executed_at
risk_level
confidence
error_message
```

---

## If Database Migration Is Too Heavy For Demo

Use temporary in-memory store for Phase 2 demo, but write code behind an interface:

```ts
interface HitlRequestRepository {
  create(...): Promise<HitlRequest>;
  findById(...): Promise<HitlRequest | null>;
  listPending(...): Promise<HitlRequest[]>;
  saveDecision(...): Promise<HitlRequest>;
}
```

Then replace with DB repository later.

---

# Step 10 — Audit Logging

## Goal

Every AI-assisted approval must be auditable.

---

## Record Events

```text
hitl.request.created
hitl.request.approved
hitl.request.rejected
hitl.request.edited
hitl.action.executed
hitl.action.failed
```

---

## Include

```text
- user id
- role
- request id
- action kind
- target entity id
- timestamp
- before/after payload when available
```

---

# Step 11 — Integrate With Copilot Rail Metadata

## Goal

Surface pending HITL requests inside the rail.

---

## Extend Rail Metadata

Add optional field:

```ts
pendingApprovals?: HitlRequest[];
```

---

## Server Emits

After AI suggests workflow action:

```text
STATE_SNAPSHOT
{
  servexaCopilot: {
    suggestedActions,
    pendingApprovals
  }
}
```

---

## Frontend Renders

In `AICopilotRail`:

```text
SuggestedActionsPanel
HitlApprovalList
EvidencePanel
```

Recommended order:

```text
1. Chat
2. Pending approvals
3. Suggested actions
4. Evidence
```

---

# Step 12 — Mock HITL Workflows First

## Goal

Make demo work before deep backend execution.

---

## Mock Actions

Implement mock execution for:

```text
repair_escalation
customer_response_draft
```

---

## Mock Result Example

```text
Approved. Escalation request has been recorded for Repair Case RC-291.
```

---

## Then Add Real Execution

After mock is stable:

```text
repair_escalation → update repair case service
technician_assignment → update assignment service
customer_response_draft → save draft only
```

---

# Step 13 — Improve Operational Context Extraction

## Goal

Fix Phase 1 context gap.

---

## Update Hook

```text
apps/web/src/features/ai-copilot/hooks/use-operational-context.ts
```

---

## Add Route-Specific Context Providers

Recommended pattern:

```text
apps/web/src/features/ai-copilot/context/
 ├── operational-context-provider.tsx
 ├── repair-case-context.tsx
 └── selected-entity-context.tsx
```

---

## Route Example

Repair case detail page provides:

```ts
{
  repairCaseId,
  customerId,
  technicianId,
  productModel,
  warrantyStatus,
}
```

The rail consumes it without prop drilling.

---

# Step 14 — HITL Chat Continuation

## Goal

After decision, AI should continue the conversation.

---

## Flow

```text
User approves action
↓
Server executes or records decision
↓
Frontend adds a system/user message
↓
Copilot agent runs again with decision result context
↓
AI summarizes result and next step
```

---

## Example Follow-Up Prompt

```text
The user approved repair_escalation for RC-291. Summarize the executed action and suggest the next operational step.
```

---

# Step 15 — Testing Plan

## Unit Tests

Add tests for:

```text
- HITL schema validation
- action registry rejects unknown action
- decision transition rules
- permission mapping
- suggested action compatibility
```

---

## Frontend Tests

Add tests for:

```text
- approval card renders pending request
- approve button calls API
- reject flow captures reason
- edit flow submits edited payload
- prompt action still works
```

---

## Integration Tests

Add tests for:

```text
- create approval request
- approve request
- reject request
- execute mock workflow
- audit event creation
```

---

# Decision State Machine

Use strict transitions.

```text
pending → approved → executed
pending → rejected
pending → edited → approved → executed
pending → expired
approved → failed
```

Invalid:

```text
executed → edited
rejected → approved
failed → approved
```

---

# Safety Rules

## Critical Rules

```text
- AI may propose actions
- Human approves actions
- Server validates actions
- Domain service executes actions
- Audit log records actions
```

---

## Never Allow

```text
- frontend directly executing AI action
- LLM deciding approval by itself
- arbitrary tool/action name execution
- unaudited workflow mutation
- auto-send customer messages
```

---

# Implementation Order

## Recommended Order

```text
1. Add HITL schemas to packages/ai-contracts
2. Extend CopilotSuggestedAction schema
3. Add server HITL API routes
4. Add in-memory HITL repository
5. Add action registry
6. Add audit events
7. Add frontend HITL hooks
8. Add ApprovalCard UI
9. Wire workflow suggested actions to approval creation
10. Fix operational context extraction
11. Add mock repair escalation workflow
12. Add mock customer response draft workflow
13. Add tests
14. Replace mock actions with real domain service calls gradually
```

---

# Final Phase 2 Deliverables

## Frontend Deliverables

```text
- HITL ApprovalCard
- HITL ApprovalList
- HITL edit dialog
- HITL decision result UI
- workflow-aware SuggestedActionsPanel
- real operational context support
- decision continuation prompt
```

---

## Backend Deliverables

```text
- HITL shared contracts
- HITL API routes
- HITL service
- HITL repository interface
- in-memory or DB repository
- action registry
- permission checks
- audit logging
- mock workflow execution
```

---

## Integration Deliverables

```text
- AI suggested workflow action appears in rail
- user can approve/reject/edit
- server validates decision
- action is recorded/executed
- rail updates status
- chat continues with result
```

---

# Success Criteria

Phase 2 is successful when the demo can show:

```text
AI detects an operational issue
↓
AI proposes a concrete action
↓
Human approves or rejects
↓
Server records and validates the decision
↓
System executes or stores the workflow result
↓
AI explains what happened next
```

The platform should now feel like:

```text
AI-assisted operations with human control
```

not:

```text
chatbot recommendations with no execution path
```

