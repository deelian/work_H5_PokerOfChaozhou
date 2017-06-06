/*
 * Base Dependencies
 */
var http = require('http');
var async = require('async');
var request = require('request');

/*
 * Server Dependencies
 */
var pomelo = require('../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);
var GameDB = require('../../../models/game');
var OSSUtils = require('../utils/oss-utils');
var URLUtils = require('../utils/url-utils');
var TokenUtils = require('../utils/token-utils');
var User = GameDB.models.user;

/*
 * Game Dependencies
 */
var Game = require('../../../game');
var Code = Game.Code;
var Player = Game.Player;


var AuthService = function(app) {
    this.app = app;
};

module.exports = AuthService;

AuthService.prototype.verifyUser = function(msg, callback) {
    var udid = msg.udid;
    var code = msg.code;

    var host = "http://api.glfun.cn";
    var api  = "/wx/user_info";
    var params = {
        code: code
    };
    var url = URLUtils.formatURL(host + api, params);
    request(url, function(error, response, body) {
        if (error != null) {
            callback(Code.SYSTEM.HTTP_ERROR);
            return;
        }

        if (response.statusCode != 200) {
            callback(Code.SYSTEM.HTTP_ERROR);
            return;
        }
        var data = null;
        try {
            data = JSON.parse(body);
        } catch (e) {
            callback(Code.SYSTEM.HTTP_ERROR);
            return;
        }

        User.find({
            where: { unionid: data.unionid }
        }).then(function(record) {
            if (record == null) {
                return User.create({
                    udid:        udid,
                    name:        data.nickname,
                    unionid:     data.unionid,
                    gender:      data.sex,
                    language:    data.language,
                    country:     data.country,
                    province:    data.province,
                    city:        data.city,
                    data:        "{}"
                });
            }

            return record;
        }).then(function(record) {
            var results = {};

            // 同步头像数据到OSS
            OSSUtils.putAvatar(record.uuid, data.headimgurl, function() {
                var user = {
                    id: record.id,
                    uuid: record.uuid,
                    unionid: record.unionid,
                    name: record.name
                };

                // 获取最新的访问令牌
                TokenUtils.generateAccessToken(user, "game", function(err, token, jti) {
                    if (err != null) {
                        throw new Error(err);
                    }

                    results.player = record.player;
                    results.token  = token;

                    record.jti = jti;

                    record.save().then(function() {
                        callback(null, results);
                    });
                });
            });
        }).catch(function(e) {
            callback(Code.SYSTEM.MySQL_ERROR);
        });
    });
};

AuthService.prototype.verifyGuest = function(msg, callback) {
    var udid = msg.udid;

    var results = {};
    User.find({
        where: {
            udid: udid,
            $and: { unionid: "" }
        }
    }).then(function(record) {
        if (record == null) {
            return User.create({
                udid: udid,
                data: "{}"
            });
        }

        return record;
    }).then(function(record) {

        results.player = record.player;
        callback(null, results);

    }).catch(function(e) {

        logger.error(e);
        callback(Code.SYSTEM.MySQL_ERROR);
    });
};

AuthService.prototype.verifyToken = function(msg, callback) {
    var udid = msg.udid;
    var token = msg.token;

    TokenUtils.verifyToken(token, function(err, decoded) {
        if (err != null) {
            callback(Code.SYSTEM.TOKEN_ERROR);
            return;
        }

        User.findOne({
            where: { unionid: decoded.user.unionid }
        }).then(function(record) {
            if (record == null) {
                throw new Error("invalid token");
            }

            if (record.jti != decoded.jti) {
                throw new Error("token revoked");
            }

            var results = {};
            var user = {
                id: record.id,
                uuid: record.uuid,
                unionid: record.unionid,
                name: record.name
            };
            TokenUtils.generateAccessToken(user, "game", function(err, token, jti) {
                if (err != null) {
                    throw new Error(err);
                }

                results.player = record.player;
                results.token  = token;

                record.jti = jti;
                record.save().then(function() {
                    callback(null, results);
                });
            });
        }).catch(function(e) {
            callback(Code.SYSTEM.MySQL_ERROR);
        });
    });
};
