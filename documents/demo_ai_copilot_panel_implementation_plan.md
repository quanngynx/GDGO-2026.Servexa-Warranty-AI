# AI Copilot Panel Implementation Plan

## Objective

Implement an enterprise-grade AI Copilot Panel for the Servexa Warranty AI platform using:

- React Vite
- TanStack Router
- CopilotKit
- AG-UI protocol
- Express API Gateway (`app/server`)
- Python AI Services (`app/ai-services`)
- Future-ready LangGraph + RAG integration

The implementation must:

- prioritize demo impact for hackathon presentation
- remain architecture-safe for future production scaling
- avoid tight coupling between frontend and AI runtime
- support future multi-agent workflows
- support evidence-based RAG UX

---

# Phase 0 — Foundation & Architecture Alignment

## Goals

- Establish AI-first frontend boundaries
- Prevent frontend/backend coupling
- Define stable AI contracts early
- Prepare streaming-compatible architecture

---

## Target Architecture

```text
React Vite + TanStack Router
        ↓
CopilotKit + AG-UI UI Layer
        ↓
Express AI Gateway (app/server)
        ↓
Python AI Services (app/ai-services)
        ↓
LangGraph / RAG / pgvector / Tools
```

---

## Repository Structure

### Frontend

```text
src/
 ├── features/
 │    ├── ai-copilot/
 │    ├── ai-search/
 │    ├── ai-insights/
 │    ├── repair-intelligence/
 │    └── supply-chain-intelligence/
 │
 ├── providers/
 ├── routes/
 ├── layouts/
 ├── shared/
 └── services/
```

---

### Backend Gateway

```text
app/server/src/modules/
 └── ai-copilot/
      ├── controllers/
      ├── services/
      ├── routes/
      ├── adapters/
      ├── dto/
      └── contracts/
```

---

### AI Services

```text
app/ai-services/src/
 ├── agents/
 │    ├── operations/
 │    ├── supply_chain/
 │    ├── diagnostics/
 │    └── warranty/
 │
 ├── rag/
 ├── retrieval/
 ├── embeddings/
 ├── tools/
 └── contracts/
```

---

# Phase 1 — Core Copilot UI Shell

## Priority

Highest.

This phase creates the main visible AI experience.

---

## Goals

Implement:

- Fixed AI Copilot Panel
- CopilotKit integration
- Base conversation UI
- Enterprise AI layout
- Mock AI responses
- Context-aware UX foundation

---

## Install Dependencies

```bash
pnpm add @copilotkit/react-core
pnpm add @copilotkit/react-ui
pnpm add @copilotkit/runtime
pnpm add @copilotkit/runtime-client-gql
pnpm add @ag-ui/client
```

---

## Configure Global Styles

### main.tsx

```tsx
import "@copilotkit/react-ui/styles.css";
```

---

## Create Copilot Provider

### File

```text
src/providers/copilot-provider.tsx
```

### Responsibilities

- initialize CopilotKit
- configure runtime endpoint
- provide future streaming support
- centralize AI runtime configuration

---

## Configure Root Application

Wrap:

```tsx
<CopilotProvider>
  <RouterProvider />
</CopilotProvider>
```

---

## Create AI Command Center Route

### File

```text
src/routes/_app/ai-command-center.tsx
```

---

## Layout Structure

```text
┌──────────┬──────────────────────┬──────────────┐
│ Sidebar  │ Main Workspace      │ AI Copilot   │
│          │                     │ Fixed Panel  │
└──────────┴──────────────────────┴──────────────┘
```

---

## Implement Fixed Copilot Panel

### Component

```text
src/features/ai-copilot/components/ai-copilot-panel.tsx
```

---

## Initial Features

### Required

- persistent right sidebar
- conversation history
- streaming-ready message list
- prompt input
- loading states
- suggested prompts
- auto-scroll
- collapsible evidence section

---

## Suggested Prompts

```text
- Summarize this repair case
- Find similar failures
- Explain warranty eligibility
- Search technical manuals
- Detect supply chain risk
- Suggest next operational action
```

---

## Context Awareness

The Copilot Panel must automatically receive:

```ts
{
  currentRoute,
  repairCaseId,
  technicianId,
  customerId,
  productModel,
  warrantyStatus,
  currentUserRole,
}
```

without user re-entry.

---

# Phase 2 — Mock AI Runtime

## Goals

- enable fully interactive demo
- avoid backend dependency blocking frontend
- validate UX before real AI integration

---

## Create Mock Response Layer

### Folder

```text
src/features/ai-copilot/mock/
```

---

## Create Mock Contracts

### Copilot Response

```ts
export type CopilotResponse = {
  answer: string;
  confidence: number;
  sources: {
    id: string;
    title: string;
    type: "manual" | "repair_case" | "policy" | "inventory";
    excerpt?: string;
  }[];
  suggestedActions: {
    label: string;
    action: string;
  }[];
};
```

---

## Mock Scenarios

Create predefined scenarios:

```text
- overheating issue
- compressor failure
- delayed part shipment
- repeated repair failures
- warranty rejection explanation
```

---

## Evidence-Based UX

Every response must include:

- answer
- confidence
- evidence sources
- suggested actions
- related entities

