# Agent code

## Local setup

```bash
python -m venv .venv

# unix shell
source .venv/Scripts/activate
# cmd
.\.venv\Scripts\activate.bat
# PowerShell
.\.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

- Option, update lib into requirment.txt

```bash
pip freeze > requirment.txt
```

## Run API

```bash
fastapi dev --host 0.0.0.0 --port 8081
```

## Run worker

```bash
python -m src.worker
```

## Run tests

```bash
pytest
```

## Docker

```bash
docker compose up --build
```
