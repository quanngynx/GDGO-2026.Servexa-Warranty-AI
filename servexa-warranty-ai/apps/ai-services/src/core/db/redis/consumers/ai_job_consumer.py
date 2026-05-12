"""Consumes AI job envelopes published by Node `AiJobStreamService` (Redis Streams).

Features:
- consumer groups
- visibility timeout claim (XAUTOCLAIM)
- retry stream + bounded retries
- poison-message quarantine to DLQ
"""

from __future__ import annotations

import json
import logging
from datetime import datetime
from typing import Any

import redis.asyncio as redis

from configs.base import settings
from modules.v1.grpc.services.grpc_bridge_service import GrpcBridgeService

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
        body: dict[str, str] = {
            'version': '1.0',
            'stream': stream,
            'messageId': message_id,
            'reason': reason,
            'payload': payload,
            'retryCount': str(retry_count),
            'createdAt': datetime.utcnow().isoformat(),
        }
        if error:
            body['error'] = error
        if job_id:
            body['jobId'] = job_id
        await self._client.xadd(self._dlq, body)

    async def _queue_retry(self, envelope: dict[str, Any]) -> None:
        retry_count = int(envelope.get('retryCount', 0)) + 1
        envelope['retryCount'] = retry_count
        await self._client.xadd(
            self._retry_stream,
            {'payload': json.dumps(envelope)},
        )

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
        if not job_id or not query:
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

        try:
            output = await self._bridge.process(query)
            await self._set_meta(
                job_id,
                {
                    **envelope,
                    'status': 'completed',
                    'output': output[:16_000],
                    'workerStream': stream,
                },
            )
        except Exception as error:  # noqa: BLE001 — surface to DLQ + meta
            logger.exception('ai job failed job_id=%s', job_id)
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
