import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPrompts();
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversationId) {
      fetchPrompts(activeConversationId);
    } else {
      fetchPrompts();
    }
  }, [activeConversationId]);

  const fetchPrompts = async (conversationId = null) => {
    try {
      const url = conversationId
        ? `${API_BASE_URL}/api/prompts?conversation_id=${conversationId}`
        : `${API_BASE_URL}/api/prompts`;
      const response = await axios.get(url);
      setPrompts(response.data);
    } catch (err) {
      console.error('Failed to fetch prompts:', err);
    }
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
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = { content: prompt.trim() };
      if (activeConversationId) {
        payload.conversation_id = activeConversationId;
      }
      const response = await axios.post(`${API_BASE_URL}/api/prompts`, payload);

      setActiveConversationId(response.data.conversation_id);
      await fetchPrompts(response.data.conversation_id);
      await fetchConversations();
      setPrompt('');
      setSuccess(
        response.data.phase === 'discovery'
          ? 'The PM agent has asked clarifying questions. Reply above to get the full product plan.'
          : 'Product plan generated!'
      );
    } catch (err) {
      console.error('Failed to submit prompt:', err);
      setError(err.response?.data?.detail || 'Failed to submit prompt. Please try again.');
    }

    setLoading(false);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setPrompt('');
    setError('');
    setSuccess('');
    fetchPrompts();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const selectConversation = (id) => {
    setActiveConversationId(id);
    setSuccess('');
  };

  const totalPrompts = prompts.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Manager Agent</h1>
              <p className="text-gray-600">Welcome back, {user?.username}! Describe your idea to get a product plan.</p>
            </div>
            <Button onClick={logout} variant="outline">
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Prompt Input Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Describe Your Product Idea</CardTitle>
                    <CardDescription>
                      {activeConversationId
                        ? 'Reply to continue the conversation and get the full product plan'
                        : 'Start a new idea or pick a conversation below to continue'}
                    </CardDescription>
                  </div>
                  {activeConversationId && (
                    <Button variant="outline" size="sm" onClick={handleNewConversation}>
                      New conversation
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitPrompt} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert>
                      <AlertDescription>{success}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="prompt">
                      {activeConversationId ? 'Your reply' : 'Your idea'}
                    </Label>
                    <Textarea
                      id="prompt"
                      placeholder={
                        activeConversationId
                          ? "Answer the PM's questions or add more context..."
                          : 'e.g. Make a clone of Zomato for tier-2 cities'
                      }
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !prompt.trim()}
                  >
                    {loading ? 'Processing...' : activeConversationId ? 'Reply' : 'Submit'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* User Info & Conversations */}
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
                <CardDescription>
                  {totalPrompts} message{totalPrompts !== 1 ? 's' : ''} in current view
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conversations.length === 0 ? (
                  <p className="text-gray-500 text-sm">No conversations yet. Start one above!</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {conversations.map((conv) => (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => selectConversation(conv.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          activeConversationId === conv.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <p className="text-sm text-gray-900 truncate">{conv.preview}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {conv.message_count} message{conv.message_count !== 1 ? 's' : ''} ·{' '}
                          {formatDate(conv.updated_at)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-sm text-gray-600">{user?.email}</p>
                  <p className="text-xs text-gray-500">Member since {user?.created_at ? formatDate(user.created_at) : 'N/A'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompts History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Current Thread</CardTitle>
              <CardDescription>
                {activeConversationId
                  ? 'Messages in this conversation'
                  : 'All prompts (select a conversation to filter)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prompts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {activeConversationId ? 'No messages in this conversation.' : 'No prompts yet. Describe your product idea above!'}
                </p>
              ) : (
                <div className="space-y-4">
                  {prompts.map((promptItem) => (
                    <div key={promptItem.id} className="border rounded-lg p-4 bg-white space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-gray-900">You</h4>
                        <div className="flex items-center gap-2">
                          {promptItem.phase && (
                            <Badge variant="secondary" className="text-xs">
                              {promptItem.phase}
                            </Badge>
                          )}
                          <span className="text-xs text-gray-500">
                            {formatDate(promptItem.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700">{promptItem.content}</p>
                      {promptItem.response && (
                        <>
                          <div className="border-t pt-3 mt-3">
                            <h4 className="font-medium text-gray-900 mb-2">PM Agent</h4>
                            <div
                              className="text-gray-600 bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap font-sans"
                              style={{ fontFamily: 'inherit' }}
                            >
                              {promptItem.response}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
