from __future__ import annotations

import socket
import subprocess
import sys


def is_port_in_use(port: int, host: str = '127.0.0.1') -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.3)
        return sock.connect_ex((host, port)) == 0


def listening_pid_on_port(port: int) -> int | None:
    if sys.platform == 'win32':
        result = subprocess.run(
            ['netstat', '-ano'],
            capture_output=True,
            text=True,
            check=False,
            creationflags=subprocess.CREATE_NO_WINDOW if hasattr(subprocess, 'CREATE_NO_WINDOW') else 0,
        )
        needle = f':{port}'
        for line in result.stdout.splitlines():
            if 'LISTENING' not in line or needle not in line:
                continue
            parts = line.split()
            if not parts:
                continue
            try:
                return int(parts[-1])
            except ValueError:
                continue
        return None

    result = subprocess.run(
        ['lsof', '-i', f':{port}', '-sTCP:LISTEN', '-t'],
        capture_output=True,
        text=True,
        check=False,
    )
    if result.returncode != 0 or not result.stdout.strip():
        return None
    try:
        return int(result.stdout.strip().splitlines()[0])
    except ValueError:
        return None
