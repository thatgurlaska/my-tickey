const CACHE_NAME = "my-tickey-v4";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",

    // Core
    "./core/base.css",
    "./core/app.js",

    // Home
    "./home/home.html",
    "./home/home.css",

    // To-do
    "./todo/todo.html",
    "./todo/todo.css",
    "./todo/todo.js",

    // Crochet
    "./crochet/crochet.html",
    "./crochet/crochet.css",
    "./crochet/crochet.js",

    // App icons
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


// ============================================================
// INSTALL
// Save the current app files for offline use
// ============================================================

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches
                .open(CACHE_NAME)
                .then(
                    function (cache) {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );

    }
);


// ============================================================
// ACTIVATE
// Remove old My TICKEY caches after an update
// ============================================================

self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches
                .keys()
                .then(
                    function (cacheNames) {

                        return Promise.all(

                            cacheNames.map(
                                function (cacheName) {

                                    if (
                                        cacheName !==
                                        CACHE_NAME
                                    ) {

                                        return caches.delete(
                                            cacheName
                                        );

                                    }

                                }
                            )

                        );

                    }
                )

        );

    }
);


// ============================================================
// FETCH
// Use cached files when available
// ============================================================

self.addEventListener(
    "fetch",
    function (event) {

        event.respondWith(

            caches
                .match(event.request)
                .then(
                    function (cachedResponse) {

                        return (
                            cachedResponse ||
                            fetch(event.request)
                        );

                    }
                )

        );

    }
);