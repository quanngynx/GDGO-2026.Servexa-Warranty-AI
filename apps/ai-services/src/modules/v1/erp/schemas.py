from pydantic import BaseModel, Field


class ERPProxyRequest(BaseModel):
    endpoint: str = Field(min_length=1)
    method: str = Field(default='GET')
    payload: dict[str, str | int | float | bool] = Field(default_factory=dict)
