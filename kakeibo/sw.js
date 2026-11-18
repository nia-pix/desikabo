// オフラインでも開けるようにするサービスワーカー
const CACHE = 'kakeibo-v18';
const FILES = ['./', './index.html', './manifest.webmanifest', './pig.webp', './pig-sad.webp', './pig-empty.webp', './icon-192.png', './icon-512.png', './icon-maskable.png', './apple-touch-icon.png',
  './fx/coin-gold.webp', './fx/coin-silver.webp', './fx/coin-star.webp', './fx/flame.webp', './fx/heart-blue.webp', './fx/heart-pink.webp', './fx/heart-purple.webp', './fx/sp-pink.webp', './fx/sp-purple.webp', './fx/sp-rainbow.webp', './fx/sp-white.webp', './fx/star-blue.webp', './fx/star-mint.webp', './fx/star-pink.webp', './fx/star-purple.webp', './fx/star-yellow.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// ネット優先・つながらない時はキャッシュ（アプリ更新がすぐ反映されるように）
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res.ok && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
