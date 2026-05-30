from modules.v1.agents.tools.base_tool import BaseTool
from modules.v1.agents.tools.erp_tool import ERPTool
from modules.v1.agents.tools.inventory_tool import InventoryTool
from modules.v1.agents.tools.report_tool import ReportTool
from modules.v1.agents.tools.telegram_tool import TelegramTool


def get_tools() -> dict[str, BaseTool]:
    return {
        'telegram': TelegramTool(),
        'inventory': InventoryTool(),
        'erp': ERPTool(),
        'report': ReportTool(),
    }