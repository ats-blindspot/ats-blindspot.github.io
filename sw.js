// CHANGE THIS VERSION NUMBER EVERY TIME YOU DEPLOY AN UPDATE (e.g., v1.0.1, v1.0.2)
const CACHE_NAME = 'blindspot-v1.0.0'; 
const ASSETS = [
  './',
  './index.html',
  './admin_manifest.json',
  './icon_192.png',
  './icon-512.png'
];

// Install Service Worker & Cache Files
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force new service worker to take over immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate & Clear Old Cache
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim()) // Tell the new SW to control all open pages
  );
});

// Fetch from Cache (Offline Support)
self.addEventListener('fetch', (e) => {
  // Ignore Supabase API calls
  if (e.request.url.includes('supabase.co') || e.request.url.includes('functions/v1')) return;
  
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request);
    })
  );
});

// --- PUSH NOTIFICATION LISTENER ---
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './icon_192.png',
      badge: './icon_192.png',
      vibrate: [100, 50, 100]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
