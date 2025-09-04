/**
 * Video Processing Queue System
 * Manages multiple video processing jobs with concurrency control
 */

class VideoProcessingQueue {
  constructor(maxConcurrent = 2) {
    this.queue = [];
    this.processing = new Set();
    this.maxConcurrent = maxConcurrent;
    this.onProgressCallbacks = new Map();
    this.onCompleteCallbacks = new Map();
    this.onErrorCallbacks = new Map();
    this.workers = new Map();
    
    // Listen for device memory pressure
    if ('memory' in navigator) {
      this.adjustConcurrencyBasedOnMemory();
    }
  }
  
  /**
   * Add a new video job to the processing queue
   */
  addToQueue(videoJob) {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Add job to queue with metadata
    this.queue.push({ 
      id: jobId, 
      status: 'queued',
      addedAt: Date.now(),
      priority: videoJob.priority || 'normal',
      ...videoJob 
    });
    
    // Sort queue by priority
    this.sortQueue();
    
    // Start processing if possible
    this.processQueue();
    
    return jobId;
  }
  
  /**
   * Sort the queue based on priority and timestamp
   */
  sortQueue() {
    const priorityValues = {
      'high': 3,
      'normal': 2,
      'low': 1
    };
    
    this.queue.sort((a, b) => {
      // First by priority
      const priorityDiff = (priorityValues[b.priority] || 2) - (priorityValues[a.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by timestamp (older first)
      return a.addedAt - b.addedAt;
    });
  }
  
  /**
   * Register progress callback for a job
   */
  onProgress(jobId, callback) {
    this.onProgressCallbacks.set(jobId, callback);
    return this; // For chaining
  }
  
  /**
   * Register completion callback for a job
   */
  onComplete(jobId, callback) {
    this.onCompleteCallbacks.set(jobId, callback);
    return this; // For chaining
  }
  
  /**
   * Register error callback for a job
   */
  onError(jobId, callback) {
    this.onErrorCallbacks.set(jobId, callback);
    return this; // For chaining
  }
  
  /**
   * Cancel a specific job
   */
  cancelJob(jobId) {
    // If job is in queue, remove it
    const queueIndex = this.queue.findIndex(job => job.id === jobId);
    if (queueIndex !== -1) {
      this.queue.splice(queueIndex, 1);
      return true;
    }
    
    // If job is processing, terminate the worker
    if (this.processing.has(jobId) && this.workers.has(jobId)) {
      const worker = this.workers.get(jobId);
      worker.postMessage({ command: 'cancel' });
      worker.terminate();
      
      this.processing.delete(jobId);
      this.workers.delete(jobId);
      
      // Clean up callbacks
      this.onProgressCallbacks.delete(jobId);
      this.onCompleteCallbacks.delete(jobId);
      this.onErrorCallbacks.delete(jobId);
      
      // Process next job
      this.processQueue();
      return true;
    }
    
    return false; // Job not found
  }
  
  /**
   * Process the next job in the queue if possible
   */
  async processQueue() {
    if (this.processing.size >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }
    
    const job = this.queue.shift();
    this.processing.add(job.id);
    
    try {
      // Create worker for this job
      const worker = new Worker(new URL('../workers/videoWorker.js', import.meta.url));
      this.workers.set(job.id, worker);
      
      worker.onmessage = (e) => {
        const { status, progress, video, error } = e.data;
        
        if (status === 'progress') {
          const callback = this.onProgressCallbacks.get(job.id);
          if (callback) callback(progress, e.data);
        } else if (status === 'complete') {
          this.processing.delete(job.id);
          this.workers.delete(job.id);
          
          const callback = this.onCompleteCallbacks.get(job.id);
          if (callback) callback(video);
          
          // Clean up callbacks
          this.onProgressCallbacks.delete(job.id);
          this.onCompleteCallbacks.delete(job.id);
          this.onErrorCallbacks.delete(job.id);
          
          // Save successful export to IndexedDB
          this.saveExportRecord(job.id, {
            ...job,
            status: 'completed',
            completedAt: Date.now(),
            video
          });
          
          // Process next job
          this.processQueue();
        } else if (status === 'error') {
          this.processing.delete(job.id);
          this.workers.delete(job.id);
          
          const callback = this.onErrorCallbacks.get(job.id);
          if (callback) callback(error);
          
          // Clean up callbacks
          this.onProgressCallbacks.delete(job.id);
          this.onCompleteCallbacks.delete(job.id);
          this.onErrorCallbacks.delete(job.id);
          
          // Save error record
          this.saveExportRecord(job.id, {
            ...job,
            status: 'failed',
            error,
            failedAt: Date.now()
          });
          
          // Process next job
          this.processQueue();
        }
      };
      
      worker.onerror = (error) => {
        console.error('Worker error:', error);
        
        this.processing.delete(job.id);
        this.workers.delete(job.id);
        
        const callback = this.onErrorCallbacks.get(job.id);
        if (callback) callback({
          message: 'Worker error',
          originalError: error
        });
        
        // Clean up callbacks
        this.onProgressCallbacks.delete(job.id);
        this.onCompleteCallbacks.delete(job.id);
        this.onErrorCallbacks.delete(job.id);
        
        // Process next job
        this.processQueue();
      };
      
      // Start processing
      worker.postMessage({
        frames: job.frames,
        audioTrack: job.audioTrack,
        options: job.options
      });
    } catch (error) {
      console.error('Error starting video job:', error);
      
      this.processing.delete(job.id);
      
      const callback = this.onErrorCallbacks.get(job.id);
      if (callback) callback({
        message: 'Failed to start processing',
        originalError: error
      });
      
      // Clean up callbacks
      this.onProgressCallbacks.delete(job.id);
      this.onCompleteCallbacks.delete(job.id);
      this.onErrorCallbacks.delete(job.id);
      
      // Process next job
      this.processQueue();
    }
  }
  
  /**
   * Save export record to IndexedDB
   */
  async saveExportRecord(jobId, record) {
    try {
      // In a real implementation, this would save to IndexedDB
      // For this example, we'll just log it with sanitized data
      const sanitizedRecord = {
        jobId: encodeURIComponent(String(record.jobId || 'unknown')),
        status: encodeURIComponent(String(record.status || 'unknown')),
        timestamp: record.completedAt || record.failedAt || Date.now()
      };
      console.log('Export record saved:', sanitizedRecord);
      
      // Notify any listeners about the export record
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('videoExportUpdate', { 
          detail: { jobId, record } 
        }));
      }
    } catch (error) {
      console.error('Failed to save export record:', error);
    }
  }
  
