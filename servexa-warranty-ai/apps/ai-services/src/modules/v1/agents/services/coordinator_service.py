from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from modules.v1.agents.services.operations_service import OperationsService
from modules.v1.agents.services.supply_chain_service import SupplyChainService


class CoordinatorState(TypedDict):
    message: str
    route: str
    output: str
    tool_results: dict[str, str | int | float | bool]


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

    async def run(self, message: str) -> CoordinatorState:
        app = self._build_graph()
        return await app.ainvoke(
            {'message': message, 'route': 'operations', 'output': '', 'tool_results': {}},
        )

    def _route(self, state: CoordinatorState) -> CoordinatorState:
        route = 'supply_chain' if 'stock' in state['message'].lower() or 'restock' in state['message'].lower() else 'operations'
        return {**state, 'route': route}

    async def _supply_chain(self, state: CoordinatorState) -> CoordinatorState:
        result = await self.supply_chain_service.run(state['message'])
        return {**state, 'tool_results': result}

    async def _operations(self, state: CoordinatorState) -> CoordinatorState:
        result = await self.operations_service.run(state['message'])
        return {**state, 'tool_results': result}

    def _finalize(self, state: CoordinatorState) -> CoordinatorState:
        output = f"route={state['route']} completed"
        return {**state, 'output': output}
