"""P0A-only Redis trace consumer; never selected by production manifests."""

import asyncio
import secrets
import time

import httpx
import redis.asyncio as redis

from configs.base import settings


async def emit_span(traceparent: str, correlation_id: str) -> None:
    started = time.time_ns()
    payload = {'resourceSpans': [{
        'resource': {'attributes': [{'key': 'service.name', 'value': {'stringValue': 'servexa-ai-worker-p0a'}}]},
        'scopeSpans': [{'scope': {'name': 'p0a-proof'}, 'spans': [{
            'traceId': traceparent.split('-')[1], 'spanId': secrets.token_hex(8), 'name': 'worker-p0a-proof', 'kind': 5,
            'startTimeUnixNano': str(started), 'endTimeUnixNano': str(started + 1_000_000), 'status': {'code': 1},
            'attributes': [{'key': 'correlation.id', 'value': {'stringValue': correlation_id}}],
        }]}],
    }]}
    async with httpx.AsyncClient(timeout=2.0) as client:
        response = await client.post(f'{settings.otel_exporter_otlp_endpoint.rstrip("/")}/v1/traces', json=payload)
        response.raise_for_status()


async def main() -> None:
    if not settings.p0a_enabled:
        raise RuntimeError('P0A worker cannot run unless P0A_ENABLED=true')
    client = redis.from_url(settings.redis_url, decode_responses=True)
    last_id = '0-0'
    while True:
        messages = await client.xread({'p0a:trace': last_id}, count=10, block=1_000)
        for _, entries in messages:
            for message_id, fields in entries:
                await emit_span(fields['traceparent'], fields['correlationId'])
                await client.xdel('p0a:trace', message_id)
                last_id = message_id


if __name__ == '__main__':
    asyncio.run(main())
