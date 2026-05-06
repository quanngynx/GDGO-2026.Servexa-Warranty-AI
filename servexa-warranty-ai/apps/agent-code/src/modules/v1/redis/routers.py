from fastapi import APIRouter

from core.db.redis.consumers.inventory_consumer import InventoryConsumer
from core.db.redis.schemas import EventEnvelope
from core.dependencies import RedisEventClientDep
from core.schemas import ApiMessage

router = APIRouter(prefix='/v1/redis', tags=['redis'])


@router.post('/publish', response_model=ApiMessage)
async def publish_event(client: RedisEventClientDep) -> ApiMessage:
    await client.publish(EventEnvelope(event_type='PING', payload={'source': 'api'}))
    return ApiMessage(message='event published')


@router.post('/consume-once', response_model=ApiMessage)
async def consume_once() -> ApiMessage:
    consumer = InventoryConsumer()
    processed_count = await consumer.start_once()
    return ApiMessage(message=f'processed {processed_count} events')
