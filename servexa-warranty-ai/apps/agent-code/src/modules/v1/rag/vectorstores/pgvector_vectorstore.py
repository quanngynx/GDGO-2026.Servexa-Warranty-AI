from functools import lru_cache

from langchain_postgres import PGVector
from langchain_google_genai import GoogleGenerativeAIEmbeddings

from configs.base import settings

@lru_cache(maxsize=1)
def get_vector_store() -> PGVector:
    embeddings = GoogleGenerativeAIEmbeddings(
        model=settings.embedding_model,
        google_api_key=settings.gemini_api_key,
    )
    return PGVector(
        embeddings=embeddings,
        collection_name=settings.pgvector_collection_name,
        connection=settings.database_url,
        use_jsonb=True,
    )