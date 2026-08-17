import asyncio
import secrets
import time

import httpx
from fastapi import APIRouter, HTTPException, Request, Response

from configs.base import settings

router = APIRouter(prefix='/v1/health', tags=['health'])


async def emit_p0a_span(traceparent: str, correlation_id: str, name: str) -> None:
    trace_id = traceparent.split('-')[1]
    started = time.time_ns()
    payload = {'resourceSpans': [{
        'resource': {'attributes': [{'key': 'service.name', 'value': {'stringValue': 'servexa-ai-p0a'}}]},
        'scopeSpans': [{'scope': {'name': 'p0a-proof'}, 'spans': [{
            'traceId': trace_id, 'spanId': secrets.token_hex(8), 'name': name, 'kind': 2,
            'startTimeUnixNano': str(started), 'endTimeUnixNano': str(started + 1_000_000), 'status': {'code': 1},
            'attributes': [{'key': 'correlation.id', 'value': {'stringValue': correlation_id}}],
        }]}],
    }]}
    async with httpx.AsyncClient(timeout=2.0) as client:
        result = await client.post(f'{settings.otel_exporter_otlp_endpoint.rstrip("/")}/v1/traces', json=payload)
        result.raise_for_status()

@router.get('/ping')
def health_check() -> dict[str, str]:
    return {'ping': 'pong'}


@router.get('/ready')
async def readiness(response: Response) -> dict[str, object]:
    urls = [value.strip() for value in settings.p0a_dependency_urls.split(',') if value.strip()]

    async def check(url: str) -> dict[str, object]:
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                result = await client.get(url)
            return {'url': url, 'ready': result.is_success}
        except httpx.HTTPError:
            return {'url': url, 'ready': False}

    dependencies = await asyncio.gather(*(check(url) for url in urls))
    ready = all(item['ready'] for item in dependencies)
    response.status_code = 200 if ready else 503
    return {'status': 'ready' if ready else 'degraded', 'dependencies': dependencies}


@router.post('/p0a-trace-proof')
async def p0a_trace_proof(request: Request) -> dict[str, object]:
    if not settings.p0a_enabled:
        raise HTTPException(status_code=404, detail='P0A disabled')
    traceparent = request.headers.get('traceparent')
    correlation_id = request.headers.get('x-correlation-id')
    if not traceparent or not correlation_id:
        raise HTTPException(status_code=400, detail='trace context required')
    await emit_p0a_span(traceparent, correlation_id, 'fastapi-p0a-proof')
    async with httpx.AsyncClient(timeout=2.0) as client:
        provider = await client.post(
            f'{settings.p0a_ai_reference_url.rstrip("/")}/v1/inference',
            headers={'traceparent': traceparent, 'x-correlation-id': correlation_id},
            json={'requestId': correlation_id, 'task': 'GENERATE', 'sanitizedInput': 'synthetic trace proof', 'dataClasses': ['INTERNAL'], 'trace': {'correlationId': correlation_id, 'traceparent': traceparent}},
        )
        provider.raise_for_status()
    return {'traceparent': traceparent, 'provider': provider.json()}


@router.post('/p0a-ai-data-proof')
async def p0a_ai_data_proof(request: Request) -> dict[str, object]:
    """Exercise the P0A-only provider boundary without retaining raw input."""
    if not settings.p0a_enabled:
        raise HTTPException(status_code=404, detail='P0A disabled')
    body = await request.json()
    allowed_fields = {'requestId', 'task', 'sanitizedInput', 'dataClasses', 'trace'}
    data_classes = body.get('dataClasses')
    if not isinstance(data_classes, list) or any(value not in {'PUBLIC', 'INTERNAL'} for value in data_classes):
        raise HTTPException(status_code=422, detail='restricted or unclassified provider data')
    provider_payload = {key: body[key] for key in allowed_fields if key in body}
    redacted_fields = sorted(set(body) - allowed_fields)
    correlation_id = str(body.get('trace', {}).get('correlationId', 'p0a-ai-data-proof'))
    async with httpx.AsyncClient(timeout=2.0) as client:
        provider = await client.post(
            f'{settings.p0a_ai_reference_url.rstrip("/")}/v1/inference',
            headers={'x-correlation-id': correlation_id},
            json=provider_payload,
        )
        provider.raise_for_status()
    return {'redactedFields': redacted_fields, 'provider': provider.json()}