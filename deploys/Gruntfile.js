var path = require('path');
var build = require('./lib/build');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        files: grunt.file.exists("./build/files.json") && grunt.file.readJSON("./build/files.json") || {},

        srcPath: "../client",
        buildPath: "./build",
        destPath: "../dist",
        latestPath: "../dist/client/latest",

        sshconfig: {
            "dev253": {
                host: '192.168.80.253',
                username: 'root',
                agent: process.env.SSH_AUTH_SOCK
            }
        },

        concat: {
            options: {
            },
            lib: {
                src: [
                    '<%= files.lib %>'
                ],
                dest: './build/laya.js'
            },
            src: {
                src: [
                    '<%= files.src %>'
                ],
                dest: './build/main.js'
            }
        },

        uglify: {
            options: {
            },
            lib: {
                src: './build/laya.js',
                dest: './build/laya.min.js'
            },
            src: {
                src: './build/main.js',
                dest: './build/main.min.js'
            }
        },

        copy: {
            client: {
                files: [
                    {
                        expand: true,
                        cwd:    "<%= buildPath %>",
                        src:    ['**', '!laya.js', '!main.js', '!files.json' ],
                        dest:   "<%= destPath %>"
                    },
                    {
                        expand: true,
                        cwd:     "<%= srcPath %>/bin",
                        src:    ['**', '!libs/**', '!index.html', '!project.json' ],
                        dest:   "<%= destPath %>"
                    },
                    {
                        expand: true,
                        cwd:    "<%= buildPath %>",
                        src:    ['**', '!laya.js', '!main.js', '!files.json' ],
                        dest:   "<%= latestPath %>"
                    },
                    {
                        expand: true,
                        cwd:     "<%= srcPath %>/bin",
                        src:    ['**', '!libs/**', '!index.html', '!project.json' ],
                        dest:   "<%= latestPath %>"
                    }
                ]
            }
        },

        oss: {
            default: {
                options: {
                    accessKeyId: "LTAIhv5npmphDkox",
                    accessKeySecret: "tYFAnc3EBwX96Zp8gqhyrAGCEh01N8",
                    bucket: "deju-poker",
                    region: "oss-cn-shenzhen"
                },
                files: [
                    {
                        expand: true,
                        cwd: "../dist/client/<%= files.version %>/",
                        src: [ '**' ],
                        dest: "deju-poker"
                    }
                ]
            }
        },

        sftp: {
            "dev253": {
                files: {
                    './': [
                        "../dist/client/<%= files.version %>/**"
                    ]
                },
                options: {
                    path: '/data/nginx/DejuPoker/',
                    config: "dev253",
                    showProgress: true,
                    createDirectories: true,
                    srcBasePath: "../../dist/client/<%= files.version %>/"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks("grunt-ssh");
    grunt.loadTasks('./grunt-tasks');

    grunt.registerTask("build", function(env) {
        var done = this.async();

        env = env || "production";
        grunt.file.mkdir("build");
        build('DejuPoker', '../client', './build', env, function(err, files) {
            if (err != null) {
                done(new Error(err));
                return;
            }

            grunt.config('files', files);
            grunt.config('destPath', path.resolve('../dist', 'client/' + files.version + "/"));
            grunt.log.ok('project build complete!');
            done(null, files);
        })
    });
    grunt.registerTask("clean", function() {
        grunt.file.delete("build");
    });

    grunt.registerTask("oss-upload", [ 'oss:default' ]);
    grunt.registerTask("dev-upload", [ 'sftp:dev253' ]);

    grunt.registerTask("default", [ 'clean', 'build:production', 'concat:lib', 'concat:src', 'uglify:lib', 'uglify:src', 'copy' ]);
    grunt.registerTask("build-debug", [ 'clean', 'build:production', 'concat:lib', 'concat:src', 'uglify:lib', 'uglify:src', 'copy' ]);
    grunt.registerTask("build-dev", [ 'clean', 'build:dev', 'concat:lib', 'concat:src', 'uglify:lib', 'uglify:src', 'copy' ]);
    grunt.registerTask("build-dev1", [ 'clean', 'build:dev1', 'concat:lib', 'concat:src', 'uglify:lib', 'uglify:src', 'copy' ]);
};