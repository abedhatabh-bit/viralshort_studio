import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';
import Icon from '../components/AppIcon';
import Button from '../components/ui/Button';
import FacelessVideoCreator from '../components/faceless/FacelessVideoCreator';
import ViralOptimizer from '../components/faceless/ViralOptimizer';
import HighQualityRenderer from '../components/faceless/HighQualityRenderer';

const FacelessStudio = () => {
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState(null);
  const [renderedVideo, setRenderedVideo] = useState(null);
  const [activeTab, setActiveTab] = useState('create');

  const handleVideoGenerate = (data) => {
    setVideoData(data);
    setActiveTab('optimize');
  };

  const handleOptimizationApply = (optimization) => {
    console.log('Applied optimization:', optimization);
  };

  const handleRenderComplete = (video) => {
    setRenderedVideo(video);
    setActiveTab('result');
  };

  const tabs = [
    { id: 'create', label: 'Create', icon: 'Video', description: 'Choose video type' },
    { id: 'optimize', label: 'Optimize', icon: 'TrendingUp', description: 'Viral optimization' },
    { id: 'render', label: 'Render', icon: 'Settings', description: 'High-quality output' },
    { id: 'result', label: 'Result', icon: 'Download', description: 'Download & share' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[60px] pb-20 md:pb-8">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              <span className="text-primary">Faceless</span> Video Studio
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              Create viral faceless videos with AI voices, engaging backgrounds, and professional quality. 
              Perfect for Reddit stories, facts, horror content, and more.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                🔥 Viral Optimized
              </span>
              <span className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium">
                🎬 4K/8K Quality
              </span>
              <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                🤖 AI Powered
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium">
                📱 Mobile Optimized
              </span>
            </div>

            <Button
              variant="outline"
              iconName="ArrowLeft"
              onClick={() => navigate('/dashboard-enhanced')}
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Progress Tabs */}
          <div className="mb-8">
            <div className="flex justify-center">
              <div className="flex bg-card rounded-lg border border-border p-2 overflow-x-auto">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={
                      (tab.id === 'optimize' && !videoData) ||
                      (tab.id === 'render' && !videoData) ||
                      (tab.id === 'result' && !renderedVideo)
                    }
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : videoData || tab.id === 'create'
                        ? 'text-foreground hover:bg-muted'
                        : 'text-muted-foreground cursor-not-allowed'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <div className="text-left">
                      <div>{tab.label}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                    {index < tabs.length - 1 && (
                      <Icon name="ChevronRight" size={14} className="ml-2 opacity-50" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            
            {/* Create Tab */}
            {activeTab === 'create' && (
              <div className="space-y-6">
                <FacelessVideoCreator onVideoGenerate={handleVideoGenerate} />
                
                {/* Popular Templates */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">🔥 Trending Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="MessageSquare" size={16} className="text-red-500" />
                        <span className="font-medium text-foreground">Reddit AITA</span>
                        <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">HOT</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Relationship drama stories</p>
                      <div className="text-xs text-green-500">Avg: 3.2M views</div>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="Ghost" size={16} className="text-purple-500" />
                        <span className="font-medium text-foreground">True Horror</span>
                        <span className="px-2 py-1 bg-purple-500/10 text-purple-500 rounded text-xs">VIRAL</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Real paranormal experiences</p>
                      <div className="text-xs text-green-500">Avg: 4.1M views</div>
                    </div>
                    
                    <div className="p-4 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="Brain" size={16} className="text-blue-500" />
                        <span className="font-medium text-foreground">Mind Facts</span>
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-xs">TRENDING</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">Psychology & science facts</p>
                      <div className="text-xs text-green-500">Avg: 2.8M views</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Optimize Tab */}
            {activeTab === 'optimize' && videoData && (
              <div className="grid lg:grid-cols-2 gap-6">
                <ViralOptimizer 
                  videoType={videoData.type} 
                  onOptimizationApply={handleOptimizationApply}
                />
                
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="font-semibold text-foreground mb-4">Video Preview</h3>
                  <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Icon name="Play" size={48} className="text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{videoData.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {videoData.settings.quality} • {videoData.settings.duration}s
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Voice:</span>
                      <span className="text-foreground">{videoData.elements.voice?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Background:</span>
                      <span className="text-foreground">{videoData.elements.background?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quality:</span>
                      <span className="text-foreground">{videoData.settings.quality}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="default"
                    className="w-full mt-4"
                    onClick={() => setActiveTab('render')}
                  >
                    Continue to Render
                  </Button>
                </div>
              </div>
            )}

            {/* Render Tab */}
            {activeTab === 'render' && videoData && (
              <HighQualityRenderer 
                videoData={videoData}
                onRenderComplete={handleRenderComplete}
              />
            )}

            {/* Result Tab */}
            {activeTab === 'result' && renderedVideo && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-6 flex items-center space-x-2">
                  <Icon name="CheckCircle" size={20} className="text-green-500" />
                  <span>Video Ready!</span>
                </h3>

                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Video Preview */}
                  <div>
                    <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <Icon name="Play" size={64} className="text-primary mx-auto mb-4" />
                        <p className="text-lg font-medium text-foreground mb-2">
                          {renderedVideo.quality} Video Ready
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {renderedVideo.specs.width}x{renderedVideo.specs.height} • {renderedVideo.duration}s
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="default" className="w-full">
                        <Icon name="Download" size={16} className="mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Icon name="Share" size={16} className="mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>

                  {/* Video Stats */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-foreground mb-3">Video Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Quality:</span>
                          <span className="text-foreground">{renderedVideo.quality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">File Size:</span>
                          <span className="text-foreground">{renderedVideo.fileSize} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Codec:</span>
                          <span className="text-foreground">{renderedVideo.metadata.codec.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Frame Rate:</span>
                          <span className="text-foreground">{renderedVideo.metadata.fps} fps</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Viral Predictions</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-green-500/10 rounded-lg">
                          <div className="text-lg font-bold text-green-500">2.8M+</div>
                          <div className="text-xs text-muted-foreground">Expected Views</div>
                        </div>
                        <div className="text-center p-3 bg-blue-500/10 rounded-lg">
                          <div className="text-lg font-bold text-blue-500">94%</div>
                          <div className="text-xs text-muted-foreground">Engagement</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-3">Publishing</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Icon name="Video" size={14} className="mr-2 text-pink-500" />
                          Publish to TikTok
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Icon name="Play" size={14} className="mr-2 text-red-500" />
                          Upload to YouTube Shorts
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Icon name="Camera" size={14} className="mr-2 text-purple-500" />
                          Share to Instagram Reels
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacelessStudio;