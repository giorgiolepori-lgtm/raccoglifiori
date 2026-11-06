// Service worker del Cammino di Bruno: dopo la prima visita il gioco funziona anche senza internet.
const CACHE = 'cammino-di-bruno-v1';
const CORE = [
  './cammino-di-bruno.html',
  './manifest-bruno.webmanifest',
  './icone/bruno-192.png',
  './icone/bruno-512.png',
  './icone/bruno-maskable-512.png',
  './icone/bruno-apple-180.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Il gioco: prima la rete (per avere gli aggiornamenti), se non c'è la copia salvata.
  if (url.pathname.endsWith('/cammino-di-bruno.html') || (req.mode === 'navigate' && url.origin === location.origin)) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./cammino-di-bruno.html', copy)); return res; })
      .catch(() => caches.match('./cammino-di-bruno.html')));
    return;
  }
  // Font di Google e file statici: prima la copia salvata, poi la rete.
  if (url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    })));
  }
});
