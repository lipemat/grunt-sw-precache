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
    appendTimestamp: true,
};

function getOptions(grunt, task) {

    var options = task.options(defaultOptions);
    var data = task.data;

    for (var key in defaultOptions) {
        if ( ! defaultOptions.hasOwnProperty(key)) continue;
        if (data[key] !== undefined) options[key] = data[key];
    }

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

        swPrecache.write(workerPath, options.config, function (error) {

            if (error) grunt.fail.warn(error);

            if (appendTimestamp === true) {

                var data = '\n/* @preserve ' + new Date().toUTCString() + ' */';

                fs.appendFile(workerPath, data, function (error) {
                    if (error) grunt.fail.warn(error);
                    writeComplete();
                });

            } else {

                writeComplete();
            }
        });
    });
};