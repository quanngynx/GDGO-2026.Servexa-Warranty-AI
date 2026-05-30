"""Build AG-UI / copilot rail metadata including HITL workflow suggested actions."""

from __future__ import annotations

from typing import Any

_IN_WARRANTY_TOKENS = frozenset({
    'in_warranty',
    'in warranty',
    'active',
    'under_warranty',
    'covered',
    'warranty',
})

_OUT_OF_WARRANTY_TOKENS = frozenset({
    'out_of_warranty',
    'out of warranty',
    'expired',
    'no_warranty',
    'void',
    'not_covered',
})


def _workflow_action(
    action_id: str,
    label: str,
    workflow_kind: str,
    payload: dict[str, Any],
) -> dict[str, Any]:
    return {
        'id': action_id,
        'label': label,
        'action': f'workflow:{workflow_kind}',
        'kind': 'workflow',
        'workflowKind': workflow_kind,
        'requiresApproval': True,
        'payload': payload,
    }


def _pick_str(ctx: dict[str, Any], *keys: str) -> str | None:
    for key in keys:
        val = ctx.get(key)
        if isinstance(val, str) and val.strip():
            return val.strip()
    return None


def _snapshot(ctx: dict[str, Any]) -> dict[str, Any]:
    raw = ctx.get('repairCaseSnapshot') or ctx.get('selectedCaseSummary')
    return raw if isinstance(raw, dict) else ctx


def build_selected_case_summary(execution_ctx: dict[str, Any]) -> dict[str, Any] | None:
    src = _snapshot(execution_ctx)
    repair_case_id = _pick_str(src, 'repairCaseId', 'repair_case_id') or _pick_str(
        execution_ctx, 'repairCaseId', 'repair_case_id',
    )
    if not repair_case_id:
        return None

    summary: dict[str, Any] = {'repairCaseId': repair_case_id}
    for out_key, *in_keys in (
        ('caseNumber', 'caseNumber', 'case_number'),
        ('status', 'status'),
        ('priority', 'priority'),
        ('customerName', 'customerName', 'customer_name'),
        ('customerPhone', 'customerPhone', 'customer_phone'),
        ('productModel', 'productModel', 'product_model'),
        ('modelCode', 'modelCode', 'model_code'),
        ('serialNumber', 'serialNumber', 'serial_number'),
        ('warrantyForm', 'warrantyForm', 'warranty_form'),
        ('warrantyServiceType', 'warrantyServiceType', 'warranty_service_type'),
        ('errorPhenomena', 'errorPhenomena', 'error_phenomena'),
        ('promisedDeliveryDate', 'promisedDeliveryDate', 'promised_delivery_date'),
    ):
        val = _pick_str(src, *in_keys) or _pick_str(execution_ctx, *in_keys)
        if val is not None:
            summary[out_key] = val
        elif in_keys[0] in src and src[in_keys[0]] is None:
            summary[out_key] = None

    return summary


def build_warranty_eligibility(execution_ctx: dict[str, Any]) -> dict[str, Any]:
    src = _snapshot(execution_ctx)
    warranty_form = (_pick_str(src, 'warrantyForm', 'warranty_form') or '').lower()
    warranty_service = (
        _pick_str(src, 'warrantyServiceType', 'warranty_service_type') or ''
    ).lower()
    combined = f'{warranty_form} {warranty_service}'.strip()

    status = 'unknown'
    reason = 'Warranty coverage could not be determined from the selected repair case.'

    if any(token in combined for token in _OUT_OF_WARRANTY_TOKENS):
        status = 'not_eligible'
        reason = 'Repair case warranty form or service type indicates the device is out of warranty.'
    elif any(token in combined for token in _IN_WARRANTY_TOKENS) or (
        warranty_form and warranty_service
    ):
        status = 'eligible'
        reason = 'Repair case warranty form indicates active warranty coverage.'

    return {
        'status': status,
        'reason': reason,
        'warrantyForm': _pick_str(src, 'warrantyForm', 'warranty_form'),
        'warrantyServiceType': _pick_str(src, 'warrantyServiceType', 'warranty_service_type'),
        'confidence': 0.82 if status == 'eligible' else 0.65 if status == 'not_eligible' else 0.4,
    }


def build_heuristic_diagnosis_draft(execution_ctx: dict[str, Any]) -> dict[str, Any]:
    src = _snapshot(execution_ctx)
    symptom = (
        _pick_str(src, 'errorPhenomena', 'error_phenomena')
        or 'No symptom recorded on the repair case.'
    )
    product = _pick_str(src, 'productModel', 'product_model') or 'device'
    serial = _pick_str(src, 'serialNumber', 'serial_number') or 'unknown serial'

    severity = 'medium'
    symptom_lower = symptom.lower()
    if any(word in symptom_lower for word in ('no power', 'dead', 'smoke', 'fire', 'shock')):
        severity = 'high'
    elif any(word in symptom_lower for word in ('scratch', 'cosmetic', 'minor')):
        severity = 'low'

    return {
        'symptoms': [symptom],
        'possibleCauses': [
            f'Hardware fault related to reported symptom on {product}.',
            'Configuration or firmware issue after recent service.',
        ],
        'recommendedChecks': [
            f'Verify serial {serial} against warranty records.',
            'Run standard diagnostic checklist for the reported symptom.',
            'Inspect power and connectivity before parts replacement.',
        ],
        'severity': severity,
    }


