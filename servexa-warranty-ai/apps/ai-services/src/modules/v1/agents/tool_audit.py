"""Structured tool execution logging (revision report §3.4)."""

from __future__ import annotations

import json
import logging
import time
from typing import Any, Awaitable, Callable

logger = logging.getLogger(__name__)

TOOL_VERSION_DEFAULT = '1'


def log_tool_execution(
    *,
    tool_name: str,
    tool_version: str = TOOL_VERSION_DEFAULT,
    trace_id: str,
    tenant_id: str,
    execution_time_ms: float,
    execution_status: str,
    error_type: str | None = None,
    retry_count: int = 0,
    extra: dict[str, Any] | None = None,
) -> None:
    payload: dict[str, Any] = {
        'event': 'tool_execution',
        'tool_name': tool_name,
        'tool_version': tool_version,
        'trace_id': trace_id,
        'tenant_id': tenant_id,
        'execution_time_ms': round(execution_time_ms, 2),
        'execution_status': execution_status,
        'retry_count': retry_count,
    }
    if error_type:
        payload['error_type'] = error_type
    if extra:
        payload['extra'] = extra
    line = json.dumps(payload, default=str)
    if execution_status == 'error':
        logger.error('tool_execution %s', line)
    else:
        logger.info('tool_execution %s', line)


async def run_tool_traced(
    *,
    tool_name: str,
    trace_id: str,
    tenant_id: str,
    runner: Callable[[], Awaitable[dict[str, str | int | float | bool]]],
) -> dict[str, str | int | float | bool]:
    start = time.perf_counter()
    try:
        result = await runner()
        log_tool_execution(
            tool_name=tool_name,
            trace_id=trace_id,
            tenant_id=tenant_id,
            execution_time_ms=(time.perf_counter() - start) * 1000,
            execution_status='ok',
        )
        return result
    except Exception as exc:  # noqa: BLE001
        log_tool_execution(
            tool_name=tool_name,
            trace_id=trace_id,
            tenant_id=tenant_id,
            execution_time_ms=(time.perf_counter() - start) * 1000,
            execution_status='error',
            error_type=type(exc).__name__,
        )
        raise
