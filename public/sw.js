const CACHE_NAME = "sports-dashboard-v1";
const STATIC_CACHE_NAME = "sports-dashboard-static-v1";
const API_CACHE_NAME = "sports-dashboard-api-v1";

// Files to cache for offline functionality
const STATIC_FILES = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// API endpoints to cache
const API_ENDPOINTS = [
  "/api/scores",
  "/api/teams",
  "/api/players",
  "/api/standings",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log("Service Worker: Caching static files");
        return cache.addAll(STATIC_FILES);
      }),
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log("Service Worker: Pre-caching API endpoints");
        // Pre-cache API endpoints if they're available
        return Promise.allSettled(
          API_ENDPOINTS.map(
            (endpoint) =>
              fetch(endpoint)
                .then((response) =>
                  response.ok ? cache.put(endpoint, response) : null
                )
                .catch(() => null) // Ignore failures during pre-caching
          )
        );
      }),
    ]).then(() => {
      console.log("Service Worker: Installation complete");
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== API_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Activation complete");
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleApiRequest(request));
  }
  // Handle static assets
  else if (
    request.destination === "document" ||
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image"
  ) {
    event.respondWith(handleStaticRequest(request));
  }
  // Handle other requests
  else {
    event.respondWith(handleOtherRequest(request));
  }
});

// API request handler - Network First with Cache Fallback
async function handleApiRequest(request) {
  try {
    console.log("Service Worker: Fetching API data from network:", request.url);

    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      console.log("Service Worker: Cached API response:", request.url);
      return networkResponse;
    }

    throw new Error("Network response not ok");
  } catch (error) {
    console.log("Service Worker: Network failed, trying cache:", request.url);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log("Service Worker: Serving from cache:", request.url);
      return cachedResponse;
    }

    // Return offline response for API calls
    console.log(
      "Service Worker: No cache available, returning offline response"
    );
    return new Response(
      JSON.stringify({
        error: "offline",
        message: "Data unavailable offline",
        cached: false,
        timestamp: Date.now(),
      }),
      {
        status: 503,
        statusText: "Service Unavailable",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}

// Static request handler - Cache First with Network Fallback
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log(
        "Service Worker: Serving static file from cache:",
        request.url
      );
      return cachedResponse;
    }

    // Fallback to network
    console.log(
      "Service Worker: Fetching static file from network:",
      request.url
    );
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("Service Worker: Static file request failed:", request.url);

    // For HTML requests, return the cached index.html as fallback
    if (request.destination === "document") {
      const cachedIndex = await caches.match("/index.html");
      if (cachedIndex) {
        return cachedIndex;
      }
    }

    throw error;
  }
}

// Other request handler
async function handleOtherRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response("Offline", { status: 503 });
  }
}

// Background sync for when connection is restored
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    console.log("Service Worker: Background sync triggered");
    event.waitUntil(
      // Refresh critical data when back online
      refreshCriticalData()
    );
  }
});

// Refresh critical data
async function refreshCriticalData() {
  try {
    const cache = await caches.open(API_CACHE_NAME);
    const refreshPromises = API_ENDPOINTS.map(async (endpoint) => {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          await cache.put(endpoint, response);
          console.log("Service Worker: Refreshed cache for:", endpoint);
        }
      } catch (error) {
        console.log("Service Worker: Failed to refresh:", endpoint);
      }
    });

    await Promise.allSettled(refreshPromises);

    // Notify clients that data has been refreshed
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: "DATA_REFRESHED",
        timestamp: Date.now(),
      });
    });
  } catch (error) {
    console.error("Service Worker: Failed to refresh critical data:", error);
  }
}
