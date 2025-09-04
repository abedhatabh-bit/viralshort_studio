/**
 * Startup Validator - Professional App Health Check
 * Ensures app runs smoothly without issues
 */

class StartupValidator {
  constructor() {
    this.checks = [];
    this.results = [];
    this.isValidating = false;
  }

  // Add validation check
  addCheck(name, checkFn, critical = false) {
    this.checks.push({ name, checkFn, critical });
  }

  // Run all validation checks
  async validate() {
    if (this.isValidating) return this.results;
    
    this.isValidating = true;
    this.results = [];
    
    console.log('🔍 Running startup validation...');
    
    for (const check of this.checks) {
      await this.runCheck(check);
    }
    
    this.isValidating = false;
    return this.generateReport();
  }

  async runCheck(check) {
    const startTime = Date.now();
    
    try {
      await check.checkFn();
      
      const duration = Date.now() - startTime;
      this.results.push({
        name: check.name,
        status: 'PASS',
        critical: check.critical,
        duration,
        error: null
      });
      
      console.log(`✅ ${check.name} - PASS (${duration}ms)`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.results.push({
        name: check.name,
        status: 'FAIL',
        critical: check.critical,
        duration,
        error: error.message
      });
      
      const icon = check.critical ? '🚨' : '⚠️';
      console.log(`${icon} ${check.name} - FAIL: ${error.message}`);
    }
  }

  generateReport() {
    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const criticalFailed = this.results.filter(r => r.status === 'FAIL' && r.critical).length;
    
    const report = {
      total: this.results.length,
      passed,
      failed,
      criticalFailed,
      healthy: criticalFailed === 0,
      results: this.results
    };
    
    console.log('\n📊 Startup Validation Report:');
    console.log(`Health Status: ${report.healthy ? '🟢 HEALTHY' : '🔴 CRITICAL ISSUES'}`);
    console.log(`Checks: ${passed}/${this.results.length} passed`);
    
    if (criticalFailed > 0) {
      console.log(`🚨 Critical failures: ${criticalFailed}`);
    }
    
    return report;
  }
}

// Create validator instance
const validator = new StartupValidator();

// Browser compatibility checks
validator.addCheck('Modern Browser Support', async () => {
  const required = [
    'Promise',
    'fetch',
    'localStorage',
    'sessionStorage',
    'addEventListener',
    'querySelector',
    'JSON'
  ];
  
  for (const feature of required) {
    if (!(feature in window)) {
      throw new Error(`Missing required feature: ${feature}`);
    }
  }
}, true);

validator.addCheck('ES6+ Support', async () => {
  try {
    // Test arrow functions
    const arrow = () => true;
    if (!arrow()) throw new Error('Arrow functions not supported');
    
    // Test template literals
    const template = `test`;
    if (template !== 'test') throw new Error('Template literals not supported');
    
    // Test destructuring
    const { test } = { test: true };
    if (!test) throw new Error('Destructuring not supported');
    
    // Test async/await
    const asyncTest = async () => true;
    if (!(asyncTest() instanceof Promise)) throw new Error('Async/await not supported');
    
  } catch (error) {
    throw new Error(`ES6+ features not supported: ${error.message}`);
  }
}, true);

// Storage checks
validator.addCheck('Local Storage', async () => {
  try {
    const testKey = 'startup_test';
    const testValue = 'test_value';
    
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (retrieved !== testValue) {
      throw new Error('localStorage read/write failed');
    }
  } catch (error) {
    throw new Error(`localStorage not available: ${error.message}`);
  }
}, true);

validator.addCheck('IndexedDB', async () => {
  if (!window.indexedDB) {
    throw new Error('IndexedDB not supported');
  }
  
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('startup_test', 1);
    
    request.onerror = () => reject(new Error('IndexedDB access denied'));
    request.onsuccess = () => {
      request.result.close();
      indexedDB.deleteDatabase('startup_test');
      resolve();
    };
    
    setTimeout(() => reject(new Error('IndexedDB timeout')), 5000);
  });
}, false);

