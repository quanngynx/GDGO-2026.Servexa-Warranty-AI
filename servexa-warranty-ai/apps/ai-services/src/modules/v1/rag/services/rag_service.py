import time

from modules.v1.rag.retrievers.pgvector_retriever import PGVectorRetriever
from modules.v1.rag.schemas import RetrievedDocument

class RAGService:
    def __init__(self) -> None:
        self.retriever = PGVectorRetriever()

    async def retrieve(self, query: str, top_k: int = 5) -> tuple[list[RetrievedDocument], int]:
        start = time.perf_counter()
        documents = await self.retriever.similarity_search(query=query, k=top_k)
        retrieval_ms = int((time.perf_counter() - start) * 1000)

        return (
            [RetrievedDocument(content=doc.page_content, metadata=doc.metadata) for doc in documents],
            retrieval_ms,
        )