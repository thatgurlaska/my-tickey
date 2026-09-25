const CACHE_NAME = "my-tickey-v2";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];


// Save the app files for offline use
self.addEventListener("install", function (event) {

    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {

            return cache.addAll(FILES_TO_CACHE);

        })
    );

});


// Remove old caches after an update
self.addEventListener("activate", function (event) {

    event.waitUntil(
        caches.keys().then(function (cacheNames) {

            return Promise.all(
                cacheNames.map(function (cacheName) {

                    if (cacheName !== CACHE_NAME) {

                        return caches.delete(cacheName);

                    }

                })
            );

        })
    );

});


// Load cached files when possible
self.addEventListener("fetch", function (event) {

    event.respondWith(
        caches.match(event.request).then(function (cachedResponse) {

            return cachedResponse || fetch(event.request);

        })
    );

});