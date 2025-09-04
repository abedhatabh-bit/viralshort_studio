import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import HealthTipsGenerator from './components/HealthTipsGenerator';
import WorkingVideoCreator from './components/WorkingVideoCreator';
import WorkingCustomization from './components/WorkingCustomization';

const FixedVideoCreator = () => {
  const navigate = useNavigate();
  const [generatedScript, setGeneratedScript] = useState(null);
  const [customizationSettings, setCustomizationSettings] = useState({});
  const [activeTab, setActiveTab] = useState('create');
  const [systemReady, setSystemReady] = useState(null);

  // Test system compatibility on mount
  React.useEffect(() => {
    const testSystem = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const hasMediaRecorder = !!window.MediaRecorder;
        
        if (ctx && hasMediaRecorder) {
          setSystemReady(true);
        } else {
          setSystemReady(false);
        }
      } catch (error) {
        setSystemReady(false);
      }
    };
    
    testSystem();
  }, []);

  const handleScriptGenerate = (script) => {
    setGeneratedScript(script);
    // Auto-switch to preview on mobile
    if (window.innerWidth < 768) {
      setActiveTab('preview');
    }
  };

  const handleCustomizationChange = (settings) => {
    setCustomizationSettings(settings);
  };

  const handleVideoGenerated = (videoBlob) => {
    console.log('Video generated:', videoBlob);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-[60px] pb-[80px] md:pb-4">
        <div className="container mx-auto px-4 py-6">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  <span className="text-primary">Health Tips</span> Video Creator
                </h1>
                <p className="text-muted-foreground">
                  Create viral health tip videos with Subway Surfers or Minecraft backgrounds
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  iconName="ArrowLeft"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>

            {/* System Status */}
            {systemReady !== null && (
              <div className={`mb-4 p-3 rounded-lg border ${
                systemReady 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={systemReady ? 'CheckCircle' : 'AlertTriangle'} 
                    size={16} 
                    className={systemReady ? 'text-green-600' : 'text-red-600'}
                  />
                  <span className={`text-sm font-medium ${
                    systemReady 
                      ? 'text-green-800 dark:text-green-200'
                      : 'text-red-800 dark:text-red-200'
                  }`}>
                    {systemReady 
                      ? 'System Ready - Video creation available'
                      : 'System Issues - Please update your browser'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Technology Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-full text-xs">
                <Icon name="Heart" size={12} className="text-green-600" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Health Tips + Gaming Backgrounds
                </span>
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full text-xs">
                <Icon name="Video" size={12} className="text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  720p • 1080p • 4K Export
                </span>
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-full text-xs">
                <Icon name="Gamepad2" size={12} className="text-purple-600" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  Subway Surfers • Minecraft
                </span>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            <div className="md:hidden flex bg-card rounded-lg p-1 border border-border mb-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
                  ${activeTab === 'create' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name="Edit" size={16} className="inline mr-2" />
                Create
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all
                  ${activeTab === 'preview' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name="Monitor" size={16} className="inline mr-2" />
                Preview
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Left Panel - Creation Controls */}
            <div className={`lg:col-span-2 space-y-6 ${activeTab === 'preview' ? 'hidden md:block' : ''}`}>
              
              {/* Health Tips Generator */}
              <div className="bg-card rounded-lg border border-border p-6">
                <HealthTipsGenerator onScriptGenerate={handleScriptGenerate} />
              </div>

              {/* Customization Panel */}
              <div className="bg-card rounded-lg border border-border p-6">
                <WorkingCustomization onSettingsChange={handleCustomizationChange} />
              </div>
            </div>

            {/* Right Panel - Video Creator */}
            <div className={`space-y-6 ${activeTab === 'create' ? 'hidden md:block' : ''}`}>
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                {generatedScript ? (
                  <WorkingVideoCreator
                    script={generatedScript}
                    selectedNiche="health"
                    customizationSettings={customizationSettings}
                    onVideoGenerated={handleVideoGenerated}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Icon name="Video" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-2">Ready to Create</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Generate a health tips script to start creating your video
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('create')}
                      className="md:hidden"
                    >
                      Create Script
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              {generatedScript && (
                <div className="bg-card rounded-lg border border-border p-4">
                  <h4 className="font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="Zap" size={16} />
                    <span>Quick Actions</span>
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Video"
                      className="w-full"
                      disabled={!systemReady}
                    >
                      Create TikTok Video
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Youtube"
                      className="w-full"
                      disabled={!systemReady}
                    >
                      Create YouTube Shorts
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Share"
                      className="w-full"
                    >
                      Share Template
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Bottom Actions */}
          <div className="md:hidden fixed bottom-[80px] left-0 right-0 p-4 bg-background border-t border-border">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Save"
                disabled={!generatedScript}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                disabled={!generatedScript || !systemReady}
                className="flex-1"
              >
                Create Video
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FixedVideoCreator;