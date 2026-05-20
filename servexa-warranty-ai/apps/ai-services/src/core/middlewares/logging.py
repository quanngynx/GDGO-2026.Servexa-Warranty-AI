import time
import uuid
from collections.abc import Callable

from fastapi import Request, Response
from loguru import logger
from starlette.middleware.base import BaseHTTPMiddleware


class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        request_id = str(uuid.uuid4())
        start_time = time.perf_counter()
        response = await call_next(request)
        process_time = time.perf_counter() - start_time

        response.headers['X-Request-ID'] = request_id
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