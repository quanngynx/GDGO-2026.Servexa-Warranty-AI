# Phase 3 Plan — Shared State between Agent and AG-UI

## Project

Servexa Warranty AI

## Phase Goal

Phase 3 tập trung biến AG-UI từ một chat panel nhận context một chiều thành một **agentic UI có shared state nghiệp vụ hai chiều**.

Mục tiêu chính:

```txt
UI selects / changes warranty operation context
→ Agent reads current state
→ Agent returns structured state metadata
→ UI renders cards, actions, evidence, workflow progress
→ Human approves / edits / rejects
→ Agent continues with updated decision state
```

Phase này **không cố làm realtime subgraph streaming đầy đủ**. Trọng tâm là shared state theo fixed schema, đủ ổn định để demo và phát triển tiếp Phase 4/5.

---

# 1. Current Baseline

## 1.1 Existing capabilities

Codebase hiện tại đã có nền cho shared state:

```txt
apps/web/src/features/ai-copilot/hooks/use-operational-context.ts
apps/web/src/features/(GENERAL)/repair-cases-management/components/repair-cases-table.tsx
apps/web/src/features/ai-copilot/hooks/use-servexa-copilot-panel.ts
apps/server/src/modules/copilotkit/servexa-unary-gateway.agent.ts
packages/ai-contracts/src/copilot-response.ts
apps/ai-services/src/modules/v1/hitl/copilot_metadata.py
```

Hiện đã có:

| Capability | Status |
|---|---|
| UI operational context provider | Exists |
| `useAgentContext()` bridge | Exists |
| Selected repair case context | Exists |
| Repair case snapshot | Exists |
| Rail metadata envelope | Exists |
| Evidence panel contract | Partially exists |
| Suggested actions contract | Exists |
| HITL pending approvals | Exists |
| Last HITL decision context | Exists |
| Warranty eligibility card | Missing |
| Diagnosis draft card | Missing |
| Workflow progress timeline | Missing |
| Two-way shared state schema | Missing |
| State patch normalization | Missing / partial |

## 1.2 Current limitation

Hiện flow gần đúng là:

```txt
UI context
→ useAgentContext
→ Copilot runtime
→ unary gateway
→ AI service / Gemini
→ text + limited metadata
→ UI rail render
```

Vấn đề:

```txt
- State chưa có schema nghiệp vụ rõ ràng
- Agent chưa patch về UI các state như warrantyEligibility, diagnosisDraft, workflowProgress
- UI chưa có card render cho các state mới
- HITL decision đã có nhưng chưa được dùng như continuation state một cách rõ ràng
- Gateway vẫn unary, chưa event-native AG-UI full stream
```

---

# 2. Phase 3 Scope

## 2.1 In scope

Phase 3 sẽ implement các shared state sau:

```txt
1. selectedCaseSummary
2. warrantyEligibility
3. diagnosisDraft
4. evidenceSources
5. recommendedActions
6. pendingApprovals
7. lastDecision
8. workflowProgress
```

Trong đó:

| State | Direction | Priority |
|---|---|---:|
| selectedCaseSummary | UI → Agent → UI | P0 |
| warrantyEligibility | Agent → UI | P0 |
| diagnosisDraft | Agent → UI | P0 |
| evidenceSources | Agent → UI | P0 |
| recommendedActions | Agent → UI | P0 |
| pendingApprovals | Agent/UI → UI | P0 |
| lastDecision | UI → Agent → UI | P1 |
| workflowProgress | Derived UI + Agent → UI | P1 |

## 2.2 Out of scope

Không làm trong Phase 3:

```txt
- Full LangGraph subgraph realtime streaming
- Multimodal upload / image diagnosis
- Agent-generated arbitrary React UI
- Full inventory ordering workflow if backend handler is not ready
- Full warranty exception workflow if backend handler is not ready
- Long-term memory across sessions
```

Các phần này để Phase 4/5.

---

# 3. Target User Flow

## 3.1 Main demo flow

```txt
1. User opens repair cases management page
2. User selects one repair case row
3. UI updates operational shared state
4. Copilot rail shows selected repair case summary
5. User asks: “Analyze this case and suggest next actions”
6. Agent reads selected repair case context
7. Agent returns:
   - warranty eligibility
   - diagnosis draft
   - evidence sources
   - suggested workflow actions
   - workflow progress
8. UI renders structured cards
9. User clicks suggested workflow action, e.g. escalate repair case
10. UI creates HITL approval request
11. Manager approves / rejects / edits
12. UI updates lastDecision shared state
13. Agent continues and summarizes the executed decision
```

