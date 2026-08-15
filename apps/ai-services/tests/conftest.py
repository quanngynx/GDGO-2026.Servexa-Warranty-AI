import pytest

from modules.v1.agents.trace_emitter import TraceEmitter


@pytest.fixture(autouse=True)
def mock_trace_emitter_publish(monkeypatch: pytest.MonkeyPatch) -> None:
    async def _noop_publish(self, envelope: dict) -> None:
        pass

    monkeypatch.setattr(TraceEmitter, '_publish', _noop_publish)
