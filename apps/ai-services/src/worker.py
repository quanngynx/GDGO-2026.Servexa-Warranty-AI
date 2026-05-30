import asyncio

from core.db.redis.consumers.inventory_consumer import InventoryConsumer


async def main() -> None:
    consumer = InventoryConsumer()
    while True:
        await consumer.start_once()
        await asyncio.sleep(1)


if __name__ == '__main__':
    asyncio.run(main())