## 3.2 Expected demo result

The demo should prove:

```txt
- Agent understands current selected repair case
- Agent can update UI with structured business state
- UI can render actionable cards, not just text
- Human can approve an agent-suggested workflow
- Agent can continue after human decision
```

---

# 4. Shared State Schema

## 4.1 Proposed TypeScript schema

Add or extend in:

```txt
packages/ai-contracts/src/copilot-response.ts
```

Suggested schema:

```ts
export const selectedCaseSummarySchema = z.object({
  repairCaseId: z.string(),
  caseNumber: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  productModel: z.string().nullable().optional(),
  modelCode: z.string().nullable().optional(),
  serialNumber: z.string().optional(),
  warrantyForm: z.string().nullable().optional(),
  warrantyServiceType: z.string().nullable().optional(),
  errorPhenomena: z.string().nullable().optional(),
  promisedDeliveryDate: z.string().nullable().optional(),
});

export const warrantyEligibilitySchema = z.object({
  status: z.enum(["eligible", "not_eligible", "unknown"]),
  reason: z.string(),
  warrantyForm: z.string().nullable().optional(),
  warrantyServiceType: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).optional(),
});

export const diagnosisDraftSchema = z.object({
  symptoms: z.array(z.string()).default([]),
  possibleCauses: z.array(z.string()).default([]),
  recommendedChecks: z.array(z.string()).default([]),
  severity: z.enum(["low", "medium", "high"]),
});

export const workflowProgressSchema = z.object({
  currentStep: z.string(),
  steps: z.array(
    z.object({
      key: z.string(),
      label: z.string(),
      status: z.enum(["done", "active", "pending", "failed"]),
    }),
  ),
});
```

Extend existing `copilotRailMetadataSchema`:

```ts
export const copilotRailMetadataSchema = z.object({
  sources: z.array(copilotEvidenceSourceSchema).optional(),
  suggestedActions: z.array(copilotSuggestedActionSchema).optional(),
  pendingApprovals: z.array(copilotPendingApprovalSchema).optional(),
  workflowExecutionStatus: workflowExecutionStatusSchema.optional(),
  lastDecision: copilotLastDecisionSchema.optional(),

  selectedCaseSummary: selectedCaseSummarySchema.optional(),
  warrantyEligibility: warrantyEligibilitySchema.optional(),
  diagnosisDraft: diagnosisDraftSchema.optional(),
  workflowProgress: workflowProgressSchema.optional(),
});
```

## 4.2 Compatibility rule

All new fields must be optional.

Reason:

```txt
- Existing Copilot responses must not break
- Existing rail metadata can remain valid
- UI can progressively render cards only when state exists
```

---

# 5. Implementation Plan

## Step 1 — Normalize selected repair case into shared state

### Files

```txt
apps/web/src/features/(GENERAL)/repair-cases-management/components/repair-cases-table.tsx
apps/web/src/features/ai-copilot/hooks/use-operational-context.ts
apps/web/src/features/ai-copilot/hooks/use-servexa-copilot-panel.ts
```

### Tasks

- Ensure selecting repair case row sets complete `repairCaseSnapshot`.
- Normalize selected case into `selectedCaseSummary`.
- Pass this state through `useAgentContext()`.
- Make sure null-safe behavior works when no case is selected.

### Expected state

```ts
{
  repairCaseId: "...",
  caseNumber: "...",
  status: "...",
  priority: "...",
  customerName: "...",
  productModel: "...",
  serialNumber: "...",
  warrantyForm: "...",
  warrantyServiceType: "...",
  errorPhenomena: "..."
}
```

### Acceptance criteria

```txt
- Selecting a repair case updates operational context
- Copilot prompt can access selected case details
- No runtime error when no case is selected
```

---

## Step 2 — Add shared state contract to `ai-contracts`

### Files

```txt
packages/ai-contracts/src/copilot-response.ts
packages/ai-contracts/src/index.ts
```

### Tasks

- Add schemas:
  - `selectedCaseSummarySchema`
  - `warrantyEligibilitySchema`
  - `diagnosisDraftSchema`
  - `workflowProgressSchema`
- Extend existing rail metadata schema.
- Export inferred TypeScript types.
- Update any normalizer if needed.

### Acceptance criteria

```txt
- TypeScript compile passes
- Existing metadata remains valid
- New metadata can be parsed safely
```

---

## Step 3 — Build backend metadata mapper

### Files

```txt
apps/server/src/modules/copilotkit/servexa-unary-gateway.agent.ts
packages/ai-contracts/src/normalize-unary.ts
apps/ai-services/src/modules/v1/hitl/copilot_metadata.py
```

### Tasks

- Ensure gateway accepts execution context from UI.
- Map selected repair case context into metadata where possible.
- If AI service returns structured metadata, normalize it.
- If AI service only returns text, optionally derive minimal rail state from execution context.

### Minimum backend behavior

For a selected repair case, metadata should include:

```ts
{
  selectedCaseSummary: {
    repairCaseId,
    caseNumber,
    status,
    priority,
    customerName,
    productModel,
    serialNumber,
    errorPhenomena
  }
}
```

### Acceptance criteria

```txt
- Agent response can carry selectedCaseSummary
- Invalid metadata does not crash the rail
- Unknown fields are ignored or safely stripped
```

---

## Step 4 — Add frontend shared state cards

### New files

```txt
apps/web/src/features/ai-copilot/components/selected-repair-case-card.tsx
apps/web/src/features/ai-copilot/components/warranty-eligibility-card.tsx
apps/web/src/features/ai-copilot/components/diagnosis-draft-card.tsx
apps/web/src/features/ai-copilot/components/workflow-progress-card.tsx
```

### Existing file to update

```txt
apps/web/src/features/ai-copilot/components/servexa-copilot-side-panels.tsx
```

### Components

#### `SelectedRepairCaseCard`

Renders:

```txt
Case number
Status
Priority
Customer
Product model
Serial number
Main symptom / error phenomena
```

#### `WarrantyEligibilityCard`

Renders:

```txt
Status: eligible / not eligible / unknown
Reason
Warranty form
Warranty service type
Confidence
```

#### `DiagnosisDraftCard`

Renders:

```txt
Symptoms
Possible causes
Recommended checks
Severity
```

#### `WorkflowProgressCard`

Renders:

```txt
Case selected
AI recommendation generated
Waiting approval
Executed
Summary generated
```

### Acceptance criteria

```txt
- Cards render only when state exists
- Cards do not break existing rail UI
- Empty/null fields are hidden gracefully
- Mobile/responsive layout remains usable
```

---

## Step 5 — Implement warranty eligibility metadata

### Files

```txt
apps/ai-services/src/modules/v1/hitl/copilot_metadata.py
apps/server/src/modules/copilotkit/servexa-unary-gateway.agent.ts
packages/ai-contracts/src/copilot-response.ts
```

### Rule for MVP

Use simple deterministic rule first:

```txt
If warrantyForm or warrantyServiceType indicates active warranty:
  status = eligible
Else if explicitly out of warranty:
  status = not_eligible
Else:
  status = unknown
```

Example output:

```json
{
  "warrantyEligibility": {
    "status": "eligible",
    "reason": "Repair case warranty form indicates active warranty coverage.",
    "warrantyForm": "in_warranty",
    "warrantyServiceType": "standard_warranty",
    "confidence": 0.82
  }
}
```

### Acceptance criteria

```txt
- Agent can return warranty eligibility metadata
- UI renders eligibility card
- Unknown/missing warranty data results in `unknown`, not crash
```

---

## Step 6 — Implement diagnosis draft metadata

### Input fields

Use:

```txt
repairCaseSnapshot.errorPhenomena
repairCaseSnapshot.productModel
repairCaseSnapshot.modelCode
repairCaseSnapshot.serialNumber
```

### MVP behavior

Agent should produce:

```ts
{
  symptoms: string[],
  possibleCauses: string[],
  recommendedChecks: string[],
  severity: "low" | "medium" | "high"
}
```

### Recommended implementation

For Phase 3, keep generation controlled:

```txt
- Let AI generate text and structured metadata
- Validate metadata through zod contract
- Fallback to safe empty diagnosis if invalid
```

### Acceptance criteria

```txt
- Diagnosis card appears after asking for case analysis
- Bad/missing AI metadata does not crash UI
- Diagnosis content is clearly tied to selected case symptom
```

