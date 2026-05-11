import { Button } from '@servexa-warranty-ai/ui/components/button'
import { ScrollArea } from '@servexa-warranty-ai/ui/components/scroll-area'
import { Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'
import { CopilotHeader } from './copilot-header'
import { CopilotSources } from './copilot-sources'
import { useCopilot } from '../hooks/use-copilot'
import { getContextPromptHint } from '../hooks/use-page-context'

export function CopilotPanel() {
  const {
    isExpanded,
    setIsExpanded,
    setIsOpen,
    pageContext,
    messages,
    isLoading,
    send,
    reload,
    suggestedQueries,
  } = useCopilot()
  const [input, setInput] = useState('')

  const assistantMessages = useMemo(
    () => messages.filter((message) => message.role === 'assistant'),
    [messages]
  )

  const lastAssistantMessage = assistantMessages.at(-1)

  const handleSubmit = () => {
    if (!input.trim()) return
    send(input)
    setInput('')
  }

  return (
    <aside
      className={`hidden border-l border-border bg-card/80 backdrop-blur lg:flex lg:flex-col ${isExpanded ? 'lg:w-[460px]' : 'lg:w-[360px]'}`}
      aria-label="AI copilot panel"
    >
      <CopilotHeader
        pageContext={pageContext}
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded((previous) => !previous)}
        onClose={() => setIsOpen(false)}
        onReload={reload}
        hasMessages={messages.length > 0}
      />

      <ScrollArea className="h-[calc(100svh-15.5rem)] px-4 py-3">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4">
              <p className="text-sm font-medium text-foreground">AI Operations Copilot</p>
              <p className="mt-1 text-xs text-muted-foreground">{getContextPromptHint(pageContext)}</p>
            </div>
          ) : (
            messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-lg p-3 ${message.role === 'user' ? 'ms-6 bg-ai-primary/10' : 'me-6 bg-muted/30'}`}
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  {message.role === 'user' ? 'You' : 'AI'}
                </p>
                <p className="mt-1 text-sm text-foreground">{message.content}</p>
                {message.role === 'assistant' ? (
                  <CopilotSources sources={message.sources ?? []} confidence={message.confidence} />
                ) : null}
              </article>
            ))
          )}

          {isLoading ? (
            <div className="flex items-center gap-2 rounded-lg bg-muted/20 p-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-ai-primary" />
              Generating response…
            </div>
          ) : null}
        </div>
      </ScrollArea>

      <div className="border-t border-border px-4 py-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestedQueries.map((query) => (
            <Button
              key={query}
              variant="outline"
              size="sm"
              className="h-7 text-[11px]"
              onClick={() => send(query)}
            >
              {query}
            </Button>
          ))}
        </div>

        <label htmlFor="copilot-input" className="sr-only">
          Ask AI Assist
        </label>
        <div className="flex items-center gap-2">
          <input
            id="copilot-input"
            name="copilotPrompt"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') return
              event.preventDefault()
              handleSubmit()
            }}
            autoComplete="off"
            placeholder={getContextPromptHint(pageContext)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button onClick={handleSubmit} disabled={!input.trim()}>
            Send
          </Button>
        </div>
        {lastAssistantMessage?.confidence !== undefined ? (
          <p className="mt-2 text-[11px] text-muted-foreground">
            Last response confidence: {Math.round(lastAssistantMessage.confidence * 100)}%
          </p>
        ) : null}
      </div>
    </aside>
  )
}