  /**
   * Adjust concurrency based on available device memory
   */
  adjustConcurrencyBasedOnMemory() {
    const updateConcurrency = () => {
      try {
        // Get available memory in GB
        const memoryInGB = navigator.deviceMemory || 4;
        
        // Adjust concurrency based on available memory
        if (memoryInGB <= 2) {
          this.maxConcurrent = 1; // Low memory devices
        } else if (memoryInGB <= 4) {
          this.maxConcurrent = 2; // Medium memory devices
        } else if (memoryInGB <= 8) {
          this.maxConcurrent = 3; // High memory devices
        } else {
          this.maxConcurrent = 4; // Very high memory devices
        }
        
        console.log(`Adjusted video processing concurrency to ${this.maxConcurrent} based on ${memoryInGB}GB device memory`);
      } catch (error) {
        console.error('Error adjusting concurrency:', error);
      }
    };
    
    // Update initially
    updateConcurrency();
    
    // Update when tab becomes visible again
    if (document.addEventListener) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          updateConcurrency();
        }
      });
    }
  }
  
  /**
   * Get current queue status
   */
  getStatus() {
    return {
      queued: this.queue.length,
      processing: this.processing.size,
      maxConcurrent: this.maxConcurrent
    };
  }
}

// Create and export singleton instance
export const videoQueue = new VideoProcessingQueue();

// Export class for testing or custom instances
export default VideoProcessingQueue;