/** Prefix folder deploy (mis. GitHub Pages /nama-repo/) agar cache & fallback offline benar */
const BASE = self.location.pathname.replace(/[^/]*$/, '');
const CACHE_NAME = 'pena-analisis-cache-v6';

const FILES_TO_CACHE = [
  BASE + 'index.html',
  BASE + 'dashboard.html',
  BASE + 'dashboard-home.html',
  BASE + 'Identitas Penilaian.html',
  BASE + 'peserta-didik.html',
  BASE + 'input-jawaban.html',
  BASE + 'konversi.html',
  BASE + 'analisis.html',
  BASE + 'hasil.html',
  BASE + 'cetak.html',
  BASE + 'about-info.html',
  BASE + 'icon.png?v=3',
  BASE + 'splash.png?v=2',
  BASE + 'profile.jpeg',
  BASE + 'manifest.json'
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
          return caches.match(BASE + 'index.html');
        }
      });
    })
  );
});
