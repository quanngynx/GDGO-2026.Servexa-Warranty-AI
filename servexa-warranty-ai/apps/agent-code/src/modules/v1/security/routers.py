from fastapi import APIRouter

from core.schemas import ApiMessage
from core.security import RateLimitDep, SecureRouteDep

router = APIRouter(prefix='/v1/security', tags=['security'])


@router.get('/check', response_model=ApiMessage)
def security_check(_: SecureRouteDep, __: RateLimitDep) -> ApiMessage:
    return ApiMessage(message='security checks passed')
