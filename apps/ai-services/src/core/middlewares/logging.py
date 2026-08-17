import time
import uuid
from collections.abc import Callable

from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware


class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = request.headers.get('x-correlation-id') or request.headers.get('x-request-id') or str(uuid.uuid4())
        traceparent = request.headers.get('traceparent')
        request.state.request_id = request_id
        request.state.traceparent = traceparent
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = time.perf_counter() - start_time

        response.headers['X-Request-ID'] = request_id
        response.headers['X-Correlation-ID'] = request_id
        if traceparent:
            response.headers['traceparent'] = traceparent
        response.headers['X-Process-Time'] = f'{process_time:.4f}'

        logger.info(
            'method={} path={} status={} duration_ms={} request_id={}',
            request.method,
            request.url.path,
            response.status_code,
            int(process_time * 1000),
            request_id,
        )
        return response