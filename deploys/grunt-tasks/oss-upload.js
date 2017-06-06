'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var chalk = require('chalk');
var OSS = require('ali-oss').Wrapper;

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks
	grunt.registerMultiTask('oss', 'A grunt tool for uploading static file to aliyun oss.', function() {
		var done = this.async();
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			/**
			 * @name objectGen --return a aliyun oss object name
			 *					  default return grunt task files' dest + files' name
			 * @param dest  --grunt task files' dest
			 * @param src  --grunt task files' src
			 */
			objectGen: function(dest, src){
				return [dest, path.basename(src)].join('\/');
			}
		});

		if (!options.accessKeyId || !options.accessKeySecret || !options.bucket ||!options.region ) {
			grunt.fail.fatal('accessKeyId, accessKeySecret and bucket, region  are all required!');
		}
		var option = {
			accessKeyId: 	 options.accessKeyId,
			accessKeySecret: options.accessKeySecret,
			bucket:		     options.bucket,
			region:		     options.region
		};

		//creat a new oss-client
		var oss = new OSS(option);
		var uploadQue = [];

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			// Concat specified files.
			var objects = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				// return an oss object.
				return {
					bucket: options.bucket,
					//object: options.objectGen(f.dest, filepath),
					destFile: f.dest,
					srcFile: filepath
				};

			});
			objects.forEach(function(o) {
				uploadQue.push(o);
			});
		});

		var uploadTasks = [];
		uploadQue.forEach(function(o) {
			uploadTasks.push(makeUploadTask(o));
		});

		grunt.log.ok('Start uploading files.');
		async.series(uploadTasks, function(error, results) {
			if (error) {
				grunt.fail.fatal("uploadError:"+ JSON.stringify(error));
			} else {
				grunt.log.ok('All files has uploaded yet!');
			}
			done(error, results);
		});
		/**
		 * @name makeUploadTask  -- make task for async
		 * @param object  -- aliyun oss object
		 */
		function makeUploadTask(object) {
			return function(callback) {
				//skip object when object's path is a directory;
				if (fs.lstatSync(object.srcFile).isDirectory()) {
					grunt.log.error(chalk.cyan(object.srcFile) + chalk.red(' is a directory, skip it!'));
					callback();
				} else {
					grunt.log.ok('Start uploading file '+ chalk.cyan(object.srcFile));

                    oss.put(object.destFile, object.srcFile)
                        .then(function(result) {
                            grunt.log.ok(result.name, result.res.status);
                            callback();
                        })
                        .catch(function(e) {
                            grunt.log.ok(e);
                        });
				}
			}
		}
	});
};
