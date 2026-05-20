"""Build AG-UI / copilot rail metadata including HITL workflow suggested actions."""

from __future__ import annotations

from typing import Any


def _workflow_action(
    action_id: str,
    label: str,
    workflow_kind: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    return {
        "id": action_id,
        "label": label,
        "action": f"workflow:{workflow_kind}",
        "kind": "workflow",
        "workflowKind": workflow_kind,
        "requiresApproval": True,
        "payload": payload,
    }


def build_copilot_envelope(
    route: str | None,
    execution_ctx: dict[str, Any],
) -> dict[str, Any]:
    """Return metadata.copilot shape aligned with @servexa-warranty-ai/ai-contracts."""
    repair_case_id = execution_ctx.get("repairCaseId") or execution_ctx.get("repair_case_id")
    case_number = execution_ctx.get("caseNumber") or execution_ctx.get("case_number")
    base_payload: dict[str, Any] = {}
    if repair_case_id:
        base_payload["repairCaseId"] = str(repair_case_id)
    if case_number:
        base_payload["caseNumber"] = str(case_number)

    suggested: list[dict[str, Any]] = []
    if route == "operations" and repair_case_id:
        suggested.extend(
            [
                _workflow_action(
                    "ops-escalate",
                    "Escalate repair case",
                    "repair_escalation",
                    {
                        **base_payload,
                        "reason": "SLA risk identified by AI coordinator",
                        "priority": "urgent",
                    },
                ),
                _workflow_action(
                    "ops-assign-tech",
                    "Assign technician",
                    "technician_assignment",
                    {
                        **base_payload,
                        "technicianId": str(execution_ctx.get("technicianId") or ""),
                    },
                ),
                _workflow_action(
                    "ops-customer-draft",
                    "Draft customer response",
                    "customer_response_draft",
                    {
                        **base_payload,
                        "body": (
                            "Thank you for contacting us regarding your warranty case. "
                            "We are reviewing your request and will follow up shortly."
                        ),
                    },
                ),
            ]
        )

    envelope: dict[str, Any] = {"suggestedActions": suggested or None}
    confidence = execution_ctx.get("confidence")
    if isinstance(confidence, (int, float)):
        envelope["confidence"] = float(confidence)
    return {"copilot": {k: v for k, v in envelope.items() if v is not None}}


def publish_hitl_event_log(event: str, payload: dict[str, Any]) -> None:
    """Log structured HITL events (Redis publish can be added in a later phase)."""
    import json
    import logging

    logging.getLogger(__name__).info(
        "hitl_event %s",
        json.dumps({"event": event, **payload}, default=str),
    )
