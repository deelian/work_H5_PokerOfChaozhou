
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
                                    '!Gruntfile.js'
                                ],
                        dest:   "../dist/server/pomelo"
                    }
                ]
            }
        },

        sftp: {
            pomelo: {
                files: {
                    "./": [
                        '**',
                        '!node_modules/**',
                        '!Gruntfile.js'
                    ]
                },
                options: {
                    path: '/home/zsz/DejuPoker/pomelo/',
                    config: 'aliyun',
                    showProgress: true
                }
            }
        },

        sshexec: {
            install: {
                command: "cd /home/zsz/DejuPoker/pomelo && npm install",
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