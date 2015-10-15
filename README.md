# grunt-sw-precache

A [Grunt](http://gruntjs.com) task wrapper for [sw-precache](https://www.npmjs.com/package/sw-precache).

[![npm Version](https://img.shields.io/npm/v/grunt-sw-precache.svg?style=flat-square)](https://www.npmjs.com/package/grunt-sw-precache)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://bitbucket.org/morrisallison/grunt-sw-precache/raw/default/LICENSE)

## Getting Started

This plugin requires Grunt `~0.4.5`.

If you haven't used [Grunt](http://gruntjs.com/) before, please view the [Getting Started](http://gruntjs.com/getting-started) guide.
The guide explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile), and how to install and use Grunt plugins.

## Installation

This plugin can be installed using the following command:

```bash
$ npm install grunt-sw-precache --save-dev
```

The plugin can then be enabled inside your Gruntfile with this:

```javascript
grunt.loadNpmTasks('grunt-sw-precache');
```

## Configuration

The options documented here are specific to grunt-sw-precache. For all other options, please view the [options documentation for sw-precache](https://github.com/googlechrome/sw-precache#options).

### baseDir `string`

The base directory for the `staticFileGlobs` and `workerFileName` options.

Default is `"./dist"`;

### workerFileName `string`

The file name of the generated service worker. This is joined with the `baseDir` option.

Default is `"service-worker.js"`;

### stripPrefix `string`

The same option as `stripPrefix` in sw-precache, but has a different default value.

Default is `baseDir + '/'`;

### Example

    grunt.initConfig({
		'sw-precache': {
			options: {
				cacheId: 'your-package-name',
				workerFileName: 'sw.js',
				verbose: true,
			},
			'default': {
				staticFileGlobs: [
					'css/**/*.css',
					'font/**/*.{woff,ttf,svg,eot}',
					'img/**/*.{gif,png,jpg}',
					'js/**/*.js',
				],
			},
			'develop': {
				staticFileGlobs: [
					'font/**/*.{woff,ttf,svg,eot}'
				],
			},
		},
    });

## License

Released under the MIT license.