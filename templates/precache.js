/**
 * Precache the URL and any other resources
 * passed to the `<%= var %>` config
 */
self.addEventListener( 'install', function( event ){
    toolbox.precache(['<%= resources %>']);
});
