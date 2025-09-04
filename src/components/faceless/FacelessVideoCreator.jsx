import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from '../ui/Button';

const FacelessVideoCreator = ({ onVideoGenerate }) => {
  const [selectedType, setSelectedType] = useState('');
  const [settings, setSettings] = useState({
    voiceType: 'neural',
    backgroundType: 'animated',
    textStyle: 'modern',
    quality: '4K',
    duration: 60
  });

  const facelessTypes = [
    {
      id: 'reddit-stories',
      name: 'Reddit Stories',
      icon: 'MessageSquare',
      description: 'Viral Reddit stories with engaging visuals',
      viralScore: 95,
      avgViews: '2.5M',
      examples: ['AITA Stories', 'Relationship Drama', 'Work Stories']
    },
    {
      id: 'facts-trivia',
      name: 'Facts & Trivia',
      icon: 'Brain',
      description: 'Mind-blowing facts with stunning visuals',
      viralScore: 88,
      avgViews: '1.8M',
      examples: ['Space Facts', 'History Mysteries', 'Science Trivia']
    },
    {
      id: 'motivational',
      name: 'Motivational',
      icon: 'Zap',
      description: 'Inspiring quotes with cinematic backgrounds',
      viralScore: 82,
      avgViews: '1.2M',
      examples: ['Success Quotes', 'Life Lessons', 'Mindset Shifts']
    },
    {
      id: 'horror-stories',
      name: 'Horror Stories',
      icon: 'Ghost',
      description: 'Creepy stories with atmospheric visuals',
      viralScore: 92,
      avgViews: '3.1M',
      examples: ['True Crime', 'Paranormal', 'Urban Legends']
    },
    {
      id: 'life-hacks',
      name: 'Life Hacks',
      icon: 'Lightbulb',
      description: 'Useful tips with clear demonstrations',
      viralScore: 85,
      avgViews: '1.6M',
      examples: ['Money Saving', 'Productivity', 'DIY Tips']
    },
    {
      id: 'conspiracy',
      name: 'Conspiracy Theories',
      icon: 'Eye',
      description: 'Mysterious theories with dark aesthetics',
      viralScore: 89,
      avgViews: '2.2M',
      examples: ['Government Secrets', 'Ancient Mysteries', 'Cover-ups']
    }
  ];

  const voiceOptions = [
    { id: 'neural-male', name: 'Neural Male', quality: 'Premium', accent: 'American' },
    { id: 'neural-female', name: 'Neural Female', quality: 'Premium', accent: 'British' },
    { id: 'ai-narrator', name: 'AI Narrator', quality: 'Ultra', accent: 'Neutral' },
    { id: 'documentary', name: 'Documentary', quality: 'Premium', accent: 'Deep' }
  ];

  const backgroundTypes = [
    { id: 'minecraft', name: 'Minecraft Parkour', viral: 'High', engagement: '94%' },
    { id: 'subway-surfers', name: 'Subway Surfers', viral: 'Ultra', engagement: '96%' },
    { id: 'satisfying', name: 'Satisfying Videos', viral: 'High', engagement: '91%' },
    { id: 'nature-4k', name: '4K Nature Scenes', viral: 'Medium', engagement: '87%' },
    { id: 'space-visuals', name: 'Space Visuals', viral: 'High', engagement: '89%' },
    { id: 'abstract-art', name: 'Abstract Art', viral: 'Medium', engagement: '83%' }
  ];

  const generateFacelessVideo = () => {
    const selectedTypeData = facelessTypes.find(t => t.id === selectedType);
    
    const videoData = {
      type: selectedType,
      title: `${selectedTypeData?.name} - ${selectedTypeData?.examples[0]}`,
      settings,
      specs: {
        resolution: settings.quality,
        duration: settings.duration,
        fps: 60,
        format: 'MP4',
        codec: 'H.264'
      },
      elements: {
        voice: voiceOptions.find(v => v.id === settings.voiceType),
        background: backgroundTypes.find(b => b.id === settings.backgroundType),
        textStyle: settings.textStyle
      },
      viralOptimization: {
        hookTiming: 3,
        retentionCurve: 'exponential',
        engagementTriggers: ['question', 'cliffhanger', 'reveal'],
        thumbnailStyle: 'clickbait-optimized'
      }
    };

    onVideoGenerate?.(videoData);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
        <Icon name="Video" size={16} />
        <span>Faceless Video Creator</span>
        <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs">VIRAL</span>
      </h3>

      {/* Video Type Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Choose Video Type</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {facelessTypes.map(type => (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border hover:border-muted-foreground hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <Icon name={type.icon} size={20} className="text-primary" />
                <div>
                  <h5 className="font-medium text-foreground text-sm">{type.name}</h5>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-green-500">Viral: {type.viralScore}%</span>
                    <span className="text-muted-foreground">Avg: {type.avgViews}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
              <div className="flex flex-wrap gap-1">
                {type.examples.slice(0, 2).map(example => (
                  <span key={example} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedType && (
        <>
          {/* Voice Settings */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">AI Voice</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {voiceOptions.map(voice => (
                <div
                  key={voice.id}
                  onClick={() => setSettings(prev => ({ ...prev, voiceType: voice.id }))}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    settings.voiceType === voice.id
                      ? 'border-secondary bg-secondary/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">{voice.name}</span>
                    <span className="text-xs text-secondary">{voice.quality}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{voice.accent} accent</p>
                </div>
              ))}
            </div>
          </div>

          {/* Background Settings */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Background Video</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {backgroundTypes.map(bg => (
                <div
                  key={bg.id}
                  onClick={() => setSettings(prev => ({ ...prev, backgroundType: bg.id }))}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    settings.backgroundType === bg.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{bg.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      bg.viral === 'Ultra' ? 'bg-red-500/10 text-red-500' :
                      bg.viral === 'High' ? 'bg-green-500/10 text-green-500' :
                      'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {bg.viral}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Engagement: {bg.engagement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quality & Duration */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Video Settings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground">Quality</label>
                <select
                  value={settings.quality}
                  onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded text-sm"
                >
                  <option value="1080p">1080p HD</option>
                  <option value="4K">4K Ultra HD</option>
                  <option value="8K">8K Premium</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Duration</label>
                <select
                  value={settings.duration}
                  onChange={(e) => setSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded text-sm"
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                </select>
              </div>
            </div>
          </div>

          {/* Viral Optimization Preview */}
          <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
              <Icon name="TrendingUp" size={14} />
              <span>Viral Optimization Preview</span>
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">
                  {facelessTypes.find(t => t.id === selectedType)?.viralScore}%
                </div>
                <div className="text-xs text-muted-foreground">Viral Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-secondary">
                  {backgroundTypes.find(b => b.id === settings.backgroundType)?.engagement}
                </div>
                <div className="text-xs text-muted-foreground">Engagement</div>
              </div>
              <div>
                <div className="text-lg font-bold text-accent">
                  {facelessTypes.find(t => t.id === selectedType)?.avgViews}
                </div>
                <div className="text-xs text-muted-foreground">Avg Views</div>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            variant="default"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={generateFacelessVideo}
          >
            <Icon name="Sparkles" size={16} className="mr-2" />
            Generate Viral Faceless Video
          </Button>
        </>
      )}
    </div>
  );
};

export default FacelessVideoCreator;