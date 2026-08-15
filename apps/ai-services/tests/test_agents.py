import pytest

from modules.v1.agents.services.coordinator_service import CoordinatorService


@pytest.mark.asyncio
async def test_coordinator_routes_supply_chain(monkeypatch: pytest.MonkeyPatch) -> None:
    async def _fake_publish(*args, **kwargs):
        return 'msg-1'

    monkeypatch.setattr(
        'core.db.redis.producers.ai_producer.AIEventProducer.publish',
        _fake_publish,
    )
    coordinator = CoordinatorService()
    result = await coordinator.run('please restock low stock items')
    assert result['route'] == 'supply_chain'
