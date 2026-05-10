from pydantic import BaseModel, Field

class IngestRequest(BaseModel):
    content: str = Field(min_length=1)
    metadata: dict[str, str | int | float | bool] = Field(default_factory=dict)

class RetrievedDocument(BaseModel):
    content: str
    metadata: dict[str, str | int | float | bool]

class RetrieveRequest(BaseModel):
    query: str = Field(min_length=1)
    top_k: int = Field(default=5, ge=1, le=20)

class RetrieveResponse(BaseModel):
    documents: list[RetrievedDocument]
    retrieval_ms: int
