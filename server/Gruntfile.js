
module.exports = function(grunt) {
    grunt.initConfig({
        sshconfig: {
            "aliyun": grunt.file.readJSON('../secret.json')
        },

        copy: {
            server: {
                files: [
                    {
                        expand: true,
                        cwd:    "./",
                        src:    [
                                    '**',
                                    '!node_modules/**',
                                    '!customerConfig/**',
                                    '!logs/**',
                                    '!Gruntfile.js',
                                    '!config/servers.json'
                                ],
                        dest:   "../dist/server/server"
                    },

                    {
                        expand: true,
                        cwd:    "./customerConfig",
                        src:    [ '**' ],
                        dest:   "../dist/server/server"
                    }
                ]
            }
        },

        sftp: {
            server: {
                files: {
                    "./": [
                        '**',
                        '!node_modules/**',
                        '!customerConfig/**',
                        '!logs/**',
                        '!Gruntfile.js',
                        '!config/servers.json'
                    ]
                },
                options: {
                    path: '/home/zsz/DejuPoker/server/',
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
                    path: '/home/zsz/DejuPoker/server/',
                    config: 'aliyun',
                    showProgress: true,
                    createDirectories: true,
                    srcBasePath: "customerConfig/"
                }
            }
        },
        sshexec: {
            install: {
                command: "cd /home/zsz/DejuPoker/server && npm install",
                options: {
                    config: 'aliyun'
                }
            },
            start: {
                command: "cd /home/zsz/DejuPoker/server && pomelo stop -P 6000 && pomelo start -e production -D",
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
    grunt.registerTask("start", ['sshexec:start']);
    grunt.registerTask("deploy", ['sftp', 'sshexec']);
};