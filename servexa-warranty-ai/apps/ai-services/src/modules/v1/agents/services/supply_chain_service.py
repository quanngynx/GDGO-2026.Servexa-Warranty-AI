from modules.v1.agents.tool_audit import run_tool_traced
from modules.v1.agents.tools.tool_registry import get_tools


class SupplyChainService:
    async def run(self, message: str, *, trace_id: str = '', tenant_id: str = '') -> dict[str, str | int | float | bool]:
        if 'restock' not in message.lower():
            return {'status': 'noop'}

        inventory_tool = get_tools()['inventory']

        async def _run() -> dict[str, str | int | float | bool]:
            return await inventory_tool.execute({'product_id': 'sku-demo', 'quantity': 10})

        try:
            return await run_tool_traced(
                tool_name='inventory',
                trace_id=trace_id,
                tenant_id=tenant_id,
                runner=_run,
            )
        except Exception:
            return {'status': 'queued-local-fallback'}
