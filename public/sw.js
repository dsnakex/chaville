const CACHE = 'chaville-v8';
const ASSETS = [
  './',
  './index.html',
  './aventure.html',
  './academie.html',
  './demo.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './fonts/fredoka.woff2',
  './fonts/nunito.woff2',
  './fonts/nunito-italic.woff2',
  './assets/decors/carte.png',
  './assets/decors/place.png',
  './assets/decors/port.png',
  './assets/decors/manoir.png',
  './assets/decors/bibliotheque.png',
  './assets/decors/theatre.png',
  './assets/decors/tour.png',
  './assets/decors/toits.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (e.request.method === 'GET' && res.ok && new URL(e.request.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }))
  );
});
