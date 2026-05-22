"""Package bootstrap: legacy imports (configs, core, modules) expect `src` on PYTHONPATH."""

from __future__ import annotations

import sys
from pathlib import Path

_SRC_ROOT = Path(__file__).resolve().parent
_src_root = str(_SRC_ROOT)
if _src_root not in sys.path:
    sys.path.insert(0, _src_root)
