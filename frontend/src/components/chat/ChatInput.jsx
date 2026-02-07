import React, { useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { cn } from '../../lib/utils';

const ChatInput = ({ value, onChange, onSubmit, loading, placeholder }) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading && value.trim()) {
        onSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="relative">
      <div className="relative flex items-end gap-2 p-4 bg-white border border-gray-200 rounded-2xl shadow-lg">
        <Textarea
          ref={textareaRef}
          data-testid="chat-input"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Type your message here... (Press Enter to send, Shift+Enter for new line)"}
          disabled={loading}
          className={cn(
            "min-h-[50px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
            "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          )}
          rows={1}
        />
        
        <Button
          type="submit"
          data-testid="send-message-btn"
          disabled={loading || !value.trim()}
          size="icon"
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl",
            "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
            "transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-white" />
          ) : (
            <Send className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>
      
      {/* Hint text */}
      <p className="text-xs text-gray-500 mt-2 px-1">
        Press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Enter</kbd> to send, 
        <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded ml-1">Shift + Enter</kbd> for new line
      </p>
    </form>
  );
};

export default ChatInput;
