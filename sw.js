const CACHE_NAME = 'pena-analisis-cache-v5';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/dashboard-home.html',
  '/Identitas Penilaian.html',
  '/peserta-didik.html',
  '/input-jawaban.html',
  '/konversi.html',
  '/analisis.html',
  '/hasil.html',
  '/cetak.html',
  '/about-info.html',
  '/icon.png?v=3',
  '/splash.png?v=2',
  '/profile.jpeg',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      return fetch(event.request).then(networkResponse => {
        if (event.request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
