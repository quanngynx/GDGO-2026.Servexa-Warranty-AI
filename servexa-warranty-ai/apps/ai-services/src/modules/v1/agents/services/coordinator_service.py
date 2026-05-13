import json
import logging
from typing import Any, TypedDict

from langgraph.graph import END, START, StateGraph

from modules.v1.agents.schemas.coordinator_schemas import CoordinatorRunMetadata, RoutingDecision
from modules.v1.agents.services.operations_service import OperationsService
from modules.v1.agents.services.supply_chain_service import SupplyChainService

logger = logging.getLogger(__name__)


class CoordinatorState(TypedDict):
    message: str
    route: str
    output: str
    tool_results: dict[str, str | int | float | bool]
    trace_id: str
    tenant_id: str
    job_id: str
    job_type: str
    execution_context: dict[str, Any]


class CoordinatorService:
    def __init__(self) -> None:
        self.supply_chain_service = SupplyChainService()
        self.operations_service = OperationsService()

    def _build_graph(self):
        graph = StateGraph(CoordinatorState)
        graph.add_node('route', self._route)
        graph.add_node('supply_chain', self._supply_chain)
        graph.add_node('operations', self._operations)
        graph.add_node('finalize', self._finalize)
        graph.add_edge(START, 'route')
        graph.add_conditional_edges(
            'route',
            lambda state: state['route'],
            {
                'supply_chain': 'supply_chain',
                'operations': 'operations',
            },
        )
        graph.add_edge('supply_chain', 'finalize')
        graph.add_edge('operations', 'finalize')
        graph.add_edge('finalize', END)
        return graph.compile()

    async def run(
        self,
        message: str,
        *,
        trace_id: str = '',
        tenant_id: str = '',
        job_id: str = '',
        job_type: str = '',
        execution_context: dict[str, Any] | None = None,
    ) -> CoordinatorState:
        ctx = execution_context or {}
        if ctx:
            logger.info(
                'coordinator_execution_context %s',
                json.dumps(
                    {'trace_id': trace_id, 'job_id': job_id, 'job_type': job_type, 'keys': list(ctx.keys())},
                    default=str,
                ),
            )
        app = self._build_graph()
        return await app.ainvoke(
            {
                'message': message,
                'route': 'operations',
                'output': '',
                'tool_results': {},
                'trace_id': trace_id,
                'tenant_id': tenant_id,
                'job_id': job_id,
                'job_type': job_type,
                'execution_context': ctx,
            },
        )

    def _route(self, state: CoordinatorState) -> CoordinatorState:
        raw = (
            'supply_chain'
            if 'stock' in state['message'].lower() or 'restock' in state['message'].lower()
            else 'operations'
        )
        decision = RoutingDecision(route=raw, rationale='keyword_router')
        logger.info(
            'routing_trace %s',
            json.dumps(
                {
                    'trace_id': state.get('trace_id', ''),
                    'route': decision.route,
                    'rationale': decision.rationale,
                },
                default=str,
            ),
        )
        return {**state, 'route': decision.route}

    async def _supply_chain(self, state: CoordinatorState) -> CoordinatorState:
        result = await self.supply_chain_service.run(
            state['message'],
            trace_id=state.get('trace_id', ''),
            tenant_id=state.get('tenant_id', ''),
        )
        return {**state, 'tool_results': result}

    async def _operations(self, state: CoordinatorState) -> CoordinatorState:
        result = await self.operations_service.run(
            state['message'],
            trace_id=state.get('trace_id', ''),
            tenant_id=state.get('tenant_id', ''),
        )
        return {**state, 'tool_results': result}

    def _finalize(self, state: CoordinatorState) -> CoordinatorState:
        meta = CoordinatorRunMetadata(
            trace_id=state.get('trace_id', ''),
            tenant_id=state.get('tenant_id', ''),
            job_id=state.get('job_id', ''),
            job_type=state.get('job_type', ''),
            route=state.get('route', ''),
        )
        tool_json = json.dumps(state.get('tool_results', {}))
        text = f"route={state['route']} tool_results={tool_json}"
        logger.info('coordinator_finalize %s', json.dumps(meta.model_dump(), default=str))
        return {**state, 'output': text}
