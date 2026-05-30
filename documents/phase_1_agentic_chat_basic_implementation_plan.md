# Phase 1 — Agentic Chat Basic Implementation Plan

## Objective

Complete a production-structured foundational Agentic Chat experience for the Servexa Warranty AI platform using:

- React Vite
- TanStack Router
- CopilotKit
- AG-UI protocol concepts
- Express AI Gateway
- Existing AI services
- Existing unary gateway agent

This phase focuses on:

- stable AI Copilot UX
- operational intelligence workflows
- evidence-based AI responses
- context-aware interactions
- streaming-compatible architecture
- hackathon/demo readiness

This phase DOES NOT yet implement:

- full multi-agent orchestration
- advanced shared state synchronization
- multimodal processing
- subgraph visualization
- human-in-the-loop interrupts
- generative dynamic UI rendering

---

# Phase Goals

## Primary Goals

Implement:

1. Stable AI Copilot Panel
2. Context-aware Agentic Chat
3. Streaming AI responses
4. Evidence/source rendering
5. Suggested action rendering
6. AI response metadata support
7. Operational intelligence prompts
8. AI Gateway integration
9. Mock + real backend compatibility
10. Production-safe frontend architecture

---

# Current Architecture Assessment

## Existing Strengths

### apps/web

Already contains:

```text
- authenticated-copilot-providers
- ai-copilot-rail
- CopilotChat integration
- useAgent hooks
- useAgentContext
```

---

### apps/server

Already contains:

```text
- /api/copilotkit route
- CopilotRuntime
- ServexaUnaryGatewayAgent
- AG-UI event emission
- streaming text chunk simulation
```

---

### apps/ai-services

Already contains:

```text
- LangGraph coordinator
- RAG modules
- gRPC bridge
- Redis
- pgvector foundation
```

---

# Target UX

## Final UX for Phase 1

```text
User opens AI Command Center
↓
Copilot Panel visible on right side
↓
User asks operational question
↓
AI streams response in realtime
↓
AI displays:
- answer
- confidence
- evidence
- suggested actions
- related entities
↓
User continues contextual conversation
```

---

# Architecture Target

```text
React UI
↓
CopilotKit Provider
↓
Copilot Runtime Gateway
↓
Unary Gateway Agent
↓
AI Services
↓
Gemini / LangGraph / RAG
```

---

# Phase 1 Deliverables

## Frontend

- AI Copilot Panel
- AI Command Center page
- Context-aware prompts
- Evidence rendering
- Suggested action rendering
- Streaming message rendering
- Operational prompt presets
- Loading states
- Error states
- AI metadata rendering

---

## Backend

- Stable `/api/copilotkit`
- Response metadata contract
- Evidence payload support
- Suggested actions payload support
- Operational context forwarding
- AI response normalization

---

# Step 1 — Stabilize AI Copilot Layout

## Goal

Convert the current Copilot rail into a permanent enterprise AI workspace.

---

## Files

```text
apps/web/src/features/ai-copilot/
```

---

## Tasks

### Refactor `ai-copilot-rail.tsx`

Implement:

```text
- fixed right sidebar
- sticky height
- responsive collapse
- conversation persistence
- streaming-ready message area
- operational prompts
```

---

## Layout Structure

```text
┌────────────────────────────┐
│ Agent Header               │
├────────────────────────────┤
│ Operational Quick Actions  │
├────────────────────────────┤
│ Conversation Thread        │
├────────────────────────────┤
│ Evidence Section           │
├────────────────────────────┤
│ Suggested Actions          │
├────────────────────────────┤
│ Prompt Input               │
└────────────────────────────┘
```

---

## Agent Header

Must display:

```text
- agent name
- agent status
- current operational scope
- current route context
```

Example:

```text
Operations Intelligence Agent
Currently assisting with Repair Case #RC-291
```

---

# Step 2 — Context-Aware Chat Integration

## Goal

Ensure the AI automatically understands current operational context.

---

## Context Sources

The frontend should automatically inject:

```ts
{
  currentRoute,
  repairCaseId,
  customerId,
  technicianId,
  productModel,
  warrantyStatus,
  currentUserRole,
}
```

---

## Implementation

### Use `useAgentContext`

Create:

```text
apps/web/src/features/ai-copilot/hooks/
```

Add:

```text
use-operational-context.ts
```

Responsibilities:

- extract router context
- extract repair case context
- extract user role
- normalize AI context payload

---

## Example Context

```ts
{
  route: "/repair-cases/123",
  repairCaseId: "123",
  model: "Samsung-WM-2024",
  warrantyStatus: "in_warranty",
  role: "technician",
}
```

---

# Step 3 — Operational Prompt Presets

## Goal

Provide enterprise operational AI workflows.

---

## Quick Prompts

Implement:

```text
- Summarize this repair case
- Find similar repair failures
- Explain warranty eligibility
- Detect SLA risk
- Search technical manuals
- Suggest next operational action
- Detect supply chain risk
```

---

## Component

```text
quick-prompt-grid.tsx
```

---

# Step 4 — Streaming AI Responses

## Goal

Create realtime AI interaction.

---

## Current State

Existing unary gateway already emits:

```text
TEXT_MESSAGE_CONTENT
```

in chunked streaming form.

