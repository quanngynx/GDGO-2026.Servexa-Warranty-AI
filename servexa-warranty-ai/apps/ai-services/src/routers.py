from fastapi import APIRouter
from modules.v1.agents.routers import router as agents_router
from modules.v1.chat.routers import router as chat_router
from modules.v1.erp.routers import router as erp_router
from modules.v1.grpc.routers import router as grpc_router
from modules.v1.health.routers import router as health_router
from modules.v1.observability.routers import router as observability_router
from modules.v1.rag.routers import router as rag_router
from modules.v1.redis.routers import router as redis_router
from modules.v1.security.routers import router as security_router

api_routers = APIRouter()

api_routers.include_router(health_router)
api_routers.include_router(chat_router)
api_routers.include_router(agents_router)
api_routers.include_router(rag_router)
api_routers.include_router(redis_router)
api_routers.include_router(erp_router)
api_routers.include_router(grpc_router)
api_routers.include_router(observability_router)
api_routers.include_router(security_router)