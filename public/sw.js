// Detroit Navigator Service Worker
// Provides offline functionality and PWA features

const CACHE_NAME = 'detroit-navigator-v1';
const STATIC_CACHE = 'detroit-navigator-static-v1';
const API_CACHE = 'detroit-navigator-api-v1';
const IMAGE_CACHE = 'detroit-navigator-images-v1';

// Resources to cache for offline use
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  // Add other static assets as needed
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/programs',
  '/api/categories',
  '/api/offices'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static resources
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_RESOURCES);
      }),
      
      // Cache API data
      caches.open(API_CACHE).then((cache) => {
        // Pre-cache essential API data
        return Promise.all(
          API_ENDPOINTS.map(endpoint => {
            return fetch(endpoint)
              .then(response => {
                if (response.ok) {
                  return cache.put(endpoint, response);
                }
              })
              .catch(error => {
                console.log('Failed to cache:', endpoint, error);
              });
          })
        );
      })
    ]).then(() => {
      // Force the waiting service worker to become the active service worker
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== API_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all pages
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    if (isStaticResource(request)) {
      // Cache First strategy for static resources
      event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isAPIRequest(request)) {
      // Network First strategy for API requests
      event.respondWith(networkFirst(request, API_CACHE));
    } else if (isImageRequest(request)) {
      // Cache First strategy for images
      event.respondWith(cacheFirst(request, IMAGE_CACHE));
    } else {
      // Network First for other requests
      event.respondWith(networkFirst(request, STATIC_CACHE));
    }
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-applications') {
    event.waitUntil(syncApplications());
  } else if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Detroit Navigator', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  } else if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  } else if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(clearAllCaches());
  }
});

// Caching strategies
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached version and update in background
      updateCacheInBackground(request, cache);
      return cachedResponse;
    }
    
    // Not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response for future use
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First strategy failed:', error);
    return new Response('Offline - Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function networkFirst(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    // Network failed, try cache
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await cache.match('/offline.html');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return new Response('Offline - Resource not available', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('Background cache update failed:', error);
  }
}

// Helper functions
function isStaticResource(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/static/') ||
         url.pathname.endsWith('.js') ||
         url.pathname.endsWith('.css') ||
         url.pathname === '/' ||
         url.pathname === '/index.html' ||
         url.pathname === '/manifest.json';
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') ||
         url.hostname.includes('api.') ||
         url.hostname.includes('detroitmi.gov') ||
         url.hostname.includes('michigan.gov');
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

// Background sync functions
async function syncApplications() {
  try {
    // Get pending applications from IndexedDB
    const applications = await getStoredApplications();
    const pendingApplications = applications.filter(app => app.status === 'pending-sync');
    
    for (const application of pendingApplications) {
      try {
        // Attempt to sync with server
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(application)
        });
        
        if (response.ok) {
          // Update application status
          application.status = 'submitted';
          await updateStoredApplication(application);
          
          // Notify user of successful sync
          await self.registration.showNotification('Application Synced', {
            body: `Your application for ${application.programName} has been submitted.`,
            icon: '/icons/icon-192x192.png'
          });
        }
      } catch (error) {
        console.error('Failed to sync application:', application.id, error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncFavorites() {
  try {
    // Sync favorites with server if needed
    const favorites = await getStoredFavorites();
    
    const response = await fetch('/api/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ favorites })
    });
    
    if (response.ok) {
      console.log('Favorites synced successfully');
    }
  } catch (error) {
    console.error('Failed to sync favorites:', error);
  }
}

// IndexedDB helpers (simplified versions)
async function getStoredApplications() {
  // This would interface with the IndexedDB storage service
  // For now, return empty array
  return [];
}

async function updateStoredApplication(application) {
  // This would update the application in IndexedDB
  console.log('Updating application:', application.id);
}

async function getStoredFavorites() {
  // This would get favorites from IndexedDB
  return [];
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Periodic background sync for updating cached data
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-programs') {
    event.waitUntil(updateProgramsCache());
  }
});

async function updateProgramsCache() {
  try {
    const cache = await caches.open(API_CACHE);
    
    // Update programs data
    const programsResponse = await fetch('/api/programs');
    if (programsResponse.ok) {
      await cache.put('/api/programs', programsResponse);
    }
    
    // Update categories data
    const categoriesResponse = await fetch('/api/categories');
    if (categoriesResponse.ok) {
      await cache.put('/api/categories', categoriesResponse);
    }
    
    console.log('Programs cache updated successfully');
  } catch (error) {
    console.error('Failed to update programs cache:', error);
  }
}

// Installation prompt handling
let deferredPrompt;

self.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the mini-infobar from appearing on mobile
  event.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = event;
  
  // Send message to main thread that install is available
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'INSTALL_AVAILABLE'
      });
    });
  });
});

// Handle app installation
self.addEventListener('appinstalled', (event) => {
  console.log('PWA was installed');
  
  // Send analytics event
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'APP_INSTALLED'
      });
    });
  });
});

console.log('Service Worker loaded');