This is sufficient for Phase 1.

---

## Tasks

### Improve Streaming UX

Implement:

```text
- typing indicator
- partial rendering
- markdown rendering
- smooth scrolling
- message transition animation
```

---

## Avoid

Do NOT implement:

```text
- websocket orchestration
- realtime subgraphs
- event DAG visualization
```

in Phase 1.

---

# Step 5 — AI Metadata Contract

## Goal

Upgrade AI responses from plain text to operational intelligence responses.

---

## Current Problem

Current responses are primarily:

```ts
{
  answer: string
}
```

This is insufficient.

---

## New Contract

Create shared contract:

```text
packages/ai-contracts/
```

---

## Copilot Response Schema

```ts
export type CopilotResponse = {
  answer: string;
  confidence?: number;
  sources?: {
    id: string;
    title: string;
    type: "manual" | "repair_case" | "policy" | "inventory";
    excerpt?: string;
  }[];
  suggestedActions?: {
    id: string;
    label: string;
    action: string;
  }[];
  relatedEntities?: {
    id: string;
    type: string;
    label: string;
  }[];
};
```

---

# Step 6 — Evidence Rendering

## Goal

Every AI answer must show evidence.

---

## Component

```text
evidence-panel.tsx
```

---

## Render:

```text
- source title
- source type
- source excerpt
- source relevance
```

---

## Examples

```text
Sources:
- Samsung Washer Repair Manual
- Repair Case RC-2019
- Warranty Policy W-12
```

---

# Step 7 — Suggested Actions UI

## Goal

Move beyond chatbot interaction.

---

## Component

```text
suggested-actions.tsx
```

---

## Actions

```text
[Assign technician]
[Escalate repair]
[Order replacement part]
[Generate customer summary]
```

---

## Requirements

Actions should:

```text
- be clickable
- be context-aware
- support future workflow execution
```

---

# Step 8 — AI Gateway Normalization

## Goal

Normalize AI responses before frontend consumption.

---

## Files

```text
apps/server/src/modules/copilotkit/
```

---

## Tasks

### Refactor `servexa-unary-gateway.agent.ts`

Add:

```text
- metadata extraction
- evidence normalization
- suggested action mapping
- confidence extraction
```

---

## Target

Frontend should receive:

```text
stable AI schema
```

independent of:

```text
Gemini
LangGraph
OpenAI
future models
```

---

# Step 9 — AI Service Compatibility Layer

## Goal

Allow mock mode and real AI mode simultaneously.

---

## Requirements

Support:

```text
- mock responses
- grpc responses
- LangGraph responses
- Gemini responses
```

without frontend changes.

---

## Create Adapter Layer

```text
apps/server/src/modules/copilotkit/adapters/
```

---

## Adapters

```text
mock.adapter.ts
grpc.adapter.ts
langgraph.adapter.ts
```

---

# Step 10 — AI Command Center Page

## Goal

Create the primary AI workspace screen.

---

## Route

```text
/apps/web/src/routes/_app/ai-command-center.tsx
```

---

## Dashboard Widgets

Implement:

```text
- SLA risk
- repair bottlenecks
- escalation risk
- technician workload
- AI recommendations
- active alerts
```

---

## Avoid

Do NOT implement:

```text
- ecommerce analytics
- fake revenue charts
- generic admin widgets
```

---

# Step 11 — Error Handling & Reliability

## Goal

Prevent broken AI UX.

---

## Frontend States

Implement:

```text
- loading
- partial response
- timeout
- retry
- disconnected state
- backend unavailable
```

---

## Backend

Implement:

```text
- request timeout
- fallback response
- streaming cancellation
- structured error format
```

---

# Step 12 — Demo Optimization

## Goal

Optimize hackathon/demo perception.

---

## Focus Areas

Prioritize:

```text
- perceived intelligence
- realtime feel
- operational usefulness
- contextual awareness
- evidence-based AI
```

---

## Avoid

Avoid spending time on:

```text
- advanced orchestration
- subgraph rendering
- complex tool systems
- autonomous workflows
```

during Phase 1.

---

# Technical Rules

## Frontend Rules

### Avoid

```text
- AI provider logic in components
- direct Gemini/OpenAI coupling
- giant copilot component files
- global mutable AI state
```

---

## Backend Rules

### Avoid

```text
- frontend-aware orchestration
- leaking provider schemas
- hardcoded provider assumptions
```

---

# Visual Direction

## Style Direction

Inspired by:

```text
- Linear
- Vercel
- Retool
- Palantir-lite
```

---

## Colors

```text
Background: slate/navy
AI accents: indigo/cyan
Alerts: amber/red
```

---

## Layout Rules

```text
- dense enterprise layout
- subtle borders
- minimal shadows
- fixed copilot panel
- no popup chatbot
```

---

# Final Deliverables

## Frontend

- AI Command Center
- AI Copilot Panel
- Streaming Chat UX
- Evidence UI
- Suggested Actions UI
- Operational Prompts
- Context-aware AI

---

## Backend

- Stable AI Gateway
- AI metadata contract
- Response normalization
- Mock/real compatibility
- Streaming support

---

# Success Criteria

The system should feel like:

```text
An enterprise AI operational assistant
```

NOT:

```text
A chatbot attached to a dashboard
```

