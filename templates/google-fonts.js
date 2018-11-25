/**
 * Cache google fonts
 */
self.addEventListener( 'install', function( event ){
    toolbox.router.get('/(.+)', toolbox.fastest, {
        origin: /https?:\/\/fonts.+/
    });
});
