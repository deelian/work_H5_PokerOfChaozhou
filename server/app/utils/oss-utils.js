/**
 * Module dependencies.
 */
var http = require('http');
var OSS = require('ali-oss').Wrapper;

/*
 * Server Dependencies
 */

/*
 * Game Modules Dependencies
 */


var client = new OSS({
    accessKeyId: "LTAIhv5npmphDkox",
    accessKeySecret: "tYFAnc3EBwX96Zp8gqhyrAGCEh01N8",
    bucket: "deju-poker",
    region: "oss-cn-shenzhen"
});

module.exports = {
    put: function(object, file, callback) {
        client.put(object, file)
            .then(function(result) {
                callback(null);
            })
            .catch(function(e) {
                callback(e);
            });
    },

    putStream: function(objet, url, callback) {
        var req = http.get(url);

        req.on('response', function(stream) {
            client.putStream(object, stream)
                .then(function(result) {
                    callback(null);
                })
                .catch(function(e) {
                    callback(e);
                })
        })
    },

    putAvatar: function(uuid, url, callback) {
        var req = http.get(url);
        var object = "/users/" + uuid + "/avatar";

        req.on('response', function(stream) {
            client.putStream(object, stream)
                .then(function(result) {
                    callback(null);
                })
                .catch(function(e) {
                    callback(e);
                })
        })
    }
};
