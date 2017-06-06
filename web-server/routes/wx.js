/**
 * Module dependencies.
 */
var CryptoJS = require('crypto-js');
var express = require('express');
var router = express.Router();
var async = require('async');
var Request = require('request');
var UUID = require('uuid');
var moment = require('moment');

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:route:wx');
var app = require('../app');
var GameDB = require('../../models/game');
var URLUtils = require('../utils/url-utils');
var ServerError = require('../errors/server-error');
var WxUser = GameDB.models.wx_user;

/*
 * Game Modules Dependencies
 */
var Game = require('../../game');
var GE = Game.ERROR;

module.exports = {
    path: "/wx",
    route: router
};

var Token = "5rb9l3388u5oehebd0whb0kz2738u8yl";
var AppID = "wx5e9ac11e7ef7af8d";
var AppSecret = "a1f7503da7e659481e45d7b5490e3679";
var EncodingAESKey = "AHG4J05MYxQRbHeJmwEhap7m8MDyAoQRVvlYqQPcDbf";

// var AppID = "wx62d5d896061e4be5";
// var AppSecret = "ef1937fefed9b877a1b74c1241ef4b49";

var STATES = {
    "PORTAL_RELEASE": {
        url: "http://h5.glfun.cn/deju-poker/index.html",
        redirect: true
    },
    "PORTAL_BETA": {
        url: "http://h5.glfun.cn/deju-poker-test/index.html",
        redirect: true
    },
    "PORTAL_ALPHA": {
        url: "http://192.168.80.253/deju-poker/index.html",
        redirect: false
    },
    "PORTAL_DEV@1": {
        url: "http://192.168.80.185/deju-poker/client/bin/index.html",
        redirect: false
    },
    "PORTAL_DEV@2": {
        url: "http://192.168.1.106/deju-poker/client/bin/index.html",
        redirect: false
    }
};

router.get('/verify', function(req, res, next) {
    var token = Token;
    var timestamp = req.query.timestamp;
    var nonce = req.query.nonce;
    var echostr = req.query.echostr;
    var signature = req.query.signature;

    var array = [token, timestamp, nonce].sort();
    var string = array[0] + array[1] + array[2];
    var encode = CryptoJS.SHA1(string);

    if (encode != signature) {
        res.send('error');
    } else {
        res.send(echostr);
    }
});

router.get('/authorize_callback', function(req, res, next) {
    var code = req.query.code;
    var states = (req.query.state || "").split('#');

    var state  = states[0];     // 跳转控制
    var middle = states[1];     // wechat_redirect
    var uuid   = states[2];     // uuid识别
    var config = STATES[state];

    if (config == null) {
        res.end();
        return;
    }

    var redirect_uri = config.url;
    var url = URLUtils.formatURL(redirect_uri, { code: code });

    if (config.redirect === true) {
        res.locals.name = "欢乐木虱";
        res.locals.url = url;

        res.render('portal');
    } else {
        res.send("重定向去：" + url);
    }

    debug('wx.authorize_callback: redirectTo %s', url);
});

router.get('/authorize', function(req, res, next) {
    var uri = "http://open.weixin.qq.com";
    var api = "/connect/oauth2/authorize";
    var state = req.query.state || "PORTAL_RELEASE";
    var params = {
        appid: AppID,
        redirect_uri: "http://api.glfun.cn/wx/authorize_callback",
        response_type: "code",
        scope: "snsapi_userinfo",
        state: state + "#wechat_redirect#" + UUID.v4()
    };

    var url = URLUtils.formatURL(uri + api, params);
    res.redirect(url);

    debug('wx.authorize: redirectTo %s', url);
});

