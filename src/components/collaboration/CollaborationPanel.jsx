import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const CollaborationPanel = ({ projectId, onCollaboratorChange }) => {
  const [collaborators, setCollaborators] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [liveChanges, setLiveChanges] = useState([]);

  useEffect(() => {
    setCollaborators([
      { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', avatar: 'SC', status: 'online', role: 'editor' },
      { id: 2, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', status: 'away', role: 'viewer' }
    ]);

    const interval = setInterval(() => {
      setLiveChanges(prev => [
        { id: Date.now(), user: 'Sarah Chen', action: 'edited frame 3', timestamp: Date.now() },
        ...prev.slice(0, 4)
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, [projectId]);

  const handleInvite = () => {
    if (!inviteEmail) return;
    
    const newCollaborator = {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      avatar: inviteEmail.substring(0, 2).toUpperCase(),
      status: 'invited',
      role: 'editor'
    };
    
    setCollaborators(prev => [...prev, newCollaborator]);
    setInviteEmail('');
    onCollaboratorChange?.(collaborators.length + 1);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Users" size={16} />
        <span>Live Collaboration</span>
      </h3>

      <div className="space-y-3 mb-4">
        {collaborators.map(collaborator => (
          <div key={collaborator.id} className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-medium text-primary-foreground">
                {collaborator.avatar}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${
                collaborator.status === 'online' ? 'bg-green-500' : 
                collaborator.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{collaborator.name}</p>
              <p className="text-xs text-muted-foreground">{collaborator.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mb-4">
        <input
          type="email"
          placeholder="Enter email to invite"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm text-foreground"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleInvite}
          disabled={!inviteEmail}
          className="w-full"
        >
          <Icon name="UserPlus" size={14} className="mr-2" />
          Invite
        </Button>
      </div>

      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-foreground mb-2">Recent Activity</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {liveChanges.map(change => (
            <div key={change.id} className="text-xs text-muted-foreground">
              <span className="font-medium">{change.user}</span> {change.action}
              <span className="ml-2">{new Date(change.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollaborationPanel;