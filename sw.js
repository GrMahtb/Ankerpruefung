'use strict';

const BASE  = '/Ankerpruefung/';
const CACHE = 'htb-ankerpruefung-v6';

// Alle Assets die offline verfügbar sein sollen
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'styles.css',
  BASE + 'app.js',
  BASE + 'manifest.json',
  BASE + 'logo.svg',
  BASE + 'logo.png',
  BASE + 'icon.svg',
];

// ── INSTALL: alle Assets vorab cachen ──
self.addEventListener('install', event => {
  console.log('[SW Anker] install, cache:', CACHE);
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      // addAll bricht bei einem 404 ab → deshalb einzeln mit Fehlertoleranz
      return Promise.allSettled(
        ASSETS.map(url =>
          cache.add(url).catch(err =>
            console.warn('[SW Anker] Cache miss (ignoriert):', url, err)
          )
        )
      );
    })
  );
  self.skipWaiting(); // sofort aktiv werden
});

// ── ACTIVATE: alte Caches löschen ──
self.addEventListener('activate', event => {
  console.log('[SW Anker] activate');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE)
          .map(k => {
            console.log('[SW Anker] lösche alten Cache:', k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim(); // alle offenen Tabs sofort übernehmen
});

// ── FETCH: Network-first mit Cache-Fallback ──
self.addEventListener('fetch', event => {
  const { request } = event;

  // Nur GET-Requests behandeln
  if (request.method !== 'GET') return;

  // Externe Requests (CDN für pdf-lib etc.) → Cache-first, dann Netz
  const url = new URL(request.url);
  const isExternal = url.origin !== self.location.origin;

  if (isExternal) {
    // CDN-Ressourcen (pdf-lib): Cache-first
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              const clone = response.clone();
              caches.open(CACHE).then(cache => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            // CDN offline → kein Fallback nötig (PDF-Export wird später gebaut)
            return new Response('', { status: 503 });
          });
      })
    );
    return;
  }

  // Eigene Assets: Network-first, Cache als Fallback
  event.respondWith(
    fetch(request)
      .then(response => {
        // Nur gültige Responses cachen
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, clone));
        }
        return response;
      })
      .catch(async () => {
        // Offline → aus Cache laden
        const cached = await caches.match(request);
        if (cached) return cached;

        // Navigation (neuer Tab) → index.html ausliefern
        if (request.mode === 'navigate') {
          const shell = await caches.match(BASE + 'index.html');
          if (shell) return shell;
        }

        // Kein Fallback → 503
        return new Response(
          JSON.stringify({ error: 'Offline – kein Cache verfügbar' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
  );
});

// ── MESSAGE: manuelles Cache-Update vom UI aus ──
self.addEventListener('message', event => {
  if (event.data?.action === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data?.action === 'getVersion') {
    event.ports[0]?.postMessage({ version: CACHE });
  }
});
