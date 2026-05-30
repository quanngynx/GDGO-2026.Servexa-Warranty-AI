# Phase A Contract Governance Checklist

## Proto Governance
- Canonical proto source: `packages/proto/ai/v1/ai_service.proto`.
- Avoid app-local proto copies.
- Backward compatible changes allowed in-place for `v1` (additive fields/RPCs).
- Breaking changes require new package namespace/version path (e.g. `ai.v2`).

## Event Contract Governance
- Canonical stream envelope schema in `packages/event-contracts/src/index.ts`.
- Envelope must include `version`, `jobId`, `tenantId`, `type`, `createdAt`, `retryCount`.
- DLQ entries must include `reason` and original payload context.

## Evolution Rules
- Additive fields only for minor evolution.
- Never repurpose existing fields with changed semantics.
- Keep replayability: old payloads must be parseable by current consumers.

## Compatibility Gate
- Validate producer payload against shared schema.
- Validate consumer parse path against previous payload examples.
- Keep at least one replay sample in tests/fixtures before rollout.
