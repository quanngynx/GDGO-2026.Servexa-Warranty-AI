# Phase C Backlog Package — Workflow Runtime Persistence

## Scope
- Persist workflow instances and transitions in PostgreSQL.
- Add deterministic transition engine with retry transitions and compensating actions.
- Integrate with Redis job completion events to drive state transitions.

## Proposed Modules
- `apps/server/src/modules/v1/workflows/runtime`
- `apps/server/src/modules/v1/workflows/persistence`
- `apps/server/src/modules/v1/workflows/transitions`

## Data Model
- `workflow_instances(id, workflow_key, status, tenant_id, correlation_id, created_at, updated_at)`
- `workflow_events(id, instance_id, event, from_status, to_status, payload_json, created_at)`

## Exit Criteria
- Resume/replay of workflow instance after process restart.
- Transition history queryable by `instance_id`.
