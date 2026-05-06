import pytest

from src.modules.v1.agents.services.coordinator_service import CoordinatorService


@pytest.mark.anyio
async def test_coordinator_routes_supply_chain() -> None:
    coordinator = CoordinatorService()
    result = await coordinator.run('please restock low stock items')
    assert result['route'] == 'supply_chain'
