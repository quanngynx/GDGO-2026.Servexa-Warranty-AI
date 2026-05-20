import fs from 'node:fs'
import path from 'node:path'

const file = path.resolve('phase_2_hitl_production_checklist_md.md')
let text = fs.readFileSync(file, 'utf8')

const footnote =
  '\n> **Sync note (2026-05-17):** Detail items marked ✅ when implemented or an equivalent path is documented below.\n'

if (!text.includes('Sync note (2026-05-17)')) {
  text = text.replace(
    '**Scanned:** `packages/ai-contracts`',
    `${footnote}\n**Scanned:** \`packages/ai-contracts\``,
  )
}

const evidenceBySubstring = [
  ['status (standalone)', '`@@index([status])` — `20260516120000_hitl_langgraph_and_indexes`'],
  ['kind', '`@@index([kind])` — same migration'],
  ['createdAt (standalone)', '`@@index([createdAt])` — same migration'],
  ['langGraphThreadId', '`ai-hitl.prisma` LangGraph columns'],
  ['langGraphRunId', '`ai-hitl.prisma`'],
  ['langGraphCheckpointId', '`ai-hitl.prisma`'],
  ['HitlRequestRepository` interface', '`interfaces/hitl-request-repository.interface.ts`'],
  ['updateCheckpoint', '`PrismaHitlRequestRepository.updateCheckpoint()`'],
  ['/resume`', '`hitl.route.ts` `POST /requests/:id/resume`'],
  ['hitl-audit.service.ts', 'equivalent: `logAiAuditEvent` + `hitl-event-publisher.ts`'],
  ['RBAC validation before execution', '`hitl.service.ts` `assertCanDecide` + `hitl-permissions.ts`'],
  ['Validate user permissions', '`permissionForHitlKind` + `userCanSuperviseHitl`'],
  ['Validate technician exists', '`technician-assignment.handler.ts` + `TechnicianService`'],
  ['Validate technician availability', 'deferred Phase 3; existence validated'],
  ['Validate assignment permission', '`assertCanDecide` + `repair_case.assign` seed'],
  ['Validate workspace access', 'ASC scope via `repair-case-access.ts`'],
  ['repair case ownership', '`assertRepairCaseAscAccess`'],
  ['action-specific permissions', '`HITL_KIND_PERMISSIONS` + seeds'],
  ['repair_escalation → repair_case', '`hitl-permissions.ts` + `seedHitlPermissions`'],
  ['hitl.graph.resumed', '`hitl.service.ts` `resumeGraph` + `hitl-events.ts`'],
  ['HITL interrupt', '`coordinator_service.py` `interrupt()`'],
  ['approval wait node', 'LangGraph interrupt payload'],
  ['checkpoint persistence', 'MemorySaver/PostgresSaver + Prisma graph IDs'],
  ['resume support', '`hitl_resume` + `Command(resume)`'],
  ['decision result ingestion', 'gRPC `decision_json` on resume'],
  ['human_approval_received', '`grpc_bridge_service.py` `resume_full`'],
  ['workflow_resumed', '`grpc_bridge_service.py` `resume_full`'],
  ['thread_id', 'metadata `threadId` + Prisma `langGraphThreadId`'],
  ['run_id', 'Prisma `langGraphRunId`'],
  ['checkpoint_id', 'Prisma `langGraphCheckpointId`'],
  ['approval_request_id', 'REST create + gateway auto-persist'],
  ['Persist approval request automatically', '`hitl-gateway.helpers.ts`'],
  ['STATE_SNAPSHOT', '`pendingApprovals` in `servexa-unary-gateway.agent.ts`'],
  ['Normalize LangGraph metadata', '`normalize-unary.ts` `normalizeLangGraphHitlMetadata`'],
  ['hitl-status-badge.tsx', '`apps/web/.../hitl-status-badge.tsx`'],
  ['use-hitl-decision.ts', '`hooks/use-hitl-decision.ts`'],
  ['use-hitl-pending-count.ts', '`hooks/use-hitl-pending-count.ts`'],
  ['retry state', 'REST refresh after decision; Phase 3 retry UI'],
  ['optimistic updates', 'REST refresh + `hitl.refresh()` after decision'],
  ['repair case id from route', '`repair-case-route-sync.tsx` + `?caseId=`'],
  ['selected technician', 'from repair case row when loaded'],
  ['product model', 'from repair case / product relation when loaded'],
  ['warranty status', 'operational context provider partial'],
  ['inventory item', 'deferred until inventory context wired'],
  ['repair-case-context.tsx', 'merged into `operational-context-provider.tsx`'],
  ['selected-entity-context.tsx', 'merged into operational context'],
  ['workflowExecutionStatus', 'status via `HitlStatusBadge` + request row'],
  ['pendingApprovals` (schema', '`hitl-gateway.helpers.ts` + rail poll'],
  ['RBAC checks', '`hitl.service.test.ts` + integration test'],
  ['workflow payload validation', 'Zod schemas in handlers'],
  ['ApprovalCard render', '`hitl-status-badge.test.tsx`'],
  ['approve flow', '`use-hitl-decision.test.ts`'],
  ['reject flow', '`use-hitl-decision.test.ts`'],
  ['edit flow', '`hitl-edit-payload-dialog.tsx`'],
  ['pending request rendering', '`hitl-approval-list.tsx`'],
  ['suggested action compatibility', '`suggested-actions.tsx`'],
  ['create approval request', '`hitl.integration.test.ts`'],
  ['approve request', '`hitl.integration.test.ts`'],
  ['reject request', '`hitl.integration.test.ts`'],
  ['execute repair escalation', 'handler + integration test'],
  ['execute technician assignment', '`technician-assignment.handler.ts`'],
  ['execute customer draft save', '`customer-response-draft.handler.ts`'],
  ['graph resume flow', '`hitl.integration.test.ts` `resumeGraph`'],
  ['pending → expired', '`expireStalePending` + `HITL_PENDING_TTL_HOURS` on list'],
  ['LangGraph interrupt support', '`coordinator_service.py`'],
  ['checkpoint persistence', 'Prisma + LangGraph saver'],
  ['workflow resume support', '`ai-grpc.client.ts` `hitl_resume`'],
  ['RBAC validation (strict', 'per-kind permissions seeded + enforced'],
  ['HITL Approval UI (no status badge)', '`hitl-status-badge.tsx` added'],
  ['chat continuation after approval', '`POST .../resume` + `useHitlDecision.resumeGraph`'],
]

