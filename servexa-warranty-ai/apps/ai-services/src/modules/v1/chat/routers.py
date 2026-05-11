from fastapi import APIRouter, Depends

from core.dependencies import CoordinatorServiceDep
from core.security import enforce_rate_limit, verify_api_key
from modules.v1.agents.schemas import AgentTaskRequest, AgentTaskResponse

router = APIRouter(
    prefix='/v1/chat',
    tags=['chat'],
    dependencies=[Depends(verify_api_key), Depends(enforce_rate_limit)],
)


@router.post('/message', response_model=AgentTaskResponse)
async def chat_message(payload: AgentTaskRequest, coordinator: CoordinatorServiceDep) -> AgentTaskResponse:
    result = await coordinator.run(payload.message)
    return AgentTaskResponse(output=result['output'], tool_results=result['tool_results'])
