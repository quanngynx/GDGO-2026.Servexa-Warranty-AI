import json

import redis.asyncio as redis

from configs.base import settings
from core.db.redis.schemas import EventEnvelope


class RedisEventClient:
    def __init__(self) -> None:
        # socket_timeout must exceed XREADGROUP block (default 1000ms); see AiJobStreamConsumer
        self.client = redis.from_url(
            settings.redis_url,
            decode_responses=True,
            socket_connect_timeout=2.0,
            socket_timeout=120.0,
        )
        self.stream_name = settings.redis_stream_name
        self.dlq_stream_name = settings.redis_dlq_stream_name
        self.group_name = settings.redis_group_name
        self.consumer_name = settings.redis_consumer_name

    async def publish(self, event: EventEnvelope) -> str:
        return await self.client.xadd(
            self.stream_name,
            {
                'event_type': event.event_type,
                'payload': json.dumps(event.payload),
                'trace_id': event.trace_id or '',
                'retry_count': str(event.retry_count),
            },
        )

    async def ensure_group(self) -> None:
        try:
            await self.client.xgroup_create(self.stream_name, self.group_name, id='0', mkstream=True)
        except redis.ResponseError as error:
            if 'BUSYGROUP' not in str(error):
                raise

    async def read_group(self, count: int = 10, block_ms: int = 1000) -> list[tuple[str, list[tuple[str, dict[str, str]]]]]:
        return await self.client.xreadgroup(
            groupname=self.group_name,
            consumername=self.consumer_name,
            streams={self.stream_name: '>'},
            count=count,
            block=block_ms,
        )

    async def ack(self, event_id: str) -> None:
        await self.client.xack(self.stream_name, self.group_name, event_id)

    async def publish_dead_letter(self, event: EventEnvelope) -> str:
        return await self.client.xadd(
            self.dlq_stream_name,
            {'event_type': event.event_type, 'payload': json.dumps(event.payload), 'retry_count': str(event.retry_count)},
        )
