// Service Worker pour cache offline des données API
const CACHE_NAME = 'allstarsbattle-api-v1';
const API_CACHE_NAME = 'allstarsbattle-api-data-v1';

// Routes à mettre en cache
const API_ROUTES_TO_CACHE = [
  '/api/participants',
  '/api/stats',
  '/api/featured-piece',
  '/api/recent-news',
  '/api/program',
  '/api/bracket',
  '/api/partners',
  '/api/page-backgrounds'
];

// Assets statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/robots.txt'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker caching static assets.');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache des API calls
  if (url.origin === 'https://api.allstarbattle.dance' &&
      API_ROUTES_TO_CACHE.some(route => url.pathname.startsWith(route))) {

    event.respondWith(
      caches.open(API_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          // Retourner la réponse en cache si elle existe
          if (cachedResponse) {
            // Vérifier si la réponse en cache est encore fraîche (moins de 5 minutes)
            const cacheTime = new Date(cachedResponse.headers.get('sw-cache-time') || 0);
            const now = new Date();
            const age = now - cacheTime;

            if (age < 5 * 60 * 1000) { // 5 minutes
              return cachedResponse;
            }
          }

          // Sinon, faire la requête réseau et mettre en cache
          return fetch(request).then((networkResponse) => {
            // Cloner la réponse pour la mettre en cache
            const responseToCache = networkResponse.clone();

            // Ajouter un timestamp pour le cache
            const responseWithTimestamp = new Response(responseToCache.body, {
              status: responseToCache.status,
              statusText: responseToCache.statusText,
              headers: {
                ...Object.fromEntries(responseToCache.headers.entries()),
                'sw-cache-time': new Date().toISOString()
              }
            });

            cache.put(request, responseWithTimestamp);
            return networkResponse;
          }).catch(() => {
            // En cas d'erreur réseau, retourner la réponse en cache même si elle est vieille
            if (cachedResponse) {
              return cachedResponse;
            }
            // Ou retourner une réponse d'erreur
            return new Response(JSON.stringify({ error: 'Offline', cached: true }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        });
      })
    );
  }

  // Pour les autres requêtes, stratégie cache-first pour les assets statiques
  else if (request.destination === 'style' ||
           request.destination === 'script' ||
           request.destination === 'image' ||
           request.destination === 'font') {

    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request).then((networkResponse) => {
          // Mettre en cache les assets statiques
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        });
      })
    );
  }
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});