import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import ConversationList from '../components/chat/ConversationList';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import { User, LogOut, Settings, BarChart3, Menu, X, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    setLoadingMessages(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/prompts?conversation_id=${conversationId}`
      );
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load messages',
      });
    }
    setLoadingMessages(false);
  };

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prompts/conversations`);
      setConversations(response.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessageContent = prompt.trim();
    setPrompt('');
    setLoading(true);

    // Optimistic update: Add user message immediately
    const optimisticMessage = {
      id: Date.now(), // Temporary ID
      content: userMessageContent,
      role: 'user',
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const payload = { content: userMessageContent };
      if (activeConversationId) {
        payload.conversation_id = activeConversationId;
      }

      const response = await axios.post(`${API_BASE_URL}/api/prompts`, payload);

      // If new conversation, set it as active
      if (!activeConversationId) {
        setActiveConversationId(response.data.conversation_id);
        // We need to fetch conversations to show the new one in the list
        await fetchConversations();
      }

      // Append AI response to messages
      // We need to match the format of the response from the backend
      // Assuming response.data is the full message object or similar
      // If response.data is just the creation response, we might need to adjust based on API
      // Let's assume response.data returns the created prompt object which matches the structure
      // we need to verify the structure based on existing code. 
      // Existing code used fetchMessages which replaced everything.
      // Let's look at fetchMessages: setMessages(response.data)
      // So response.data is an array of messages? 
      // Wait, axios.post usually returns the specific created resource.
      // If the backend returns the *newly created* message object, we can append it.
      // If it returns the *entire* conversation, we should setMessages(response.data).
      // Given the user wants to avoid "refresh", appending is better if possible.
      // But if the backend returns the list, we have to use it or find the new item.

      // Let's look at how fetchMessages works:
      // const response = await axios.get(...) -> setMessages(response.data)
      // So /api/prompts sends back an array?
      // POST /api/prompts probably returns the created prompt object.
      // Let's trust that we can append the result or the last item of the result if it returns list.
      // Actually, looking at standard patterns, POST usually returns the created item.
      // But let's verify what `fetchMessages` expects. It expects an array.
      // If I append `response.data`, it should work if it's a single message object.

      // However, we added an optimistic message. We should replace it or update it with real data?
      // Simpler approach for now to avoid ID collisions:
      // remove the optimistic message and append the real one?
      // Or just append the response part?

      // The backend likely returns the processed prompt object which includes response.
      // Let's try appending the response data.

      const newBackendMessage = response.data;

      // If the backend response doesn't include the 'response' field (AI answer) immediately (streaming?), 
      // this might be checking for that. But assuming standard REST:

      setMessages(prev => {
        // Remove the optimistic message (identified by temp ID) and add real one
        // OR just keep optimistic if it matches well enough?
        // Better to swap to ensure real IDs are used for subsequent interactions
        const filtered = prev.filter(m => m.id !== optimisticMessage.id);
        return [...filtered, newBackendMessage];
      });

    } catch (err) {
      console.error('Failed to submit prompt:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to send message',
      });
      // Restore the message in input if failed
      setPrompt(userMessageContent);
      // Remove optimistic message
      setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
    }

    setLoading(false);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setMessages([]);
    setPrompt('');
  };

  const handleSelectConversation = (id) => {
    setActiveConversationId(id);
  };

  const handleRenameConversation = async (id, newTitle) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/prompts/conversations/${id}`, {
        title: newTitle,
      });
      await fetchConversations();
      toast({
        description: 'Conversation renamed successfully',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to rename conversation',
      });
    }
  };

  const handleDeleteConversation = async (ids) => {
    // Determine if it's a single ID or array
    const isBulk = Array.isArray(ids);
    const idList = isBulk ? ids : [ids];

    // Confirmation is now handled in ConversationList.jsx
    // if (!window.confirm(isBulk 
    //   ? `Are you sure you want to delete ${ids.length} conversations?` 
    //   : 'Are you sure you want to delete this conversation?'
    // )) return;

    try {
      if (isBulk) {
        await axios.delete(`${API_BASE_URL}/api/prompts/conversations`, {
          data: idList, // Send list of IDs in body
        });
      } else {
        await axios.delete(`${API_BASE_URL}/api/prompts/conversations/${ids}`);
      }

      // If active conversation is in deleted list, clear it
      if (activeConversationId && idList.includes(activeConversationId)) {
        handleNewConversation();
      }

      await fetchConversations();
      toast({
        description: isBulk ? 'Conversations deleted successfully' : 'Conversation deleted successfully',
      });
    } catch (err) {
      console.error('Failed to delete conversation(s):', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete conversation(s)',
      });
    }
  };

  const handlePinConversation = async (id, isPinned) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/prompts/conversations/${id}`, {
        is_pinned: isPinned,
      });
      await fetchConversations();
      toast({
        description: isPinned ? 'Conversation pinned' : 'Conversation unpinned',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update conversation',
      });
    }
  };

  const handleArchiveConversation = async (id, isArchived) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/prompts/conversations/${id}`, {
        is_archived: isArchived,
      });
      await fetchConversations();
      toast({
        description: isArchived ? 'Conversation archived' : 'Conversation unarchived',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update conversation',
      });
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100" data-testid="dashboard">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 overflow-hidden`}
      >
        <ConversationList
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
          onPinConversation={handlePinConversation}
          onArchiveConversation={handleArchiveConversation}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              data-testid="toggle-sidebar-btn"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Product Manager
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button variant="ghost" size="icon" data-testid="profile-btn">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost" size="icon" data-testid="settings-btn">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost" size="icon" data-testid="history-btn">
                <BarChart3 className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={logout} data-testid="logout-btn">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-6 py-4">
          {loadingMessages ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="mb-6">
                  <Sparkles className="h-16 w-16 mx-auto text-purple-500 mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Start a New Conversation
                  </h2>
                  <p className="text-gray-600">
                    Describe your product idea and I'll help you create a comprehensive product plan
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-3 text-left">
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-700">
                      "Build a food delivery app for tier-2 cities"
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-700">
                      "Create a fitness tracking SaaS for gyms"
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                    <p className="text-sm text-gray-700">
                      "Design an AI-powered learning platform"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto pb-4">
              {messages.map((message) => (
                <React.Fragment key={message.id}>
                  {/* User message */}
                  <MessageBubble message={message} isUser={true} />
                  {/* AI response */}
                  {message.response && <MessageBubble message={message} isUser={false} />}
                </React.Fragment>
              ))}

              {/* Loading indicator for AI response */}
              {loading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 max-w-[85%]">
                      {/* Skeleton loading lines */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%]"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%] w-4/5"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%] w-3/4"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-full animate-shimmer bg-[length:200%_100%] w-5/6"></div>
                      </div>
                      {/* Thinking text below skeleton */}
                      <div className="flex items-center gap-2 text-gray-500 mt-3">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span className="text-xs">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onSubmit={handleSubmitPrompt}
              loading={loading}
              placeholder={
                activeConversationId
                  ? "Continue the conversation..."
                  : "Describe your product idea..."
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
