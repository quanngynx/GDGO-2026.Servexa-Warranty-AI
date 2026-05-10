from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from configs.base import settings
from core.middlewares.logging import RequestLogMiddleware
from core.observability import configure_observability
from routers import api_routers


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_observability()
    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    lifespan=lifespan,
    default_response_class=JSONResponse,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)
app.add_middleware(RequestLogMiddleware)

app.include_router(api_routers)

@app.get('/', tags=['system'])
def read_root() -> dict[str, str]:
    return {'service': settings.app_name, 'status': 'ok'}
