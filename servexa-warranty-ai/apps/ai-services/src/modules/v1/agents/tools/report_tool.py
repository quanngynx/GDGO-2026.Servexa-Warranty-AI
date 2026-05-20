from modules.v1.agents.tools.base_tool import BaseTool


class ReportTool(BaseTool):
    name = 'report'

    async def execute(self, payload: dict[str, str | int | float | bool]) -> dict[str, str | int | float | bool]:
        report_name = str(payload.get('report_name', 'ops-report'))
        return {'status': 'queued', 'report_name': report_name}
