/**
 * Offline Service
 * Handles offline video creation and sync capabilities
 */

class OfflineService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingSync = [];
    this.offlineAssets = new Map();
    
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  /**
   * Check if the app is currently online
   */
  isAppOnline() {
    return this.isOnline;
  }

  /**
   * Handle going online
   */
  handleOnline() {
    this.isOnline = true;
    console.log('App is now online');
    this.syncPendingData();
    this.notifyStatusChange('online');
  }

  /**
   * Handle going offline
   */
  handleOffline() {
    this.isOnline = false;
    console.log('App is now offline');
    this.notifyStatusChange('offline');
  }

  /**
   * Cache assets for offline use
   */
  async cacheAssets(assets) {
    try {
      const cache = await caches.open('viralshort-assets-v1');
      
      for (const asset of assets) {
        try {
          await cache.add(asset.url);
          this.offlineAssets.set(asset.id, {
            url: asset.url,
            type: asset.type,
            cachedAt: Date.now()
          });
        } catch (error) {
          console.warn(`Failed to cache asset: ${asset.url}`, error);
        }
      }
      
      return true;
    } catch (error) {
      console.error('Failed to cache assets:', error);
      return false;
    }
  }

  /**
   * Get cached asset
   */
  async getCachedAsset(assetId) {
    try {
      const asset = this.offlineAssets.get(assetId);
      if (!asset) return null;

      const cache = await caches.open('viralshort-assets-v1');
      const response = await cache.match(asset.url);
      
      if (response) {
        return {
          ...asset,
          blob: await response.blob()
        };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get cached asset:', error);
      return null;
    }
  }

  /**
   * Save project for offline editing
   */
  async saveOfflineProject(project) {
    try {
      const offlineProjects = await this.getOfflineProjects();
      offlineProjects[project.id] = {
        ...project,
        offlineMode: true,
        lastModified: Date.now(),
        syncStatus: 'pending'
      };
      
      localStorage.setItem('viralshort-offline-projects', JSON.stringify(offlineProjects));
      return true;
    } catch (error) {
      console.error('Failed to save offline project:', error);
      return false;
    }
  }

  /**
   * Get all offline projects
   */
  async getOfflineProjects() {
    try {
      const stored = localStorage.getItem('viralshort-offline-projects');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get offline projects:', error);
      return {};
    }
  }

  /**
   * Create video offline
   */
  async createVideoOffline(projectData) {
    try {
      // Use cached assets and create video locally
      const offlineVideo = {
        id: `offline_${Date.now()}`,
        projectId: projectData.id,
        frames: projectData.frames,
        settings: projectData.settings,
        createdAt: Date.now(),
        status: 'offline-created',
        syncStatus: 'pending'
      };

      // Store in pending sync queue
      this.pendingSync.push({
        type: 'video-creation',
        data: offlineVideo,
        timestamp: Date.now()
      });

      // Save to local storage
      const pendingVideos = await this.getPendingVideos();
      pendingVideos[offlineVideo.id] = offlineVideo;
      localStorage.setItem('viralshort-pending-videos', JSON.stringify(pendingVideos));

      return offlineVideo;
    } catch (error) {
      console.error('Failed to create video offline:', error);
      throw error;
    }
  }

  /**
   * Get pending videos
   */
  async getPendingVideos() {
    try {
      const stored = localStorage.getItem('viralshort-pending-videos');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to get pending videos:', error);
      return {};
    }
  }

  /**
   * Sync pending data when online
   */
  async syncPendingData() {
    if (!this.isOnline || this.pendingSync.length === 0) return;

    console.log(`Syncing ${this.pendingSync.length} pending items...`);

    const syncPromises = this.pendingSync.map(async (item) => {
      try {
        await this.syncItem(item);
        return { success: true, item };
      } catch (error) {
        console.error('Failed to sync item:', error);
        return { success: false, item, error };
      }
    });

    const results = await Promise.allSettled(syncPromises);
    
    // Remove successfully synced items
    const successfulSyncs = results
      .filter(result => result.status === 'fulfilled' && result.value.success)
      .map(result => result.value.item);

    this.pendingSync = this.pendingSync.filter(
      item => !successfulSyncs.includes(item)
    );

    console.log(`Synced ${successfulSyncs.length} items successfully`);
    this.notifyStatusChange('sync-complete', { synced: successfulSyncs.length });
  }

  /**
   * Sync individual item
   */
  async syncItem(item) {
    switch (item.type) {
      case 'video-creation':
        return await this.syncVideoCreation(item.data);
      case 'project-update':
        return await this.syncProjectUpdate(item.data);
      default:
        throw new Error(`Unknown sync item type: ${item.type}`);
    }
  }

  /**
   * Sync video creation
   */
  async syncVideoCreation(videoData) {
    // Mock API call - in real implementation, this would upload to server
    console.log('Syncing video creation:', videoData.id);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update local storage to mark as synced
    const pendingVideos = await this.getPendingVideos();
    if (pendingVideos[videoData.id]) {
      pendingVideos[videoData.id].syncStatus = 'synced';
      pendingVideos[videoData.id].syncedAt = Date.now();
      localStorage.setItem('viralshort-pending-videos', JSON.stringify(pendingVideos));
    }

    return true;
  }

  /**
   * Sync project update
   */
  async syncProjectUpdate(projectData) {
    console.log('Syncing project update:', projectData.id);
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update local storage
    const offlineProjects = await this.getOfflineProjects();
    if (offlineProjects[projectData.id]) {
      offlineProjects[projectData.id].syncStatus = 'synced';
      offlineProjects[projectData.id].syncedAt = Date.now();
      localStorage.setItem('viralshort-offline-projects', JSON.stringify(offlineProjects));
    }

    return true;
  }

  /**
   * Get sync status
   */
  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      pendingItems: this.pendingSync.length,
      cachedAssets: this.offlineAssets.size,
      lastSync: localStorage.getItem('viralshort-last-sync')
    };
  }

  /**
   * Clear offline data
   */
  async clearOfflineData() {
    try {
      // Clear cached assets
      await caches.delete('viralshort-assets-v1');
      
      // Clear local storage
      localStorage.removeItem('viralshort-offline-projects');
      localStorage.removeItem('viralshort-pending-videos');
      localStorage.removeItem('viralshort-last-sync');
      
      // Reset internal state
      this.pendingSync = [];
      this.offlineAssets.clear();
      
      return true;
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      return false;
    }
  }

  /**
   * Notify status change
   */
  notifyStatusChange(status, data = {}) {
    const event = new CustomEvent('offlineStatusChange', {
      detail: { status, data, timestamp: Date.now() }
    });
    window.dispatchEvent(event);
  }

  /**
   * Estimate storage usage
   */
  async getStorageUsage() {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
          percentage: estimate.quota ? Math.round((estimate.usage / estimate.quota) * 100) : 0
        };
      }
      return { used: 0, quota: 0, percentage: 0 };
    } catch (error) {
      console.error('Failed to get storage usage:', error);
      return { used: 0, quota: 0, percentage: 0 };
    }
  }
}

// Create and export singleton instance
export const offlineService = new OfflineService();

// Export class for testing
export default OfflineService;