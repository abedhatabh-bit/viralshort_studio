import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import HealthTipsGenerator from './components/HealthTipsGenerator';
import BulletproofVideoCreator from './components/BulletproofVideoCreator';
import WorkingCustomization from './components/WorkingCustomization';
import AppDebugger from '../../utils/appDebugger';

const DeepDebuggedCreator = () => {
  const navigate = useNavigate();
  const [generatedScript, setGeneratedScript] = useState(null);
  const [customizationSettings, setCustomizationSettings] = useState({});
  const [activeTab, setActiveTab] = useState('create');
  const [systemStatus, setSystemStatus] = useState('checking');
  const [diagnosticReport, setDiagnosticReport] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Run comprehensive system check on mount
  useEffect(() => {
    const runSystemCheck = async () => {
      try {
        setSystemStatus('checking');
        
        // Initialize debugger
        const appDebugger = new AppDebugger();
        
        // Run auto-fixes first
        await appDebugger.autoFix();
        
        // Run full diagnostic
        const report = await appDebugger.runFullDiagnostic();
        
        setDiagnosticReport(report);
        setSystemStatus(report.status === 'HEALTHY' ? 'ready' : 'issues');
        
        // Auto-show diagnostics if there are issues
        if (report.status !== 'HEALTHY') {
          setShowDiagnostics(true);
        }
        
      } catch (error) {
        console.error('System check failed:', error);
        setSystemStatus('error');
      }
    };

    runSystemCheck();
  }, []);

  const handleScriptGenerate = (script) => {
    setGeneratedScript(script);
    window.trackScriptGeneration?.(script.backgroundStyle, script.topic);
    // Auto-switch to preview on mobile
    if (window.innerWidth < 768) {
      setActiveTab('preview');
    }
  };

  const handleCustomizationChange = (settings) => {
    setCustomizationSettings(settings);
  };

  const handleVideoGenerated = (videoBlob) => {
    console.log('Video generated successfully:', videoBlob);
    window.trackVideoCreation?.('1080p', 'health_gaming', videoBlob.size);
    // Could add success notification here
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'ready': return 'green';
      case 'issues': return 'yellow';
      case 'error': return 'red';
      default: return 'blue';
    }
  };

  const getStatusMessage = () => {
    switch (systemStatus) {
      case 'ready': return 'All systems operational - Ready to create videos';
      case 'issues': return 'Some issues detected - Limited functionality';
      case 'error': return 'System error - Please refresh and try again';
      default: return 'Checking system compatibility...';
    }
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
                  <span className="text-primary">Health Tips</span> Video Creator Pro
                </h1>
                <p className="text-muted-foreground">
                  Deep-debugged video creation with health tips and gaming backgrounds
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
            <div className={`mb-4 p-4 rounded-lg border ${
              systemStatus === 'ready' 
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
                : systemStatus === 'issues'
                ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
                : systemStatus === 'error'
                ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
                : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={
                      systemStatus === 'ready' ? 'CheckCircle' :
                      systemStatus === 'issues' ? 'AlertTriangle' :
                      systemStatus === 'error' ? 'XCircle' : 'Loader'
                    }
                    size={16} 
                    className={`${
                      systemStatus === 'ready' ? 'text-green-600' :
                      systemStatus === 'issues' ? 'text-yellow-600' :
                      systemStatus === 'error' ? 'text-red-600' : 'text-blue-600 animate-spin'
                    }`}
                  />
                  <span className={`text-sm font-medium ${
                    systemStatus === 'ready' ? 'text-green-800 dark:text-green-200' :
                    systemStatus === 'issues' ? 'text-yellow-800 dark:text-yellow-200' :
                    systemStatus === 'error' ? 'text-red-800 dark:text-red-200' :
                    'text-blue-800 dark:text-blue-200'
                  }`}>
                    {getStatusMessage()}
                  </span>
                </div>
                
                {diagnosticReport && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDiagnostics(!showDiagnostics)}
                  >
                    {showDiagnostics ? 'Hide' : 'Show'} Diagnostics
                  </Button>
                )}
              </div>
            </div>

            {/* Diagnostic Report */}
            {showDiagnostics && diagnosticReport && (
              <div className="mb-6 p-4 bg-card border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Activity" size={16} />
                  <span>System Diagnostic Report</span>
                </h4>
                
                {/* Errors */}
                {diagnosticReport.errors.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-red-600 mb-2">Errors:</h5>
                    <ul className="text-sm text-red-700 space-y-1">
                      {diagnosticReport.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {diagnosticReport.warnings.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-yellow-600 mb-2">Warnings:</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {diagnosticReport.warnings.map((warning, index) => (
                        <li key={index}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Fixes Applied */}
                {diagnosticReport.fixes.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-green-600 mb-2">Auto-Fixes Applied:</h5>
                    <ul className="text-sm text-green-700 space-y-1">
                      {diagnosticReport.fixes.map((fix, index) => (
                        <li key={index}>• {fix}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommendations */}
                {diagnosticReport.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-blue-600 mb-2">Recommendations:</h5>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {diagnosticReport.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* System Info */}
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                  <div>
                    <strong>Canvas Support:</strong> {diagnosticReport.systemInfo.canvas?.supported ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>MediaRecorder:</strong> {diagnosticReport.systemInfo.mediaRecorder?.supported ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>Video Creation:</strong> {diagnosticReport.systemInfo.videoCreation?.ready ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>Browser:</strong> {diagnosticReport.systemInfo.browser?.es6 ? 'Modern' : 'Legacy'}
                  </div>
                </div>
              </div>
            )}

            {/* Feature Badges */}
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
                <Icon name="Shield" size={12} className="text-purple-600" />
                <span className="text-purple-700 dark:text-purple-300 font-medium">
                  Deep Debugged & Bulletproof
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
                  <BulletproofVideoCreator
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
              {generatedScript && systemStatus === 'ready' && (
                <div className="bg-card rounded-lg border border-border p-4">
                  <h4 className="font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
                    <Icon name="Zap" size={16} />
                    <span>Quick Export</span>
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Video"
                      className="w-full"
                    >
                      Create TikTok Video (9:16)
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Youtube"
                      className="w-full"
                    >
                      Create YouTube Shorts
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Instagram"
                      className="w-full"
                    >
                      Create Instagram Reels
                    </Button>
                  </div>
                </div>
              )}

              {/* System Status Summary */}
              <div className="bg-card rounded-lg border border-border p-4">
                <h4 className="font-body font-semibold text-foreground mb-3 flex items-center space-x-2">
                  <Icon name="Activity" size={16} />
                  <span>System Status</span>
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Canvas API:</span>
                    <span className={systemStatus === 'ready' ? 'text-green-600' : 'text-red-600'}>
                      {systemStatus === 'ready' ? '✅ Ready' : '❌ Issues'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Video Recording:</span>
                    <span className={systemStatus === 'ready' ? 'text-green-600' : 'text-red-600'}>
                      {systemStatus === 'ready' ? '✅ Ready' : '❌ Issues'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Export Formats:</span>
                    <span className={systemStatus === 'ready' ? 'text-green-600' : 'text-yellow-600'}>
                      {systemStatus === 'ready' ? '✅ WebM/MP4' : '⚠️ Limited'}
                    </span>
                  </div>
                </div>
              </div>
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
                disabled={!generatedScript || systemStatus !== 'ready'}
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

export default DeepDebuggedCreator;