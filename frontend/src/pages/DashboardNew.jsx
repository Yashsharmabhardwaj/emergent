import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Skeleton } from '../components/ui/skeleton';
import { useToast } from '../hooks/use-toast';
import ConversationList from '../components/chat/ConversationList';
import MessageBubble from '../components/chat/MessageBubble';
import ChatInput from '../components/chat/ChatInput';
import { User, LogOut, Settings, BarChart3, Menu, X, Sparkles } from 'lucide-react';
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
      const response = await axios.get(`${API_BASE_URL}/api/conversations`);
      setConversations(response.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setPrompt('');
    setLoading(true);

    try {
      const payload = { content: userMessage };
      if (activeConversationId) {
        payload.conversation_id = activeConversationId;
      }

      const response = await axios.post(`${API_BASE_URL}/api/prompts`, payload);
      
      // If new conversation, set it as active
      if (!activeConversationId) {
        setActiveConversationId(response.data.conversation_id);
      }

      // Refresh conversations and messages
      await fetchConversations();
      await fetchMessages(response.data.conversation_id);

      toast({
        description: 'Message sent successfully',
      });
    } catch (err) {
      console.error('Failed to submit prompt:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.detail || 'Failed to send message',
      });
      setPrompt(userMessage); // Restore the message
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
      await axios.patch(`${API_BASE_URL}/api/conversations/${id}`, {
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

  const handleDeleteConversation = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/conversations/${id}`);
      if (activeConversationId === id) {
        handleNewConversation();
      }
      await fetchConversations();
      toast({
        description: 'Conversation deleted successfully',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete conversation',
      });
    }
  };

  const handlePinConversation = async (id, isPinned) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/conversations/${id}`, {
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
      await axios.patch(`${API_BASE_URL}/api/conversations/${id}`, {
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
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
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
