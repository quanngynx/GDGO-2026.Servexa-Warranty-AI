import { useEffect, useState, useCallback } from 'react';
import { ArrowRight, Clock, Lightbulb } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@servexa-warranty-ai/ui/components/command';
import { Badge } from '@servexa-warranty-ai/ui/components/badge';
import { mockSearchResults, mockSuggestions } from './mock-data';
import type { SearchResult, AISearchSuggestion } from './types';
import { useTranslation } from "react-i18next";

interface AISearchDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const typeColors: Record<SearchResult['type'], { bg: string; text: string }> = {
  repair_case: { bg: 'bg-blue-500/20', text: 'text-blue-600' },
  customer: { bg: 'bg-purple-500/20', text: 'text-purple-600' },
  part: { bg: 'bg-amber-500/20', text: 'text-amber-600' },
  manual: { bg: 'bg-green-500/20', text: 'text-green-600' },
  error_code: { bg: 'bg-red-500/20', text: 'text-red-600' },
  knowledge_article: { bg: 'bg-cyan-500/20', text: 'text-cyan-600' },
  technician: { bg: 'bg-pink-500/20', text: 'text-pink-600' },
};

const typeLabels: Record<SearchResult['type'], string> = {
  repair_case: 'Case',
  customer: 'Customer',
  part: 'Part',
  manual: 'Manual',
  error_code: 'Error',
  knowledge_article: 'Article',
  technician: 'Technician',
};

function SearchResultItem({
  result,
  onSelect
}: {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}) {
    const { t } = useTranslation();
  const colors = typeColors[result.type];
  const label = typeLabels[result.type];

  return (
    <CommandItem value={result.id} onSelect={() => onSelect(result)} className="cursor-pointer">
      <div className="flex items-start gap-3 w-full py-1">
        <div className={`flex items-center justify-center w-8 h-8 rounded-md shrink-0 ${colors.bg}`}>
          <span className={`text-xs font-semibold ${colors.text}`}>
            {label.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{result.title}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
              {Math.round(result.relevanceScore * 100)}%
            </Badge>
          </div>
          {result.subtitle && (
            <p className="text-xs text-muted-foreground truncate">
              {result.subtitle}
            </p>
          )}
          {result.highlight && (
            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
              {result.highlight}
            </p>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      </div>
    </CommandItem>
  );
}

function SuggestionItem({
  suggestion,
  onSelect
}: {
  suggestion: AISearchSuggestion;
  onSelect: (query: string) => void;
}) {
    const { t } = useTranslation();
  const isRecent = suggestion.type === 'recent';

  return (
    <CommandItem
      value={suggestion.id}
      onSelect={() => onSelect(suggestion.query)}
      className="cursor-pointer"
    >
      <div className="flex items-center gap-2 w-full">
        {isRecent ? (
          <Clock className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Lightbulb className="w-4 h-4 text-ai-accent" />
        )}
        <div className="flex-1">
          <span className="text-sm">{suggestion.query}</span>
          {suggestion.description && (
            <p className="text-xs text-muted-foreground">{suggestion.description}</p>
          )}
        </div>
      </div>
    </CommandItem>
  );
}

export function AISearchDialog({ open: controlledOpen, onOpenChange }: AISearchDialogProps) {
    const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Handle CMD+K keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, setOpen]);

  const handleSelect = useCallback((result: SearchResult) => {
    // Navigate to the result
    if (result.url) {
      window.location.href = result.url;
    }
    setOpen(false);
    setSearchQuery('');
  }, [setOpen]);

  const handleSuggestionSelect = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Filter results based on search query
  const filteredResults = searchQuery.trim()
    ? mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.highlight?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  // Group results by type
  const groupedResults = Object.entries(
    filteredResults.reduce((acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    }, {} as Record<SearchResult['type'], SearchResult[]>)
  );

  // Get suggestions
  const recentSuggestions = mockSuggestions.filter(s => s.type === 'recent');
  const suggestedQueries = mockSuggestions.filter(s => s.type === 'suggested');

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="sm:max-w-4xl">
      <CommandInput
        placeholder={t("Search repairs, parts, manuals... (⌘K)")}
        value={searchQuery}
        onValueChange={setSearchQuery}
        className="text-sm"
      />

      <CommandList>
        {!searchQuery && (
          <>
            {/* Recent Searches */}
            {recentSuggestions.length > 0 && (
              <CommandGroup heading="Recent">
                {recentSuggestions.map(suggestion => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    onSelect={handleSuggestionSelect}
                  />
                ))}
              </CommandGroup>
            )}

            {/* Suggested Queries */}
            {suggestedQueries.length > 0 && (
              <CommandGroup heading="Suggestions">
                {suggestedQueries.map(suggestion => (
                  <SuggestionItem
                    key={suggestion.id}
                    suggestion={suggestion}
                    onSelect={handleSuggestionSelect}
                  />
                ))}
              </CommandGroup>
            )}
          </>
        )}

        {searchQuery && filteredResults.length === 0 && (
          <CommandEmpty>{t("No results found.")}</CommandEmpty>
        )}

        {/* Search Results Grouped by Type */}
        {groupedResults.map(([type, results]) => (
          <CommandGroup key={type} heading={typeLabels[type as SearchResult['type']]}>
            {results.map(result => (
              <SearchResultItem
                key={result.id}
                result={result}
                onSelect={handleSelect}
              />
            ))}
          </CommandGroup>
        ))}
      </CommandList>

      {/* Footer help text */}
      {!searchQuery && (
        <div className="border-t border-border/50 px-4 py-3 text-[11px] text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-[10px] font-mono">
              {t("⌘K")}</kbd>
            <span>{t("to open • ESC to close")}</span>
          </div>
        </div>
      )}
    </CommandDialog>
  );
}