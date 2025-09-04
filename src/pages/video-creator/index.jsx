import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import NicheSelector from './components/NicheSelector';
import ScriptGenerator from './components/ScriptGenerator';
import FrameSequence from './components/FrameSequence';
import EnhancedVideoPreview from './components/EnhancedVideoPreview';
import CustomizationPanel from './components/CustomizationPanel';
import EnhancedCustomizationPanel from './components/EnhancedCustomizationPanel';
import VideoQualitySelector from './components/VideoQualitySelector';
import VideoTestRunner from './components/VideoTestRunner';
import CanvasVideoCreator from './components/VideoCreator';
import EnhancedVideoCreator from './components/EnhancedVideoCreator';
import AutoSave from '../../components/AutoSave';
import { errorHandler } from '../../utils/errorHandling';

const VideoCreator = () => {
  const navigate = useNavigate();
  const autoSaveRef = useRef(null);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [generatedScript, setGeneratedScript] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [activeTab, setActiveTab] = useState('create'); // create, preview
  const [customizationSettings, setCustomizationSettings] = useState({});
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [exportFormat, setExportFormat] = useState(null);
  const [qualitySettings, setQualitySettings] = useState(null);
  const [showTestRunner, setShowTestRunner] = useState(false);
  const [systemCompatible, setSystemCompatible] = useState(null);
  const [projectData, setProjectData] = useState({
    id: `project_${Date.now()}`,
    title: 'Untitled Project',
    lastModified: Date.now()
  });
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);
  const [recoveryData, setRecoveryData] = useState(null);

  // Mock saved drafts data and set up autosave
  useEffect(() => {
    const mockDrafts = [
      {
        id: 1,
        title: "Horror Story - Haunted Mirror",
        niche: "horror",
        createdAt: "2025-01-02",
        thumbnail: "https://images.unsplash.com/photo-1520637836862-4d197d17c55a?w=400&h=300&fit=crop"
      },
      {
        id: 2,
        title: "Funny Fail - Cooking Disaster",
        niche: "funny",
        createdAt: "2025-01-01",
        thumbnail: "https://images.pexels.com/photos/4253302/pexels-photo-4253302.jpeg?w=400&h=300&fit=crop"
      }
    ];
    setSavedDrafts(mockDrafts);
    
    // Check for recovery data
    const checkForRecovery = async () => {
      try {
        if (projectData?.id) {
          const recoveryInfo = await errorHandler.checkForRecovery(projectData.id);
          if (recoveryInfo) {
            setShowRecoveryPrompt(true);
            setRecoveryData(recoveryInfo);
          }
        }
      } catch (error) {
        console.error('Failed to check for recovery data:', error);
      }
    };
    
    checkForRecovery();
  }, [projectData?.id]);

  // Handle autosave status changes
  const handleSaveStatusChange = (status) => {
    setSaveStatus(status.status);
    
    if (status.status === 'recovery-available') {
      setShowRecoveryPrompt(true);
      setRecoveryData(status.data);
    }
  };
  
  // Handle applying recovery data
  const handleApplyRecovery = async () => {
    if (autoSaveRef.current && recoveryData) {
      const recoveredContext = await autoSaveRef.current.applyRecovery();
      
      if (recoveredContext) {
        // Restore project state from recovery data
        if (recoveredContext.niche) setSelectedNiche(recoveredContext.niche);
        if (recoveredContext.script) setGeneratedScript(recoveredContext.script);
        if (recoveredContext.frame !== undefined) setCurrentFrame(recoveredContext.frame);
        if (recoveredContext.settings) setCustomizationSettings(recoveredContext.settings);
      }
      
      setShowRecoveryPrompt(false);
    }
  };
  
  // Handle discarding recovery data
  const handleDiscardRecovery = async () => {
    if (autoSaveRef.current) {
      await autoSaveRef.current.discardRecovery();
      setShowRecoveryPrompt(false);
    }
  };
  
  // Handle export progress updates
  const handleExportProgress = (progress) => {
    console.log(`Export progress: ${progress}%`);
    // You could update UI to show progress
  };
  
  // Handle export completion
  const handleExportComplete = (video) => {
    console.log('Export complete:', video);
    // You could show a success message or download link
    
    // Update project data with export info
    setProjectData(prev => ({
      ...prev,
      lastExported: Date.now(),
      exports: [...(prev.exports || []), video],
      lastModified: Date.now()
    }));
  };

  const handleNicheSelect = (niche) => {
    setSelectedNiche(niche);
    setGeneratedScript(null);
    setCurrentFrame(0);
    
    // Update project data
    setProjectData(prev => ({
      ...prev,
      niche,
      lastModified: Date.now()
    }));
  };

  const handleScriptGenerate = (script) => {
    setGeneratedScript(script);
    setCurrentFrame(0);
    
    // Update project data
    setProjectData(prev => ({
      ...prev,
      script,
      lastModified: Date.now()
    }));
    
    // Auto-switch to preview on mobile
    if (window.innerWidth < 768) {
      setActiveTab('preview');
    }
  };

  const handleFrameUpdate = (frameIndex) => {
    setCurrentFrame(frameIndex);
    
    // Update project data
    setProjectData(prev => ({
      ...prev,
      currentFrame: frameIndex,
      lastModified: Date.now()
    }));
  };

  const handleCustomizationChange = (settings) => {
    setCustomizationSettings(settings);
    
    // Update project data
    setProjectData(prev => ({
      ...prev,
      settings,
      lastModified: Date.now()
    }));
  };
  
  const handleQualityChange = (settings) => {
    setQualitySettings(settings);
    
    // Update project data
    setProjectData(prev => ({
      ...prev,
      qualitySettings: settings,
      lastModified: Date.now()
    }));
  };
  
  const handleTestComplete = (results) => {
    const criticalTests = Object.values(results).filter(r => r.critical);
    const criticalPassed = criticalTests.filter(r => r.passed).length;
    setSystemCompatible(criticalPassed === criticalTests.length);
  };
  
  // Handle force save
  const handleForceSave = async () => {
    if (autoSaveRef.current) {
      const success = await autoSaveRef.current.forceSave();
      if (success) {
        // Could show a success message
        console.log('Project saved successfully');
      }
    }
  };

  const handleSaveDraft = () => {
    if (!generatedScript || !selectedNiche) return;
    
    const newDraft = {
      id: Date.now(),
      title: `${selectedNiche?.charAt(0)?.toUpperCase() + selectedNiche?.slice(1)} Story - ${new Date()?.toLocaleDateString()}`,
      niche: selectedNiche,
      script: generatedScript,
      settings: customizationSettings,
      createdAt: new Date()?.toISOString()?.split('T')?.[0],
      thumbnail: "https://images.pixabay.com/photo-2016/11/29/13/14/video-1869198_1280.jpg?w=400&h=300&fit=crop"
    };
    
    setSavedDrafts(prev => [newDraft, ...prev]);
  };

  const handleExportVideo = (format) => {
    if (!generatedScript) return;

    setExportFormat(format);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* AutoSave Component */}
      <AutoSave
        ref={autoSaveRef}
        project={projectData}
        frames={generatedScript?.frames || []}
        onChange={handleSaveStatusChange}
        interval={15000} // Save every 15 seconds
        enabled={!!projectData?.id}
      />
      
      {/* Recovery Prompt */}
      {showRecoveryPrompt && recoveryData && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              Recover Unsaved Work
            </h3>
            <p className="text-muted-foreground mb-4">
              We found unsaved work from your previous session. Would you like to recover it?
            </p>
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={handleApplyRecovery}
              >
                Recover Work
              </Button>
              <Button
                variant="outline"
                onClick={handleDiscardRecovery}
              >
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Header />
      <div className="pt-[60px] pb-[80px] md:pb-4">
        <div className="container mx-auto px-4 py-6">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  <span className="text-primary">Viral</span> Video Creator Pro
                </h1>
                <p className="text-muted-foreground">
                  Professional AI-powered video creation with quality options, multiple niches, and enhanced features - Create actual HD/4K video files!
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Save"
                  onClick={handleForceSave}
                  disabled={!generatedScript}
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Project'}
                </Button>
                <Button
                  variant="outline"
                  iconName="FileText"
                  onClick={handleSaveDraft}
                  disabled={!generatedScript}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="ghost"
                  iconName="ArrowLeft"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>

            {/* Technology Badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-full text-xs">
                <Icon name="Zap" size={12} className="text-green-600" />
                <span className="text-green-700 dark:text-green-300 font-medium">
                  HTML5 Canvas + WebM/MP4 Export
                </span>
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full text-xs">
                <Icon name="Monitor" size={12} className="text-blue-600" />
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  720p • 1080p • 4K Quality
                </span>
              </div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-full text-xs">
                <Icon name="Gamepad2" size={12} className="text-purple-600" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  Subway Surfers • Minecraft • Horror
                </span>
              </div>
            </div>

            {/* System Status */}
            {systemCompatible !== null && (
              <div className={`mb-4 p-3 rounded-lg border ${
                systemCompatible 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                  : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={systemCompatible ? 'CheckCircle' : 'AlertTriangle'} 
                      size={16} 
                      className={systemCompatible ? 'text-green-600' : 'text-red-600'}
                    />
                    <span className={`text-sm font-medium ${
                      systemCompatible 
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {systemCompatible 
                        ? 'System Ready - All features available'
                        : 'Compatibility Issues - Some features may not work'
                      }
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTestRunner(!showTestRunner)}
                  >
                    {showTestRunner ? 'Hide Tests' : 'Show Tests'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Test Runner */}
            {showTestRunner && (
              <div className="mb-6 bg-card rounded-lg border border-border p-6">
                <VideoTestRunner onTestComplete={handleTestComplete} />
              </div>
            )}

            {/* Mobile Tab Navigation */}
            <div className="md:hidden flex bg-card rounded-lg p-1 border border-border mb-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-neon
                  ${activeTab === 'create' ?'bg-primary text-primary-foreground neon-glow-primary' :'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon name="Edit" size={16} className="inline mr-2" />
                Create
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`
                  flex-1 py-2 px-4 rounded-md text-sm font-medium transition-neon
                  ${activeTab === 'preview' ?'bg-primary text-primary-foreground neon-glow-primary' :'text-muted-foreground hover:text-foreground'
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
              
              {/* Saved Drafts */}
              {savedDrafts?.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="FileText" size={16} />
                    <span>Recent Drafts</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {savedDrafts?.slice(0, 2)?.map((draft) => (
                      <div key={draft?.id} className="flex items-center space-x-3 p-3 bg-muted rounded-md">
                        <div className="w-12 h-12 bg-primary/20 rounded-md flex items-center justify-center">
                          <Icon name="Video" size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{draft?.title}</p>
                          <p className="text-xs text-muted-foreground">{draft?.createdAt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Niche Selection */}
              <div className="bg-card rounded-lg border border-border p-6">
                <NicheSelector
                  selectedNiche={selectedNiche}
                  onNicheSelect={handleNicheSelect}
                />
              </div>

              {/* Script Generator */}
              <div className="bg-card rounded-lg border border-border p-6">
                <ScriptGenerator
                  selectedNiche={selectedNiche}
                  onScriptGenerate={handleScriptGenerate}
                />
              </div>

              {/* Frame Sequence */}
              {generatedScript && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <FrameSequence
                    script={generatedScript}
                    onFrameUpdate={handleFrameUpdate}
                  />
                </div>
              )}

              {/* Video Quality Settings */}
              <div className="bg-card rounded-lg border border-border p-6">
                <VideoQualitySelector
                  onQualityChange={handleQualityChange}
                  selectedNiche={selectedNiche}
                />
              </div>
              
              {/* Enhanced Customization Panel */}
              <div className="bg-card rounded-lg border border-border p-6">
                <EnhancedCustomizationPanel
                  onSettingsChange={handleCustomizationChange}
                />
              </div>

              {/* Enhanced Canvas Recorder (Create real video) */}
              {generatedScript && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <EnhancedVideoCreator
                    script={generatedScript}
                    selectedNiche={selectedNiche}
                    customizationSettings={customizationSettings}
                    qualitySettings={qualitySettings}
                    onVideoGenerated={() => {}}
                    autoStartFormat={null}
                  />
                </div>
              )}
            </div>

            {/* Right Panel - Enhanced Preview */}
            <div className={`space-y-6 ${activeTab === 'create' ? 'hidden md:block' : ''}`}>
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <EnhancedVideoPreview
                  script={generatedScript}
                  selectedNiche={selectedNiche}
                  currentFrame={currentFrame}
                  customizationSettings={customizationSettings}
                  exportFormat={exportFormat}
                  onExportProgress={handleExportProgress}
                  onExportComplete={handleExportComplete}
                />
              </div>

              {/* Enhanced Export Options */}
              {generatedScript && (
                <div className="bg-card rounded-lg border border-border p-4">
                  <h4 className="font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="Download" size={16} />
                    <span>Video Export Options</span>
                  </h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-muted rounded-lg mb-3">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Sparkles" size={14} className="text-primary" />
                        <span className="text-xs font-medium text-foreground">Real Video Creation</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Generate actual video files using Canvas API and open source libraries
                      </p>
                    </div>
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Video"
                      onClick={() => handleExportVideo('tiktok')}
                      className="w-full"
                    >
                      Create TikTok Video (9:16)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Video"
                      onClick={() => handleExportVideo('youtube')}
                      className="w-full"
                    >
                      Create YouTube Shorts Video
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
                onClick={handleSaveDraft}
                disabled={!generatedScript}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Download"
                onClick={() => handleExportVideo('tiktok')}
                disabled={!generatedScript}
                className="flex-1"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Custom Styles for Animations */}
      <style jsx>{`
        @keyframes moveDown {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
};

export default VideoCreator;