---

## Step 7 — Strengthen suggested workflow actions

### Existing supported workflows

Use only currently supported HITL workflow kinds:

```txt
repair_escalation
technician_assignment
customer_response_draft
```

Avoid enabling these until handlers are ready:

```txt
part_order_request
warranty_exception
```

### Suggested actions to generate

For selected repair case:

```ts
[
  {
    id: "ops-escalate",
    label: "Escalate repair case",
    kind: "workflow",
    workflowKind: "repair_escalation",
    requiresApproval: true,
    payload: {
      repairCaseId,
      caseNumber,
      reason,
      priority: "urgent"
    }
  },
  {
    id: "ops-assign-technician",
    label: "Assign technician",
    kind: "workflow",
    workflowKind: "technician_assignment",
    requiresApproval: true,
    payload: {
      repairCaseId,
      technicianId: selectedTechnicianId
    }
  },
  {
    id: "ops-draft-customer-response",
    label: "Draft customer response",
    kind: "workflow",
    workflowKind: "customer_response_draft",
    requiresApproval: true,
    payload: {
      repairCaseId,
      body
    }
  }
]
```

### Acceptance criteria

```txt
- Suggested actions render correctly
- Workflow actions create HITL request
- Unsupported workflow kinds are not shown as executable actions
```

---

## Step 8 — Implement workflow progress state

### MVP approach

Implement as frontend-derived state first.

Source signals:

| Signal | Step |
|---|---|
| `selectedCaseSummary` exists | Case selected |
| `warrantyEligibility` exists | Warranty checked |
| `diagnosisDraft` exists | Diagnosis drafted |
| `suggestedActions.length > 0` | Actions suggested |
| `pendingApprovals.length > 0` | Awaiting approval |
| `lastDecision.status === executed` | Workflow executed |
| `workflowExecutionStatus === failed` | Failed |

### Example state

```ts
{
  currentStep: "awaiting_approval",
  steps: [
    { key: "case_selected", label: "Case selected", status: "done" },
    { key: "warranty_checked", label: "Warranty checked", status: "done" },
    { key: "diagnosis_drafted", label: "Diagnosis drafted", status: "done" },
    { key: "actions_suggested", label: "Actions suggested", status: "done" },
    { key: "awaiting_approval", label: "Awaiting approval", status: "active" },
    { key: "executed", label: "Workflow executed", status: "pending" }
  ]
}
```

### Acceptance criteria

```txt
- Workflow progress card updates as user interacts
- Does not require backend streaming
- Failed state displays clearly
```

---

## Step 9 — HITL decision continuation

### Existing state

`lastDecision` already exists in current flow.

### Tasks

- Ensure approval/edit/reject updates shared state consistently.
- Ensure `lastDecision` is included in `useAgentContext()`.
- Agent response after HITL decision should summarize outcome.

### Example user flow

```txt
User clicks “Escalate repair case”
→ HITL approval card appears
→ Manager approves
→ lastDecision updated
→ User asks “What happened?”
→ Agent answers with executed result
```

### Acceptance criteria

```txt
- Agent can see last HITL decision
- UI can render last decision summary
- Rejected/edited decisions are handled, not only approved
```

---

# 6. Testing Plan

## 6.1 Unit tests

### Contract tests

Files:

```txt
packages/ai-contracts/src/copilot-response.test.ts
```

Test:

```txt
- Valid selectedCaseSummary parses
- Valid warrantyEligibility parses
- Valid diagnosisDraft parses
- Valid workflowProgress parses
- Missing optional fields still valid
- Invalid enum values rejected
```

## 6.2 Frontend component tests

Files:

```txt
apps/web/src/features/ai-copilot/components/*.test.tsx
```

Test:

```txt
- SelectedRepairCaseCard renders complete state
- WarrantyEligibilityCard handles eligible/not_eligible/unknown
- DiagnosisDraftCard handles empty arrays
- WorkflowProgressCard handles done/active/pending/failed
```

## 6.3 Integration tests

Test flow:

```txt
1. Open repair cases page
2. Select repair case row
3. Verify selected case appears in rail
4. Send prompt to copilot
5. Verify warranty card appears
6. Verify diagnosis card appears
7. Verify suggested actions appear
8. Click escalation action
9. Verify HITL request appears
10. Approve request
11. Verify last decision state updates
```

## 6.4 Manual browser checklist

