from core.db.redis.producers.ai_producer import AIEventProducer
from modules.v1.agents.tools.base_tool import BaseTool


class InventoryTool(BaseTool):
    name = 'inventory'

    def __init__(self):
        self.producer = AIEventProducer()

    async def create_restock_request(
        self,
        product_id: str,
        quantity: int,
    ):
        await self.producer.publish(
            event_type="RESTOCK_REQUEST",
            payload={
                "product_id": product_id,
                "quantity": quantity,
            }
        )

        return {
            "status": "queued"
        }

    async def execute(self, payload: dict[str, str | int | float | bool]) -> dict[str, str | int | float | bool]:
        product_id = str(payload.get('product_id', 'unknown'))
        quantity = int(payload.get('quantity', 0))
        return await self.create_restock_request(product_id=product_id, quantity=quantity)