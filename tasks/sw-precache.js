/*
 * grunt-sw-precache
 *
 * Copyright (c) 2015 Morris Allison III <author@morrisallison.com>
 * Released under the MIT License.
 *
 * For the full copyright and license information, please view
 * the LICENSE file distributed with this source code.
 *
 * @preserve
 */

'use strict';

var path = require('path');
var swPrecache = require('sw-precache');

var defaultOptions = {
    /**
     * sw-precache options
     */
    cacheId: undefined,
    directoryIndex: undefined,
    dynamicUrlToDependencies: undefined,
    handleFetch: undefined,
    ignoreUrlParametersMatching: undefined,
    importScripts: undefined,
    maximumFileSizeToCacheInBytes: undefined,
    navigateFallback: undefined,
    stripPrefix: undefined,
    replacePrefix: undefined,
    staticFileGlobs: undefined,
    templateFilePath: undefined,
    verbose: undefined,

    /**
     * grunt-sw-precache specific options
     */
    baseDir: './dist',
    workerFileName: 'service-worker.js',
};

module.exports = function (grunt) {

    grunt.registerMultiTask('sw-precache', function () {

        var options = this.options(defaultOptions);
        var data = this.data;

        for (var key in defaultOptions) {
            if ( ! defaultOptions.hasOwnProperty(key)) continue;
            if (data[key] !== undefined) options[key] = data[key];
        }

        options.logger = grunt.log.writeln;

        if (options.stripPrefix === undefined) {
            options.stripPrefix = options.baseDir + '/'
        }

        options.staticFileGlobs.forEach(function (fileGlob, index, staticFileGlobs) {
            options.staticFileGlobs[index] = options.baseDir + '/' + fileGlob;
        });

        var workerPath = path.resolve(options.baseDir, options.workerFileName);
        var complete = this.async();

        swPrecache.write(workerPath, options, function (error) {
            if (error) grunt.fail.warn(error);
            grunt.log.writeln('Service worker generated at: ' + workerPath);
            complete();
        });
    });
};