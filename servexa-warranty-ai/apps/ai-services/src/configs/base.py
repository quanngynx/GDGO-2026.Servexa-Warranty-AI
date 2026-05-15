from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file='.env',
        env_file_encoding='utf-8',
        extra='ignore',
    )

    environment: str = Field(default='development')
    app_name: str = Field(default='AI Service')
    app_version: str = Field(default='0.1.0')
    app_host: str = Field(default='0.0.0.0')
    app_port: int = Field(default=8081)
    logs_path: str = Field(default='./logs/access.log')
    cors_origin: list[str] = Field(default=['http://localhost', 'http://localhost:3000', 'http://localhost:3001'])

    gemini_api_key: str | None = Field(default=None)
    gemini_model_flash: str = Field(default='gemini-2.5-flash')
    gemini_model_pro: str = Field(default='gemini-1.5-pro')
    embedding_model: str = Field(default='models/text-embedding-004')

    redis_url: str = Field(default='redis://localhost:6381/0')
    redis_stream_name: str = Field(default='ai-events')
    redis_dlq_stream_name: str = Field(default='ai-events-dlq')
    redis_group_name: str = Field(default='ai-workers')
    redis_consumer_name: str = Field(default='agent-worker')

    # Must match `packages/env` server defaults / Node `AiJobStreamService`
    ai_stream_analysis: str = Field(default='ai.analysis.stream')
    ai_stream_chat: str = Field(default='ai.chat.stream')
    ai_stream_report: str = Field(default='ai.report.stream')
    ai_stream_anomaly: str = Field(default='ai.anomaly.stream')
    ai_stream_ingest: str = Field(default='ai.ingest.stream')
    ai_stream_retry: str = Field(default='ai.retry.stream')
    ai_job_consumer_group: str = Field(default='ai-job-workers')
    ai_job_dlq_stream: str = Field(default='ai.jobs.dlq')
    ai_job_max_retries: int = Field(default=3)
    ai_job_visibility_timeout_ms: int = Field(default=60_000)

    erp_base_url: str | None = Field(default=None)
    erp_internal_base_url: str | None = Field(
        default=None,
        validation_alias='ERP_INTERNAL_BASE_URL',
        description='Node ERP base URL for internal worker webhooks (e.g. http://host.docker.internal:3000)',
    )
    ai_internal_ingest_secret: str | None = Field(default=None, validation_alias='AI_INTERNAL_INGEST_SECRET')

    grpc_host: str = Field(default='0.0.0.0')
    grpc_port: int = Field(default=50051)

    postgres_host: str = Field(default='localhost')
    postgres_port: int = Field(default=5432)
    postgres_user: str = Field(default='postgres')
    postgres_password: str = Field(default='postgres')
    postgres_db: str = Field(default='ai_service')
    pgvector_collection_name: str = Field(default='documents')

    auth_enabled: bool = Field(default=False)
    api_key: str | None = Field(default=None)
    rate_limit_per_minute: int = Field(default=60)

    otel_enabled: bool = Field(default=False)
    otel_service_name: str = Field(default='ai-agent-code')
    trace_sample_ratio: float = Field(default=1.0)

    @property
    def database_url(self) -> str:
        return (
            f'postgresql+psycopg://'
            f'{self.postgres_user}:'
            f'{self.postgres_password}@'
            f'{self.postgres_host}:'
            f'{self.postgres_port}/'
            f'{self.postgres_db}'
        )

    def is_production(self) -> bool:
        return self.environment == 'production'


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()