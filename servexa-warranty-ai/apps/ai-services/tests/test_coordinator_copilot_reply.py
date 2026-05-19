import pytest

from modules.v1.agents.services.coordinator_service import CoordinatorService


@pytest.mark.asyncio
async def test_coordinator_general_chat_not_noop_template(monkeypatch):
    service = CoordinatorService()

    async def _fake_compose_reply(*, message: str, execution_context=None):
        return f'Reply to: {message}'

    monkeypatch.setattr(
        service.copilot_reply_service,
        'compose_reply',
        _fake_compose_reply,
    )

    result = await service.run('Hi', trace_id='trace-hi')
    assert result.get('output') == 'Reply to: Hi'
    assert 'Operations workflow completed' not in result.get('output', '')
    assert 'noop' not in result.get('output', '').lower()
