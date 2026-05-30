import httpx

from configs.base import settings


class ERPService:
    async def call(
        self,
        endpoint: str,
        method: str = 'GET',
        data: dict[str, str | int | float | bool] | None = None,
    ) -> dict[str, str | int | float | bool]:
        if not settings.erp_base_url:
            return {'status': 'skipped', 'reason': 'ERP_BASE_URL not configured'}

        url = f"{settings.erp_base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        timeout = httpx.Timeout(8.0, connect=3.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.request(method=method, url=url, json=data)
            return {'status': 'ok', 'status_code': response.status_code, 'endpoint': endpoint}
