from modules.v1.rag.vectorstores.pgvector_vectorstore import get_vector_store

class PGVectorRetriever:
    async def similarity_search(self, query: str, k: int = 5):
        vector_store = get_vector_store()
        return await vector_store.asimilarity_search(
            query=query,
            k=k,
        )