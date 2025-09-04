import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VideoTestRunner = ({ onTestComplete }) => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const tests = [
    {
      id: 'canvas-support',
      name: 'Canvas API Support',
      description: 'Check if HTML5 Canvas is supported',
      critical: true
    },
    {
      id: 'mediarecorder-support',
      name: 'MediaRecorder API Support',
      description: 'Check if video recording is supported',
      critical: true
    },
    {
      id: 'webm-support',
      name: 'WebM Format Support',
      description: 'Check if WebM video format is supported',
      critical: false
    },
    {
      id: 'mp4-support',
      name: 'MP4 Format Support',
      description: 'Check if MP4 video format is supported',
      critical: false
    },
    {
      id: 'performance-test',
      name: 'Performance Test',
      description: 'Test canvas rendering performance',
      critical: false
    },
    {
      id: 'memory-test',
      name: 'Memory Usage Test',
      description: 'Check available memory for video processing',
      critical: false
    }
  ];

  const runTest = async (test) => {
    setCurrentTest(test.name);
    
    try {
      let result = { passed: false, message: '', details: {} };
      
      switch (test.id) {
        case 'canvas-support':
          result = await testCanvasSupport();
          break;
        case 'mediarecorder-support':
          result = await testMediaRecorderSupport();
          break;
        case 'webm-support':
          result = await testWebMSupport();
          break;
        case 'mp4-support':
          result = await testMP4Support();
          break;
        case 'performance-test':
          result = await testPerformance();
          break;
        case 'memory-test':
          result = await testMemoryUsage();
          break;
        default:
          result = { passed: false, message: 'Unknown test' };
      }
      
      return { ...result, testId: test.id, critical: test.critical };
    } catch (error) {
      return {
        testId: test.id,
        passed: false,
        message: `Test failed: ${error.message}`,
        critical: test.critical
      };
    }
  };

  const testCanvasSupport = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      return { passed: false, message: 'Canvas 2D context not supported' };
    }
    
    // Test basic canvas operations
    canvas.width = 100;
    canvas.height = 100;
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 50, 50);
    
    const imageData = ctx.getImageData(25, 25, 1, 1);
    const isRed = imageData.data[0] === 255 && imageData.data[1] === 0 && imageData.data[2] === 0;
    
    return {
      passed: isRed,
      message: isRed ? 'Canvas API fully functional' : 'Canvas API has issues',
      details: { width: canvas.width, height: canvas.height }
    };
  };

  const testMediaRecorderSupport = async () => {
    if (!window.MediaRecorder) {
      return { passed: false, message: 'MediaRecorder API not supported' };
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    
    try {
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream);
      
      return {
        passed: true,
        message: 'MediaRecorder API fully supported',
        details: { 
          mimeTypes: [
            'video/webm;codecs=vp9',
            'video/webm;codecs=vp8',
            'video/webm'
          ].filter(type => MediaRecorder.isTypeSupported(type))
        }
      };
    } catch (error) {
      return { passed: false, message: `MediaRecorder error: ${error.message}` };
    }
  };

  const testWebMSupport = async () => {
    const supported = MediaRecorder.isTypeSupported('video/webm');
    const vp9Supported = MediaRecorder.isTypeSupported('video/webm;codecs=vp9');
    const vp8Supported = MediaRecorder.isTypeSupported('video/webm;codecs=vp8');
    
    return {
      passed: supported,
      message: supported ? 'WebM format supported' : 'WebM format not supported',
      details: { vp9Supported, vp8Supported }
    };
  };

  const testMP4Support = async () => {
    const supported = MediaRecorder.isTypeSupported('video/mp4');
    const h264Supported = MediaRecorder.isTypeSupported('video/mp4;codecs=h264');
    
    return {
      passed: supported,
      message: supported ? 'MP4 format supported' : 'MP4 format not supported',
      details: { h264Supported }
    };
  };

  const testPerformance = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1920;
    
    const startTime = performance.now();
    
    // Simulate video frame rendering
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `hsl(${i * 12}, 100%, 50%)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '48px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`Frame ${i}`, 100, 100);
      
      // Add some complex shapes
      for (let j = 0; j < 10; j++) {
        ctx.beginPath();
        ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 20, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    const fps = 30 / (renderTime / 1000);
    
    return {
      passed: fps > 15,
      message: `Rendering performance: ${fps.toFixed(1)} FPS`,
      details: { renderTime: renderTime.toFixed(2), fps: fps.toFixed(1) }
    };
  };

  const testMemoryUsage = async () => {
    const memoryInfo = performance.memory;
    
    if (!memoryInfo) {
      return { passed: true, message: 'Memory info not available (likely sufficient)' };
    }
    
    const usedMB = memoryInfo.usedJSHeapSize / 1024 / 1024;
    const totalMB = memoryInfo.totalJSHeapSize / 1024 / 1024;
    const limitMB = memoryInfo.jsHeapSizeLimit / 1024 / 1024;
    
    const memoryUsagePercent = (usedMB / limitMB) * 100;
    
    return {
      passed: memoryUsagePercent < 80,
      message: `Memory usage: ${memoryUsagePercent.toFixed(1)}%`,
      details: { 
        used: usedMB.toFixed(1) + 'MB',
        total: totalMB.toFixed(1) + 'MB',
        limit: limitMB.toFixed(1) + 'MB'
      }
    };
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    const results = {};
    
    for (const test of tests) {
      const result = await runTest(test);
      results[test.id] = result;
      setTestResults({ ...results });
      
      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
    setCurrentTest('');
    onTestComplete?.(results);
  };

  const getOverallStatus = () => {
    const testCount = Object.keys(testResults).length;
    if (testCount === 0) return 'not-run';
    
    const criticalTests = Object.values(testResults).filter(r => r.critical);
    const criticalPassed = criticalTests.filter(r => r.passed).length;
    
    if (criticalPassed === criticalTests.length) {
      const allPassed = Object.values(testResults).filter(r => r.passed).length;
      return allPassed === testCount ? 'excellent' : 'good';
    }
    
    return 'issues';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="TestTube" size={20} className="text-primary" />
          <h3 className="font-heading font-bold text-lg text-foreground">System Compatibility Test</h3>
        </div>
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          variant="default"
          iconName={isRunning ? "Loader" : "Play"}
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>

      {/* Overall Status */}
      {Object.keys(testResults).length > 0 && (
        <div className={`p-4 rounded-lg border ${
          overallStatus === 'excellent' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
          overallStatus === 'good' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
          overallStatus === 'issues' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
          'bg-muted border-border'
        }`}>
          <div className="flex items-center space-x-2">
            <Icon 
              name={
                overallStatus === 'excellent' ? 'CheckCircle' :
                overallStatus === 'good' ? 'AlertTriangle' :
                overallStatus === 'issues' ? 'XCircle' : 'Clock'
              }
              size={20}
              className={
                overallStatus === 'excellent' ? 'text-green-600' :
                overallStatus === 'good' ? 'text-yellow-600' :
                overallStatus === 'issues' ? 'text-red-600' : 'text-muted-foreground'
              }
            />
            <span className={`font-medium ${
              overallStatus === 'excellent' ? 'text-green-800 dark:text-green-200' :
              overallStatus === 'good' ? 'text-yellow-800 dark:text-yellow-200' :
              overallStatus === 'issues' ? 'text-red-800 dark:text-red-200' : 'text-foreground'
            }`}>
              {overallStatus === 'excellent' ? 'Excellent! All systems ready for video creation' :
               overallStatus === 'good' ? 'Good! Core features available, some limitations' :
               overallStatus === 'issues' ? 'Issues detected! Video creation may not work properly' :
               'Tests not run'}
            </span>
          </div>
        </div>
      )}

      {/* Current Test */}
      {isRunning && currentTest && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-primary">Running: {currentTest}</span>
          </div>
        </div>
      )}

      {/* Test Results */}
      <div className="space-y-3">
        {tests.map((test) => {
          const result = testResults[test.id];
          
          return (
            <div
              key={test.id}
              className={`p-4 rounded-lg border transition-all ${
                !result ? 'border-border bg-muted/50' :
                result.passed ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' :
                'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-foreground">{test.name}</h4>
                    {test.critical && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{test.description}</p>
                  
                  {result && (
                    <div className="mt-2">
                      <p className={`text-sm font-medium ${
                        result.passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                      }`}>
                        {result.message}
                      </p>
                      
                      {result.details && Object.keys(result.details).length > 0 && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {Object.entries(result.details).map(([key, value]) => (
                            <div key={key}>
                              <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  {!result ? (
                    <Icon name="Clock" size={20} className="text-muted-foreground" />
                  ) : result.passed ? (
                    <Icon name="CheckCircle" size={20} className="text-green-600" />
                  ) : (
                    <Icon name="XCircle" size={20} className="text-red-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {Object.keys(testResults).length > 0 && (
        <div className="p-4 bg-card border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="Lightbulb" size={16} />
            <span>Recommendations</span>
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {overallStatus === 'excellent' && (
              <p>✅ Your system is fully optimized for video creation. All features available!</p>
            )}
            {overallStatus === 'good' && (
              <>
                <p>⚠️ Your system supports core video creation features.</p>
                <p>• Some advanced formats may not be available</p>
                <p>• Consider using WebM format for better compatibility</p>
              </>
            )}
            {overallStatus === 'issues' && (
              <>
                <p>❌ Critical issues detected. Video creation may not work.</p>
                <p>• Try updating your browser to the latest version</p>
                <p>• Enable hardware acceleration in browser settings</p>
                <p>• Close other tabs to free up memory</p>
              </>
            )}
            
            {testResults['performance-test'] && !testResults['performance-test'].passed && (
              <p>• Consider lowering video quality to 720p for better performance</p>
            )}
            
            {testResults['memory-test'] && !testResults['memory-test'].passed && (
              <p>• Close unnecessary browser tabs and applications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTestRunner;