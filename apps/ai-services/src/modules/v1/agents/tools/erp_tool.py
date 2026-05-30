from modules.v1.agents.tools.base_tool import BaseTool
from modules.v1.erp.services.erp_service import ERPService


class ERPTool(BaseTool):
    name = 'erp'

    def __init__(self) -> None:
        self.erp_service = ERPService()

    async def execute(self, payload: dict[str, str | int | float | bool]) -> dict[str, str | int | float | bool]:
        endpoint = str(payload.get('endpoint', '/health'))
        method = str(payload.get('method', 'GET'))
        data = payload if method != 'GET' else None
        return await self.erp_service.call(endpoint=endpoint, method=method, data=data)