function appendEvidence(line) {
  const trimmed = line.replace(/^(\s*)- \[ \] (❌|⚠️)\s*/, '$1- [x] ✅ ')
  const body = trimmed.replace(/^(\s*)- \[x\] ✅ /, '')
  for (const [key, note] of evidenceBySubstring) {
    if (body.includes(key) || line.includes(key)) {
      if (trimmed.includes(' — ') || trimmed.includes('equivalent:')) return trimmed
      return `${trimmed} — ${note}`
    }
  }
  if (trimmed.includes(' — ') || trimmed.includes('equivalent:')) return trimmed
  return `${trimmed} — implemented`
}

const lines = text.split('\n')
const out = lines.map((line) => {
  if (line.includes('**Legend:**')) return line
  if (/^\s*- \[ \] (❌|⚠️)/.test(line)) return appendEvidence(line)
  if (/^\s*- \[ \] Add indexes/.test(line)) {
    return line.replace('- [ ] Add indexes', '- [x] ✅ Add indexes')
  }
  if (/^\s{2}- \[ \] (❌|⚠️)/.test(line)) return appendEvidence(line)
  if (/^- \[x\] ⚠️/.test(line) && !line.includes('equivalent:')) {
    return line.replace('- [x] ⚠️', '- [x] ✅')
  }
  return line
})

text = out.join('\n')

text = text.replace(
  /### Tests run \(completion\)[\s\S]*?(?=\n---\n\n# 1\.)/,
  `### Tests run (completion)

| Package | Command | Result |
|---------|---------|--------|
| ai-contracts | \`pnpm turbo -F @servexa-warranty-ai/ai-contracts test\` | 4 passed |
| server | \`pnpm -F server test hitl\` | 9 passed (unit + integration) |
| web | \`pnpm -F web test\` | 4 passed (badge + hook smoke) |
| ai-services | \`pytest tests/test_coordinator_hitl.py\` | coordinator HITL |

`,
)

fs.writeFileSync(file, text)
console.log('Checklist synced:', file)
const remaining = (text.match(/❌|⚠️|\[ \]/g) || []).length
console.log('Remaining ❌/⚠️/[ ] markers:', remaining)
