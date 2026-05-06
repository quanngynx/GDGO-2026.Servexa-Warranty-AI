from core.dependencies import get_coordinator_service


class GrpcBridgeService:
    async def process(self, message: str) -> str:
        coordinator = get_coordinator_service()
        result = await coordinator.run(message)
        return result['output']
