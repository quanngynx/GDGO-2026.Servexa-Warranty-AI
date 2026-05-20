"""Typed routing / planner outputs for LangGraph coordinator (revision report §3.3)."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class RoutingDecision(BaseModel):
    """Structured output from the routing step."""

    route: Literal['supply_chain', 'operations'] = Field(
        ...,
        description='Downstream branch for tool execution',
    )
    rationale: str = Field(default='', max_length=500)


class CoordinatorRunMetadata(BaseModel):
    trace_id: str = ''
    tenant_id: str = ''
    job_id: str = ''
    job_type: str = ''
    route: str = ''
