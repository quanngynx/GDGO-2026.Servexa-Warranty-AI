from modules.v1.agents.tools.tool_registry import get_tools


class OperationsService:
    async def run(self, message: str) -> dict[str, str | int | float | bool]:
        if 'alert' not in message.lower():
            return {'status': 'noop'}
        telegram_tool = get_tools()['telegram']
        try:
            return await telegram_tool.execute({'message': message})
        except Exception:
            return {'status': 'queued-local-fallback'}
