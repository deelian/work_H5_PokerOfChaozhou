var path = require('path');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        files: grunt.file.readJSON("./dist/files.json"),

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
                dest: './dist/laya.js'
            },
            src: {
                src: [
                    '<%= files.src %>'
                ],
                dest: './dist/main.js'
            }
        },

        uglify: {
            options: {
            },
            lib: {
                src: './dist/laya.js',
                dest: './dist/laya.min.js'
            },
            src: {
                src: './dist/main.js',
                dest: './dist/main.min.js'
            }
        },

        copy: {
            client: {
                files: [
                    {
                        expand: true,
                        cwd:    "./dist",
                        src:    ['**', '!laya.js', '!main.js', '!files.json' ],
                        dest:   "../../dist/client/<%= files.version %>/"
                    },
                    {
                        expand: true,
                        cwd:    "<%= files.dir %>/bin",
                        src:    ['**', '!libs/**', '!index.html', '!project.json' ],
                        dest:   "../../dist/client/<%= files.version %>/"
                    },
                    {
                        expand: true,
                        cwd:    "./dist",
                        src:    ['**', '!laya.js', '!main.js', '!files.json' ],
                        dest:   "../../dist/client/latest/"
                    },
                    {
                        expand: true,
                        cwd:    "<%= files.dir %>/bin",
                        src:    ['**', '!libs/**', '!index.html', '!project.json' ],
                        dest:   "../../dist/client/latest/"
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
                        cwd: "../../dist/client/<%= files.version %>/",
                        src: [ '**' ],
                        dest: "deju-poker"
                    }
                ]
            },

            test: {
                options: {
                    accessKeyId: "LTAIhv5npmphDkox",
                    accessKeySecret: "tYFAnc3EBwX96Zp8gqhyrAGCEh01N8",
                    bucket: "deju-poker",
                    region: "oss-cn-shenzhen"
                },
                files: [
                    {
                        expand: true,
                        cwd: "../../dist/client/<%= files.version %>/",
                        src: [ '**' ],
                        dest: "deju-poker-test"
                    }
                ]
            }
        },

        sftp: {
            "dev253": {
                files: {
                    './': [
                        "../../dist/client/<%= files.version %>/**"
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

    grunt.registerTask("default", [ 'concat:lib', 'concat:src', 'uglify:lib', 'uglify:src', 'copy' ]);
    grunt.registerTask("oss-upload", [ 'oss:default' ]);
    grunt.registerTask("oss-upload-test", [ 'oss:test' ]);
    grunt.registerTask("upload-dev", [ 'sftp:dev253' ]);
};