This is mandatory.

---

# Phase 3 — Express AI Gateway

## Goals

- centralize AI traffic
- isolate frontend from AI runtime changes
- support future multi-agent orchestration

---

## Create AI Module

### Folder

```text
app/server/src/modules/ai-copilot/
```

---

## Initial Endpoints

```http
POST /api/copilotkit
POST /api/v1/ai/copilot/query
GET  /api/v1/ai/search
GET  /api/v1/ai/cases/:id/insights
GET  /api/v1/ai/supply-chain/alerts
```

---

## Responsibilities

### Express Gateway MUST:

- authenticate requests
- attach user context
- attach tenant/workspace context
- map integration IDs
- proxy AI requests
- normalize AI responses
- support future streaming

---

## Integration IDs

Use business-oriented identifiers.

### Correct

```ts
operations-intelligence-agent
technical-diagnosis-agent
supply-chain-agent
call-center-copilot
```

### Avoid

```ts
langgraph
openai
crewai
```

---

# Phase 4 — AI Services Integration

## Goals

- integrate real AI runtime
- integrate LangGraph agent
- integrate RAG retrieval
- support future tool calling

---

## AI Service Structure

```text
app/ai-services/src/
 ├── agents/
 ├── retrieval/
 ├── rag/
 ├── embeddings/
 ├── vectorstores/
 └── tools/
```

---

## Initial Agent Capabilities

### Operations Intelligence Agent

Should support:

- repair case summarization
- failure analysis
- warranty explanation
- technician assistance
- operational recommendation
- inventory impact awareness

---

## Minimal RAG Scope

Retrieve from:

```text
- repair history
- technical manuals
- warranty policies
- inventory records
- service bulletins
```

---

# Phase 5 — Streaming & AG-UI Integration

## Goals

- realtime AI experience
- streaming token updates
- future agent event support
- interruptible workflows

---

## Streaming Requirements

Support:

```text
- token streaming
- progress updates
- evidence updates
- tool execution events
- partial results
```

---

## Transport

Initial:

```text
SSE
```

Future:

```text
AG-UI event streams
WebSocket
```

---

## Frontend Streaming Features

- incremental rendering
- typing indicators
- streaming markdown
- realtime evidence injection
- partial AI answers

---

# Phase 6 — Enterprise AI UX

## Goals

Transform the system from:

```text
dashboard + chatbot
```

into:

```text
AI operational workspace
```

---

## Required Features

### Evidence Panel

Every AI answer must display:

- source title
- source type
- source excerpt
- confidence score
- related repair cases

---

## Suggested Actions

Examples:

```text
[Escalate case]
[Assign technician]
[Order replacement part]
[Generate customer response]
```

---

## AI Insight Cards

Examples:

```text
- Failure spike detected
- Inventory stockout risk
- SLA breach prediction
- High-risk repair queue
```

---

## AI Explainability

Add:

```text
Why did AI recommend this?
```

with explanation breakdown.

---

# Phase 7 — Global AI Search

## Goals

Implement enterprise semantic operational search.

---

## Features

- semantic search
- hybrid retrieval
- recent searches
- quick actions
- keyboard shortcut
- AI-generated summaries

---

## Search Targets

```text
- repair cases
- manuals
- inventory
- policies
- service bulletins
- AI insights
```

---

# Phase 8 — Future Multi-Agent Expansion

## Future Agents

```text
- Supply Chain Agent
- Operations Intelligence Agent
- Technical Diagnosis Agent
- Warranty Policy Agent
- Call Center Copilot
```

---

## Requirements

The frontend architecture must support:

- agent switching
- multi-agent orchestration
- shared context
- agent-specific tools
- agent-specific prompts

without major redesign.

---

# Visual Design Rules

## Direction

Inspired by:

- Linear
- Vercel
- Retool
- Stripe
- Palantir-lite

---

## Avoid

- generic admin template look
- ecommerce dashboard patterns
- fake analytics cards
- popup chatbot UI

---

## Visual Rules

### Backgrounds

```text
slate/navy
avoid pure black
```

---

### Cards

```text
subtle borders
light depth
tight spacing
```

---

### AI Accent Colors

```text
indigo
cyan
electric blue
```

---

# Technical Rules

## Frontend

### Avoid

- AI logic in UI components
- global mutable AI state
- direct framework coupling
- hardcoded AI provider assumptions

---

## Backend

### Avoid

- exposing AI provider details to frontend
- coupling routes to LangGraph directly
- frontend-controlled orchestration

---

# Final Deliverables

## Phase 1 Deliverables

- AI Command Center page
- Fixed AI Copilot Panel
- CopilotKit integration
- Mock AI responses
- Evidence UI
- Suggested actions UI
- Context-aware prompts

---

## Phase 2 Deliverables

- Express AI Gateway
- Real AI service integration
- LangGraph agent connection
- Streaming responses
- RAG retrieval

---

## Phase 3 Deliverables

- Global AI Search
- Supply chain insights
- Multi-agent support
- Operational intelligence widgets
- Realtime AI updates

---

# Success Criteria

The final system should feel like:

```text
An enterprise AI operational intelligence platform
```

NOT:

```text
A dashboard with a chatbot attached
```

