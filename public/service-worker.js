/**
 * ViralShort Studio Service Worker
 * Provides offline support and asset caching
 */

const CACHE_NAME = 'viralshort-studio-v1';
const ASSET_CACHE_NAME = 'viralshort-studio-assets-v1';
const EXPORT_CACHE_NAME = 'viralshort-studio-exports-v1';

// Resources to cache on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/logo.png'
];

// Cache core app shell on install
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Install completed');
        return self.skipWaiting();
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating');
  
  const currentCaches = [CACHE_NAME, ASSET_CACHE_NAME, EXPORT_CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then((cachesToDelete) => {
        return Promise.all(cachesToDelete.map((cacheToDelete) => {
          console.log('[Service Worker] Deleting old cache:', cacheToDelete);
          return caches.delete(cacheToDelete);
        }));
      })
      .then(() => {
        console.log('[Service Worker] Activation completed');
        return self.clients.claim();
      })
  );
});

// Handle fetch requests with different strategies
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip browser extensions and chrome URLs
  if (!(url.protocol === 'http:' || url.protocol === 'https:')) return;
  
  // Skip analytics and tracking requests
  if (url.hostname.includes('google-analytics.com') || 
      url.hostname.includes('analytics') || 
      url.pathname.includes('tracking')) {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstWithTimeout(event.request, 3000));
    return;
  }
  
  // Handle media assets
  if (url.pathname.startsWith('/assets/') || 
      url.pathname.includes('.jpg') || 
      url.pathname.includes('.png') || 
      url.pathname.includes('.svg') || 
      url.pathname.includes('.webp') || 
      url.pathname.includes('.mp3') || 
      url.pathname.includes('.mp4')) {
    event.respondWith(cacheFirst(event.request, ASSET_CACHE_NAME));
    return;
  }
  
  // Handle exported videos
  if (url.pathname.startsWith('/exports/') || url.pathname.includes('blob:')) {
    event.respondWith(cacheFirst(event.request, EXPORT_CACHE_NAME));
    return;
  }
  
  // Handle app shell and other resources
  event.respondWith(networkFirst(event.request, CACHE_NAME));
});

/**
 * Network-first strategy with timeout fallback
 */
async function networkFirstWithTimeout(request, timeoutMs) {
  try {
    // Try network first with timeout
    const networkPromise = fetch(request);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Network timeout')), timeoutMs);
    });
    
    // Race network request against timeout
    const response = await Promise.race([networkPromise, timeoutPromise]);
    
    // Cache successful response
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network request failed, falling back to cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If no cache, return offline fallback
    return caches.match('/offline.html') || new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Network-first strategy
 */
async function networkFirst(request, cacheName) {
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful response
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network request failed, falling back to cache');
    
    // Try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If request is for the main page, return offline page
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || new Response('Offline', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Otherwise return error
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Cache-first strategy
 */
async function cacheFirst(request, cacheName) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // If not in cache, get from network
    const response = await fetch(request);
    
    // Cache successful response
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    
    return response;
  } catch (error) {
    console.log('[Service Worker] Network request failed for cache-first strategy');
    
    // For images, return placeholder
    if (request.url.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return caches.match('/assets/placeholder-image.png') || new Response('Image not available', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // For other resources, return error
    return new Response('Resource not available offline', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_ASSET') {
    const { url } = event.data;
    
    if (url) {
      caches.open(ASSET_CACHE_NAME).then(cache => {
        fetch(url).then(response => {
          cache.put(url, response);
        });
      });
    }
  }
  
  if (event.data && event.data.type === 'CACHE_EXPORT') {
    const { url, blob } = event.data;
    
    if (url && blob) {
      caches.open(EXPORT_CACHE_NAME).then(cache => {
        const response = new Response(blob);
        cache.put(url, response);
      });
    }
  }
});