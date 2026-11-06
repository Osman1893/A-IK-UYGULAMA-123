// Service Worker for Uzaktan Türkolog PWA
// Complete offline mode support for lessons, alphabet, and authentic Kazakh audio
const CACHE_NAME = 'turkolog-cache-v3';

// Core shell assets and Kazakh special letter audios pre-cached during SW installation
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  // 9 Authentic Kazakh Special Letter Audios generated with Gemini TTS
  '/audio/letters/letter_1240.wav', // Ә (1240)
  '/audio/letters/letter_1030.wav', // І (1030)
  '/audio/letters/letter_1186.wav', // Ң (1186)
  '/audio/letters/letter_1170.wav', // Ғ (1170)
  '/audio/letters/letter_1198.wav', // Ү (1198)
  '/audio/letters/letter_1200.wav', // Ұ (1200)
  '/audio/letters/letter_1178.wav', // Қ (1178)
  '/audio/letters/letter_1256.wav', // Ө (1256)
  '/audio/letters/letter_1210.wav'  // Һ (1210)
];

// Installation: Pre-cache core shell and essential audio files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use map with catch so individual failures don't block SW installation
      return Promise.allSettled(
        CORE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn('[SW] Could not pre-cache asset:', asset, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activation: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch: Strategy depending on request type
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Exclude real-time synthesis admin APIs from caching
  if (url.pathname.startsWith('/api/admin/synthesize')) {
    return;
  }

  // 1. Navigation requests (HTML pages) -> Network first, fallback to cached index.html
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        })
        .catch(() => {
          return caches.match('/index.html').then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  // 2. Audio files (.wav, .mp3) -> Cache first, fallback to network and cache
  if (url.pathname.startsWith('/audio/') || url.pathname.endsWith('.wav') || url.pathname.endsWith('.mp3')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. Static assets (JS, CSS, images, fonts) -> Stale-while-revalidate / Cache first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache));
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return cachedResponse;
        });

      return cachedResponse || fetchPromise;
    })
  );
});

// Communication with client app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
