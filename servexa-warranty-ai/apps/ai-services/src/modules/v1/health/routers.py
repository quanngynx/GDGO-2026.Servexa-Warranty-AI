from fastapi import APIRouter

router = APIRouter(prefix='/v1/health', tags=['health'])

@router.get('/ping')
def health_check() -> dict[str, str]:
    return {'ping': 'pong'}