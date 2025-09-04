/**
 * Enhanced Error Handling System
 * Professional error management and recovery
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.listeners = [];
    this.recoveryStrategies = new Map();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: Date.now()
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        error: event.reason,
        timestamp: Date.now()
      });
    });

    // Catch React errors (if available)
    if (window.React) {
      const originalError = console.error;
      console.error = (...args) => {
        if (args[0]?.includes?.('React')) {
          this.handleError({
            type: 'react',
            message: args.join(' '),
            timestamp: Date.now()
          });
        }
        originalError.apply(console, args);
      };
    }
  }

  handleError(errorInfo) {
    // Sanitize error data
    const sanitizedError = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: this.sanitizeString(errorInfo.type || 'unknown'),
      message: this.sanitizeString(errorInfo.message || 'Unknown error'),
      timestamp: errorInfo.timestamp || Date.now(),
      url: this.sanitizeString(window.location.href),
      userAgent: this.sanitizeString(navigator.userAgent),
      stack: errorInfo.error?.stack ? this.sanitizeString(errorInfo.error.stack) : null
    };

    this.errors.push(sanitizedError);
    
    // Keep only last 100 errors
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    // Notify listeners
    this.notifyListeners(sanitizedError);

    // Attempt recovery
    this.attemptRecovery(sanitizedError);

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error handled:', sanitizedError);
    }
  }

  sanitizeString(str) {
    if (typeof str !== 'string') return String(str || '');
    return encodeURIComponent(str).substring(0, 1000); // Limit length and encode
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  notifyListeners(error) {
    this.listeners.forEach(listener => {
      try {
        listener(error);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });
  }

  addRecoveryStrategy(errorType, strategy) {
    this.recoveryStrategies.set(errorType, strategy);
  }

  attemptRecovery(error) {
    const strategy = this.recoveryStrategies.get(error.type);
    if (strategy) {
      try {
        strategy(error);
      } catch (recoveryError) {
        console.error('Recovery strategy failed:', recoveryError);
      }
    }
  }

  // Get error statistics
  getErrorStats() {
    const now = Date.now();
    const last24h = this.errors.filter(e => now - e.timestamp < 86400000);
    const byType = {};
    
    this.errors.forEach(error => {
      byType[error.type] = (byType[error.type] || 0) + 1;
    });

    return {
      total: this.errors.length,
      last24h: last24h.length,
      byType,
      recent: this.errors.slice(-10)
    };
  }

  // Clear old errors
  clearErrors(olderThan = 86400000) { // 24 hours default
    const cutoff = Date.now() - olderThan;
    this.errors = this.errors.filter(error => error.timestamp > cutoff);
  }

  // Export errors for debugging
  exportErrors() {
    return {
      errors: this.errors,
      stats: this.getErrorStats(),
      timestamp: Date.now(),
      version: '1.0.0'
    };
  }

  // Recovery data management
  async saveRecoveryData(projectId, data) {
    try {
      const recoveryData = {
        projectId: this.sanitizeString(projectId),
        data: JSON.stringify(data),
        timestamp: Date.now()
      };
      
      localStorage.setItem(`recovery_${projectId}`, JSON.stringify(recoveryData));
      return true;
    } catch (error) {
      console.error('Failed to save recovery data:', error);
      return false;
    }
  }

  async checkForRecovery(projectId) {
    try {
      const recoveryKey = `recovery_${projectId}`;
      const stored = localStorage.getItem(recoveryKey);
      
      if (stored) {
        const recoveryData = JSON.parse(stored);
        
        // Check if recovery data is recent (within 1 hour)
        if (Date.now() - recoveryData.timestamp < 3600000) {
          return {
            projectId: recoveryData.projectId,
            data: JSON.parse(recoveryData.data),
            timestamp: recoveryData.timestamp
          };
        } else {
          // Clean up old recovery data
          localStorage.removeItem(recoveryKey);
        }
      }
      
      return null;
    } catch (error) {
      console.error('Failed to check recovery data:', error);
      return null;
    }
  }

  async clearRecoveryData(projectId) {
    try {
      localStorage.removeItem(`recovery_${projectId}`);
      return true;
    } catch (error) {
      console.error('Failed to clear recovery data:', error);
      return false;
    }
  }
}

// Create global error handler instance
export const errorHandler = new ErrorHandler();

// Add common recovery strategies
errorHandler.addRecoveryStrategy('network', (error) => {
  // Show offline notification
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification('Network Error', {
        body: 'Working offline. Changes will sync when connection is restored.',
        icon: '/favicon.ico'
      });
    });
  }
});

errorHandler.addRecoveryStrategy('memory', (error) => {
  // Clear caches to free memory
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        if (name.includes('temp') || name.includes('cache')) {
          caches.delete(name);
        }
      });
    });
  }
});

errorHandler.addRecoveryStrategy('storage', (error) => {
  // Clear old data from localStorage
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('temp_') || key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (e) {
    console.error('Failed to clear storage:', e);
  }
});

// Utility functions
export const withErrorHandling = (fn, context = 'unknown') => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler.handleError({
        type: 'function',
        message: `Error in ${context}: ${error.message}`,
        error,
        context
      });
      throw error;
    }
  };
};

export const safeAsync = (promise, fallback = null) => {
  return promise.catch(error => {
    errorHandler.handleError({
      type: 'async',
      message: error.message,
      error
    });
    return fallback;
  });
};

export default errorHandler;