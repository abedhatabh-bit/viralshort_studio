// Console Commands for App Analysis
window.appCommands = {
  // Get analytics report
  analytics: () => {
    const report = window.analytics?.getReport();
    console.table(report?.features);
    console.table(report?.performance);
    console.log('📊 Analytics Report:', report);
    return report;
  },

  // Test video creation
  testVideo: async () => {
    console.log('🎬 Testing video creation...');
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 720;
      canvas.height = 1280;
      
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Test Video', canvas.width/2, canvas.height/2);
      
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream);
      
      console.log('✅ Video creation test passed');
      return { canvas: true, stream: true, recorder: true };
    } catch (error) {
      console.error('❌ Video creation test failed:', error);
      return { error: error.message };
    }
  },

  // Check system compatibility
  checkSystem: async () => {
    console.log('🔍 Checking system compatibility...');
    const report = await window.runAppDiagnostic?.();
    console.log('System Report:', report);
    return report;
  },

  // Performance test
  perfTest: () => {
    console.log('⚡ Running performance test...');
    const start = performance.now();
    
    // Simulate heavy operation
    for (let i = 0; i < 1000000; i++) {
      Math.random();
    }
    
    const duration = performance.now() - start;
    console.log(`Performance test completed in ${duration.toFixed(2)}ms`);
    return { duration, status: duration < 100 ? 'good' : 'slow' };
  },

  // Memory usage
  memory: () => {
    if (performance.memory) {
      const memory = {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
      console.log('💾 Memory Usage:', memory);
      return memory;
    }
    return { error: 'Memory info not available' };
  },

  // Clear analytics
  clearAnalytics: () => {
    if (window.analytics) {
      window.analytics.logs = [];
      window.analytics.features = {};
      window.analytics.performance = {};
      window.analytics.errors = [];
      console.log('🧹 Analytics cleared');
    }
  },

  // Help
  help: () => {
    console.log(`
🔧 Available Commands:
• appCommands.analytics() - View analytics report
• appCommands.testVideo() - Test video creation
• appCommands.checkSystem() - Check compatibility
• appCommands.perfTest() - Run performance test
• appCommands.memory() - Check memory usage
• appCommands.clearAnalytics() - Clear analytics
• appCommands.help() - Show this help
    `);
  }
};

// Auto-run help on load
console.log('🚀 App Console Ready! Type appCommands.help() for commands');

export default window.appCommands;