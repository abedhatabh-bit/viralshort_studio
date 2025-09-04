import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const VideoPerformanceCard = ({ video, onViewDetails }) => {
  const [pulseActive, setPulseActive] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseActive(true);
      setTimeout(() => setPulseActive(false), 857);
    }, 3000);

    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 7000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  const getViralScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'primary';
    if (score >= 40) return 'accent';
    return 'destructive';
  };

  const getEngagementIcon = (rate) => {
    if (rate >= 8) return 'TrendingUp';
    if (rate >= 5) return 'BarChart3';
    return 'TrendingDown';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000)?.toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000)?.toFixed(1)}K`;
    return num?.toString();
  };

  const viralScoreColor = getViralScoreColor(video?.viralScore);

  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden surface-elevation transition-neon hover:neon-glow-primary ${glitchActive ? 'glitch-effect' : ''}`}>
      {/* Video Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={video?.thumbnail}
          alt={video?.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => onViewDetails(video?.id)}
            className={`p-4 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 transition-neon hover:neon-glow-primary ${pulseActive ? 'pulse-cta' : ''}`}
          >
            <Icon name="Play" size={24} className="text-primary ml-1" />
          </button>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 rounded text-xs text-white font-mono">
          {video?.duration}
        </div>

        {/* Viral Score Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 bg-${viralScoreColor}/20 border border-${viralScoreColor}/30 rounded neon-glow-${viralScoreColor} backdrop-blur-sm`}>
          <span className={`text-xs font-bold text-${viralScoreColor}`}>
            {video?.viralScore}% Viral
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-card-foreground line-clamp-2 mb-1">
            {video?.title}
          </h3>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs rounded-full bg-${video?.categoryColor}/20 text-${video?.categoryColor} border border-${video?.categoryColor}/30`}>
              {video?.category}
            </span>
            <span className="text-xs text-muted-foreground">
              {video?.publishedAt}
            </span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={14} className="text-muted-foreground" />
              <span className="text-sm font-medium text-card-foreground">
                {formatNumber(video?.views)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Views</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Icon name="Heart" size={14} className="text-destructive" />
              <span className="text-sm font-medium text-card-foreground">
                {formatNumber(video?.likes)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Likes</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={14} className="text-accent" />
              <span className="text-sm font-medium text-card-foreground">
                {formatNumber(video?.comments)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Comments</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Icon name="Share" size={14} className="text-secondary" />
              <span className="text-sm font-medium text-card-foreground">
                {formatNumber(video?.shares)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Shares</p>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name={getEngagementIcon(video?.engagementRate)} size={16} className="text-primary" />
            <span className="text-sm font-medium text-card-foreground">
              Engagement Rate
            </span>
          </div>
          <span className="text-sm font-bold text-primary">
            {video?.engagementRate}%
          </span>
        </div>

        {/* Platform Performance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {video?.platforms?.map((platform) => (
              <div key={platform?.name} className="flex items-center space-x-1">
                <Icon name={platform?.icon} size={16} className={`text-${platform?.color}`} />
                <span className="text-xs text-muted-foreground">
                  {formatNumber(platform?.performance)}
                </span>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => onViewDetails(video?.id)}
            className="text-xs text-primary hover:text-primary/80 transition-neon font-medium"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPerformanceCard;