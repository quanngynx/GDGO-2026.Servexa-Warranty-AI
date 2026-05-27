import json
import logging
import os
import uuid
from functools import lru_cache
from pathlib import Path
from typing import Any, TypedDict

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt

from modules.v1.agents.schemas.coordinator_schemas import CoordinatorRunMetadata, RoutingDecision
from modules.v1.agents.services.copilot_reply_service import CopilotReplyService, is_noop_tool_result
from modules.v1.agents.services.operations_service import OperationsService
from modules.v1.agents.services.supply_chain_service import SupplyChainService
from modules.v1.agents.trace_emitter import (
    TraceEmitter,
    get_trace_emitter,
    reset_trace_emitter,
    set_trace_emitter,
)

logger = logging.getLogger(__name__)
_DEBUG_LOG_PATH = Path(__file__).resolve().parents[6] / 'debug-596e87.log'


def _debug_log(hypothesis_id: str, message: str, data: dict[str, Any]) -> None:
    payload = {
        'sessionId': '596e87',
        'runId': 'initial',
        'hypothesisId': hypothesis_id,
        'location': 'coordinator_service.py',
        'message': message,
        'data': data,
        'timestamp': int(__import__('time').time() * 1000),
    }
    _DEBUG_LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with _DEBUG_LOG_PATH.open('a', encoding='utf-8') as fp:
        fp.write(json.dumps(payload, default=str) + '\n')


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

        repair_case_id = str(ctx.get('repairCaseId') or '') or None
        emitter = TraceEmitter(
            trace_id=trace_id or thread_id,
            run_id=trace_id or thread_id,
            thread_id=thread_id,
            repair_case_id=repair_case_id,
        )
        token = set_trace_emitter(emitter)
        await emitter.trace_started()
        run_step_id = await emitter.start_step(
            step_type='run',
            title='Copilot run',
            summary='Processing your request',
        )

        try:
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
        except Exception:
            await emitter.trace_failed(error_message='Coordinator run failed')
            await emitter.close()
            reset_trace_emitter(token)
            raise

        interrupts = result.get('__interrupt__')
        if interrupts:
            payload = interrupts[0].value if hasattr(interrupts[0], 'value') else interrupts[0]
            await emitter.complete_step(run_step_id, summary='Awaiting human approval')
            await emitter.start_step(
                step_type='hitl',
                title='Human approval required',
                summary='Review the proposed action in the copilot rail',
                status='waiting_for_human',
            )
            out = {
                **result,
                'hitl_status': 'awaiting_approval',
                'interrupt_payload': payload,
                'thread_id': thread_id,
                'reasoning_trace': emitter.snapshot(),
            }
            await emitter.close()
            reset_trace_emitter(token)
            return out

        await emitter.complete_step(run_step_id, summary='Run completed')
        await emitter.trace_completed()
        result['reasoning_trace'] = emitter.snapshot()
        await emitter.close()
        reset_trace_emitter(token)
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

    async def _route(self, state: CoordinatorState) -> CoordinatorState:
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
        emitter = get_trace_emitter()
        if emitter:
            step_id = await emitter.start_step(
                step_type='routing',
                title='Route selection',
                summary='Selecting the best agent path for this request',
            )
            await emitter.complete_step(
                step_id,
                summary=f"Selected route: {decision.route}",
                safe_details={'result': decision.rationale},
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
        emitter = get_trace_emitter()
        step_id = None
        if emitter:
            step_id = await emitter.start_step(
                step_type='tool',
                title='Supply chain workflow',
                summary='Running supply chain tools',
                agent_name='supply_chain',
            )
        result = await self.supply_chain_service.run(
            state['message'],
            trace_id=state.get('trace_id', ''),
            tenant_id=state.get('tenant_id', ''),
        )
        if emitter and step_id:
            await emitter.complete_step(
                step_id,
                summary='Supply chain workflow completed',
                safe_details={'candidateCount': len(result) if isinstance(result, dict) else 0},
            )
        return {**state, 'tool_results': result}

    async def _operations(self, state: CoordinatorState) -> CoordinatorState:
        emitter = get_trace_emitter()
        step_id = None
        if emitter:
            step_id = await emitter.start_step(
                step_type='tool',
                title='Operations workflow',
                summary='Running operations tools',
                agent_name='operations',
            )
        result = await self.operations_service.run(
            state['message'],
            trace_id=state.get('trace_id', ''),
            tenant_id=state.get('tenant_id', ''),
        )
        if emitter and step_id:
            await emitter.complete_step(
                step_id,
                summary='Operations workflow completed',
                safe_details={'candidateCount': len(result) if isinstance(result, dict) else 0},
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
        finalization_summary = 'Done'
        # #region agent log
        _debug_log(
            'H1',
            'finalize_entry',
            {
                'traceId': state.get('trace_id', ''),
                'noopPathCandidate': is_noop_tool_result(tool_results) and not bool(approval),
                'hasApproval': bool(approval),
                'toolResultsType': type(tool_results).__name__,
            },
        )
        # #endregion

        copilot_phase3: dict[str, Any] = {}
        if is_noop_tool_result(tool_results) and not approval:
            output_text, copilot_phase3 = await self.copilot_reply_service.compose_reply_with_metadata(
                message=state.get('message', ''),
                execution_context=state.get('execution_context'),
            )
            finalization_summary = 'Response composed from copilot metadata.'
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
            finalization_summary = summary

        emitter = get_trace_emitter()
        if emitter:
            gen_id = await emitter.start_step(
                step_type='generation',
                title='Compose response',
                summary='Generating the assistant reply',
            )
            await emitter.complete_step(gen_id, summary='Response ready')
            fin_id = await emitter.start_step(
                step_type='finalization',
                title='Finalize',
                summary='Finalizing copilot output',
            )
            # #region agent log
            _debug_log(
                'H1',
                'finalize_before_complete_step',
                {
                    'traceId': state.get('trace_id', ''),
                    'summaryInLocals': 'summary' in locals(),
                    'finalizationSummaryLen': len(finalization_summary),
                    'outputTextLen': len(output_text) if isinstance(output_text, str) else -1,
                },
            )
            # #endregion
            await emitter.complete_step(fin_id, summary=finalization_summary[:200] if finalization_summary else 'Done')

        logger.info('coordinator_finalize %s', json.dumps(meta.model_dump(), default=str))
        return {**state, 'output': output_text, 'copilot_phase3': copilot_phase3}
