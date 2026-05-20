from __future__ import annotations

import threading
import time
from typing import Any


class MetricsService:
    """Lightweight in-process counters (revision report observability hooks)."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.started_at = int(time.time())
        self._counters: dict[str, int] = {
            'jobs_completed': 0,
            'jobs_failed': 0,
            'jobs_cancelled': 0,
            'dlq_published': 0,
        }

    def inc(self, name: str, delta: int = 1) -> None:
        with self._lock:
            self._counters[name] = self._counters.get(name, 0) + delta

    def get_metrics(self) -> dict[str, int]:
        with self._lock:
            snapshot = dict(self._counters)
        snapshot['uptime_seconds'] = int(time.time()) - self.started_at
        return snapshot


_metrics_singleton: MetricsService | None = None
_metrics_lock = threading.Lock()


def get_metrics_service() -> MetricsService:
    global _metrics_singleton  # noqa: PLW0603
    with _metrics_lock:
        if _metrics_singleton is None:
            _metrics_singleton = MetricsService()
        return _metrics_singleton
