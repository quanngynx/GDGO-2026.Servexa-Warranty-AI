from pydantic import BaseModel, Field


class AgentTaskRequest(BaseModel):
    message: str = Field(min_length=1)
    trace_id: str | None = Field(default=None)


class AgentTaskResponse(BaseModel):
    output: str
    tool_results: dict[str, str | int | float | bool]
