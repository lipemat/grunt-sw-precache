# grunt-service-worker-precache

A [Grunt](http://gruntjs.com) task for generating service workers using [sw-precache](https://www.npmjs.com/package/sw-precache).

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://bitbucket.org/morrisallison/grunt-sw-precache/raw/default/LICENSE)

Loaded with default settings including `runtimeCaching` which automatically uses the correct [handlers](https://googlechromelabs.github.io/sw-toolbox/api.html#handlers) to cache both the page content and all resources. 

**Out of the box this will work for dynamic websites without any special configurations!**

_Obviously_ all options may be overridden for static sites and apps.

## Getting Started

grunt-sw-precache requires Grunt `~1.0.3`.

If you haven't used [Grunt](http://gruntjs.com/) before, please view the [Getting Started](http://gruntjs.com/getting-started) guide.
The guide explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile), and how to install and use Grunt plugins.

## Installation

Add the following resolution to your `package.json` file

``` bash
npm install grunt-service-worked-precache
```


To enable grunt-service-worked-precache, add the following line to your `Gruntfile`:

```javascript
grunt.loadNpmTasks('grunt-service-worked-precache');
```

## Configuration

The options documented here are specific to `grunt-service-worked-precache`.

For all other options, please view the [options documentation for sw-precache](https://github.com/googlechrome/sw-precache#options).

### offlineFallback `object`

A page to load if the we go offline and the current page is not cached. Also specifiy an array of resources like images or stylesheets to preload specifically for this page.

```js
 offlineFallback: {
        url : '/',
        resources: [ '/dist/img1.png', '/dist/style.css' ]
    }
```

Default is `url : '/'` and `resources: []`. Set to false to disable.

### baseDir `string`

The base directory for the `staticFileGlobs` and `workerFileName` options.

Default is `"./"`;

### workerFileName `string`

The file name of the generated service worker. This is joined with the `baseDir` option.

Default is `"service-worker.js"`;

### appendTimestamp `boolean`

If `true`, a comment containing a human readable UTC timestamp will be appended to the service worker.

```javascript
/* @preserve Thu, 01 Jan 1970 00:00:00 GMT */
```

Default is `true`;

### stripPrefix `string`

The same option as `stripPrefix` in sw-precache, but has a different default value.

Default is `baseDir + '/'`;

### Example

    grunt.initConfig({
		'sw-precache': {
			options: {
                    cacheId: 'your-package-name'
                },
                /**
                 * Don't use cache while developing
                 */
                default: {
                    handleFetch: false
                },
            
                dist: {}
           }
    });
    
### Default `runtimeCaching` configuration
    runtimeCaching: [
            {
                urlPattern: /\/$/,
                handler: 'networkFirst'
            },
            {
                urlPattern: /\/*\.css/,
                handler: 'cacheFirst',
                options: {
                    cache: {
                        maxEntries: 50,
                        name: 'css-cache'
                    }
                }
            },
            {
                urlPattern: /\/*\.js/,
                handler: 'cacheFirst',
                options: {
                    cache: {
                        maxEntries: 50,
                        name: 'js-cache'
                    }
                }
            },
            {
                urlPattern: /\/*\.(?:png|jpg|gif|jpeg)/,
                handler: 'cacheFirst',
                options: {
                    cache: {
                        maxEntries: 500,
                        name: 'img-cache'
                    }
                }
            },
            {
                urlPattern: /\/*\.(?:tff|woff|eot|svg)/,
                handler: 'cacheFirst',
                options: {
                    cache: {
                        maxEntries: 10,
                        name: 'font-cache'
                    }
                }
    }]

## License

Released under the [MIT license](https://bitbucket.org/morrisallison/grunt-sw-precache/raw/default/LICENSE).
