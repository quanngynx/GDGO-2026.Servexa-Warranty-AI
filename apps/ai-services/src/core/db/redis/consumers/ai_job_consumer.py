"""Consumes AI job envelopes published by Node `AiJobStreamService` (Redis Streams).

Features:
- consumer groups
- visibility timeout claim (XAUTOCLAIM)
- retry stream + bounded retries
- poison-message quarantine to DLQ
- optional async knowledge ingest forwarding to Node internal webhook
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any

import httpx
import redis.asyncio as redis

from configs.base import settings
from modules.v1.grpc.services.grpc_bridge_service import GrpcBridgeService, ProcessContext
from modules.v1.observability.services.metrics_service import get_metrics_service

logger = logging.getLogger(__name__)

JOB_META_PREFIX = 'ai:job:meta:'
JOB_META_TTL_SEC = 86_400


class AiJobStreamConsumer:
    """XREADGROUP over ERP AI streams; failures are retried or quarantined."""

    def __init__(self) -> None:
        self._client = redis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=2.0,
            socket_timeout=120.0,
        )
        self._streams = [
            settings.ai_stream_analysis,
            settings.ai_stream_chat,
            settings.ai_stream_report,
            settings.ai_stream_anomaly,
            settings.ai_stream_ingest,
        ]
        self._retry_stream = settings.ai_stream_retry
        self._group = settings.ai_job_consumer_group
        self._consumer = settings.redis_consumer_name
        self._dlq = settings.ai_job_dlq_stream
        self._max_retries = settings.ai_job_max_retries
        self._visibility_timeout_ms = settings.ai_job_visibility_timeout_ms
        self._bridge = GrpcBridgeService()

    async def ensure_groups(self) -> None:
        for stream in [*self._streams, self._retry_stream]:
            try:
                await self._client.xgroup_create(stream, self._group, id='0', mkstream=True)
            except redis.ResponseError as error:
                if 'BUSYGROUP' not in str(error):
                    raise

    async def _set_meta(self, job_id: str, data: dict[str, Any]) -> None:
        key = f'{JOB_META_PREFIX}{job_id}'
        data = {**data, 'lastHeartbeatAt': datetime.now(timezone.utc).isoformat()}
        await self._client.set(key, json.dumps(data), ex=JOB_META_TTL_SEC)

    async def _publish_dlq(
        self,
        *,
        stream: str,
        message_id: str,
        reason: str,
        payload: str,
        error: str | None = None,
        job_id: str | None = None,
        retry_count: int = 0,
    ) -> None:
        # Field names aligned with packages/event-contracts aiJobDlqEnvelopeSchema (camelCase keys in stream)
        body: dict[str, str] = {
            'version': '1.0',
            'stream': stream,
            'messageId': message_id,
            'reason': reason,
            'payload': payload,
            'retryCount': str(retry_count),
            'createdAt': datetime.now(timezone.utc).isoformat(),
        }
        if error:
            body['error'] = error
        if job_id:
            body['jobId'] = job_id
        await self._client.xadd(self._dlq, body)
        get_metrics_service().inc('dlq_published')

    async def _queue_retry(self, envelope: dict[str, Any]) -> None:
        retry_count = int(envelope.get('retryCount', 0)) + 1
        envelope['retryCount'] = retry_count
        await self._client.xadd(
            self._retry_stream,
            {'payload': json.dumps(envelope)},
        )

    async def _maybe_cancelled(self, job_id: str) -> bool:
        key = f'ai:job:cancel:{job_id}'
        val = await self._client.get(key)
        return bool(val)

    async def _forward_knowledge_ingest(self, envelope: dict[str, Any], job_id: str) -> str:
        base = (settings.erp_internal_base_url or '').rstrip('/')
        secret = settings.ai_internal_ingest_secret or ''
        if not base or not secret:
            raise RuntimeError('knowledge_ingest requires ERP_INTERNAL_BASE_URL and AI_INTERNAL_INGEST_SECRET')
        url = f'{base}/v1/ai/knowledge/internal-ingest'
        payload = {'envelope': envelope}
        headers = {'x-internal-ingest-key': secret, 'content-type': 'application/json'}
        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            if isinstance(data, dict) and 'metadata' in data:
                return json.dumps(data['metadata'])
            return json.dumps(data) if isinstance(data, dict) else (resp.text[:16_000] or '{}')

    async def _handle_one(self, stream: str, message_id: str, fields: dict[str, str]) -> None:
        raw = fields.get('payload', '{}')
        try:
            envelope = json.loads(raw)
        except json.JSONDecodeError:
            logger.exception('invalid job payload stream=%s id=%s', stream, message_id)
            await self._publish_dlq(
                stream=stream,
                message_id=message_id,
                reason='invalid_json',
                payload=raw,
            )
            await self._client.xack(stream, self._group, message_id)
            return

        job_id = str(envelope.get('jobId', '')).strip()
        query = str(envelope.get('query', '')).strip()
        retry_count = int(envelope.get('retryCount', 0))
        job_type = str(envelope.get('type', '')).strip()

        if not job_id:
            await self._publish_dlq(
                stream=stream,
                message_id=message_id,
                reason='invalid_payload',
                payload=raw,
            )
            await self._client.xack(stream, self._group, message_id)
            return

        if job_type != 'knowledge_ingest' and not query:
            await self._publish_dlq(
                stream=stream,
                message_id=message_id,
                reason='invalid_payload',
                payload=raw,
            )
            await self._client.xack(stream, self._group, message_id)
            return

        if job_type == 'knowledge_ingest' and not isinstance(envelope.get('context'), dict):
            await self._publish_dlq(
                stream=stream,
                message_id=message_id,
                reason='invalid_payload',
                payload=raw,
            )
            await self._client.xack(stream, self._group, message_id)
            return

        base_meta = {**envelope, 'status': 'processing', 'workerStream': stream}
        await self._set_meta(job_id, base_meta)

        if await self._maybe_cancelled(job_id):
            await self._set_meta(job_id, {**envelope, 'status': 'cancelled', 'workerStream': stream})
            await self._client.xack(stream, self._group, message_id)
            get_metrics_service().inc('jobs_cancelled')
            return

        try:
            if job_type == 'knowledge_ingest':
                output = await self._forward_knowledge_ingest(envelope, job_id)
            else:
                ctx_blob = {
                    **(envelope.get('context') or {}),
                    'envelope': {'jobId': job_id, 'type': job_type, 'createdAt': envelope.get('createdAt')},
                }
                proc = ProcessContext(
                    message=query,
                    trace_id=str(envelope.get('traceId') or job_id),
                    user_id=str(envelope.get('userId', '')),
                    tenant_id=str(envelope.get('tenantId', '')),
                    role='',
                    context_json=json.dumps(envelope.get('context') or {}),
                    request_version='1',
                    job_id=job_id,
                    job_type=job_type,
                    execution_context_json=json.dumps(ctx_blob),
                )
                output, _meta = await self._bridge.process_full(proc)

            await self._set_meta(
                job_id,
                {
                    **envelope,
                    'status': 'completed',
                    'output': output[:16_000] if isinstance(output, str) else str(output)[:16_000],
                    'workerStream': stream,
                },
            )
            get_metrics_service().inc('jobs_completed')
        except Exception as error:  # noqa: BLE001 — surface to DLQ + meta
            logger.exception('ai job failed job_id=%s', job_id)
            get_metrics_service().inc('jobs_failed')
            if retry_count < self._max_retries:
                await self._queue_retry(envelope)
                await self._set_meta(
                    job_id,
                    {
                        **envelope,
                        'status': 'retry_scheduled',
                        'error': str(error),
                        'workerStream': stream,
                        'retryCount': retry_count + 1,
                    },
                )
            else:
                await self._publish_dlq(
                    stream=stream,
                    message_id=message_id,
                    reason='poison_message',
                    payload=raw,
                    error=str(error),
                    job_id=job_id,
                    retry_count=retry_count,
                )
                await self._set_meta(
                    job_id,
                    {**envelope, 'status': 'failed', 'error': str(error), 'workerStream': stream},
                )
        finally:
            await self._client.xack(stream, self._group, message_id)

    async def _claim_timed_out(self) -> int:
        claimed_total = 0
        for stream in [*self._streams, self._retry_stream]:
            next_id = '0-0'
            while True:
                next_id, claimed, _deleted = await self._client.xautoclaim(
                    stream,
                    self._group,
                    self._consumer,
                    self._visibility_timeout_ms,
                    next_id,
                    count=25,
                )
                for msg_id, data in claimed:
                    await self._handle_one(stream, msg_id, data)
                    claimed_total += 1
                if next_id == '0-0' or not claimed:
                    break
        return claimed_total

    async def process_batch(self, count: int = 10, block_ms: int = 5000) -> int:
        await self.ensure_groups()
        reclaimed = await self._claim_timed_out()
        stream_ids = {s: '>' for s in [*self._streams, self._retry_stream]}
        block_arg = block_ms if block_ms > 0 else 1
        messages = await self._client.xreadgroup(
            groupname=self._group,
            consumername=self._consumer,
            streams=stream_ids,
            count=count,
            block=block_arg,
        )
        processed = 0
        if not messages:
            return reclaimed
        for stream_name, entries in messages:
            for msg_id, data in entries:
                await self._handle_one(stream_name, msg_id, data)
                processed += 1
        return reclaimed + processed

    async def close(self) -> None:
        await self._client.aclose()
