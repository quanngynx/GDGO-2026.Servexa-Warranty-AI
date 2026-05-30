from fastapi import APIRouter

from modules.v1.observability.services.metrics_service import get_metrics_service

router = APIRouter(prefix='/v1/observability', tags=['observability'])


@router.get('/metrics')
def get_metrics() -> dict[str, int]:
    return get_metrics_service().get_metrics()
