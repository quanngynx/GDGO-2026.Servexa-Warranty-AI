from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.asyncio import async_sessionmaker

from configs.base import settings


engine = create_async_engine(
    settings.database_url.replace("psycopg", "asyncpg"),
    echo=False,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
)