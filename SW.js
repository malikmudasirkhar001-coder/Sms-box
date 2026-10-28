const CACHE_NAME = 'messages-app-v2';
const ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// Install Service Worker
self.addEventListener('install', (e) => {
    self.skipWaiting(); // Force new SW to take over
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch from Cache if Offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            // Return cached version or fetch from network
            return response || fetch(e.request).catch(() => {
                // If completely offline and not in cache, do nothing
            });
        })
    );
});
