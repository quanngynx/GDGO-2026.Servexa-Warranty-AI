from modules.v1.agents.tools.tool_registry import get_tools


class SupplyChainService:
    async def run(self, message: str) -> dict[str, str | int | float | bool]:
        if 'restock' not in message.lower():
            return {'status': 'noop'}

        inventory_tool = get_tools()['inventory']
        try:
            return await inventory_tool.execute({'product_id': 'sku-demo', 'quantity': 10})
        except Exception:
            return {'status': 'queued-local-fallback'}
