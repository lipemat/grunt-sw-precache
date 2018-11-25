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
var fs = require('fs');
var prependFile = require('prepend-file');
var swPrecache = require('sw-precache');

var defaultOptions = {
    /**
     * sw-precache options
     */
    cacheId: undefined,
    directoryIndex: undefined,
    dynamicUrlToDependencies: undefined,
    handleFetch: true,
    ignoreUrlParametersMatching: undefined,
    importScripts: undefined,
    maximumFileSizeToCacheInBytes: undefined,
    navigateFallback: undefined,
    stripPrefix: '.',
    replacePrefix: undefined,
    staticFileGlobs: [],
    templateFilePath: undefined,
    verbose: true,
    skipWaiting: true,
    runtimeCaching: [
        {
            urlPattern: /\/$/,
            handler: 'networkFirst',
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
        }],

    /**
     * grunt-sw-precache specific options
     */
    baseDir: './',
    workerFileName: 'service-worker.js',
    appendTimestamp: true,
    cacheGoogleFonts: true,
    offlineFallback: {
        url : '/',
        resources: []
    },
    startURL: {
        url : '/',
        resources: []
    }
};

function getOptions(grunt, task) {

    var options = task.options(defaultOptions);
    var data = task.data;

    for (var key in defaultOptions) {
        if ( ! defaultOptions.hasOwnProperty(key)) continue;
        if (data[key] !== undefined) options[key] = data[key];
    }

    options.offlineFallback.resources.push( options.offlineFallback.url );
    options.startURL.resources.push( options.startURL.url );

    var baseDir = options.baseDir;
    var workerFileName = options.workerFileName;
    var appendTimestamp = options.appendTimestamp;

    delete options.baseDir;
    delete options.workerFileName;
    delete options.appendTimestamp;

    options.logger = grunt.log.writeln;

    if (options.stripPrefix === undefined) {
        options.stripPrefix = baseDir + '/';
    }

    options.staticFileGlobs.forEach(function (fileGlob, index, staticFileGlobs) {
        options.staticFileGlobs[index] = baseDir + '/' + fileGlob;
    });

    return {
        config: options,
        workerPath: path.resolve(baseDir, workerFileName),
        appendTimestamp: appendTimestamp,
    };
}

module.exports = function (grunt) {

    grunt.registerMultiTask('sw-precache', function () {

        var options = getOptions(grunt, this);
        var workerPath = options.workerPath;
        var appendTimestamp = options.appendTimestamp;
        var taskComplete = this.async();
        var writeComplete = function () {
            grunt.log.writeln('Service worker generated at: ' + workerPath);
            taskComplete();
        };
        var _prependContents = '';

        swPrecache.write(workerPath, options.config, function (error) {

            if (error) grunt.fail.warn(error);

            if (options.config.cacheGoogleFonts) {
                fs.readFile(path.resolve(__dirname + '/../templates/google-fonts.js'), function (error, contents) {
                    _prependContents += contents;
                });
            }

            if (options.config.startURL.url !== 'undefined' && options.config.startURL.url !== options.config.offlineFallback.url) {
                fs.readFile(path.resolve(__dirname + '/../templates/precache.js'), function (error, contents) {
                    contents = contents.toString().replace(/<%= resources %>/g, options.config.startURL.resources.join("','"));
                    _prependContents += contents.toString().replace(/<%= var %>/g, 'startURL' );
                })
            }

            if (typeof options.config.offlineFallback.url !== 'undefined') {
                fs.readFile(path.resolve(__dirname + '/../templates/precache.js'), function (error, contents) {
                    contents = contents.toString().replace(/<%= resources %>/g, options.config.offlineFallback.resources.join("','"));
                    _prependContents += contents.toString().replace(/<%= var %>/g, 'offlineFallback' );
                });
                fs.readFile(path.resolve(__dirname + '/../templates/offline-default.js'), function (error, contents) {
                    _prependContents += contents.toString().replace(/<%= config.offlineFallback.url %>/g, options.config.offlineFallback.url);
                });

            }


            if (appendTimestamp === true) {
                var data = '\n/* @preserve ' + new Date().toUTCString() + ' */';
                fs.appendFile(workerPath, data, function (error) {
                    if (error) grunt.fail.warn(error);
                });
            }

            setTimeout( function() {
                prependFile(workerPath, _prependContents, function (error) {
                    if (error) grunt.fail.warn(error);
                    writeComplete()
                });
            }, 2000 );

        });
    });
};
