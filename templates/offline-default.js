/**
 * If we are not online and we are getting page content via
 * 'navigate' event.
 *
 * We first check the cache for the page and return it if available
 * If not available, we return the specified `offlineFallback`
 *
 */
self.addEventListener('fetch', function(event) {
    if (event.request.mode === 'navigate' && !navigator.onLine) {
        event.respondWith(
            caches.match(event.request).then(function (response) {
                return response || caches.match('<%= config.offlineFallback.url %>');
            }).catch(function () {
                console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
                throw Error('Page is not cached and we don\'t have an offlineFallback.');
            })
        );
    }
});
