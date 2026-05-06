import { Button } from '@servexa-warranty-ai/ui/components/button';
import { Textarea } from '@servexa-warranty-ai/ui/components/textarea';
import { Send, Paperclip } from 'lucide-react';
import { useState, useRef, type KeyboardEvent, type FormEvent } from 'react';

interface CopilotInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  suggestedQueries?: string[];
}

export function CopilotInput({ 
  onSend, 
  isLoading, 
  placeholder = 'Ask anything...',
  suggestedQueries = [],
}: CopilotInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (query: string) => {
    onSend(query);
  };

  return (
    <div className="border-t border-border bg-background/50 p-3">
      {/* Suggested queries - only show when no messages */}
      {suggestedQueries.length > 0 && !isLoading && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {suggestedQueries.map((query, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(query)}
              className="text-xs px-2.5 py-1.5 rounded-full bg-ai-primary/10 text-ai-primary hover:bg-ai-primary/20 transition-colors truncate max-w-full"
            >
              {query}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[40px] max-h-[120px] resize-none pr-10 text-sm bg-muted/50 border-border/50 focus:border-ai-primary/50"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 bottom-1 h-7 w-7 text-muted-foreground hover:text-foreground"
            title="Attach file"
            disabled
          >
            <Paperclip className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          type="submit"
          size="icon"
          className="h-10 w-10 bg-ai-primary hover:bg-ai-primary/90 shrink-0"
          disabled={!input.trim() || isLoading}
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>

      <p className="text-[10px] text-muted-foreground mt-2 text-center">
        AI responses are evidence-based. Always verify critical information.
      </p>
    </div>
  );
}
