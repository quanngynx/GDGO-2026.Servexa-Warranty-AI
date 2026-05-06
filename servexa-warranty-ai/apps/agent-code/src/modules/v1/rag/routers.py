from typing import Annotated

from fastapi import APIRouter, Depends

from core.dependencies import IngestionServiceDep, RagServiceDep
from core.schemas import ApiMessage
from modules.v1.rag.schemas import IngestRequest, RetrieveRequest, RetrieveResponse
from modules.v1.rag.services.context_aggregator_service import ContextAggregatorService
from modules.v1.rag.services.prompt_builder_service import PromptBuilderService

router = APIRouter(prefix='/v1/rag', tags=['rag'])

def get_context_aggregator() -> ContextAggregatorService:
    return ContextAggregatorService()


def get_prompt_builder() -> PromptBuilderService:
    return PromptBuilderService()

ContextAggregatorDep = Annotated[ContextAggregatorService, Depends(get_context_aggregator)]
PromptBuilderDep = Annotated[PromptBuilderService, Depends(get_prompt_builder)]

@router.post('/ingest', response_model=ApiMessage)
async def ingest_document(payload: IngestRequest, ingestion_service: IngestionServiceDep) -> ApiMessage:
    await ingestion_service.ingest(payload.content, payload.metadata)
    return ApiMessage(message='document ingested')

@router.post('/retrieve', response_model=RetrieveResponse)
async def retrieve_context(payload: RetrieveRequest, rag_service: RagServiceDep) -> RetrieveResponse:
    documents, retrieval_ms = await rag_service.retrieve(payload.query, payload.top_k)
    return RetrieveResponse(documents=documents, retrieval_ms=retrieval_ms)

@router.post('/prompt', response_model=ApiMessage)
async def build_prompt(
    payload: RetrieveRequest,
    rag_service: RagServiceDep,
    context_aggregator: ContextAggregatorDep,
    prompt_builder: PromptBuilderDep,
) -> ApiMessage:
    documents, _ = await rag_service.retrieve(payload.query, payload.top_k)
    context_chunks = context_aggregator.aggregate(documents)
    prompt = prompt_builder.build(payload.query, context_chunks)
    return ApiMessage(message=prompt)
