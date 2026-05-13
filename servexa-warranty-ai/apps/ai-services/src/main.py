from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from configs.base import settings
from core.middlewares.logging import RequestLogMiddleware
from core.observability import configure_observability
from modules.v1.grpc.grpc_ai_servicer import create_grpc_server
from routers import api_routers

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_observability()
    grpc_server = None
    try:
        grpc_server = create_grpc_server(settings.grpc_host, settings.grpc_port)
        grpc_server.start()
    except Exception:
        logger.exception('gRPC AiService failed to bind on %s:%s', settings.grpc_host, settings.grpc_port)
    try:
        yield
    finally:
        if grpc_server is not None:
            grpc_server.stop(grace=5.0)
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
