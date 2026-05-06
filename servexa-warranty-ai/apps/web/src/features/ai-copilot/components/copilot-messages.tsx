import { ScrollArea } from '@servexa-warranty-ai/ui/components/scroll-area';
import { User, Sparkles } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Streamdown } from 'streamdown';
import type { AIAction, CopilotMessage } from '../types';
import { CopilotActions } from './copilot-actions';
import { CopilotSources } from './copilot-sources';

interface CopilotMessagesProps {
  messages: CopilotMessage[];
  isLoading: boolean;
  onAction: (action: AIAction) => void;
}

function MessageBubble({ 
  message, 
  onAction 
}: { 
  message: CopilotMessage; 
  onAction: (action: AIAction) => void;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div 
        className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${
          isUser 
            ? 'bg-primary/20 text-primary' 
            : 'bg-ai-primary/20 text-ai-primary'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>
      
      <div 
        className={`flex-1 min-w-0 ${isUser ? 'text-right' : ''}`}
      >
        <div 
          className={`inline-block rounded-lg px-3 py-2 text-sm ${
            isUser 
              ? 'bg-primary text-primary-foreground ml-8' 
              : 'bg-muted/70 text-foreground mr-4'
          }`}
        >
          {message.isStreaming ? (
            <Streamdown isAnimating={true}>
              {message.content}
            </Streamdown>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-1 mr-4">
            <CopilotSources 
              sources={message.sources} 
              confidence={message.confidence} 
            />
          </div>
        )}
        
        {!isUser && message.actions && message.actions.length > 0 && !message.isStreaming && (
          <div className="mr-4">
            <CopilotActions actions={message.actions} onAction={onAction} />
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-ai-primary/20 text-ai-primary shrink-0">
        <Sparkles className="w-4 h-4 animate-pulse" />
      </div>
      <div className="flex items-center gap-1 px-3 py-2">
        <span className="w-2 h-2 rounded-full bg-ai-primary/60 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-ai-primary/60 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-ai-primary/60 animate-bounce" />
      </div>
    </div>
  );
}

export function CopilotMessages({ messages, isLoading, onAction }: CopilotMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollRef}>
      <div className="space-y-4 py-4">
        {messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            onAction={onAction}
          />
        ))}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <LoadingIndicator />
        )}
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
