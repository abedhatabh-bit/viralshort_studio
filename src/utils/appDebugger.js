// Comprehensive App Debugger and Fixer
class AppDebugger {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.fixes = [];
    this.systemInfo = {};
  }

  // Test all core systems
  async runFullDiagnostic() {
    console.log('🔍 Starting comprehensive app diagnostic...');
    
    // Test browser compatibility
    await this.testBrowserCompatibility();
    
    // Test Canvas API
    await this.testCanvasAPI();
    
    // Test MediaRecorder API
    await this.testMediaRecorderAPI();
    
    // Test React components
    await this.testReactComponents();
    
    // Test video creation pipeline
    await this.testVideoCreationPipeline();
    
    // Generate report
    return this.generateReport();
  }

  async testBrowserCompatibility() {
    console.log('Testing browser compatibility...');
    
    const tests = {
      userAgent: navigator.userAgent,
      webGL: !!window.WebGLRenderingContext,
      webGL2: !!window.WebGL2RenderingContext,
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
      webWorkers: !!window.Worker,
      serviceWorkers: !!navigator.serviceWorker,
      fetch: !!window.fetch,
      promises: !!window.Promise,
      es6: (() => {
        try {
          eval('const test = () => {}; class Test {}');
          return true;
        } catch {
          return false;
        }
      })()
    };

    this.systemInfo.browser = tests;
    
    if (!tests.es6) {
      this.errors.push('Browser does not support ES6 features');
    }
    
    if (!tests.fetch) {
      this.errors.push('Browser does not support Fetch API');
    }
  }

  async testCanvasAPI() {
    console.log('Testing Canvas API...');
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        this.errors.push('Canvas 2D context not available');
        return;
      }

      // Test basic canvas operations
      canvas.width = 100;
      canvas.height = 100;
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 50, 50);
      
      // Test text rendering
      ctx.font = '16px Arial';
      ctx.fillText('Test', 10, 30);
      
      // Test image data
      const imageData = ctx.getImageData(25, 25, 1, 1);
      const isRed = imageData.data[0] === 255;
      
      if (!isRed) {
        this.warnings.push('Canvas rendering may have issues');
      }

      // Test canvas stream capture
      if (canvas.captureStream) {
        const stream = canvas.captureStream(30);
        this.systemInfo.canvasStream = !!stream;
      } else {
        this.errors.push('Canvas stream capture not supported');
      }

      this.systemInfo.canvas = {
        supported: true,
        context2d: !!ctx,
        streamCapture: !!canvas.captureStream
      };

    } catch (error) {
      this.errors.push(`Canvas API error: ${error.message}`);
    }
  }

  async testMediaRecorderAPI() {
    console.log('Testing MediaRecorder API...');
    
    try {
      if (!window.MediaRecorder) {
        this.errors.push('MediaRecorder API not supported');
        return;
      }

      // Test supported MIME types
      const mimeTypes = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm',
        'video/mp4;codecs=h264',
        'video/mp4'
      ];

      const supportedTypes = mimeTypes.filter(type => 
        MediaRecorder.isTypeSupported(type)
      );

      this.systemInfo.mediaRecorder = {
        supported: true,
        supportedTypes
      };

      if (supportedTypes.length === 0) {
        this.errors.push('No supported video formats for MediaRecorder');
      }

      // Test with dummy canvas stream
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      
      if (canvas.captureStream) {
        const stream = canvas.captureStream(30);
        const recorder = new MediaRecorder(stream);
        
        this.systemInfo.mediaRecorder.canRecord = true;
      }

    } catch (error) {
      this.errors.push(`MediaRecorder API error: ${error.message}`);
    }
  }

  async testReactComponents() {
    console.log('Testing React components...');
    
    try {
      // Test if React is available
      if (!window.React) {
        this.errors.push('React not loaded');
        return;
      }

      // Test component creation
      const testElement = window.React.createElement('div', null, 'Test');
      if (!testElement) {
        this.errors.push('React element creation failed');
      }

      this.systemInfo.react = {
        version: window.React.version || 'unknown',
        available: true
      };

    } catch (error) {
      this.errors.push(`React component error: ${error.message}`);
    }
  }

  async testVideoCreationPipeline() {
    console.log('Testing video creation pipeline...');
    
    try {
      // Create test canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        this.errors.push('Cannot create canvas context for video');
        return;
      }

      canvas.width = 720;
      canvas.height = 1280;

      // Test drawing operations
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Test Video', canvas.width / 2, canvas.height / 2);

      // Test stream capture
      if (!canvas.captureStream) {
        this.errors.push('Canvas stream capture not available');
        return;
      }

      const stream = canvas.captureStream(30);
      
      // Test MediaRecorder with stream
      if (!window.MediaRecorder) {
        this.errors.push('MediaRecorder not available for video creation');
        return;
      }

      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      this.systemInfo.videoCreation = {
        canvasSupported: true,
        streamCaptureSupported: true,
        mediaRecorderSupported: true,
        ready: true
      };

    } catch (error) {
      this.errors.push(`Video creation pipeline error: ${error.message}`);
      this.systemInfo.videoCreation = { ready: false };
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      status: this.errors.length === 0 ? 'HEALTHY' : 'ISSUES_DETECTED',
      errors: this.errors,
      warnings: this.warnings,
      fixes: this.fixes,
      systemInfo: this.systemInfo,
      recommendations: this.generateRecommendations()
    };

    console.log('🔍 Diagnostic Report:', report);
    return report;
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.errors.some(e => e.includes('Canvas'))) {
      recommendations.push('Enable hardware acceleration in browser settings');
      recommendations.push('Update graphics drivers');
    }

    if (this.errors.some(e => e.includes('MediaRecorder'))) {
      recommendations.push('Update browser to latest version');
      recommendations.push('Try Chrome or Firefox for best compatibility');
    }

    if (this.errors.some(e => e.includes('ES6'))) {
      recommendations.push('Update browser to support modern JavaScript');
    }

    if (this.warnings.length > 0) {
      recommendations.push('Close unnecessary browser tabs to free memory');
      recommendations.push('Restart browser if issues persist');
    }

    return recommendations;
  }

  // Auto-fix common issues
  async autoFix() {
    console.log('🔧 Attempting auto-fixes...');

    // Fix missing polyfills
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = window.setTimeout;
      this.fixes.push('Added requestAnimationFrame polyfill');
    }

    // Fix missing console methods
    if (!window.console) {
      window.console = {
        log: () => {},
        error: () => {},
        warn: () => {},
        info: () => {}
      };
      this.fixes.push('Added console polyfill');
    }

    // Fix missing fetch
    if (!window.fetch && window.XMLHttpRequest) {
      // Simple fetch polyfill
      window.fetch = (url, options = {}) => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(options.method || 'GET', url);
          xhr.onload = () => resolve({
            ok: xhr.status >= 200 && xhr.status < 300,
            status: xhr.status,
            text: () => Promise.resolve(xhr.responseText),
            json: () => Promise.resolve(JSON.parse(xhr.responseText))
          });
          xhr.onerror = reject;
          xhr.send(options.body);
        });
      };
      this.fixes.push('Added basic fetch polyfill');
    }

    return this.fixes;
  }
}

// Global diagnostic function
window.runAppDiagnostic = async () => {
  const appDebugger = new AppDebugger();
  await appDebugger.autoFix();
  return await appDebugger.runFullDiagnostic();
};

export default AppDebugger;