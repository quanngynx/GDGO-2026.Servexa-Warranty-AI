from loguru import logger

from configs.base import settings


def configure_observability() -> None:
    logger.remove()
    logger.add(
        sink=lambda message: print(message, end=''),
        format='{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}',
    )
    logger.info(
        'observability initialized service={} env={} otel_enabled={}',
        settings.app_name,
        settings.environment,
        settings.otel_enabled,
    )
