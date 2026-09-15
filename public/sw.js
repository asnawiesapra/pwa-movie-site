/* Service worker for PWA Movie Site.
   Three caching strategies:
   1. App shell  -> cache-first  (instant repeat loads)
   2. TMDB API   -> network-first with cache fallback (fresh data, works offline)
   3. Posters    -> cache-first  (images never change for a given URL)
*/

const VERSION = "v2";
const SHELL_CACHE = `shell-${VERSION}`;
const API_CACHE = `api-${VERSION}`;
const IMG_CACHE = `img-${VERSION}`;

// Files that make the app usable with no network at all.
const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// INSTALL — pre-cache the app shell.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

// ACTIVATE — delete caches from older versions.
self.addEventListener("activate", (event) => {
  const keep = [SHELL_CACHE, API_CACHE, IMG_CACHE];
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => !keep.includes(n)).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

// FETCH — route each request to the right strategy.
self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // 1. Page navigations: try network, fall back to cached shell, then offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put("/index.html", copy));
          return response;
        })
        .catch(async () => (await caches.match("/index.html")) || caches.match("/offline.html"))
    );
    return;
  }

  // 2. TMDB API calls: network-first so data stays fresh, cache as offline backup.
  if (url.hostname === "api.themoviedb.org") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(API_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 3. Poster images: cache-first.
  if (url.hostname === "image.tmdb.org") {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const copy = response.clone();
            caches.open(IMG_CACHE).then((cache) => cache.put(request, copy));
            return response;
          })
      )
    );
    return;
  }

  // 4. Everything else (JS, CSS, icons): cache-first with network fallback.
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
    )
  );
});
