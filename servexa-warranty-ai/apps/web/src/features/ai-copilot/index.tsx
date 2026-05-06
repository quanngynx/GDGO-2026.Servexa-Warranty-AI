import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Sparkles, X } from 'lucide-react';
import { CopilotEmptyState } from './components/copilot-empty-state';
import { CopilotHeader } from './components/copilot-header';
import { CopilotInput } from './components/copilot-input';
import { CopilotMessages } from './components/copilot-messages';
import { useCopilot } from './hooks/use-copilot';
import { getContextPromptHint } from './hooks/use-page-context';

export function AICopilotPanel() {
  const {
    isOpen,
    isExpanded,
    pageContext,
    messages,
    isLoading,
    suggestedQueries,
    setIsOpen,
    setIsExpanded,
    send,
    reload,
    handleAction,
  } = useCopilot();

  // Collapsed state - show floating button
  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-ai-primary hover:bg-ai-primary/90 shadow-lg shadow-ai-primary/25 z-50"
        size="icon"
      >
        <Sparkles className="w-5 h-5" />
      </Button>
    );
  }

  const panelWidth = isExpanded ? 'w-[480px]' : 'w-[380px]';

  return (
    <>
      {/* Panel */}
      <aside 
        className={`
          ${panelWidth}
          h-full
          flex flex-col
          bg-background
          border-l border-border
          transition-all duration-200
          shrink-0
        `}
      >
        <CopilotHeader
          pageContext={pageContext}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          onClose={() => setIsOpen(false)}
          onReload={reload}
          hasMessages={messages.length > 0}
        />

        {messages.length === 0 ? (
          <CopilotEmptyState pageContext={pageContext} />
        ) : (
          <CopilotMessages
            messages={messages}
            isLoading={isLoading}
            onAction={handleAction}
          />
        )}

        <CopilotInput
          onSend={send}
          isLoading={isLoading}
          placeholder={getContextPromptHint(pageContext)}
          suggestedQueries={messages.length === 0 ? suggestedQueries : []}
        />
      </aside>

      {/* Mobile close overlay */}
      <button
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        aria-label="Close copilot"
      />
    </>
  );
}

// Export types and hooks for use elsewhere
export * from './types';
export { useCopilot } from './hooks/use-copilot';
export { usePageContext, getContextLabel, getContextPromptHint } from './hooks/use-page-context';
