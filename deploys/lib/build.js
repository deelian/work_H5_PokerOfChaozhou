var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var async = require('async');
var child = require('child_process');

module.exports = function(projectName, basePath, buildPath, env, complete) {
    var projectConfig = require(path.resolve(basePath, "bin/project.json"));
    var version = projectConfig.version;
    var revision = child.execSync("git log --pretty=oneline | wc -l").toString().replace(/[ \r\n]/g, '');
    var projectVersion = version + "." + revision;

    var files = {
        dir:     basePath,
        project: projectName,
        version: projectVersion,
        lib: [],
        src: []
    };

    async.series([
        function(callback) {
            var file;
            var content = fs.readFileSync(path.resolve(basePath, "bin/index.html")).toString();

            jsdom.env(content, function(errors, window) {
                if (errors != null) {
                    return callback(errors);
                }

                var $ = require('jquery')(window);

                $("script").each(function(index, element) {
                    if (element.src.indexOf("libs/") != -1) {
                        file = path.resolve(basePath, "bin", element.src);
                        files.lib.push(file);
                    }

                    if (element.src.indexOf("src/") != -1) {
                        file = path.resolve(basePath, "bin", element.src);
                        files.src.push(file);
                    }
                });

                fs.writeFile(path.resolve(buildPath, "files.json"), JSON.stringify(files, null, 4), function(err) {
                    if (err != null) {
                        return callback(err);
                    }

                    callback(null);
                });
            });
        },

        function(callback) {
            var htmlIndex = fs.readFileSync("./assets/index.html").toString();

            htmlIndex = htmlIndex.replace("$title$", projectName);
            htmlIndex = htmlIndex.replace("$lib$", "laya.min.js?v=" + projectVersion);
            htmlIndex = htmlIndex.replace("$src$", "main.min.js?v=" + projectVersion);

            fs.writeFile(path.resolve(buildPath, "index.html"), htmlIndex, function(err) {
                if (err != null) {
                    return callback(err);
                }

                callback(null);
            });
        },

        function(callback) {
            projectConfig.showFPS = false;
            projectConfig.version = projectVersion;

            switch (env) {
                case "dev1": {
                    projectConfig.host = "192.168.1.106";
                    break;
                }
                case "dev": {
                    projectConfig.host = "192.168.80.185";
                    break;
                }
                case "debug": {
                    projectConfig.host = "192.168.80.253";
                    break;
                }
                case "production": {
                    projectConfig.host = "39.108.5.167";
                    break;
                }
                default: {
                    projectConfig.host = "192.168.80.253";
                    break;
                }
            }

            fs.writeFile(path.resolve(buildPath, "project.json"), JSON.stringify(projectConfig, null, 4), function(err) {
                if (err != null) {
                    return callback(err);
                }

                callback(null);
            });
        }
    ], function(err) {
        complete(err, files);
    });
};

// var baseDir = "../../client";
// var projectName = "DejuPoker";
// var content = fs.readFileSync(baseDir + "/bin/index.html").toString();
// var proejctConfig = require(path.resolve(baseDir, "bin/project.json"));
// var version = proejctConfig.version;
// var revision = child.execSync("git log --pretty=oneline | wc -l").toString().replace(/[ \r\n]/g, '');
// var projectVersion = version + "." + revision;
//
// var env = process.argv[2];
//
// var file;
// var files = {
//     dir:     baseDir,
//     project: projectName,
//     version: projectVersion,
//     lib: [],
//     src: []
// };
//
// async.series([
//     function(callback) {
//         jsdom.env(content, function(errors, window) {
//             if (errors != null) {
//                 return callback(errors);
//             }
//
//             var $ = require('jquery')(window);
//
//             $("script").each(function(index, element) {
//                 if (element.src.indexOf("libs/") != -1) {
//                     file = path.resolve(baseDir, "bin", element.src);
//                     files.lib.push(file);
//                 }
//
//                 if (element.src.indexOf("src/") != -1) {
//                     file = path.resolve(baseDir, "bin", element.src);
//                     files.src.push(file);
//                 }
//             });
//
//             fs.writeFile("./dist/files.json", JSON.stringify(files, null, 4), function(err) {
//                if (err != null) {
//                    return callback(err);
//                }
//
//                 callback(null);
//             });
//         });
//     },
//
//     function(callback) {
//         var htmlIndex = fs.readFileSync("./index.html").toString();
//
//         htmlIndex = htmlIndex.replace("$title$", projectName);
//         htmlIndex = htmlIndex.replace("$lib$", "laya.min.js?v=" + projectVersion);
//         htmlIndex = htmlIndex.replace("$src$", "main.min.js?v=" + projectVersion);
//
//         fs.writeFile("./dist/index.html", htmlIndex, function(err) {
//             if (err != null) {
//                 return callback(err);
//             }
//
//             callback(null);
//         });
//     },
//
//
//
//     function(callback) {
//         proejctConfig.showFPS = false;
//         proejctConfig.version = projectVersion;
//
//         switch (env) {
//             case "dev": {
//                 proejctConfig.host = "192.168.80.185";
//                 break;
//             }
//             case "debug": {
//                 proejctConfig.host = "192.168.80.253";
//                 break;
//             }
//             case "production": {
//                 proejctConfig.host = "39.108.5.167";
//                 break;
//             }
//             default: {
//                 proejctConfig.host = "192.168.80.253";
//                 break;
//             }
//         }
//
//         fs.writeFile("./dist/project.json", JSON.stringify(proejctConfig, null, 4), function(err) {
//             if (err != null) {
//                 return callback(err);
//             }
//
//             callback(null);
//         });
//     }
// ], function(err) {
//     if (err != null) {
//         console.log(err);
//         process.exit(-1);
//     }
//
//     process.exit(0);
// });
//
//
