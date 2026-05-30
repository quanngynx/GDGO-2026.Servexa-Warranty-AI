# Phase D Backlog Package — Governance & Security

## Scope
- Tool permission model per tenant and role.
- Human-in-the-loop approval for restricted tools/actions.
- Prompt injection and unsafe output policy enforcement.

## Policy Model
- `policy_key` + `tenant_scope` + `role_scope` + `tool_name` + `action`.
- Decision outcomes: `allow`, `deny`, `require_approval`.

## HITL Flow
1. AI/tool invocation requests guarded action.
2. Action stored as pending approval.
3. Approver decision emits approval event.
4. Worker resumes execution from approval event.

## Exit Criteria
- Restricted tools cannot execute without explicit allow/approval.
- Governance decisions logged with actor + rationale.
