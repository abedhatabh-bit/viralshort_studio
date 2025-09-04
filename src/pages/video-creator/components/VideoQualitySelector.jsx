import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoQualitySelector = ({ onQualityChange, selectedNiche }) => {
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedFormat, setSelectedFormat] = useState('mp4');
  const [selectedPlatform, setSelectedPlatform] = useState('tiktok');

  const qualityOptions = [
    {
      id: '720p',
      name: '720p HD',
      resolution: '720x1280',
      bitrate: '2.5 Mbps',
      fileSize: '~15MB',
      description: 'Good quality, smaller file size',
      icon: 'Monitor',
      recommended: false
    },
    {
      id: '1080p',
      name: '1080p Full HD',
      resolution: '1080x1920',
      bitrate: '5.0 Mbps',
      fileSize: '~30MB',
      description: 'High quality, balanced performance',
      icon: 'Tv',
      recommended: true
    },
    {
      id: '4K',
      name: '4K Ultra HD',
      resolution: '2160x3840',
      bitrate: '15.0 Mbps',
      fileSize: '~90MB',
      description: 'Maximum quality, large file size',
      icon: 'Tv2',
      recommended: false
    }
  ];

  const formatOptions = [
    {
      id: 'webm',
      name: 'WebM',
      description: 'Best compression, modern browsers',
      compatibility: 'Modern browsers',
      icon: 'FileVideo'
    },
    {
      id: 'mp4',
      name: 'MP4',
      description: 'Universal compatibility',
      compatibility: 'All devices & platforms',
      icon: 'FileVideo2'
    }
  ];

  const platformOptions = [
    {
      id: 'tiktok',
      name: 'TikTok',
      aspectRatio: '9:16',
      maxDuration: '60s',
      maxSize: '287MB',
      icon: 'Music',
      color: 'pink'
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      aspectRatio: '9:16',
      maxDuration: '60s',
      maxSize: '256MB',
      icon: 'Play',
      color: 'red'
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      aspectRatio: '9:16',
      maxDuration: '90s',
      maxSize: '100MB',
      icon: 'Camera',
      color: 'purple'
    },
    {
      id: 'custom',
      name: 'Custom Export',
      aspectRatio: 'Custom',
      maxDuration: 'No limit',
      maxSize: 'No limit',
      icon: 'Settings',
      color: 'blue'
    }
  ];

  const handleQualitySelect = (quality) => {
    setSelectedQuality(quality);
    updateSettings(quality, selectedFormat, selectedPlatform);
  };

  const handleFormatSelect = (format) => {
    setSelectedFormat(format);
    updateSettings(selectedQuality, format, selectedPlatform);
  };

  const handlePlatformSelect = (platform) => {
    setSelectedPlatform(platform);
    updateSettings(selectedQuality, selectedFormat, platform);
  };

  const updateSettings = (quality, format, platform) => {
    const settings = {
      quality,
      format,
      platform,
      ...qualityOptions.find(q => q.id === quality),
      ...formatOptions.find(f => f.id === format),
      ...platformOptions.find(p => p.id === platform)
    };
    onQualityChange?.(settings);
  };

  const getEstimatedSpecs = () => {
    const quality = qualityOptions.find(q => q.id === selectedQuality);
    const platform = platformOptions.find(p => p.id === selectedPlatform);
    
    return {
      resolution: quality?.resolution,
      bitrate: quality?.bitrate,
      fileSize: quality?.fileSize,
      aspectRatio: platform?.aspectRatio,
      maxDuration: platform?.maxDuration
    };
  };

  const specs = getEstimatedSpecs();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Icon name="Settings" size={20} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-foreground">Video Quality & Export</h3>
      </div>

      {/* Platform Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Target Platform</label>
        <div className="grid grid-cols-2 gap-3">
          {platformOptions.map((platform) => (
            <button
              key={platform.id}
              onClick={() => handlePlatformSelect(platform.id)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${selectedPlatform === platform.id
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-md
                  ${selectedPlatform === platform.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <Icon name={platform.icon} size={16} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{platform.name}</h4>
                  <p className="text-xs text-muted-foreground">{platform.aspectRatio} • {platform.maxDuration}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quality Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Video Quality</label>
        <div className="space-y-2">
          {qualityOptions.map((quality) => (
            <button
              key={quality.id}
              onClick={() => handleQualitySelect(quality.id)}
              className={`
                w-full p-4 rounded-lg border-2 text-left transition-all duration-200
                ${selectedQuality === quality.id
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    p-2 rounded-md
                    ${selectedQuality === quality.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                  `}>
                    <Icon name={quality.icon} size={16} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-foreground">{quality.name}</h4>
                      {quality.recommended && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{quality.description}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>{quality.resolution}</span>
                      <span>{quality.bitrate}</span>
                      <span>{quality.fileSize}</span>
                    </div>
                  </div>
                </div>
                {selectedQuality === quality.id && (
                  <Icon name="CheckCircle" size={20} className="text-primary" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Export Format</label>
        <div className="grid grid-cols-2 gap-3">
          {formatOptions.map((format) => (
            <button
              key={format.id}
              onClick={() => handleFormatSelect(format.id)}
              className={`
                p-4 rounded-lg border-2 text-left transition-all duration-200
                ${selectedFormat === format.id
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  p-2 rounded-md
                  ${selectedFormat === format.id ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                `}>
                  <Icon name={format.icon} size={16} />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{format.name}</h4>
                  <p className="text-xs text-muted-foreground">{format.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Niche-Specific Recommendations */}
      {selectedNiche && (
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} />
            <span>Recommendations for {selectedNiche}</span>
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            {selectedNiche === 'horror' && (
              <>
                <p>• Use 1080p for crisp dark scenes</p>
                <p>• MP4 format for wider compatibility</p>
                <p>• TikTok/Instagram for maximum reach</p>
              </>
            )}
            {selectedNiche === 'gaming' && (
              <>
                <p>• 4K recommended for detailed gameplay</p>
                <p>• WebM for better compression</p>
                <p>• YouTube Shorts for gaming audience</p>
              </>
            )}
            {selectedNiche === 'subway' && (
              <>
                <p>• 1080p perfect for fast-paced content</p>
                <p>• MP4 for mobile optimization</p>
                <p>• TikTok ideal for gaming content</p>
              </>
            )}
            {selectedNiche === 'minecraft' && (
              <>
                <p>• 4K showcases block details best</p>
                <p>• WebM for smaller file sizes</p>
                <p>• YouTube Shorts for tutorials</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Export Preview */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
          <Icon name="FileVideo" size={16} />
          <span>Export Preview</span>
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Resolution:</span>
            <span className="ml-2 text-foreground font-medium">{specs.resolution}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Aspect Ratio:</span>
            <span className="ml-2 text-foreground font-medium">{specs.aspectRatio}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Bitrate:</span>
            <span className="ml-2 text-foreground font-medium">{specs.bitrate}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Est. File Size:</span>
            <span className="ml-2 text-foreground font-medium">{specs.fileSize}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Format:</span>
            <span className="ml-2 text-foreground font-medium">{selectedFormat.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Platform:</span>
            <span className="ml-2 text-foreground font-medium">
              {platformOptions.find(p => p.id === selectedPlatform)?.name}
            </span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Optimized for {platformOptions.find(p => p.id === selectedPlatform)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          iconName="Zap"
          onClick={() => {
            handleQualitySelect('1080p');
            handleFormatSelect('mp4');
            handlePlatformSelect('tiktok');
          }}
        >
          Quick Setup: TikTok
        </Button>
        <Button
          variant="outline"
          size="sm"
          iconName="Youtube"
          onClick={() => {
            handleQualitySelect('1080p');
            handleFormatSelect('webm');
            handlePlatformSelect('youtube');
          }}
        >
          Quick Setup: YouTube
        </Button>
      </div>
    </div>
  );
};

export default VideoQualitySelector;