"""Long-running consumer for Node-enqueued AI jobs (Redis Streams)."""

from __future__ import annotations

import asyncio
import logging

from core.db.redis.consumers.ai_job_consumer import AiJobStreamConsumer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main() -> None:
    consumer = AiJobStreamConsumer()
    await consumer.ensure_groups()
    try:
        while True:
            n = await consumer.process_batch(count=5, block_ms=5000)
            if n:
                logger.info('processed %s ai job message(s)', n)
    finally:
        await consumer.close()


if __name__ == '__main__':
    asyncio.run(main())
