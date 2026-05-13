from __future__ import annotations

import json
import logging
from dataclasses import dataclass

from core.dependencies import get_coordinator_service

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

        result = await coordinator.run(
            ctx.message,
            trace_id=ctx.trace_id,
            tenant_id=ctx.tenant_id,
            job_id=ctx.job_id,
            job_type=ctx.job_type,
            execution_context=execution_ctx,
        )
        metadata = {
            'traceId': ctx.trace_id,
            'jobId': ctx.job_id,
            'jobType': ctx.job_type,
            'route': result.get('route'),
            'requestVersion': ctx.request_version,
            'toolResults': result.get('tool_results'),
        }
        return result['output'], json.dumps(metadata)

    async def process(self, message: str) -> str:
        out, _meta = await self.process_full(ProcessContext(message=message))
        return out
