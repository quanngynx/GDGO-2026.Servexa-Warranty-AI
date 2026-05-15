import React from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Laptop, Moon, Sparkles, Sun } from "lucide-react";
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
import { sidebarData } from "../../../../apps/web/src/components/layout/data/sidebar-data";

/** Keep in sync with apps/web/src/features/ai-copilot/constants.ts */
const SERVEXA_COPILOT_QUICK_PROMPT_EVENT = "servexa:copilot-quick-prompt";

const AI_SUGGESTED_PROMPTS = [
  "Summarize this repair case",
  "Find similar failures",
  "Explain warranty eligibility",
  "Search technical manuals",
  "Detect supply chain risk",
  "Suggest next operational action",
] as const;

export function CommandMenu() {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { open, setOpen } = useSearch();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pe-1">
          <CommandEmpty>No results found.</CommandEmpty>
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

                return navItem.items?.map((subItem, i) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${i}`}
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
          <CommandGroup heading="AI suggested prompts">
            {AI_SUGGESTED_PROMPTS.map((query) => (
              <CommandItem
                key={query}
                value={`copilot-${query}`}
                onSelect={() => {
                  runCommand(() => {
                    window.dispatchEvent(
                      new CustomEvent(SERVEXA_COPILOT_QUICK_PROMPT_EVENT, { detail: query }),
                    );
                  });
                }}
              >
                <Sparkles className="size-3.5 text-ai-primary" />
                {query}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="AI Quick Actions">
            <CommandItem
              onSelect={() => {
                runCommand(() => navigate({ to: "/" }));
              }}
            >
              <Sparkles className="size-3.5 text-ai-primary" />
              Open AI Command Center
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => navigate({ to: "/ai" }));
              }}
            >
              <Sparkles className="size-3.5 text-ai-primary" />
              Open AI Chat
            </CommandItem>
            <CommandItem
              onSelect={() => {
                runCommand(() => navigate({ to: "/repair-cases-management" }));
              }}
            >
              <Sparkles className="size-3.5 text-ai-primary" />
              Find Similar Repair Cases
            </CommandItem>
          </CommandGroup>
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
