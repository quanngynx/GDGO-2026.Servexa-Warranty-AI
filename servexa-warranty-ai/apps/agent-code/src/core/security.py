import time
from collections import defaultdict, deque
from typing import Annotated

from fastapi import Depends, Header, HTTPException

from configs.base import settings

_requests_window: dict[str, deque[float]] = defaultdict(deque)


def verify_api_key(x_api_key: Annotated[str | None, Header()] = None) -> None:
    if not settings.auth_enabled:
        return
    if not settings.api_key or x_api_key != settings.api_key:
        raise HTTPException(status_code=401, detail='invalid api key')


def enforce_rate_limit(x_forwarded_for: Annotated[str | None, Header()] = None) -> None:
    identity = x_forwarded_for or 'local'
    now = time.time()
    window = _requests_window[identity]
    while window and (now - window[0]) > 60:
        window.popleft()
    if len(window) >= settings.rate_limit_per_minute:
        raise HTTPException(status_code=429, detail='rate limit exceeded')
    window.append(now)


SecureRouteDep = Annotated[None, Depends(verify_api_key)]
RateLimitDep = Annotated[None, Depends(enforce_rate_limit)]