// Canvas and media checks
validator.addCheck('Canvas 2D Support', async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }
  
  // Test basic drawing
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 1, 1);
  
  const imageData = ctx.getImageData(0, 0, 1, 1);
  if (!imageData || imageData.data.length === 0) {
    throw new Error('Canvas drawing not working');
  }
}, true);

validator.addCheck('Web Workers', async () => {
  if (!window.Worker) {
    throw new Error('Web Workers not supported');
  }
  
  return new Promise((resolve, reject) => {
    try {
      const workerCode = 'self.postMessage("test");';
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const worker = new Worker(URL.createObjectURL(blob));
      
      worker.onmessage = (e) => {
        if (e.data === 'test') {
          worker.terminate();
          resolve();
        } else {
          worker.terminate();
          reject(new Error('Worker communication failed'));
        }
      };
      
      worker.onerror = (error) => {
        worker.terminate();
        reject(new Error(`Worker error: ${error.message}`));
      };
      
      setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker timeout'));
      }, 3000);
      
    } catch (error) {
      reject(new Error(`Worker creation failed: ${error.message}`));
    }
  });
}, false);

// Network and service worker checks
validator.addCheck('Service Worker Support', async () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Workers not supported');
  }
  
  // Test registration capability (don't actually register)
  if (typeof navigator.serviceWorker.register !== 'function') {
    throw new Error('Service Worker registration not available');
  }
}, false);

validator.addCheck('Fetch API', async () => {
  if (!window.fetch) {
    throw new Error('Fetch API not supported');
  }
  
  // Test basic fetch capability with data URL
  try {
    const response = await fetch('data:text/plain,test');
    const text = await response.text();
    
    if (text !== 'test') {
      throw new Error('Fetch API not working correctly');
    }
  } catch (error) {
    throw new Error(`Fetch API error: ${error.message}`);
  }
}, true);

// Performance checks
validator.addCheck('Performance API', async () => {
  if (!window.performance || !performance.now) {
    throw new Error('Performance API not available');
  }
  
  const start = performance.now();
  await new Promise(resolve => setTimeout(resolve, 1));
  const end = performance.now();
  
  if (end <= start) {
    throw new Error('Performance timing not working');
  }
}, false);

validator.addCheck('Memory Information', async () => {
  if (performance.memory) {
    const memory = performance.memory;
    
    if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
      throw new Error('High memory usage detected');
    }
    
    console.log(`💾 Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB used`);
  }
}, false);

// CSS and styling checks
validator.addCheck('CSS Custom Properties', async () => {
  if (!CSS || !CSS.supports) {
    throw new Error('CSS.supports not available');
  }
  
  if (!CSS.supports('color', 'var(--test)')) {
    throw new Error('CSS custom properties not supported');
  }
}, true);

validator.addCheck('CSS Grid', async () => {
  if (!CSS.supports('display', 'grid')) {
    throw new Error('CSS Grid not supported');
  }
}, false);

validator.addCheck('CSS Flexbox', async () => {
  if (!CSS.supports('display', 'flex')) {
    throw new Error('CSS Flexbox not supported');
  }
}, true);

// React and framework checks
validator.addCheck('React Environment', async () => {
  if (typeof React === 'undefined') {
    // React might not be globally available, check for React-like environment
    if (!document.querySelector('#root')) {
      throw new Error('React root element not found');
    }
  }
}, true);

// Security checks
validator.addCheck('HTTPS Context', async () => {
  if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
    console.warn('⚠️ Running over HTTP - some features may be limited');
  }
}, false);

validator.addCheck('Content Security Policy', async () => {
  // Check if CSP is too restrictive
  try {
    const script = document.createElement('script');
    script.textContent = '// test';
    document.head.appendChild(script);
    document.head.removeChild(script);
  } catch (error) {
    throw new Error('Content Security Policy too restrictive');
  }
}, false);

// Export validator
export default validator;

// Auto-run validation on import in development
if (process.env.NODE_ENV === 'development') {
  // Run validation after a short delay to allow app initialization
  setTimeout(() => {
    validator.validate().then(report => {
      if (!report.healthy) {
        console.warn('🚨 App health issues detected. Check console for details.');
      } else {
        console.log('✅ App startup validation passed!');
      }
    });
  }, 1000);
}