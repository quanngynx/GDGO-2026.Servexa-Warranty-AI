import time


class MetricsService:
    def __init__(self) -> None:
        self.started_at = int(time.time())

    def get_metrics(self) -> dict[str, int]:
        return {'uptime_seconds': int(time.time()) - self.started_at}
