from __future__ import annotations

import asyncio
import logging
import sys
from concurrent import futures
from pathlib import Path

import grpc

from modules.v1.grpc.services.grpc_bridge_service import GrpcBridgeService, ProcessContext

logger = logging.getLogger(__name__)

_gen_root = Path(__file__).resolve()
for _ancestor in _gen_root.parents:
    _cand = _ancestor / 'generated'
    if _cand.is_dir():
        if str(_cand) not in sys.path:
            sys.path.insert(0, str(_cand))
        break

from ai.v1 import ai_service_pb2  # noqa: E402
from ai.v1 import ai_service_pb2_grpc  # noqa: E402


class AiServiceServicer(ai_service_pb2_grpc.AiServiceServicer):
    def ProcessRequest(self, request: ai_service_pb2.ProcessRequestInput, context: grpc.ServicerContext):
        bridge = GrpcBridgeService()
        ctx = ProcessContext(
            message=request.message,
            trace_id=request.trace_id or '',
            user_id=request.user_id or '',
            tenant_id=request.tenant_id or '',
            role=request.role or '',
            context_json=request.context_json or '{}',
            request_version=request.request_version or '1',
            job_id=request.job_id or '',
            job_type=request.job_type or '',
            execution_context_json=request.execution_context_json or '{}',
        )
        try:
            output, metadata_json = asyncio.run(bridge.process_full(ctx))
        except Exception as exc:  # noqa: BLE001
            logger.exception('ProcessRequest failed trace_id=%s', ctx.trace_id)
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(str(exc))
            return ai_service_pb2.ProcessRequestOutput(output='', metadata_json='{}')

        return ai_service_pb2.ProcessRequestOutput(output=output, metadata_json=metadata_json)


def create_grpc_server(host: str, port: int) -> grpc.Server:
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=8))
    ai_service_pb2_grpc.add_AiServiceServicer_to_server(AiServiceServicer(), server)
    listen = f'{host}:{port}'
    server.add_insecure_port(listen)
    logger.info('gRPC AiService will bind %s', listen)
    return server


def serve_blocking(host: str, port: int) -> None:
    server = create_grpc_server(host, port)
    server.start()
    server.wait_for_termination()
