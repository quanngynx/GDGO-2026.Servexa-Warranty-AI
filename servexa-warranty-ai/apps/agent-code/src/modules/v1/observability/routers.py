from fastapi import APIRouter

from modules.v1.observability.services.metrics_service import MetricsService

router = APIRouter(prefix='/v1/observability', tags=['observability'])
metrics_service = MetricsService()


@router.get('/metrics')
def get_metrics() -> dict[str, int]:
    return metrics_service.get_metrics()
