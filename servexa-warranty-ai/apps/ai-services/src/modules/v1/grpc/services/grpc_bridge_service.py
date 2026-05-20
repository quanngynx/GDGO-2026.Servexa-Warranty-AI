from __future__ import annotations

import json
import logging
from dataclasses import dataclass

from core.dependencies import get_coordinator_service
from modules.v1.hitl.copilot_metadata import build_copilot_envelope, publish_hitl_event_log

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class ProcessContext:
    message: str
    trace_id: str = ''
    user_id: str = ''
    tenant_id: str = ''
    role: str = ''
    context_json: str = '{}'
    request_version: str = '1'
    job_id: str = ''
    job_type: str = ''
    execution_context_json: str = '{}'


@dataclass(frozen=True)
class ResumeContext:
    thread_id: str
    checkpoint_id: str = ''
    approval_request_id: str = ''
    decision_json: str = '{}'
    trace_id: str = ''
    user_id: str = ''


class GrpcBridgeService:
    async def process_full(self, ctx: ProcessContext) -> tuple[str, str]:
        coordinator = get_coordinator_service()
        execution_ctx: dict[str, object] = {}
        try:
            raw = json.loads(ctx.execution_context_json or '{}')
            if isinstance(raw, dict):
                execution_ctx = raw
        except json.JSONDecodeError:
            logger.warning('invalid execution_context_json', extra={'trace_id': ctx.trace_id})

        logger.info(
            'prompt_snapshot %s',
            json.dumps(
                {
                    'trace_id': ctx.trace_id,
                    'job_id': ctx.job_id,
                    'job_type': ctx.job_type,
                    'message_chars': len(ctx.message),
                    'request_version': ctx.request_version,
                },
                default=str,
            ),
        )

        if ctx.job_type == 'hitl_resume':
            resume_ctx = ResumeContext(
                thread_id=str(execution_ctx.get('threadId') or execution_ctx.get('thread_id') or ''),
                checkpoint_id=str(
                    execution_ctx.get('checkpointId') or execution_ctx.get('checkpoint_id') or '',
                ),
                approval_request_id=str(
                    execution_ctx.get('approvalRequestId')
                    or execution_ctx.get('approval_request_id')
                    or '',
                ),
                decision_json=str(
                    execution_ctx.get('decisionJson') or execution_ctx.get('decision_json') or '{}',
                ),
                trace_id=ctx.trace_id,
                user_id=ctx.user_id,
            )
            return await self.resume_full(resume_ctx)

        result = await coordinator.run(
            ctx.message,
            trace_id=ctx.trace_id,
            tenant_id=ctx.tenant_id,
            job_id=ctx.job_id or ctx.trace_id,
            job_type=ctx.job_type,
            execution_context=execution_ctx,
        )

        thread_id = str(result.get('thread_id') or ctx.job_id or ctx.trace_id)
        route = result.get('route')
        metadata: dict[str, object] = {
            'traceId': ctx.trace_id,
            'jobId': ctx.job_id,
            'jobType': ctx.job_type,
            'route': route,
            'requestVersion': ctx.request_version,
            'toolResults': result.get('tool_results'),
            'threadId': thread_id,
        }

        if result.get('hitl_status') == 'awaiting_approval':
            interrupt_payload = result.get('interrupt_payload') or {}
            metadata['humanApprovalRequired'] = True
            metadata['checkpointId'] = result.get('checkpoint_id', '')
            metadata['runId'] = ctx.trace_id
            metadata.update(build_copilot_envelope(str(route) if route else None, execution_ctx))
            # diagnosis/warranty still attached for HITL rail context
            publish_hitl_event_log(
                'human_approval_required',
                {
                    'threadId': thread_id,
                    'traceId': ctx.trace_id,
                    'userId': ctx.user_id,
                    'payload': interrupt_payload,
                },
            )
            output = (
                'This workflow requires your approval before execution can continue. '
                'Review the suggested action in the copilot rail.'
            )
            return output, json.dumps(metadata)

        phase3 = result.get('copilot_phase3') if isinstance(result.get('copilot_phase3'), dict) else {}
        diagnosis_override = phase3.get('diagnosisDraft') if isinstance(phase3, dict) else None
        metadata.update(
            build_copilot_envelope(
                str(route) if route else None,
                execution_ctx,
                diagnosis_draft=diagnosis_override if isinstance(diagnosis_override, dict) else None,
            ),
        )
        return result.get('output', ''), json.dumps(metadata)

    async def resume_full(self, ctx: ResumeContext) -> tuple[str, str]:
        coordinator = get_coordinator_service()
        result = await coordinator.resume(
            thread_id=ctx.thread_id,
            checkpoint_id=ctx.checkpoint_id,
            decision_json=ctx.decision_json,
        )
        publish_hitl_event_log(
            'human_approval_received',
            {
                'threadId': ctx.thread_id,
                'approvalRequestId': ctx.approval_request_id,
                'traceId': ctx.trace_id,
                'userId': ctx.user_id,
            },
        )
        publish_hitl_event_log(
            'workflow_resumed',
            {
                'threadId': ctx.thread_id,
                'approvalRequestId': ctx.approval_request_id,
                'traceId': ctx.trace_id,
                'userId': ctx.user_id,
            },
        )
        metadata = {
            'traceId': ctx.trace_id,
            'threadId': ctx.thread_id,
            'humanApprovalReceived': True,
            'workflowResumed': True,
            'approvalRequestId': ctx.approval_request_id,
        }
        return result.get('output', 'Workflow resumed.'), json.dumps(metadata)

    async def process(self, message: str) -> str:
        out, _meta = await self.process_full(ProcessContext(message=message))
        return out
