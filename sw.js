// sw.js – Service Worker for GymTrack

const CACHE_NAME = 'gymtrack-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './sw.js'
  // Add any additional JS or CSS files here if you separate them
];

// Install event – cache all files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // Activate SW immediately
});

// Activate event – clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Take control immediately
});

// Fetch event – serve cached files when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if found, otherwise fetch from network
      return response || fetch(event.request).catch(() => {
        // Optionally, you can return a fallback page here
        // return caches.match('./offline.html');
      });
    })
  );
});
