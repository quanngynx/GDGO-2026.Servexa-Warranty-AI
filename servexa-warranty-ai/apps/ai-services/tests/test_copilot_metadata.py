from modules.v1.hitl.copilot_metadata import (
    build_copilot_envelope,
    build_heuristic_diagnosis_draft,
    build_selected_case_summary,
    build_warranty_eligibility,
)


def test_build_selected_case_summary_from_snapshot() -> None:
    summary = build_selected_case_summary({
        'repairCaseId': 'rc-1',
        'repairCaseSnapshot': {
            'caseNumber': 'C-100',
            'errorPhenomena': 'No power',
            'warrantyForm': 'in_warranty',
        },
    })
    assert summary is not None
    assert summary['repairCaseId'] == 'rc-1'
    assert summary['caseNumber'] == 'C-100'


def test_build_warranty_eligibility_eligible() -> None:
    result = build_warranty_eligibility({
        'repairCaseSnapshot': {
            'warrantyForm': 'in_warranty',
            'warrantyServiceType': 'standard_warranty',
        },
    })
    assert result['status'] == 'eligible'


def test_build_warranty_eligibility_unknown() -> None:
    result = build_warranty_eligibility({'repairCaseSnapshot': {}})
    assert result['status'] == 'unknown'


def test_build_heuristic_diagnosis_high_severity() -> None:
    draft = build_heuristic_diagnosis_draft({
        'repairCaseSnapshot': {'errorPhenomena': 'No power on device'},
    })
    assert draft['severity'] == 'high'
    assert draft['symptoms']


def test_build_copilot_envelope_includes_phase3_fields() -> None:
    envelope = build_copilot_envelope(
        'operations',
        {
            'repairCaseId': 'rc-1',
            'repairCaseSnapshot': {
                'caseNumber': 'C-1',
                'warrantyForm': 'in_warranty',
                'errorPhenomena': 'Screen flicker',
            },
        },
    )
    copilot = envelope['copilot']
    assert copilot['selectedCaseSummary']['repairCaseId'] == 'rc-1'
    assert copilot['warrantyEligibility']['status'] == 'eligible'
    assert copilot['diagnosisDraft']['symptoms']
