from abc import ABC, abstractmethod


class BaseTool(ABC):
    name: str

    @abstractmethod
    async def execute(self, payload: dict[str, str | int | float | bool]) -> dict[str, str | int | float | bool]:
        raise NotImplementedError
