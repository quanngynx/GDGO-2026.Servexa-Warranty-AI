from fastapi import APIRouter, Depends

from core.dependencies import CoordinatorServiceDep
from core.security import enforce_rate_limit, verify_api_key
from modules.v1.agents.schemas import AgentTaskRequest, AgentTaskResponse

router = APIRouter(
    prefix='/v1/agents',
    tags=['agents'],
    dependencies=[Depends(verify_api_key), Depends(enforce_rate_limit)],
)


@router.post('/run', response_model=AgentTaskResponse)
async def run_agent(payload: AgentTaskRequest, coordinator: CoordinatorServiceDep) -> AgentTaskResponse:
    result = await coordinator.run(payload.message)
    return AgentTaskResponse(output=result['output'], tool_results=result['tool_results'])
