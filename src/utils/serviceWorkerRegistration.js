/**
 * Service Worker Registration
 * Registers the service worker for offline support and caching
 */

// Check if service workers are supported
const isServiceWorkerSupported = 'serviceWorker' in navigator;

/**
 * Register the service worker
 */
export function register() {
  if (isServiceWorkerSupported) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';
      
      registerValidSW(swUrl);
    });
  } else {
    console.log('Service workers are not supported in this browser');
  }
}

/**
 * Register the service worker with the given URL
 */
function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      // Success
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Check for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // New content is available; notify the user
              console.log('New content is available and will be used when all tabs for this page are closed.');
              
              // Dispatch event for the app to show update notification
              window.dispatchEvent(new CustomEvent('serviceWorkerUpdate', {
                detail: { registration }
              }));
            } else {
              // Content is cached for offline use
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

/**
 * Unregister the service worker
 */
export function unregister() {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error('Error during service worker unregistration:', error);
      });
  }
}

/**
 * Check for service worker updates
 */
export function checkForUpdates() {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.update();
      })
      .catch(error => {
        console.error('Error checking for service worker updates:', error);
      });
  }
}

/**
 * Force service worker to activate immediately
 */
export function forceActivate() {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then(registration => {
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch(error => {
        console.error('Error forcing service worker activation:', error);
      });
  }
}

/**
 * Cache an asset URL
 */
export function cacheAsset(url) {
  if (isServiceWorkerSupported && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_ASSET',
      url
    });
  }
}

/**
 * Cache an exported video
 */
export async function cacheExport(url, blob) {
  if (isServiceWorkerSupported && navigator.serviceWorker.controller) {
    try {
      // Convert blob to ArrayBuffer for safe transfer
      const arrayBuffer = await blob.arrayBuffer();
      
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_EXPORT',
        url: encodeURIComponent(url),
        data: arrayBuffer,
        mimeType: blob.type
      }, [arrayBuffer]); // Transfer the ArrayBuffer
    } catch (error) {
      console.error('Failed to cache export:', error);
      
      // Fallback: send just the URL for the service worker to fetch
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_EXPORT_URL',
        url: encodeURIComponent(url)
      });
    }
  }
}