from __future__ import annotations

import json
import logging
from typing import Any

from configs.base import settings
from modules.v1.llm.services.gemini_service import GeminiService

logger = logging.getLogger(__name__)

_COPILOT_SYSTEM = """You are the Servexa warranty operations copilot for ASC technicians and coordinators.
Answer concisely in clear, professional language.
When repair-case context is provided, use it to answer operational questions (summaries, SLA, next steps).
Do not expose internal routing labels, tool names, or JSON status blobs unless the user asks about system diagnostics.
If no case is selected and the user asks about a specific case, ask them to select a repair case in the UI.
When `repairCaseSnapshot` or `repairCaseId` / `caseNumber` are present, treat that as the selected case and summarize from the snapshot fields.
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
        gemini = self._get_gemini()
        prompt = build_copilot_prompt(message=message, execution_context=execution_context)
        if gemini is None:
            logger.warning('GEMINI_API_KEY missing; using static copilot fallback')
            return (
                'I can help with repair cases, SLA risk, inventory, and approval workflows. '
                'Configure GEMINI_API_KEY in ai-services to enable full answers.'
            )
        try:
            response = await gemini.invoke_flash(prompt)
            text = getattr(response, 'content', None) or str(response)
            return str(text).strip() or 'I could not generate a response. Please try again.'
        except Exception:
            logger.exception('copilot Gemini invoke failed')
            return (
                'The AI assistant is temporarily unavailable. '
                'Please try again in a moment or use a workflow action from Suggested actions.'
            )
