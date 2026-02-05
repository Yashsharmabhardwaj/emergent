import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Textarea } from '../components/ui/textarea';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchPrompts();
  }, []);

  const fetchPrompts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/prompts`);
      setPrompts(response.data);
    } catch (error) {
      console.error('Failed to fetch prompts:', error);
    }
  };

  const handleSubmitPrompt = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/api/prompts`, {
        content: prompt,
      });

      setPrompts([response.data, ...prompts]);
      setPrompt('');
      setSuccess('Prompt submitted successfully!');
    } catch (error) {
      console.error('Failed to submit prompt:', error);
      setError('Failed to submit prompt. Please try again.');
    }

    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}!</p>
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
                <CardTitle>Create New Prompt</CardTitle>
                <CardDescription>
                  Enter your prompt below and get an AI-generated response
                </CardDescription>
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
                    <Label htmlFor="prompt">Your Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Enter your prompt here..."
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
                    {loading ? 'Processing...' : 'Submit Prompt'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* User Info Section */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Username</Label>
                  <p className="text-sm text-gray-600">{user?.username}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Member Since</Label>
                  <p className="text-sm text-gray-600">
                    {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Prompts</Label>
                  <p className="text-sm text-gray-600">{prompts.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompts History */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your Prompts History</CardTitle>
              <CardDescription>
                View all your previous prompts and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {prompts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No prompts yet. Create your first prompt above!
                </p>
              ) : (
                <div className="space-y-4">
                  {prompts.map((promptItem) => (
                    <div key={promptItem.id} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">Prompt</h4>
                        <span className="text-xs text-gray-500">
                          {formatDate(promptItem.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{promptItem.content}</p>
                      
                      {promptItem.response && (
                        <>
                          <h4 className="font-medium text-gray-900 mb-2">Response</h4>
                          <p className="text-gray-600 bg-gray-50 p-3 rounded">
                            {promptItem.response}
                          </p>
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