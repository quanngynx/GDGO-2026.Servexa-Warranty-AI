from modules.v1.agents.tool_audit import run_tool_traced
from modules.v1.agents.tools.tool_registry import get_tools


class OperationsService:
    async def run(self, message: str, *, trace_id: str = '', tenant_id: str = '') -> dict[str, str | int | float | bool]:
        if 'alert' not in message.lower():
            return {'status': 'noop'}
        telegram_tool = get_tools()['telegram']

        async def _run() -> dict[str, str | int | float | bool]:
            return await telegram_tool.execute({'message': message})

        try:
            return await run_tool_traced(
                tool_name='telegram',
                trace_id=trace_id,
                tenant_id=tenant_id,
                runner=_run,
            )
        except Exception:
            return {'status': 'queued-local-fallback'}
