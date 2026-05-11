import json

from core.db.redis.client import RedisEventClient
from core.db.redis.schemas import EventEnvelope

class InventoryConsumer:
    def __init__(self) -> None:
        self.client = RedisEventClient()

    async def start_once(self) -> int:
        await self.client.ensure_group()
        messages = await self.client.read_group()
        processed_count = 0

        for _, events in messages:
            for event_id, data in events:
                should_ack = await self.handle_event(event_id, data)
                if should_ack:
                    await self.client.ack(event_id)
                    processed_count += 1
        return processed_count

    async def handle_event(self, _: str, data: dict[str, str]) -> bool:
        event_type = data.get('event_type', '')
        payload = json.loads(data.get('payload', '{}'))
        retry_count = int(data.get('retry_count', '0'))

        if event_type == 'RESTOCK_REQUEST':
            return True
        if retry_count >= 3:
            await self.client.publish_dead_letter(
                EventEnvelope(event_type=event_type or 'UNKNOWN', payload=payload, retry_count=retry_count),
            )
            return True
        return False