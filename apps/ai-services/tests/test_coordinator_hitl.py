import pytest

from modules.v1.agents.services.coordinator_service import CoordinatorService


def test_coordinator_graph_compiles_with_checkpointer():
    service = CoordinatorService()
    compiled = service._build_graph()
    assert compiled is not None


@pytest.mark.asyncio
async def test_coordinator_interrupt_when_requires_approval():
    service = CoordinatorService()
    result = await service.run(
        "escalate repair case",
        trace_id="trace-1",
        job_id="job-1",
        execution_context={
            "requiresApproval": True,
            "workflowKind": "repair_escalation",
            "repairCaseId": "rc-1",
        },
    )
    assert result.get("hitl_status") == "awaiting_approval" or result.get("__interrupt__")
