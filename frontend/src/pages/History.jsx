import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useToast } from '../hooks/use-toast';
import { ArrowLeft, Search, MessageSquare, Archive, Trash2, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const History = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [archivedConversations, setArchivedConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const [activeResponse, archivedResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/conversations?archived=false`),
        axios.get(`${API_BASE_URL}/api/conversations?archived=true`),
      ]);
      setConversations(activeResponse.data);
      setArchivedConversations(archivedResponse.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load conversations',
      });
    }
    setLoading(false);
  };

  const handleArchive = async (id, isArchived) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/conversations/${id}`, {
        is_archived: !isArchived,
      });
      await fetchConversations();
      toast({
        description: isArchived ? 'Conversation unarchived' : 'Conversation archived',
      });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update conversation',
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/conversations/${id}`);
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

  const handleView = (id) => {
    navigate(`/dashboard`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filterConversations = (convs) => {
    if (!searchQuery) return convs;
    return convs.filter(
      (conv) =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const ConversationCard = ({ conversation, isArchived }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{conversation.title}</CardTitle>
            <CardDescription className="line-clamp-2">{conversation.preview}</CardDescription>
          </div>
          {conversation.is_pinned && (
            <Badge variant="secondary" className="ml-2">
              Pinned
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              {conversation.message_count} messages
            </span>
            <span>{formatDate(conversation.updated_at)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(conversation.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleArchive(conversation.id, isArchived)}
            >
              <Archive className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(conversation.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Conversation History</h1>
              <p className="text-sm text-gray-600">View and manage all your conversations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="active">
              Active ({filterConversations(conversations).length})
            </TabsTrigger>
            <TabsTrigger value="archived">
              Archived ({filterConversations(archivedConversations).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading conversations...</p>
              </div>
            ) : filterConversations(conversations).length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'No conversations found' : 'No active conversations'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filterConversations(conversations).map((conv) => (
                  <ConversationCard key={conv.id} conversation={conv} isArchived={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="archived">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading archived conversations...</p>
              </div>
            ) : filterConversations(archivedConversations).length === 0 ? (
              <div className="text-center py-12">
                <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? 'No conversations found' : 'No archived conversations'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filterConversations(archivedConversations).map((conv) => (
                  <ConversationCard key={conv.id} conversation={conv} isArchived={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;