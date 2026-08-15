from fastapi.testclient import TestClient

from main import app


def test_health_ping() -> None:
    client = TestClient(app)
    response = client.get('/v1/health/ping')
    assert response.status_code == 200
    assert response.json() == {'ping': 'pong'}
