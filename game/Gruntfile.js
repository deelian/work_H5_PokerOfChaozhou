
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        files: require("./tools/export"),

        sshconfig: {
            "aliyun": grunt.file.readJSON('../secret.json')
        },

        concat: {
            options: {
                banner: '/*! <%= pkg.file %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: '<%= files %>',
                dest: '../client/src/game/<%= pkg.name %>.js'
            }
        },

        copy: {
            game: {
                files: [
                    {
                        expand: true,
                        cwd:    "./",
                        src:    [
                            '**',
                            '!node_modules/**',
                            '!Gruntfile.js'
                        ],
                        dest:   "../dist/server/game"
                    }
                ]
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
            },
            build: {
                src: '<%= files %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },

        jshint: {
            build: {
                src: '<%= files %>'
            }
        },

        sftp: {
            game: {
                files: {
                    "./": [
                        '**',
                        '!node_modules/**',
                        '!Gruntfile.js'
                    ]
                },
                options: {
                    path: '/home/zsz/DejuPoker/game/',
                    config: 'aliyun',
                    showProgress: true,
                    createDirectories: true
                }
            }
        },

        sshexec: {
            install: {
                command: "cd /home/zsz/DejuPoker/game && npm install",
                options: {
                    config: 'aliyun'
                }
            }
        }
    });

    //grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-ssh');

    grunt.registerTask("default", ['concat', 'copy']);
    grunt.registerTask("scp", ['sftp']);
    grunt.registerTask("install", ['sshexec:install']);
    grunt.registerTask("deploy", ['sftp', 'sshexec']);
};