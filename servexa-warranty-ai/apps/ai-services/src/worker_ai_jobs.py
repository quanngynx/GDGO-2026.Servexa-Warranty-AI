"""Long-running consumer for Node-enqueued AI jobs (Redis Streams)."""

from __future__ import annotations

import asyncio
import logging
import signal

from core.db.redis.consumers.ai_job_consumer import AiJobStreamConsumer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def _run_loop(stop: asyncio.Event) -> None:
    consumer = AiJobStreamConsumer()
    await consumer.ensure_groups()
    try:
        while not stop.is_set():
            n = await consumer.process_batch(count=5, block_ms=5000)
            if n:
                logger.info('processed %s ai job message(s)', n)
    finally:
        await consumer.close()


def main() -> None:
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    stop = asyncio.Event()

    def _shutdown() -> None:
        logger.info('shutdown signal received, draining worker')
        stop.set()

    try:
        loop.add_signal_handler(signal.SIGINT, _shutdown)
        loop.add_signal_handler(signal.SIGTERM, _shutdown)
    except NotImplementedError:
        # Windows / restricted environments
        pass

    try:
        loop.run_until_complete(_run_loop(stop))
    except KeyboardInterrupt:
        stop.set()
    finally:
        loop.close()


if __name__ == '__main__':
    main()