```txt
[ ] No case selected → rail does not crash
[ ] Select case → selected case card appears
[ ] Ask analysis prompt → AI response appears
[ ] Warranty card appears if metadata exists
[ ] Diagnosis card appears if metadata exists
[ ] Evidence panel still works
[ ] Suggested actions still work
[ ] HITL approve works
[ ] HITL reject works
[ ] HITL edit works
[ ] Workflow progress updates
[ ] Refresh page does not leave broken stale state
```

---

# 7. Suggested Task Breakdown

## Task 1 — Contract foundation

```txt
- Add schemas to ai-contracts
- Export types
- Add parsing tests
```

Estimate: Small

## Task 2 — Selected case rail card

```txt
- Normalize selected case summary
- Add SelectedRepairCaseCard
- Render in side panel
```

Estimate: Small

## Task 3 — Warranty eligibility state

```txt
- Add metadata mapper
- Add WarrantyEligibilityCard
- Add fallback behavior
```

Estimate: Medium

## Task 4 — Diagnosis draft state

```txt
- Add diagnosis metadata parsing
- Add DiagnosisDraftCard
- Validate AI output
```

Estimate: Medium

## Task 5 — Suggested actions hardening

```txt
- Restrict executable workflows to supported handlers
- Ensure payload has repairCaseId
- Hide unsupported actions or render as prompt-only
```

Estimate: Medium

## Task 6 — Workflow progress card

```txt
- Derive progress from existing rail state
- Add WorkflowProgressCard
- Handle failed state
```

Estimate: Small / Medium

## Task 7 — HITL continuation polish

```txt
- Ensure lastDecision shared context is complete
- Add last decision display
- Add post-decision prompt behavior
```

Estimate: Medium

---

# 8. Risks and Controls

## Risk 1 — Agent returns invalid structured metadata

Control:

```txt
- Validate with zod
- Strip invalid fields
- Fallback to text-only response
```

## Risk 2 — UI state becomes stale after selecting another case

Control:

```txt
- Reset warrantyEligibility, diagnosisDraft, suggestedActions, workflowProgress when selected repairCaseId changes
- Keep lastDecision only if it belongs to same repairCaseId
```

## Risk 3 — Unsupported workflow action appears as executable

Control:

```txt
- Maintain allowlist of executable workflowKind
- Render unsupported workflows as disabled or prompt-only
```

## Risk 4 — Shared state becomes too broad

Control:

```txt
- Keep fixed schema
- Do not allow arbitrary UI generation in Phase 3
- Add new state only when there is a real UI card
```

## Risk 5 — Backend unary gateway limits realtime behavior

Control:

```txt
- Accept unary metadata snapshot for Phase 3
- Defer event-native streaming to later phase
```

---

# 9. Definition of Done

Phase 3 is done when:

```txt
[ ] Selecting a repair case updates shared state
[ ] Agent receives selected repair case context
[ ] Rail renders selected repair case summary
[ ] Agent can return warranty eligibility metadata
[ ] Rail renders warranty eligibility card
[ ] Agent can return diagnosis draft metadata
[ ] Rail renders diagnosis draft card
[ ] Evidence sources still render correctly
[ ] Suggested workflow actions still render correctly
[ ] HITL workflow action creates approval request
[ ] Approve/reject/edit updates lastDecision
[ ] Agent can continue after HITL decision
[ ] Workflow progress card reflects current state
[ ] No crash on missing/invalid metadata
[ ] Contract tests pass
[ ] Manual browser flow passes
```

---

# 10. Recommended Implementation Order

Do not start with generic state manager refactor. Start with the flow that already exists.

Recommended order:

```txt
1. Contract schemas
2. Selected repair case card
3. Warranty eligibility card
4. Diagnosis draft card
5. Suggested action hardening
6. Workflow progress card
7. HITL continuation polish
8. Tests and browser verification
```

This keeps Phase 3 close to the current codebase and avoids overengineering.

---

# 11. Final Recommendation

The best Phase 3 demo should be:

```txt
Selected repair case
→ Agent analyzes warranty + diagnosis
→ UI renders structured shared state cards
→ Agent suggests HITL workflow action
→ Human approves
→ Agent continues based on decision
```

This is the strongest version of shared state for Servexa Warranty AI because it connects directly to the actual warranty operation flow, the current Copilot rail, and existing HITL handlers.

