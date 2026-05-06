from modules.v1.agents.tools.inventory_tool import InventoryTool

class SupplyChainAgent:
    def __init__(self):
        self.inventory_tool = InventoryTool()

    async def run(self):
        low_stock_detected = True

        if low_stock_detected:
            await self.inventory_tool.create_restock_request(
                product_id="abc123",
                quantity=20,
            )

        return {
            "message": "Restock queued"
        }