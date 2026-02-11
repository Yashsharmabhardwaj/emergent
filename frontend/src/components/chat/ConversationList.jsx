import React, { useState } from 'react';
import { MessageSquare, Search, Trash2, Archive, Pin, MoreVertical, Edit2, ListChecks } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';

const ConversationList = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onDeleteConversation, // Now handles single or bulk
  onPinConversation,
  onArchiveConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedConv, setSelectedConv] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Delete Confirmation State
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemsToDelete, setItemsToDelete] = useState([]); // Array of IDs

  const filteredConversations = (conversations || []).filter((conv) =>
    (conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
    (conv.preview?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleRename = (conv) => {
    setSelectedConv(conv);
    setNewTitle(conv.title);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = () => {
    if (selectedConv && newTitle.trim()) {
      onRenameConversation(selectedConv.id, newTitle.trim());
      setRenameDialogOpen(false);
      setSelectedConv(null);
      setNewTitle('');
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredConversations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredConversations.map(c => c.id));
    }
  };

  // Triggered by Bulk Delete button
  const handleBulkDeleteClick = () => {
    if (selectedIds.length === 0) return;
    setItemsToDelete(selectedIds);
    setDeleteDialogOpen(true);
  };

  // Triggered by Single Delete menu item
  const handleSingleDeleteClick = (id) => {
    setItemsToDelete([id]);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemsToDelete.length > 0) {
      // If it's a single item array, pass just the ID if the parent expects that,
      // OR pass the array if the parent can handle it.
      // Based on my previous edit to DashboardNew.jsx, handleSingleDeleteConversation handles both.
      // But let's check. DashboardNew.jsx: handleDeleteConversation(ids) handles isBulk = Array.isArray(ids).
      // So passing [id] is fine.

      // Wait, if I pass [id], it treats it as bulk.
      // If I pass id, it treats it as single.
      // The backend endpoints are different for single vs bulk (though functionally similar).
      // Single: DELETE /conversations/{id}
      // Bulk: DELETE /conversations (body: [ids])

      // To keep it consistent, if setItemsToDelete has 1 item, we can pass it as single ID 
      // or array. DashboardNew handles both.
      // However, for single item, we might prefer the single endpoint.
      if (itemsToDelete.length === 1) {
        onDeleteConversation(itemsToDelete[0]);
      } else {
        onDeleteConversation(itemsToDelete);
      }

      setDeleteDialogOpen(false);
      setItemsToDelete([]);
      if (isSelectionMode) {
        setIsSelectionMode(false);
        setSelectedIds([]);
      }
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {isSelectionMode ? `${selectedIds.length} Selected` : 'Conversations'}
          </h2>
          <div className="flex gap-2">
            {isSelectionMode ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAll}
                  className="text-xs"
                >
                  {selectedIds.length === filteredConversations.length ? 'Deselect All' : 'Select All'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDeleteClick}
                  disabled={selectedIds.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleSelectionMode}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSelectionMode}
                  title="Select conversations"
                >
                  <ListChecks className="h-5 w-5 text-gray-500" />
                </Button>
                <Button
                  data-testid="new-conversation-btn"
                  onClick={onNewConversation}
                  size="sm"
                  className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  New
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        {!isSelectionMode && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              data-testid="search-conversations"
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-50 border-gray-200"
            />
          </div>
        )}
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 px-4">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {searchQuery ? 'Try a different search' : 'Start a new conversation to begin'}
              </p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                data-testid={`conversation-${conv.id}`}
                className={cn(
                  "group relative rounded-lg p-3 cursor-pointer transition-all duration-200",
                  "hover:bg-white hover:shadow-sm",
                  activeConversationId === conv.id && !isSelectionMode
                    ? "bg-white shadow-sm border border-blue-200"
                    : "bg-transparent border border-transparent",
                  isSelectionMode && selectedIds.includes(conv.id)
                    ? "bg-blue-50 border-blue-200"
                    : ""
                )}
                onClick={() => {
                  if (isSelectionMode) {
                    toggleSelection(conv.id);
                  } else {
                    onSelectConversation(conv.id);
                  }
                }}
              >
                {/* Selection Checkbox */}
                {isSelectionMode && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(conv.id)}
                      onChange={() => { }} // Handle click on parent
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Pin indicator */}
                {conv.is_pinned && !isSelectionMode && (
                  <Pin className="absolute top-2 right-2 h-3 w-3 text-blue-500 fill-current" />
                )}

                <div className={cn("flex items-start justify-between gap-2", isSelectionMode ? "pl-8" : "")}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {conv.title || 'Untitled Conversation'}
                      </h3>
                      {conv.is_pinned && (
                        <Badge variant="secondary" className="text-xs">
                          Pinned
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-1">{conv.preview || 'No preview available'}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{conv.message_count || 0} messages</span>
                      <span>•</span>
                      <span>{formatDate(conv.updated_at || new Date().toISOString())}</span>
                    </div>
                  </div>

                  {/* Actions Menu */}
                  {!isSelectionMode && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleRename(conv);
                        }}>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onPinConversation(conv.id, !conv.is_pinned);
                        }}>
                          <Pin className="h-4 w-4 mr-2" />
                          {conv.is_pinned ? 'Unpin' : 'Pin'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          onArchiveConversation(conv.id, !conv.is_archived);
                        }}>
                          <Archive className="h-4 w-4 mr-2" />
                          {conv.is_archived ? 'Unarchive' : 'Archive'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSingleDeleteClick(conv.id);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Rename Dialog */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Conversation</DialogTitle>
            <DialogDescription>
              Give this conversation a new name to help you find it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="title">Conversation Title</Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new title..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameSubmit} disabled={!newTitle.trim()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {itemsToDelete.length} conversation{itemsToDelete.length !== 1 ? 's' : ''} and remove {itemsToDelete.length !== 1 ? 'them' : 'it'} from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemsToDelete([])}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConversationList;
