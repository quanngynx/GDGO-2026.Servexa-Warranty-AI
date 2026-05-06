from langchain_google_genai import ChatGoogleGenerativeAI

from configs.base import settings


class GeminiService:
    def __init__(self):
        self.flash_model = ChatGoogleGenerativeAI(
            model=settings.gemini_model_flash,
            google_api_key=settings.gemini_api_key,
            temperature=0.2,
        )

        self.pro_model = ChatGoogleGenerativeAI(
            model=settings.gemini_model_pro,
            google_api_key=settings.gemini_api_key,
            temperature=0.2,
        )

    async def invoke_flash(self, prompt: str):
        return await self.flash_model.ainvoke(prompt)

    async def invoke_pro(self, prompt: str):
        return await self.pro_model.ainvoke(prompt)