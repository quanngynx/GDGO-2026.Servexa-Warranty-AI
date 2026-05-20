from __future__ import annotations

import json
import logging
from typing import Any

from configs.base import settings
from modules.v1.hitl.copilot_metadata import (
    build_heuristic_copilot_reply,
    build_heuristic_diagnosis_draft,
)
from modules.v1.llm.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)


def _is_gemini_quota_error(exc: BaseException) -> bool:
    msg = str(exc).lower()
    if "429" in msg or "resource_exhausted" in msg or "quota" in msg:
        return True
    cause = getattr(exc, "__cause__", None)
    if cause is not None and cause is not exc:
        return _is_gemini_quota_error(cause)
    return False

_DIAGNOSIS_PREFIX = 'DIAGNOSIS_JSON:'

_COPILOT_SYSTEM = """You are the Servexa warranty operations copilot for ASC technicians and coordinators.
Answer concisely in clear, professional language.
When repair-case context is provided, use it to answer operational questions (summaries, SLA, next steps).
Do not expose internal routing labels, tool names, or JSON status blobs unless the user asks about system diagnostics.
If no case is selected and the user asks about a specific case, ask them to select a repair case in the UI.
When `repairCaseSnapshot` or `repairCaseId` / `caseNumber` are present, treat that as the selected case and summarize from the snapshot fields.
When the user asks for case analysis, diagnosis, or next steps and a case is selected, end your reply with a single line:
DIAGNOSIS_JSON: {"symptoms":["..."],"possibleCauses":["..."],"recommendedChecks":["..."],"severity":"low"|"medium"|"high"}
Use only valid JSON on that line with no markdown fences.
"""

_PURE_GREETINGS = frozenset({
    'hi',
    'hello',
    'hey',
    'yo',
    'hola',
    'good morning',
    'good afternoon',
    'good evening',
})


def _user_wants_greeting(message: str) -> bool:
    normalized = ' '.join(message.strip().lower().split())
    if not normalized:
        return False
    if normalized in _PURE_GREETINGS:
        return True
    for prefix in ('hi ', 'hello ', 'hey '):
        if normalized.startswith(prefix) and len(normalized.split()) <= 4:
            return True
    return False


def is_noop_tool_result(tool_results: dict[str, Any] | None) -> bool:
    if not tool_results:
        return True
    status = tool_results.get('status')
    return status in (None, 'noop')


def _is_empty(value: Any) -> bool:
    return value in (None, '', [], {})


def _merge_value(merged: dict[str, Any], patch: dict[str, Any]) -> None:
    for key, value in patch.items():
        if _is_empty(value):
            merged.setdefault(key, value)
        else:
            merged[key] = value


def _flatten_operational_context(execution_context: dict[str, Any] | list[Any]) -> dict[str, Any]:
    merged: dict[str, Any] = {}

    def absorb(entry: Any) -> None:
        if entry is None:
            return
        if isinstance(entry, list):
            for item in entry:
                absorb(item)
            return
        if not isinstance(entry, dict):
            return
        value = entry.get('value')
        if isinstance(value, str) and value.strip().startswith('{'):
            try:
                parsed = json.loads(value)
                if isinstance(parsed, dict):
                    _merge_value(merged, parsed)
                    return
            except json.JSONDecodeError:
                pass
        if isinstance(value, dict):
            _merge_value(merged, value)
            return
        for key, child in entry.items():
            if key == 'description':
                continue
            if isinstance(child, (dict, list)):
                absorb(child)
            elif not _is_empty(child) or key not in merged:
                merged[key] = child

    absorb(execution_context)
    return merged


def _has_selected_case(ctx: dict[str, Any]) -> bool:
    if ctx.get('repairCaseId') or ctx.get('caseNumber'):
        return True
    snapshot = ctx.get('repairCaseSnapshot')
    return isinstance(snapshot, dict) and bool(snapshot)


