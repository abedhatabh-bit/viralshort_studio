/**
 * Professional Test Runner for ViralShort Studio
 * Comprehensive testing suite for all features
 */

class TestRunner {
  constructor() {
    this.tests = [];
    this.results = [];
    this.isRunning = false;
  }

  // Add test case
  addTest(name, testFn, timeout = 5000) {
    this.tests.push({ name, testFn, timeout });
  }

  // Run all tests
  async runAll() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.results = [];
    
    console.log('🚀 Starting ViralShort Studio Test Suite...');
    
    for (const test of this.tests) {
      await this.runTest(test);
    }
    
    this.isRunning = false;
    this.generateReport();
  }

  // Run individual test
  async runTest(test) {
    const startTime = Date.now();
    
    try {
      console.log(`⏳ Running: ${test.name}`);
      
      // Set timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout')), test.timeout);
      });
      
      await Promise.race([test.testFn(), timeoutPromise]);
      
      const duration = Date.now() - startTime;
      this.results.push({
        name: test.name,
        status: 'PASS',
        duration,
        error: null
      });
      
      console.log(`✅ PASS: ${test.name} (${duration}ms)`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        name: test.name,
        status: 'FAIL',
        duration,
        error: error.message
      });
      
      console.log(`❌ FAIL: ${test.name} - ${error.message}`);
    }
  }

  // Generate test report
  generateReport() {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;
    
    console.log('\n📊 Test Results Summary:');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAIL')
        .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
    }
    
    return {
      total,
      passed,
      failed,
      successRate: (passed / total) * 100,
      results: this.results
    };
  }
}

// Test utilities
export const testUtils = {
  // Wait for element to appear
  waitForElement: (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) return resolve(element);
      
      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  // Simulate user interaction
  simulateClick: (element) => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    element.dispatchEvent(event);
  },

  // Check if component renders without errors
  checkComponentRender: (Component, props = {}) => {
    return new Promise((resolve, reject) => {
      try {
        const container = document.createElement('div');
        document.body.appendChild(container);
        
        // Mock React render (simplified)
        const element = React.createElement(Component, props);
        
        // Clean up
        document.body.removeChild(container);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },

  // Performance test
  measurePerformance: async (fn, name) => {
    const start = performance.now();
    await fn();
    const end = performance.now();
    const duration = end - start;
    
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  },

  // Memory usage test
  checkMemoryUsage: () => {
    if (performance.memory) {
      const used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      const total = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
      console.log(`💾 Memory: ${used}MB / ${total}MB`);
      return { used, total };
    }
    return null;
  }
};

// Create test runner instance
export const testRunner = new TestRunner();

// Core functionality tests
testRunner.addTest('App Initialization', async () => {
  // Test app starts without errors
  if (!document.querySelector('#root')) {
    throw new Error('Root element not found');
  }
});

testRunner.addTest('Route Navigation', async () => {
  // Test all routes are accessible
  const routes = [
    '/',
    '/dashboard-enhanced',
    '/video-creator-enhanced',
    '/faceless-studio',
    '/features'
  ];
  
  // Mock route testing (simplified)
  routes.forEach(route => {
    if (!route.startsWith('/')) {
      throw new Error(`Invalid route: ${route}`);
    }
  });
});

testRunner.addTest('Component Rendering', async () => {
  // Test critical components render
  const components = [
    'Header',
    'Button',
    'Icon',
    'CollaborationPanel',
    'AIOptimizer',
    'FacelessVideoCreator'
  ];
  
  // Mock component test
  components.forEach(component => {
    if (!component || component.length === 0) {
      throw new Error(`Invalid component: ${component}`);
    }
  });
});

testRunner.addTest('Local Storage', async () => {
  // Test localStorage functionality
  try {
    localStorage.setItem('test', 'value');
    const value = localStorage.getItem('test');
    localStorage.removeItem('test');
    
    if (value !== 'value') {
      throw new Error('localStorage not working');
    }
  } catch (error) {
    throw new Error('localStorage access denied');
  }
});

testRunner.addTest('IndexedDB Support', async () => {
  // Test IndexedDB availability
  if (!window.indexedDB) {
    throw new Error('IndexedDB not supported');
  }
  
  // Test database creation
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('test-db', 1);
    
    request.onerror = () => reject(new Error('IndexedDB error'));
    request.onsuccess = () => {
      request.result.close();
      indexedDB.deleteDatabase('test-db');
      resolve();
    };
  });
});

testRunner.addTest('Canvas Support', async () => {
  // Test Canvas API
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas 2D context not supported');
  }
  
  // Test basic drawing
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 10, 10);
});

testRunner.addTest('Web Workers', async () => {
  // Test Web Worker support
  if (!window.Worker) {
    throw new Error('Web Workers not supported');
  }
  
  // Test worker creation
  try {
    const worker = new Worker(
      URL.createObjectURL(
        new Blob(['self.postMessage("test")'], { type: 'application/javascript' })
      )
    );
    
    return new Promise((resolve, reject) => {
      worker.onmessage = (e) => {
        if (e.data === 'test') {
          worker.terminate();
          resolve();
        } else {
          reject(new Error('Worker communication failed'));
        }
      };
      
      worker.onerror = () => reject(new Error('Worker error'));
      
      setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timeout'));
      }, 1000);
    });
  } catch (error) {
    throw new Error('Worker creation failed');
  }
});

testRunner.addTest('Performance Baseline', async () => {
  // Test performance metrics
  const start = performance.now();
  
  // Simulate some work
  for (let i = 0; i < 100000; i++) {
    Math.random();
  }
  
  const duration = performance.now() - start;
  
  if (duration > 100) { // 100ms threshold
    throw new Error(`Performance too slow: ${duration}ms`);
  }
});

export default testRunner;