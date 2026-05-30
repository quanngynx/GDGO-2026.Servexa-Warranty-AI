import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@servexa-warranty-ai/ui/components/command'
import { Sparkles } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useSearch } from '@servexa-warranty-ai/ui/contexts/search-provider'
import { useCopilot } from '../hooks/use-copilot'

export function AICommandSearch() {
  const navigate = useNavigate()
  const { open, setOpen } = useSearch()
  const { pageContext, suggestedQueries, send } = useCopilot()

  const contextRoute = useMemo(() => {
    if (pageContext.type === 'repair_case') return '/_authenticated/(GENERAL)/repair-cases-management'
    if (pageContext.type === 'inventory') return '/_authenticated/(SYSTEM-ADMINISTRATION)/products-management'
    if (pageContext.type === 'customer') return '/_authenticated/(SYSTEM-ADMINISTRATION)/customer-management'
    return '/_authenticated/'
  }, [pageContext.type])

  const run = (handler: () => void) => {
    setOpen(false)
    handler()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="AI Search" description="Search actions and ask AI">
      <CommandInput placeholder="Ask AI, navigate, or run an action…" />
      <CommandList>
        <CommandEmpty>No AI results.</CommandEmpty>
        <CommandGroup heading="AI Suggested Queries">
          {suggestedQueries.map((query) => (
            <CommandItem
              key={query}
              value={`ai-${query}`}
              onSelect={() => run(() => send(query))}
            >
              <Sparkles className="h-3.5 w-3.5 text-ai-primary" aria-hidden="true" />
              <span>{query}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Navigation">
          <CommandItem onSelect={() => run(() => navigate({ to: '/_authenticated/' }))}>
            AI Command Center
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: '/ai' }))}>
            AI Chat Sandbox
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run(() => navigate({ to: contextRoute }))}>
            Current Context Page
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
