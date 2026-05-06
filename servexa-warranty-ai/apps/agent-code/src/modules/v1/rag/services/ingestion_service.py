from langchain_core.documents import Document

from modules.v1.rag.vectorstores.pgvector_vectorstore import get_vector_store

class IngestionService:
    async def ingest(
        self,
        content: str,
        metadata: dict[str, str | int | float | bool],
    ) -> None:
        document = Document(
            page_content=content,
            metadata=metadata,
        )

        vector_store = get_vector_store()
        await vector_store.aadd_documents([document])