def build_heuristic_copilot_reply(
    message: str,
    execution_ctx: dict[str, Any],
) -> tuple[str, dict[str, Any]]:
    """Deterministic copilot answer when Gemini is unavailable (e.g. quota exhausted)."""
    summary = build_selected_case_summary(execution_ctx)
    meta: dict[str, Any] = {}

    if not summary:
        return (
            'Select a repair case in the table, then ask again for operational next steps.',
            meta,
        )

    diagnosis = build_heuristic_diagnosis_draft(execution_ctx)
    warranty = build_warranty_eligibility(execution_ctx)
    meta['diagnosisDraft'] = diagnosis
    meta['warrantyEligibility'] = warranty

    case_no = summary.get('caseNumber') or summary['repairCaseId']
    status = summary.get('status') or 'unknown'
    priority = summary.get('priority') or 'normal'
    symptom = summary.get('errorPhenomena') or 'No symptom recorded.'
    checks = diagnosis.get('recommendedChecks') or []
    checks_text = '\n'.join(f'- {item}' for item in checks[:4]) or '- Run standard diagnostic checklist.'

    msg = message.lower()
    if 'warranty' in msg and 'eligib' in msg:
        intro = (
            f'Warranty for **{case_no}**: {warranty["status"].replace("_", " ")}. '
            f'{warranty["reason"]}'
        )
    elif 'next' in msg and 'action' in msg:
        intro = f'**Next operational steps for {case_no}** (status: {status}, priority: {priority})'
    elif 'summar' in msg:
        intro = f'**Handoff summary for {case_no}**'
    else:
        intro = f'**Operational guidance for {case_no}**'

    text = (
        f'{intro}\n\n'
        f'**Symptom:** {symptom}\n\n'
        f'**Recommended checks:**\n{checks_text}\n\n'
        '**Suggested workflow actions:** assign a technician, escalate if SLA is at risk, '
        'or draft a customer update from the Suggested actions panel.\n\n'
        '_Live AI is over quota; this answer uses case heuristics until the Gemini limit resets._'
    )
    return text, meta


def build_evidence_sources(
    execution_ctx: dict[str, Any],
) -> list[dict[str, Any]] | None:
    summary = build_selected_case_summary(execution_ctx)
    if not summary:
        return None

    sources: list[dict[str, Any]] = [
        {
            'id': f'repair-case-{summary["repairCaseId"]}',
            'title': f'Repair case {summary.get("caseNumber") or summary["repairCaseId"]}',
            'type': 'repair_case',
            'excerpt': summary.get('errorPhenomena') or 'Selected repair case context.',
        },
    ]
    if summary.get('warrantyForm') or summary.get('warrantyServiceType'):
        sources.append({
            'id': 'warranty-policy',
            'title': 'Warranty policy signals',
            'type': 'policy',
            'excerpt': (
                f'Form: {summary.get("warrantyForm")}; '
                f'Service: {summary.get("warrantyServiceType")}'
            ),
        })
    return sources


def build_copilot_envelope(
    route: str | None,
    execution_ctx: dict[str, Any],
    *,
    diagnosis_draft: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Return metadata.copilot shape aligned with @servexa-warranty-ai/ai-contracts."""
    repair_case_id = execution_ctx.get('repairCaseId') or execution_ctx.get('repair_case_id')
    case_number = execution_ctx.get('caseNumber') or execution_ctx.get('case_number')
    base_payload: dict[str, Any] = {}
    if repair_case_id:
        base_payload['repairCaseId'] = str(repair_case_id)
    if case_number:
        base_payload['caseNumber'] = str(case_number)

    suggested: list[dict[str, Any]] = []
    if route == 'operations' and repair_case_id:
        suggested.extend(
            [
                _workflow_action(
                    'ops-escalate',
                    'Escalate repair case',
                    'repair_escalation',
                    {
                        **base_payload,
                        'reason': 'SLA risk identified by AI coordinator',
                        'priority': 'urgent',
                    },
                ),
                _workflow_action(
                    'ops-assign-tech',
                    'Assign technician',
                    'technician_assignment',
                    {
                        **base_payload,
                        'technicianId': str(execution_ctx.get('technicianId') or ''),
                    },
                ),
                _workflow_action(
                    'ops-customer-draft',
                    'Draft customer response',
                    'customer_response_draft',
                    {
                        **base_payload,
                        'body': (
                            'Thank you for contacting us regarding your warranty case. '
                            'We are reviewing your request and will follow up shortly.'
                        ),
                    },
                ),
            ]
        )

    envelope: dict[str, Any] = {'suggestedActions': suggested or None}
    confidence = execution_ctx.get('confidence')
    if isinstance(confidence, (int, float)):
        envelope['confidence'] = float(confidence)

    summary = build_selected_case_summary(execution_ctx)
    if summary:
        envelope['selectedCaseSummary'] = summary
        envelope['warrantyEligibility'] = build_warranty_eligibility(execution_ctx)
        envelope['sources'] = build_evidence_sources(execution_ctx)
        envelope['diagnosisDraft'] = diagnosis_draft or build_heuristic_diagnosis_draft(
            execution_ctx,
        )

    return {'copilot': {k: v for k, v in envelope.items() if v is not None}}


def publish_hitl_event_log(event: str, payload: dict[str, Any]) -> None:
    """Log structured HITL events (Redis publish can be added in a later phase)."""
    import json
    import logging

    logging.getLogger(__name__).info(
        'hitl_event %s',
        json.dumps({'event': event, **payload}, default=str),
    )
