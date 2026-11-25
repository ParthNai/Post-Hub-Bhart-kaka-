const CACHE_NAME = 'posterbanao-v8';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/utils.js',
  './js/profile.js',
  './js/templates.js',
  './js/ai-text.js',
  './js/sticker-library.js',
  './js/canvas-engine.js',
  './js/native-bridge.js',
  './js/download.js',
  './js/config.js',
  './js/video.js',
  './js/app.js',
  './assets/brand/posterbanao-mark.svg',
  './assets/brand/posterbanao-icon-192.png',
  './assets/brand/posterbanao-icon-512.png',
  './assets/brand/posterbanao-maskable-512.png',
  './assets/photos/wedding_real.jpg',
  './assets/photos/retail_offer_real.jpg',
  './assets/photos/birthday_cake_real.jpg'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass service worker for external API calls or hot reloads
  if (url.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === 'navigate' || event.request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put('./index.html', responseToCache);
        });

        return networkResponse;
      }).catch(() => caches.match('./index.html').then((cachedResponse) => cachedResponse || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response immediately
        return cachedResponse;
      }

      // Fallback to network
      return fetch(event.request).then((networkResponse) => {
        // Check if response is valid
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Cache new static assets dynamically (e.g. templates, photos)
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback for html requests
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
