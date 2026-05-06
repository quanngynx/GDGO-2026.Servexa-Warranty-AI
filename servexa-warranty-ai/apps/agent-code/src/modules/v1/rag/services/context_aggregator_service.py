from modules.v1.rag.schemas import RetrievedDocument


class ContextAggregatorService:
    def aggregate(self, documents: list[RetrievedDocument]) -> list[str]:
        return [doc.content for doc in documents]
