class PromptBuilderService:
    def build(self, query: str, contexts: list[str]) -> str:
        context_block = '\n\n'.join(contexts)
        return (
            'Use the following retrieved context to answer the user query.\n'
            f'Context:\n{context_block}\n\n'
            f'Query: {query}\n'
            'Answer with concise, operational guidance.'
        )
