"""
Ensure local `src` absolute imports work in dev runners.

`fastapi dev` imports `src.main`, but modules in this service use imports like
`from configs.base import settings` (expecting `src` on `sys.path`).
"""

from __future__ import annotations

import sys
from pathlib import Path

_SRC_DIR = Path(__file__).resolve().parent
_SRC_STR = str(_SRC_DIR)

if _SRC_STR not in sys.path:
    sys.path.insert(0, _SRC_STR)
