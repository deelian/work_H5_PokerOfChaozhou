
var moment = require('moment');

module.exports = function(grunt) {
    grunt.initConfig({
        date: moment().format('YYYY-MM-DD'),

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
                            '!logs/**',
                            '!Gruntfile.js'
                        ],
                        dest:   "../dist/server/web-server"
                    }
                ]
            }
        },

        sftp: {
            web_server: {
                files: {
                    "./": [
                        '**',
                        '!node_modules/**',
                        '!logs/**',
                        '!Gruntfile.js'
                    ]
                },
                options: {
                    path: '/home/zsz/DejuPoker/web-server/',
                    config: 'aliyun',
                    showProgress: true,
                    createDirectories: true
                }
            }
        },

        sshexec: {
            logs: {
                command: "cd /data/logs/web-server && tail -n 100 application.log-<%= date %>",
                options: {
                    config: 'aliyun'
                }
            },
            install: {
                command: "cd /home/zsz/DejuPoker/web-server && npm install",
                options: {
                    config: 'aliyun'
                }
            },
            start: {
                command: "cd /home/zsz/DejuPoker/web-server && pm2 startOrRestart ecosystem.json --env production",
                options: {
                    config: 'aliyun'
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-ssh');
    
    grunt.registerTask("default", ['copy']);
    grunt.registerTask("scp", ['sftp:web_server']);
    grunt.registerTask("install", ['sshexec:install']);
    grunt.registerTask("start", ['sshexec:start']);
    grunt.registerTask("logs", ['sshexec:logs']);
    grunt.registerTask("deploy", [ 'sftp:web_server', 'sshexec:install', 'sshexec:start']);
};