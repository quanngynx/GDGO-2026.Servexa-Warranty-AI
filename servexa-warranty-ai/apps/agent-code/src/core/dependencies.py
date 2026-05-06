from typing import Annotated

from fastapi import Depends

from configs.base import Settings, get_settings
from core.db.redis.client import RedisEventClient
from modules.v1.agents.services.coordinator_service import CoordinatorService
from modules.v1.erp.services.erp_service import ERPService
from modules.v1.rag.services.ingestion_service import IngestionService
from modules.v1.rag.services.rag_service import RAGService

def get_rag_service() -> RAGService:
    return RAGService()

def get_ingestion_service() -> IngestionService:
    return IngestionService()

def get_redis_event_client() -> RedisEventClient:
    return RedisEventClient()

def get_erp_service() -> ERPService:
    return ERPService()

def get_coordinator_service() -> CoordinatorService:
    return CoordinatorService()

SettingsDep = Annotated[Settings, Depends(get_settings)]
RagServiceDep = Annotated[RAGService, Depends(get_rag_service)]
IngestionServiceDep = Annotated[IngestionService, Depends(get_ingestion_service)]
RedisEventClientDep = Annotated[RedisEventClient, Depends(get_redis_event_client)]
ErpServiceDep = Annotated[ERPService, Depends(get_erp_service)]
CoordinatorServiceDep = Annotated[CoordinatorService, Depends(get_coordinator_service)]
