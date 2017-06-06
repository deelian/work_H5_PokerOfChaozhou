
module.exports = function(grunt) {
    grunt.initConfig({
        sshconfig: {
            "aliyun": grunt.file.readJSON('../secret.json')
        },

        copy: {
            pomelo: {
                files: [
                    {
                        expand: true,
                        cwd:    "./",
                        src:    [
                                    '**',
                                    '!node_modules/**',
                                    '!Gruntfile.js',
                                    '!customerConfig/**',
                                    '!config/db.game.json'
                                ],
                        dest:   "../dist/serverPackage/models"
                    },

                    {
                        expand: true,
                        cwd:    "./customerConfig",
                        src:    [ '**' ],
                        dest:   "../dist/server/models"
                    }
                ]
            }
        },
        
        sftp: {
            models: {
                files: {
                    "./": [
                        '**',
                        '!node_modules/**',
                        '!Gruntfile.js',
                        '!customerConfig/**',
                        '!config/db.game.json'
                    ]
                },
                options: {
                    path: '/home/zsz/DejuPoker/models/',
                    config: 'aliyun',
                    showProgress: true,
                    createDirectories: true
                }
            },
            config: {
                files: {
                    "./": [
                        'customerConfig/**'
                    ]
                },
                options: {
                    path: '/home/zsz/DejuPoker/models/',
                    config: 'aliyun',
                    showProgress: true,
                    createDirectories: true,
                    srcBasePath: "customerConfig/"
                }
            }
        },

        sshexec: {
            install: {
                command: "cd /home/zsz/DejuPoker/models && npm install",
                options: {
                    config: 'aliyun'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-ssh');

    grunt.registerTask("default", ['copy']);
    grunt.registerTask("scp", ['sftp']);
    grunt.registerTask("install", ['sshexec:install']);
    grunt.registerTask("deploy", ['sftp', 'sshexec']);
};