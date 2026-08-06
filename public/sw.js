const VERSION = "saha-admin-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith("saha-admin-") && key !== VERSION).map((key) => caches.delete(key)))),
  ]));
});

// Admin and reservation responses intentionally remain network-only.
self.addEventListener("fetch", () => undefined);
