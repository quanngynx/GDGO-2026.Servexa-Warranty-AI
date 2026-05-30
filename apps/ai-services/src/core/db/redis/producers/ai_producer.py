from core.db.redis.client import RedisEventClient
from core.db.redis.schemas import EventEnvelope

class AIEventProducer:
    def __init__(self) -> None:
        self.client = RedisEventClient()

    async def publish(self, event_type: str, payload: dict[str, str | int | float | bool]) -> str:
        return await self.client.publish(EventEnvelope(event_type=event_type, payload=payload))