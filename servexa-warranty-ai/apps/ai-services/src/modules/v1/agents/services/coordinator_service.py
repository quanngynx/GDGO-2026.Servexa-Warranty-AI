import json
import logging
import os
import uuid
from functools import lru_cache
from typing import Any, TypedDict

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

from modules.v1.agents.schemas.coordinator_schemas import CoordinatorRunMetadata, RoutingDecision
from modules.v1.agents.services.copilot_reply_service import CopilotReplyService, is_noop_tool_result
from modules.v1.agents.services.operations_service import OperationsService
from modules.v1.agents.services.supply_chain_service import SupplyChainService

logger = logging.getLogger(__name__)


class CoordinatorState(TypedDict, total=False):
    message: str
    route: str
    output: str
    tool_results: dict[str, str | int | float | bool]
    trace_id: str
    tenant_id: str
    job_id: str
    job_type: str
    execution_context: dict[str, Any]
    hitl_status: str
    proposed_action: dict[str, Any]
    approval_decision: dict[str, Any]
    thread_id: str
    # Do not add checkpoint_id here — LangGraph reserves that channel when a checkpointer is used.


def _use_postgres_checkpointer() -> bool:
    return bool(os.getenv('LANGGRAPH_CHECKPOINT_POSTGRES', '').lower() in ('1', 'true', 'yes'))


@lru_cache(maxsize=1)
def _get_checkpointer():
    if _use_postgres_checkpointer():
        try:
            from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver  # type: ignore

            db_url = os.getenv('DATABASE_URL', '')
            if db_url:
                return AsyncPostgresSaver.from_conn_string(db_url)
        except Exception as exc:  # noqa: BLE001
            logger.warning('Postgres checkpointer unavailable, using MemorySaver: %s', exc)
    return MemorySaver()


class CoordinatorService:
    def __init__(self) -> None:
        self.supply_chain_service = SupplyChainService()
        self.operations_service = OperationsService()
        self.copilot_reply_service = CopilotReplyService()
        self._compiled = None

    def _build_graph(self):
        graph = StateGraph(CoordinatorState)
        graph.add_node('route', self._route)
        graph.add_node('approval_gate', self._approval_gate)
        graph.add_node('supply_chain', self._supply_chain)
        graph.add_node('operations', self._operations)
        graph.add_node('finalize', self._finalize)
        graph.add_edge(START, 'route')
        graph.add_edge('route', 'approval_gate')
        graph.add_conditional_edges(
            'approval_gate',
            self._after_approval,
            {
                'supply_chain': 'supply_chain',
                'operations': 'operations',
                'awaiting': END,
            },
        )
        graph.add_edge('supply_chain', 'finalize')
        graph.add_edge('operations', 'finalize')
        graph.add_edge('finalize', END)
        checkpointer = _get_checkpointer()
        return graph.compile(checkpointer=checkpointer)

    def _app(self):
        if self._compiled is None:
            self._compiled = self._build_graph()
        return self._compiled

    def _requires_hitl(self, ctx: dict[str, Any]) -> bool:
        if ctx.get('requiresApproval') or ctx.get('hitlWorkflow'):
            return True
        return bool(ctx.get('workflowKind'))

    async def run(
        self,
        message: str,
        *,
        trace_id: str = '',
        tenant_id: str = '',
        job_id: str = '',
        job_type: str = '',
        execution_context: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        ctx = execution_context or {}
        thread_id = job_id or trace_id or f'hitl-{uuid.uuid4().hex[:12]}'
        config = {'configurable': {'thread_id': thread_id}}

        result = await self._app().ainvoke(
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
                'thread_id': thread_id,
            },
            config=config,
        )

        interrupts = result.get('__interrupt__')
        if interrupts:
            payload = interrupts[0].value if hasattr(interrupts[0], 'value') else interrupts[0]
            return {
                **result,
                'hitl_status': 'awaiting_approval',
                'interrupt_payload': payload,
                'thread_id': thread_id,
            }

        return result

    async def resume(
        self,
        *,
        thread_id: str,
        checkpoint_id: str = '',
        decision_json: str = '{}',
    ) -> dict[str, Any]:
        try:
            decision = json.loads(decision_json) if decision_json else {}
        except json.JSONDecodeError:
            decision = {}

        config = {'configurable': {'thread_id': thread_id}}
        if checkpoint_id:
            config['configurable']['checkpoint_id'] = checkpoint_id

        return await self._app().ainvoke(
            Command(resume={'approval_decision': decision}),
            config=config,
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

    def _approval_gate(self, state: CoordinatorState) -> CoordinatorState:
        ctx = state.get('execution_context') or {}
        if not self._requires_hitl(ctx):
            return state

        proposed = {
            'workflowKind': ctx.get('workflowKind'),
            'payload': ctx.get('payload') or {},
            'repairCaseId': ctx.get('repairCaseId'),
            'message': state.get('message', ''),
        }
        decision = interrupt(
            {
                'human_approval_required': True,
                'proposed_action': proposed,
                'thread_id': state.get('thread_id', ''),
            },
        )
        return {
            **state,
            'approval_decision': decision if isinstance(decision, dict) else {'raw': decision},
            'hitl_status': 'approved',
        }

    def _after_approval(self, state: CoordinatorState) -> str:
        if state.get('hitl_status') == 'awaiting_approval':
            return 'awaiting'
        return state.get('route', 'operations')

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

    async def _finalize(self, state: CoordinatorState) -> CoordinatorState:
        meta = CoordinatorRunMetadata(
            trace_id=state.get('trace_id', ''),
            tenant_id=state.get('tenant_id', ''),
            job_id=state.get('job_id', ''),
            job_type=state.get('job_type', ''),
            route=state.get('route', ''),
        )
        tool_results = state.get('tool_results') or {}
        approval = state.get('approval_decision')

        if is_noop_tool_result(tool_results) and not approval:
            output_text = await self.copilot_reply_service.compose_reply(
                message=state.get('message', ''),
                execution_context=state.get('execution_context'),
            )
        else:
            tool_json = json.dumps(tool_results)
            route = state.get('route', '') or 'general'
            summary = (
                'Supply chain workflow completed.'
                if route == 'supply_chain'
                else 'Operations workflow completed.'
            )
            if approval:
                summary = f'{summary} Human approval was recorded.'
            details = f'Tool signals: {tool_json}' if tool_json != '{}' else ''
            output_text = f'{summary}\n\n{details}'.strip() if details else summary

        logger.info('coordinator_finalize %s', json.dumps(meta.model_dump(), default=str))
        return {**state, 'output': output_text}