router.get('/user_info', function(req, res, next) {
    var data = {};
    var token = null;
    var user_info = null;

    async.series([
        function(callback) {
            var host = "https://api.weixin.qq.com";
            var api  = "/sns/oauth2/access_token";
            var code = req.query.code;
            var grant_type = "authorization_code";
            var params = {
                appid: AppID,
                secret: AppSecret,
                code: code,
                grant_type: grant_type
            };
            var url = URLUtils.formatURL(host + api, params);
            Request(url, function(error, response, body) {
                debug('wx.access_token.response: %j %d %j', error, response.statusCode, body);

                if (error != null) {
                    callback(GE.INVALID_AUTHORIZE_CODE);
                    return;
                }

                if (response.statusCode != 200) {
                    callback(GE.REMOTE_SERVER_ERROR);
                    return;
                }

                var result = null;
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    callback(GE.REMOTE_SERVER_ERROR);
                    return;
                }

                if (result.errcode != null) {
                    debug(result);
                    callback(GE.REMOTE_SERVER_ERROR);
                    return;
                }

                token = result;
                callback(null);
            });
        },

        function(callback) {
            var host = "https://api.weixin.qq.com";
            var api  = "/sns/userinfo";
            var access_token = token.access_token;
            var openid = token.openid;
            var params = {
                access_token: access_token,
                openid: openid,
                lang: "zh_CN"
            };
            var url = URLUtils.formatURL(host + api, params);
            Request(url, function(error, response, body) {
                debug('wx.userinfo.response: %j %d %j', error, response.statusCode, body);

                if (error != null) {
                    callback(GE.INVALID_AUTHORIZE_CODE);
                    return;
                }

                if (response.statusCode != 200) {
                    callback(GE.REMOTE_SERVER_ERROR);
                    return;
                }

                var result = null;
                try {
                    result = JSON.parse(body);
                } catch (e) {
                    callback(GE.REMOTE_SERVER_ERROR);
                    return;
                }

                if (result.errcode != null) {
                    debug(result);
                    callback(GE.REMOTE_SERVER_ERROR);
                    return;
                }

                data = user_info = result;
                WxUser.findOne({
                    where: {
                        unionid: result.unionid,
                        appid: AppID,
                        openid: result.openid
                    }
                }).then(function (record) {
                    if (record == null) {
                        var attributes = JSON.parse(body);

                        attributes.appid = AppID;
                        attributes.privilege = JSON.stringify(attributes.privilege);

                        return WxUser.create(attributes);
                    }

                    return record;
                }).then(function (record) {
                    record.access_token  = token.access_token;
                    record.refresh_token = token.refresh_token;
                    record.expiredAt     = moment().add(token.expires_in, 'seconds');

                    return record.save();
                }).then(function() {
                    callback(null);
                }).catch(function (e) {
                    debug(e);
                    callback(GE.INTERNAL_ERROR);
                });
            });
        }
    ], function(err) {
        if (err != null) {
            res.error(err);
            return;
        }

        res.success(data);
    });
});

router.get('/sns/oauth2/access_token', function(req, res, next) {
    var host = "https://api.weixin.qq.com";
    var api  = "/sns/oauth2/access_token";
    var code = req.query.code;
    var grant_type = "authorization_code";
    var params = {
        appid: AppID,
        secret: AppSecret,
        code: code,
        grant_type: grant_type
    };

    var url = URLUtils.formatURL(host + api, params);
    Request(url, function(error, response, body) {
        var data = {};
        try {
            data = JSON.parse(body)
        } catch(e) {

        }

        res.send(data);
        console.log(error, response.statusCode, body);
    });
});

router.get('/sns/oauth2/refresh_token', function(req, res, next) {
    var host = "https://api.weixin.qq.com";
    var api  = "/sns/oauth2/refresh_token";
    var refresh_token = req.query.refresh_token;
    var params = {
        appid: AppID,
        grant_type: "refresh_token",
        refresh_token: "refresh_token"
    };

    var url = URLUtils.formatURL(host + api, params);
    Request(url, function(error, response, body) {
        var data = {};
        try {
            data = JSON.parse(body)
        } catch(e) {

        }

        res.send(data);
        console.log(error, response, body);
    });
});

router.get('/sns/auth', function(req, res, next) {

});

router.get('/sns/user_info', function(req, res, next) {
    var host = "https://api.weixin.qq.com";
    var api  = "/sns/userinfo";
    var access_token = req.query.access_token;
    var openid = req.query.openid;
    var params = {
        access_token: access_token,
        openid: openid,
        lang: "zh_CN"
    };

    var url = URLUtils.formatURL(host + api, params);
    Request(url, function(error, response, body) {
        var data = {};
        try {
            data = JSON.parse(body)
        } catch(e) {

        }

        res.send(data);
        console.log(body);
    });
});
