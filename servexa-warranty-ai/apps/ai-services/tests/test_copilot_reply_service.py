import pytest

from modules.v1.agents.services.copilot_reply_service import (
    CopilotReplyService,
    build_copilot_prompt,
    is_noop_tool_result,
    _user_wants_greeting,
)


def test_user_wants_greeting():
    assert _user_wants_greeting('Hi') is True
    assert _user_wants_greeting('hello there') is True
    assert _user_wants_greeting('Suggest the next operational action') is False


def test_build_copilot_prompt_skips_greeting_on_operational_request():
    prompt = build_copilot_prompt(
        message='Suggest the next operational action for this case.',
        execution_context={'caseNumber': 'RC-2024-000012'},
    )
    assert 'Do not open with greetings' in prompt


def test_build_copilot_prompt_allows_greeting_on_hi():
    prompt = build_copilot_prompt(message='Hi', execution_context={})
    assert 'You may reply with a brief hello' in prompt


def test_is_noop_tool_result():
    assert is_noop_tool_result({'status': 'noop'}) is True
    assert is_noop_tool_result({}) is True
    assert is_noop_tool_result({'status': 'queued-local-fallback'}) is False


def test_build_copilot_prompt_includes_message_and_context():
    prompt = build_copilot_prompt(
        message='Hi',
        execution_context={'repairCaseId': 'rc-1', 'caseNumber': 'RC-2024-000012'},
    )
    assert 'Hi' in prompt
    assert 'RC-2024-000012' in prompt
    assert 'repair case is selected' in prompt.lower()


def test_flatten_copilotkit_agent_context_entries():
    prompt = build_copilot_prompt(
        message='Summarize this repair case for a technician handoff.',
        execution_context=[
            {
                'description': 'Current Servexa UI context for warranty operations copilot',
                'value': {
                    'repairCaseId': 'uuid-12',
                    'caseNumber': 'RC-2024-000012',
                    'repairCaseSnapshot': {'customerName': 'Nguyễn Văn An', 'status': 'khongsuaduoc'},
                },
            },
            {
                'description': 'Latest HITL decision result for copilot continuation',
                'value': {'hitlRequestId': '', 'kind': '', 'status': '', 'payloadSummary': '{}'},
            },
        ],
    )
    assert 'RC-2024-000012' in prompt
    assert 'Nguyễn Văn An' in prompt
    assert 'repair case is selected' in prompt.lower()


@pytest.mark.asyncio
async def test_compose_reply_without_api_key_uses_fallback(monkeypatch):
    monkeypatch.setattr(
        'modules.v1.agents.services.copilot_reply_service.settings.gemini_api_key',
        None,
    )
    service = CopilotReplyService()
    text = await service.compose_reply(message='Hi')
    assert 'GEMINI_API_KEY' in text
    assert 'noop' not in text.lower()


@pytest.mark.asyncio
async def test_compose_reply_uses_gemini_when_configured(monkeypatch):
    monkeypatch.setattr(
        'modules.v1.agents.services.copilot_reply_service.settings.gemini_api_key',
        'test-key',
    )

    class _FakeResponse:
        content = 'Hello from Servexa copilot.'

    class _FakeGemini:
        async def invoke_flash(self, _prompt: str):
            return _FakeResponse()

    service = CopilotReplyService()
    monkeypatch.setattr(service, '_get_gemini', lambda: _FakeGemini())
    text = await service.compose_reply(message='Hi')
    assert text == 'Hello from Servexa copilot.'
