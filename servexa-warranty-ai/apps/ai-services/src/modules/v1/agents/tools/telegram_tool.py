from core.db.redis.producers.ai_producer import AIEventProducer
from modules.v1.agents.tools.base_tool import BaseTool


class TelegramTool(BaseTool):
    name = 'telegram'

    def __init__(self):
        self.producer = AIEventProducer()

    async def execute(self, payload: dict[str, str | int | float | bool]) -> dict[str, str | int | float | bool]:
        message = str(payload.get('message', ''))
        await self.producer.publish(
            event_type="TELEGRAM_MESSAGE",
            payload={
                "message": message,
            }
        )
        return {
            "status": "sent"
        }