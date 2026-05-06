from pydantic import BaseModel, Field


class ApiMessage(BaseModel):
    message: str


class HealthStatus(BaseModel):
    status: str = Field(default='ok')
    service: str
