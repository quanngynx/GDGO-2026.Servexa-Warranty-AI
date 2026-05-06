import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { 
  ArrowRight, 
  ChevronRight, 
  Laptop, 
  Moon, 
  Sun,
  Sparkles,
  Wrench,
  User,
  Package,
  BookOpen,
  AlertCircle,
  FileText,
  Users,
  Plus,
  Search,
  Clock,
  Zap,
  BarChart3
} from "lucide-react";
import { useSearch } from "../contexts/search-provider";
import { useTheme } from "../contexts/theme-provider";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@servexa-warranty-ai/ui/components/command";
import { ScrollArea } from "@servexa-warranty-ai/ui/components/scroll-area";
import { Badge } from "@servexa-warranty-ai/ui/components/badge";
import { sidebarData } from "../../../../apps/web/src/components/layout/data/sidebar-data";

// Import AI search mock data
import { mockSearchResults, mockSuggestions, quickActions, searchMockData } from "../../../../apps/web/src/features/ai-search/mock-data";
import type { SearchResult, SearchResultType } from "../../../../apps/web/src/features/ai-search/types";

const typeIcons: Record<SearchResultType, React.ReactNode> = {
  repair_case: <Wrench className="w-4 h-4" />,
  customer: <User className="w-4 h-4" />,
  part: <Package className="w-4 h-4" />,
  manual: <BookOpen className="w-4 h-4" />,
  error_code: <AlertCircle className="w-4 h-4" />,
  knowledge_article: <FileText className="w-4 h-4" />,
  technician: <Users className="w-4 h-4" />,
};

const typeLabels: Record<SearchResultType, string> = {
  repair_case: 'Case',
  customer: 'Customer',
  part: 'Part',
  manual: 'Manual',
  error_code: 'Error',
  knowledge_article: 'KB',
  technician: 'Tech',
};

const typeColors: Record<SearchResultType, string> = {
  repair_case: 'bg-ai-primary/20 text-ai-primary',
  customer: 'bg-operations-teal/20 text-operations-teal',
  part: 'bg-alert-warning/20 text-alert-warning',
  manual: 'bg-ai-accent/20 text-ai-accent',
  error_code: 'bg-alert-critical/20 text-alert-critical',
  knowledge_article: 'bg-muted text-muted-foreground',
  technician: 'bg-alert-success/20 text-alert-success',
};

export function CommandMenu() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();
  const [searchQuery, setSearchQuery] = useState("");

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false);
      setSearchQuery("");
      command();
    },
    [setOpen]
  );

  // Filter results based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchMockData(searchQuery);
  }, [searchQuery]);

  // Filter quick actions based on search query
  const filteredActions = useMemo(() => {
    if (!searchQuery.trim()) return quickActions;
    const lowerQuery = searchQuery.toLowerCase();
    return quickActions.filter(action => 
      action.label.toLowerCase().includes(lowerQuery) ||
      action.keywords.some(kw => kw.includes(lowerQuery))
    );
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      runCommand(() => navigate({ to: result.url }));
    }
  };

  const hasResults = searchResults.length > 0;
  const showSuggestions = !searchQuery.trim();

  return (
    <CommandDialog modal open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setSearchQuery("");
    }}>
      <div className="flex items-center gap-2 px-3 border-b border-border">
        <Sparkles className="w-4 h-4 text-ai-primary shrink-0" />
        <CommandInput 
          placeholder="Search anything or ask AI..." 
          value={searchQuery}
          onValueChange={setSearchQuery}
          className="border-0"
        />
        <Badge variant="secondary" className="text-[10px] px-1.5 shrink-0">
          AI-Powered
        </Badge>
      </div>
      <CommandList>
        <ScrollArea type="hover" className="h-[400px] pe-1">
          {/* Empty state with suggestions */}
          {showSuggestions && (
            <>
              {/* Quick Actions */}
              <CommandGroup heading="Quick Actions">
                {quickActions.map((action) => (
                  <CommandItem
                    key={action.id}
                    value={action.label}
                    onSelect={() => runCommand(() => console.log('Action:', action.action))}
                    className="gap-3"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-ai-primary/10">
                      {action.action === 'create_case' && <Plus className="w-4 h-4 text-ai-primary" />}
                      {action.action === 'find_technician' && <Users className="w-4 h-4 text-ai-primary" />}
                      {action.action === 'check_inventory' && <Package className="w-4 h-4 text-ai-primary" />}
                      {action.action === 'generate_report' && <BarChart3 className="w-4 h-4 text-ai-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                    <Zap className="w-3 h-3 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              {/* Recent & Suggested */}
              <CommandGroup heading="Suggestions">
                {mockSuggestions.slice(0, 5).map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    value={suggestion.query}
                    onSelect={() => setSearchQuery(suggestion.query)}
                    className="gap-2"
                  >
                    {suggestion.type === 'recent' ? (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Search className="w-4 h-4 text-ai-accent" />
                    )}
                    <span className="flex-1">{suggestion.query}</span>
                    {suggestion.description && (
                      <span className="text-xs text-muted-foreground">{suggestion.description}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {/* Search Results */}
          {hasResults && (
            <CommandGroup heading={`${searchResults.length} Results`}>
              {searchResults.map((result) => (
                <CommandItem
                  key={result.id}
                  value={`${result.type}-${result.title}`}
                  onSelect={() => handleResultClick(result)}
                  className="gap-3 py-3"
                >
                  <div className={`flex items-center justify-center w-8 h-8 rounded-md shrink-0 ${typeColors[result.type]}`}>
                    {typeIcons[result.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{result.title}</p>
                      <Badge variant="outline" className="text-[10px] px-1 shrink-0">
                        {typeLabels[result.type]}
                      </Badge>
                    </div>
                    {result.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                    )}
                    {result.highlight && (
                      <p className="text-[11px] text-ai-accent mt-0.5 truncate">{result.highlight}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] text-muted-foreground">
                      {Math.round(result.relevanceScore * 100)}%
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {/* No results */}
          {searchQuery && !hasResults && (
            <CommandEmpty>
              <div className="flex flex-col items-center py-6">
                <Sparkles className="w-8 h-8 text-ai-primary/50 mb-2" />
                <p className="text-sm text-muted-foreground">No results found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search or ask AI
                </p>
              </div>
            </CommandEmpty>
          )}

          <CommandSeparator />

          {/* Navigation */}
          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => navigate({ to: navItem.url }));
                      }}
                    >
                      <div className="flex size-4 items-center justify-center">
                        <ArrowRight className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  );

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => navigate({ to: subItem.url }));
                    }}
                  >
                    <div className="flex size-4 items-center justify-center">
                      <ArrowRight className="size-2 text-muted-foreground/80" />
                    </div>
                    {navItem.title} <ChevronRight /> {subItem.title}
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
          
          <CommandSeparator />
          
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun /> <span>Light</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="scale-90" />
              <span>Dark</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