def build_copilot_prompt(*, message: str, execution_context: dict[str, Any] | None) -> str:
    ctx = _flatten_operational_context(execution_context or {})
    ctx_block = json.dumps(ctx, default=str, ensure_ascii=False) if ctx else '{}'
    case_hint = (
        'A repair case is selected in the UI. Use repairCaseSnapshot and identifiers for handoff summaries.\n'
        if _has_selected_case(ctx)
        else 'No repair case is selected in the UI.\n'
    )
    greeting_hint = (
        'The user sent a greeting. You may reply with a brief hello and offer help.\n'
        if _user_wants_greeting(message)
        else 'Do not open with greetings (no "Hello", "Hi", etc.). Answer the request directly.\n'
    )
    return (
        f'{_COPILOT_SYSTEM.strip()}\n\n'
        f'{greeting_hint}'
        f'{case_hint}'
        f'Operational UI context (JSON):\n{ctx_block}\n\n'
        f'User message:\n{message.strip()}'
    )


def _parse_diagnosis_json(text: str) -> dict[str, Any] | None:
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped.upper().startswith(_DIAGNOSIS_PREFIX):
            continue
        payload = stripped[len(_DIAGNOSIS_PREFIX) :].strip()
        try:
            parsed = json.loads(payload)
        except json.JSONDecodeError:
            return None
        if not isinstance(parsed, dict):
            return None
        severity = parsed.get('severity')
        if severity not in ('low', 'medium', 'high'):
            return None
        return {
            'symptoms': [str(s) for s in (parsed.get('symptoms') or []) if str(s).strip()],
            'possibleCauses': [
                str(s) for s in (parsed.get('possibleCauses') or []) if str(s).strip()
            ],
            'recommendedChecks': [
                str(s) for s in (parsed.get('recommendedChecks') or []) if str(s).strip()
            ],
            'severity': severity,
        }
    return None


def _strip_diagnosis_line(text: str) -> str:
    lines = [
        line
        for line in text.splitlines()
        if not line.strip().upper().startswith(_DIAGNOSIS_PREFIX)
    ]
    return '\n'.join(lines).strip()


class CopilotReplyService:
    def __init__(self) -> None:
        self._gemini_client: GeminiService | None = None

    def _get_gemini(self) -> GeminiService | None:
        if not settings.gemini_api_key:
            return None
        if self._gemini_client is None:
            self._gemini_client = GeminiService()
        return self._gemini_client

    async def compose_reply(
        self,
        *,
        message: str,
        execution_context: dict[str, Any] | None = None,
    ) -> str:
        text, _meta = await self.compose_reply_with_metadata(
            message=message,
            execution_context=execution_context,
        )
        return text

    async def compose_reply_with_metadata(
        self,
        *,
        message: str,
        execution_context: dict[str, Any] | None = None,
    ) -> tuple[str, dict[str, Any]]:
        ctx = _flatten_operational_context(execution_context or {})
        gemini = self._get_gemini()
        prompt = build_copilot_prompt(message=message, execution_context=execution_context)
        if gemini is None:
            logger.warning('GEMINI_API_KEY missing; using static copilot fallback')
            return (
                'I can help with repair cases, SLA risk, inventory, and approval workflows. '
                'Configure GEMINI_API_KEY in ai-services to enable full answers.',
                {},
            )
        try:
            response = await gemini.invoke_flash(prompt)
            text = getattr(response, 'content', None) or str(response)
            raw = str(text).strip() or 'I could not generate a response. Please try again.'
            diagnosis = _parse_diagnosis_json(raw)
            if diagnosis is None and _has_selected_case(ctx):
                diagnosis = build_heuristic_diagnosis_draft(ctx)
            clean = _strip_diagnosis_line(raw)
            meta: dict[str, Any] = {}
            if diagnosis:
                meta['diagnosisDraft'] = diagnosis
            return clean, meta
        except Exception as exc:
            is_quota = _is_gemini_quota_error(exc)
            logger.exception('copilot Gemini invoke failed')
            if is_quota and _has_selected_case(ctx):
                return build_heuristic_copilot_reply(message, ctx)
            return (
                'The AI assistant is temporarily unavailable. '
                'Please try again in a moment or use a workflow action from Suggested actions.',
                {},
            )
