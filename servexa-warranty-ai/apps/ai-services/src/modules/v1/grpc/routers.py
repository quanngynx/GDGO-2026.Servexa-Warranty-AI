from fastapi import APIRouter

from core.schemas import ApiMessage
from modules.v1.grpc.services.grpc_bridge_service import GrpcBridgeService

router = APIRouter(prefix='/v1/grpc', tags=['grpc'])


@router.get('/status', response_model=ApiMessage)
async def grpc_status() -> ApiMessage:
    bridge = GrpcBridgeService()
    _ = bridge
    return ApiMessage(message='gRPC boundary ready')
