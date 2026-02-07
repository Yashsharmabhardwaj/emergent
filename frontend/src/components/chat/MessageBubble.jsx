import React from 'react';
import { Copy, User, Bot, Check } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { cn } from '../../lib/utils';

const MessageBubble = ({ message, isUser }) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content || message.response);
      setCopied(true);
      toast({
        description: "Message copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy message",
      });
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div
      data-testid={isUser ? "user-message" : "ai-message"}
      className={cn(
        "flex gap-3 group animate-in fade-in-0 slide-in-from-bottom-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-purple-600"
            : "bg-gradient-to-br from-emerald-500 to-teal-600"
        )}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn("flex-1 max-w-[80%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-4 py-3 shadow-sm",
            isUser
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              : "bg-white border border-gray-200"
          )}
        >
          {/* Message Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className={cn("text-xs font-medium", isUser ? "text-blue-100" : "text-gray-500")}>
              {isUser ? "You" : "AI Assistant"}
            </span>
            {message.phase && !isUser && (
              <Badge variant="secondary" className="text-xs">
                {message.phase}
              </Badge>
            )}
          </div>

          {/* Message Text */}
          <p
            className={cn(
              "text-sm leading-relaxed whitespace-pre-wrap break-words",
              isUser ? "text-white" : "text-gray-800"
            )}
          >
            {isUser ? message.content : message.response}
          </p>

          {/* Message Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className={cn("text-xs", isUser ? "text-blue-100" : "text-gray-400")}>
              {formatTime(message.created_at)}
            </span>

            {/* Copy Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className={cn(
                "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                isUser ? "hover:bg-white/20" : "hover:bg-gray-100"
              )}
            >
              {copied ? (
                <Check className={cn("h-3 w-3", isUser ? "text-white" : "text-gray-600")} />
              ) : (
                <Copy className={cn("h-3 w-3", isUser ? "text-white" : "text-gray-600")} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
