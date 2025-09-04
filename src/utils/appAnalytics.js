// App Analytics Console
class AppAnalytics {
  constructor() {
    this.logs = [];
    this.performance = {};
    this.errors = [];
    this.features = {};
  }

  // Track feature usage
  trackFeature(feature, data = {}) {
    const timestamp = Date.now();
    this.features[feature] = { ...data, timestamp, count: (this.features[feature]?.count || 0) + 1 };
    console.log(`📊 Feature: ${feature}`, data);
  }

  // Track performance
  trackPerformance(action, duration) {
    this.performance[action] = { duration, timestamp: Date.now() };
    console.log(`⚡ Performance: ${action} took ${duration}ms`);
  }

  // Track errors
  trackError(error, context) {
    const errorData = { error: error.message, context, timestamp: Date.now() };
    this.errors.push(errorData);
    console.error(`❌ Error: ${context}`, error);
  }

  // Get analytics report
  getReport() {
    return {
      features: this.features,
      performance: this.performance,
      errors: this.errors,
      summary: {
        totalFeatures: Object.keys(this.features).length,
        totalErrors: this.errors.length,
        avgPerformance: Object.values(this.performance).reduce((a, b) => a + b.duration, 0) / Object.keys(this.performance).length || 0
      }
    };
  }
}

// Global analytics instance
window.analytics = new AppAnalytics();

// Auto-track page loads
window.analytics.trackFeature('app_loaded', { url: window.location.href });

// Track video creation
window.trackVideoCreation = (quality, background, duration) => {
  window.analytics.trackFeature('video_created', { quality, background, duration });
};

// Track script generation
window.trackScriptGeneration = (niche, topic) => {
  window.analytics.trackFeature('script_generated', { niche, topic });
};

// Performance monitoring
const originalFetch = window.fetch;
window.fetch = async (...args) => {
  const start = Date.now();
  try {
    const result = await originalFetch(...args);
    window.analytics.trackPerformance('fetch_request', Date.now() - start);
    return result;
  } catch (error) {
    window.analytics.trackError(error, 'fetch_request');
    throw error;
  }
};

export default AppAnalytics;