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
import CanvasVideoCreator from './components/VideoCreator';
import AutoSave from '../../components/AutoSave';
import CollaborationPanel from '../../components/collaboration/CollaborationPanel';
import AIOptimizer from '../../components/ai/AIOptimizer';
import SocialPublisher from '../../components/social/SocialPublisher';
import PredictiveAnalytics from '../../components/analytics/PredictiveAnalytics';
import TouchVideoEditor from '../../components/mobile/TouchVideoEditor';
import ThemeSelector from '../../components/theme/ThemeSelector';
import { errorHandler } from '../../utils/errorHandling';

const EnhancedVideoCreator = () => {
  const navigate = useNavigate();
  const autoSaveRef = useRef(null);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [generatedScript, setGeneratedScript] = useState(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [activeTab, setActiveTab] = useState('create');
  const [activeSidebar, setActiveSidebar] = useState('tools');
  const [customizationSettings, setCustomizationSettings] = useState({});
  const [collaborators, setCollaborators] = useState(0);
  const [generatedVideo, setGeneratedVideo] = useState(null);
  const [projectData, setProjectData] = useState({
    id: `project_${Date.now()}`,
    title: 'Untitled Project',
    lastModified: Date.now()
  });
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);
  const [recoveryData, setRecoveryData] = useState(null);

  // Enhanced mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-save and recovery setup
  useEffect(() => {
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

  const handleSaveStatusChange = (status) => {
    setSaveStatus(status.status);
    
    if (status.status === 'recovery-available') {
      setShowRecoveryPrompt(true);
      setRecoveryData(status.data);
    }
  };

  const handleApplyRecovery = async () => {
    if (autoSaveRef.current && recoveryData) {
      const recoveredContext = await autoSaveRef.current.applyRecovery();
      
      if (recoveredContext) {
        if (recoveredContext.niche) setSelectedNiche(recoveredContext.niche);
        if (recoveredContext.script) setGeneratedScript(recoveredContext.script);
        if (recoveredContext.frame !== undefined) setCurrentFrame(recoveredContext.frame);
        if (recoveredContext.settings) setCustomizationSettings(recoveredContext.settings);
      }
      
      setShowRecoveryPrompt(false);
    }
  };

  const handleDiscardRecovery = async () => {
    if (autoSaveRef.current) {
      await autoSaveRef.current.discardRecovery();
      setShowRecoveryPrompt(false);
    }
  };

  const handleNicheSelect = (niche) => {
    setSelectedNiche(niche);
    setGeneratedScript(null);
    setCurrentFrame(0);
    
    setProjectData(prev => ({
      ...prev,
      niche,
      lastModified: Date.now()
    }));
  };

  const handleScriptGenerate = (script) => {
    setGeneratedScript(script);
    setCurrentFrame(0);
    
    setProjectData(prev => ({
      ...prev,
      script,
      lastModified: Date.now()
    }));
    
    if (isMobile) {
      setActiveTab('preview');
    }
  };

  const handleFrameUpdate = (frameIndex) => {
    setCurrentFrame(frameIndex);
    
    setProjectData(prev => ({
      ...prev,
      currentFrame: frameIndex,
      lastModified: Date.now()
    }));
  };

  const handleCustomizationChange = (settings) => {
    setCustomizationSettings(settings);
    
    setProjectData(prev => ({
      ...prev,
      settings,
      lastModified: Date.now()
    }));
  };

  const handleVideoGenerated = (video) => {
    setGeneratedVideo(video);
  };

  const handleOptimizationApply = (suggestion) => {
    console.log('Applying AI suggestion:', suggestion);
    // Apply optimization logic here
  };

  const handleGestureAction = (action, data) => {
    console.log('Gesture action:', action, data);
    // Handle touch gestures
  };

  const handleThemeChange = (theme) => {
    console.log('Theme changed:', theme);
    // Apply theme changes
  };

  const handleForceSave = async () => {
    if (autoSaveRef.current) {
      const success = await autoSaveRef.current.forceSave();
      if (success) {
        console.log('Project saved successfully');
      }
    }
  };

  const sidebarTabs = [
    { id: 'tools', label: 'Tools', icon: 'Settings' },
    { id: 'ai', label: 'AI', icon: 'Sparkles' },
    { id: 'social', label: 'Social', icon: 'Share' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'collab', label: 'Team', icon: 'Users' },
    { id: 'theme', label: 'Theme', icon: 'Palette' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* AutoSave Component */}
      <AutoSave
        ref={autoSaveRef}
        project={projectData}
        frames={generatedScript?.frames || []}
        onChange={handleSaveStatusChange}
        interval={15000}
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
              <Button variant="default" onClick={handleApplyRecovery}>
                Recover Work
              </Button>
              <Button variant="outline" onClick={handleDiscardRecovery}>
                Discard
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Header />
      <div className="pt-[60px] pb-[80px] md:pb-4">
        <div className="container mx-auto px-4 py-6">
          
          {/* Enhanced Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
                  <span className="text-primary">Enhanced</span> Video Creator
                </h1>
                <p className="text-muted-foreground">
                  AI-powered viral video creation with collaboration, analytics, and social publishing
                </p>
              </div>
              
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Icon name="Users" size={14} />
                  <span>{collaborators} collaborators</span>
                </div>
                <Button
                  variant="outline"
                  iconName="Save"
                  onClick={handleForceSave}
                  disabled={!generatedScript}
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Project'}
                </Button>
                <Button
                  variant="ghost"
                  iconName="ArrowLeft"
                  onClick={() => navigate('/dashboard')}
                >
                  Back
                </Button>
              </div>
            </div>

            {/* Mobile Tab Navigation */}
            {isMobile && (
              <div className="flex bg-card rounded-lg p-1 border border-border mb-6">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-neon ${
                    activeTab === 'create' 
                      ? 'bg-primary text-primary-foreground neon-glow-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="Edit" size={16} className="inline mr-2" />
                  Create
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-neon ${
                    activeTab === 'preview' 
                      ? 'bg-primary text-primary-foreground neon-glow-primary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name="Monitor" size={16} className="inline mr-2" />
                  Preview
                </button>
              </div>
            )}
          </div>

          {/* Main Layout */}
          <div className="grid lg:grid-cols-4 gap-6">
            
            {/* Left Panel - Creation Controls */}
            <div className={`lg:col-span-2 space-y-6 ${activeTab === 'preview' && isMobile ? 'hidden' : ''}`}>
              
              {/* Core Creation Tools */}
              <div className="bg-card rounded-lg border border-border p-6">
                <NicheSelector
                  selectedNiche={selectedNiche}
                  onNicheSelect={handleNicheSelect}
                />
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <ScriptGenerator
                  selectedNiche={selectedNiche}
                  onScriptGenerate={handleScriptGenerate}
                />
              </div>

              {generatedScript && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <FrameSequence
                    script={generatedScript}
                    onFrameUpdate={handleFrameUpdate}
                  />
                </div>
              )}

              <div className="bg-card rounded-lg border border-border p-6">
                <CustomizationPanel
                  onSettingsChange={handleCustomizationChange}
                />
              </div>

              {/* Mobile Touch Editor */}
              {isMobile && generatedScript && (
                <TouchVideoEditor
                  frames={generatedScript.frames}
                  onFrameUpdate={handleFrameUpdate}
                  onGestureAction={handleGestureAction}
                />
              )}

              {/* Canvas Video Creator */}
              {generatedScript && (
                <div className="bg-card rounded-lg border border-border p-6">
                  <CanvasVideoCreator
                    script={generatedScript}
                    selectedNiche={selectedNiche}
                    customizationSettings={customizationSettings}
                    onVideoGenerated={handleVideoGenerated}
                    autoStartFormat={null}
                  />
                </div>
              )}
            </div>

            {/* Center Panel - Preview */}
            <div className={`space-y-6 ${activeTab === 'create' && isMobile ? 'hidden' : ''}`}>
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <EnhancedVideoPreview
                  script={generatedScript}
                  selectedNiche={selectedNiche}
                  currentFrame={currentFrame}
                  customizationSettings={customizationSettings}
                  exportFormat={null}
                  onExportProgress={() => {}}
                  onExportComplete={handleVideoGenerated}
                />
              </div>
            </div>

            {/* Right Panel - Enhanced Features */}
            <div className="space-y-6">
              
              {/* Sidebar Tab Navigation */}
              <div className="bg-card rounded-lg border border-border p-2">
                <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-2 gap-1">
                  {sidebarTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSidebar(tab.id)}
                      className={`p-2 rounded text-xs font-medium transition-colors ${
                        activeSidebar === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab.icon} size={14} className="mx-auto mb-1" />
                      <div>{tab.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Sidebar Content */}
              <div className="space-y-6">
                {activeSidebar === 'tools' && (
                  <div className="bg-card rounded-lg border border-border p-4">
                    <h3 className="font-semibold text-foreground mb-4">Quick Tools</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Icon name="Wand2" size={14} className="mr-2" />
                        Auto-enhance
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Icon name="Shuffle" size={14} className="mr-2" />
                        Randomize
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Icon name="Copy" size={14} className="mr-2" />
                        Duplicate
                      </Button>
                    </div>
                  </div>
                )}

                {activeSidebar === 'ai' && (
                  <AIOptimizer
                    script={generatedScript}
                    onOptimizationApply={handleOptimizationApply}
                  />
                )}

                {activeSidebar === 'social' && (
                  <SocialPublisher
                    video={generatedVideo}
                    onPublish={(result) => console.log('Published:', result)}
                  />
                )}

                {activeSidebar === 'analytics' && (
                  <PredictiveAnalytics
                    script={generatedScript}
                    niche={selectedNiche}
                  />
                )}

                {activeSidebar === 'collab' && (
                  <CollaborationPanel
                    projectId={projectData.id}
                    onCollaboratorChange={setCollaborators}
                  />
                )}

                {activeSidebar === 'theme' && (
                  <ThemeSelector
                    onThemeChange={handleThemeChange}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mobile Bottom Actions */}
          {isMobile && (
            <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-background border-t border-border">
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Save"
                  onClick={handleForceSave}
                  disabled={!generatedScript}
                  className="flex-1"
                >
                  Save
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Download"
                  disabled={!generatedScript}
                  className="flex-1"
                >
                  Export
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoCreator;