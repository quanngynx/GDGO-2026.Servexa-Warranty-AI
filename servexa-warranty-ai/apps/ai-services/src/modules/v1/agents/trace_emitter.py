from __future__ import annotations

import contextvars
import json
import logging
import re
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import redis.asyncio as redis

from configs.base import settings

logger = logging.getLogger(__name__)
_DEBUG_LOG_PATH = Path(__file__).resolve().parents[5] / 'debug-596e87.log'


def _debug_log(hypothesis_id: str, message: str, data: dict[str, Any]) -> None:
    payload = {
        'sessionId': '596e87',
        'runId': 'initial',
        'hypothesisId': hypothesis_id,
        'location': 'trace_emitter.py',
        'message': message,
        'data': data,
        'timestamp': int(__import__('time').time() * 1000),
    }
    _DEBUG_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _DEBUG_LOG_PATH.open('a', encoding='utf-8') as fp:
        fp.write(json.dumps(payload, default=str) + '\n')

_TRACE_EMITTER_CTX: contextvars.ContextVar['TraceEmitter | None'] = contextvars.ContextVar(
    'trace_emitter',
    default=None,
)

REASONING_TEXT_MAX_CHARS = 500
REASONING_TITLE_MAX_CHARS = 120

ALLOWED_SAFE_DETAILS_KEYS = frozenset(
    {
        'queryType',
        'topK',
        'sourceTypes',
        'result',
        'candidateCount',
    },
)

DISALLOWED_SUMMARY_PATTERNS = re.compile(
    r'(system prompt|chain of thought|raw prompt|api[_\s-]?key|password|secret|bearer\s)',
    re.IGNORECASE,
)


def trace_stream_key(trace_id: str) -> str:
    return f'ai:trace:{trace_id}'


def _utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def _without_none_fields(src: dict[str, Any]) -> dict[str, Any]:
    return {k: v for k, v in src.items() if v is not None}


def sanitize_reasoning_summary(raw: object) -> str:
    if not isinstance(raw, str):
        return ''
    value = ' '.join(raw.strip().split())
    if not value:
        return ''
    if DISALLOWED_SUMMARY_PATTERNS.search(value):
        return 'Operational summary withheld for safety.'
    if len(value) > REASONING_TEXT_MAX_CHARS:
        return value[: REASONING_TEXT_MAX_CHARS - 3] + '...'
    return value


def _sanitize_title(raw: object) -> str:
    if not isinstance(raw, str):
        return 'Step'
    value = ' '.join(raw.strip().split())
    if not value:
        return 'Step'
    if len(value) > REASONING_TITLE_MAX_CHARS:
        return value[: REASONING_TITLE_MAX_CHARS - 3] + '...'
    return value


def sanitize_safe_details(raw: object) -> dict[str, Any] | None:
    if not isinstance(raw, dict):
        return None
    out: dict[str, Any] = {}
    for key, value in raw.items():
        if key not in ALLOWED_SAFE_DETAILS_KEYS:
            continue
        if isinstance(value, str):
            trimmed = value if len(value) <= 200 else value[:197] + '...'
            if trimmed.strip():
                out[key] = trimmed
        elif isinstance(value, (int, float, bool)) or value is None:
            out[key] = value
        elif isinstance(value, list) and len(value) <= 20:
            if all(isinstance(x, str) and x.strip() for x in value):
                out[key] = [x[:120] + ('...' if len(x) > 120 else '') for x in value]
            elif all(isinstance(x, (int, float)) for x in value):
                out[key] = value
    return out or None


def set_trace_emitter(emitter: TraceEmitter | None) -> contextvars.Token:
    return _TRACE_EMITTER_CTX.set(emitter)


def reset_trace_emitter(token: contextvars.Token) -> None:
    _TRACE_EMITTER_CTX.reset(token)


def get_trace_emitter() -> TraceEmitter | None:
    return _TRACE_EMITTER_CTX.get()


