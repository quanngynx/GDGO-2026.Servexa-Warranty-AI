from langchain_google_genai import GoogleGenerativeAIEmbeddings

from configs.base import settings

class EmbeddingService:
    def __init__(self):
        self.embedding_model = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004",
            google_api_key=settings.GEMINI_API_KEY,
        )

    async def embed_documents(self, documents: list[str]):
        return await self.embedding_model.aembed_documents(documents)

    async def embed_query(self, query: str):
        return await self.embedding_model.aembed_query(query)