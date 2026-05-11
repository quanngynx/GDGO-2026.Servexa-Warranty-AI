from fastapi import APIRouter

from core.dependencies import ErpServiceDep
from modules.v1.erp.schemas import ERPProxyRequest

router = APIRouter(prefix='/v1/erp', tags=['erp'])


@router.post('/proxy')
async def proxy_to_erp(payload: ERPProxyRequest, erp_service: ErpServiceDep) -> dict[str, str | int | float | bool]:
    return await erp_service.call(endpoint=payload.endpoint, method=payload.method, data=payload.payload)