@dataclass
class TraceEmitter:
    trace_id: str
    run_id: str | None = None
    thread_id: str | None = None
    repair_case_id: str | None = None
    _events: list[dict[str, Any]] = field(default_factory=list)
    _open_steps: dict[str, dict[str, Any]] = field(default_factory=dict)
    _started_at: str = field(default_factory=_utc_now_iso)
    _status: str = 'running'
    _redis: redis.Redis | None = None

    def __post_init__(self) -> None:
        if not self.run_id:
            self.run_id = self.trace_id

    async def _client(self) -> redis.Redis:
        if self._redis is None:
            self._redis = redis.from_url(
                settings.redis_url,
                decode_responses=True,
                socket_connect_timeout=2.0,
                socket_timeout=120.0,
            )
        return self._redis

    async def close(self) -> None:
        if self._redis is not None:
            await self._redis.aclose()
            self._redis = None

    def _upsert_local(self, step: dict[str, Any]) -> None:
        step_id = str(step['id'])
        idx = next((i for i, e in enumerate(self._events) if e.get('id') == step_id), -1)
        if idx == -1:
            self._events.append(step)
        else:
            merged = {**self._events[idx], **step}
            self._events[idx] = merged

    def snapshot(self) -> dict[str, Any]:
        return _without_none_fields({
            'traceId': self.trace_id,
            'runId': self.run_id,
            'threadId': self.thread_id,
            'status': self._status,
            'startedAt': self._started_at,
            'endedAt': self._ended_at if hasattr(self, '_ended_at') else None,
            'events': list(self._events),
        })

    async def _publish(self, envelope: dict[str, Any]) -> None:
        try:
            # #region agent log
            step = envelope.get('step') if isinstance(envelope, dict) else None
            trace = envelope.get('trace') if isinstance(envelope, dict) else None
            _debug_log(
                'H2',
                'publish_envelope_shape',
                {
                    'traceId': self.trace_id,
                    'event': envelope.get('event') if isinstance(envelope, dict) else 'unknown',
                    'stepNullFields': sorted([k for k, v in step.items() if v is None]) if isinstance(step, dict) else [],
                    'traceEndedAtIsNull': isinstance(trace, dict) and trace.get('endedAt') is None,
                },
            )
            # #endregion
            client = await self._client()
            stream = trace_stream_key(self.trace_id)
            await client.xadd(
                stream,
                {'payload': json.dumps(envelope, default=str)},
                maxlen=5000,
                approximate=True,
            )
            await client.expire(stream, 86_400)
        except Exception as exc:  # noqa: BLE001
            logger.warning(
                'trace_emitter_publish_failed',
                extra={'trace_id': self.trace_id, 'error': str(exc)},
            )

    async def trace_started(self) -> None:
        self._status = 'running'
        envelope = {
            'event': 'reasoning.trace.started',
            'traceId': self.trace_id,
            'runId': self.run_id,
            'threadId': self.thread_id,
            'trace': self.snapshot(),
        }
        await self._publish(envelope)

    async def start_step(
        self,
        *,
        step_type: str,
        title: str,
        summary: str = '',
        status: str = 'running',
        parent_step_id: str | None = None,
        agent_name: str | None = None,
        tool_name: str | None = None,
        workflow_kind: str | None = None,
        hitl_request_id: str | None = None,
        safe_details: dict[str, Any] | None = None,
        step_id: str | None = None,
    ) -> str:
        sid = step_id or str(uuid.uuid4())
        step = _without_none_fields({
            'id': sid,
            'traceId': self.trace_id,
            'runId': self.run_id,
            'threadId': self.thread_id,
            'parentStepId': parent_step_id,
            'type': step_type,
            'status': status,
            'title': _sanitize_title(title),
            'summary': sanitize_reasoning_summary(summary),
            'startedAt': _utc_now_iso(),
            'agentName': agent_name,
            'toolName': tool_name,
            'workflowKind': workflow_kind,
            'hitlRequestId': hitl_request_id,
            'safeDetails': sanitize_safe_details(safe_details),
        })
        self._open_steps[sid] = step
        self._upsert_local(step)
        await self._publish(
            {
                'event': 'reasoning.step.started',
                'traceId': self.trace_id,
                'runId': self.run_id,
                'threadId': self.thread_id,
                'step': step,
            },
        )
        return sid

    async def complete_step(
        self,
        step_id: str,
        *,
        summary: str | None = None,
        safe_details: dict[str, Any] | None = None,
    ) -> None:
        base = self._open_steps.get(step_id) or next(
            (e for e in self._events if e.get('id') == step_id),
            None,
        )
        if not base:
            return
        ended = _utc_now_iso()
        started = base.get('startedAt')
        duration_ms = None
        if isinstance(started, str):
            try:
                start_dt = datetime.fromisoformat(started.replace('Z', '+00:00'))
                end_dt = datetime.fromisoformat(ended.replace('Z', '+00:00'))
                duration_ms = int((end_dt - start_dt).total_seconds() * 1000)
            except ValueError:
                duration_ms = None

        step = _without_none_fields({
            **base,
            'status': 'completed',
            'summary': sanitize_reasoning_summary(summary or base.get('summary', '')),
            'endedAt': ended,
            'durationMs': duration_ms,
            'safeDetails': sanitize_safe_details(safe_details) or base.get('safeDetails'),
        })
        self._open_steps.pop(step_id, None)
        self._upsert_local(step)
        await self._publish(
            {
                'event': 'reasoning.step.completed',
                'traceId': self.trace_id,
                'runId': self.run_id,
                'threadId': self.thread_id,
                'step': step,
            },
        )

    async def fail_step(self, step_id: str, *, error_message: str) -> None:
        base = self._open_steps.get(step_id) or next(
            (e for e in self._events if e.get('id') == step_id),
            None,
        )
        if not base:
            return
        step = _without_none_fields({
            **base,
            'status': 'failed',
            'endedAt': _utc_now_iso(),
            'errorMessage': sanitize_reasoning_summary(error_message),
        })
        self._open_steps.pop(step_id, None)
        self._upsert_local(step)
        await self._publish(
            {
                'event': 'reasoning.step.failed',
                'traceId': self.trace_id,
                'runId': self.run_id,
                'threadId': self.thread_id,
                'step': step,
            },
        )

    async def trace_completed(self) -> None:
        self._status = 'completed'
        self._ended_at = _utc_now_iso()
        trace = self.snapshot()
        await self._publish(
            {
                'event': 'reasoning.trace.completed',
                'traceId': self.trace_id,
                'runId': self.run_id,
                'threadId': self.thread_id,
                'trace': trace,
            },
        )

    async def trace_failed(self, *, error_message: str = 'Trace failed') -> None:
        self._status = 'failed'
        self._ended_at = _utc_now_iso()
        err_id = await self.start_step(
            step_type='error',
            title='Run failed',
            summary=error_message,
            status='failed',
        )
        await self.fail_step(err_id, error_message=error_message)
        await self._publish(
            {
                'event': 'reasoning.trace.failed',
                'traceId': self.trace_id,
                'runId': self.run_id,
                'threadId': self.thread_id,
                'trace': self.snapshot(),
            },
        )
