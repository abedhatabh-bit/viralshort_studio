import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const SocialPublisher = ({ video, onPublish }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState([]);

  const platforms = [
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: 'Video',
      color: 'bg-pink-500',
      connected: true,
      specs: '9:16, 60s max'
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      icon: 'Play',
      color: 'bg-red-500',
      connected: true,
      specs: '9:16, 60s max'
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      icon: 'Camera',
      color: 'bg-purple-500',
      connected: false,
      specs: '9:16, 90s max'
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: 'MessageCircle',
      color: 'bg-blue-500',
      connected: false,
      specs: '16:9 or 9:16, 140s max'
    }
  ];

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;
    
    setPublishing(true);
    
    // Mock publishing process
    for (const platformId of selectedPlatforms) {
      const platform = platforms.find(p => p.id === platformId);
      
      // Simulate publishing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        platform: platform.name,
        status: Math.random() > 0.2 ? 'success' : 'failed',
        url: `https://${platformId}.com/video/mock-${Date.now()}`,
        timestamp: Date.now()
      };
      
      setPublishResults(prev => [...prev, result]);
      onPublish?.(result);
    }
    
    setPublishing(false);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Share" size={16} />
        <span>Social Media Publisher</span>
      </h3>

      {!video ? (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="Upload" size={32} className="mx-auto mb-2 opacity-50" />
          <p>Create a video to enable publishing</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Platform Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Select Platforms</h4>
            {platforms.map(platform => (
              <div
                key={platform.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPlatforms.includes(platform.id)
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                } ${!platform.connected ? 'opacity-50' : ''}`}
                onClick={() => platform.connected && togglePlatform(platform.id)}
              >
                <div className={`w-8 h-8 ${platform.color} rounded-full flex items-center justify-center`}>
                  <Icon name={platform.icon} size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-foreground">{platform.name}</span>
                    {!platform.connected && (
                      <span className="text-xs text-muted-foreground">(Connect)</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{platform.specs}</p>
                </div>
                {platform.connected && (
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    selectedPlatforms.includes(platform.id)
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                  }`}>
                    {selectedPlatforms.includes(platform.id) && (
                      <Icon name="Check" size={12} className="text-primary-foreground" />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Publishing Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Publishing Options</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-foreground">Auto-generate hashtags</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-foreground">Optimize for each platform</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-foreground">Schedule for optimal time</span>
              </label>
            </div>
          </div>

          {/* Publish Button */}
          <Button
            variant="default"
            className="w-full"
            onClick={handlePublish}
            disabled={selectedPlatforms.length === 0 || publishing}
          >
            {publishing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Publishing...
              </>
            ) : (
              <>
                <Icon name="Send" size={14} className="mr-2" />
                Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>

          {/* Results */}
          {publishResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Publishing Results</h4>
              {publishResults.map((result, index) => (
                <div key={index} className={`flex items-center space-x-2 p-2 rounded ${
                  result.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  <Icon name={result.status === 'success' ? 'CheckCircle' : 'XCircle'} size={14} />
                  <span className="text-sm">{result.platform}: {result.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialPublisher;