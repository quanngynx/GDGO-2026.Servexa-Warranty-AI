from pydantic import BaseModel, Field


class EventEnvelope(BaseModel):
    event_type: str
    payload: dict[str, str | int | float | bool]
    trace_id: str | None = Field(default=None)
    retry_count: int = Field(default=0)
