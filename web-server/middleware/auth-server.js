'use strict';
/**
 * Module dependencies.
 */

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:auth-server');
var app = require('../app');
var GameDB = require('../../models/game');
var tokenUtils = require('../utils/token-utils');

/*
 * UModules Dependencies
 */
var Game = require('../../game');

var GE = Game.ERROR;
var User = GameDB.models.user;

/**
 * Constructor.
 */
function AuthServer() {

}

AuthServer.prototype.authenticate = function() {
    return function(req, res, next) {
        var token = null;
        if (req.headers && req.headers.authorization) {
            var parts = req.headers.authorization.split(' ');
            if (parts.length == 2) {
                var scheme = parts[0];
                var credentials = parts[1];

                if (/^Bearer$/i.test(scheme)) {
                    token = credentials;
                }
            }
        }

        if (token == null) {
            res.error(GE.UNAUTHORIZED_REQUEST);
            return;
        }

        tokenUtils.verifyToken(token, function(err, decoded) {
            if (err != null) {
                next(err);
                return;
            }

            User.findOne({
                where: { id: decoded.user.id }
            }).then(function(record) {

                if (record == null) {
                    res.JSONP(GE.INVALID_TOKEN);
                    return;
                }

                req.token = decoded;
                req.user  = record;
                req.scope = record.scope;

                next();
            }).catch(function(e) {
                next(e);
            });
        });
    };
};

AuthServer.prototype.authorize = function() {

};

AuthServer.prototype.token = function() {
    return function(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        if (username == null) {
            res.error(GE.MISSING_ARGUMENT);
            return;
        }

        if (password == null) {
            res.error(GE.MISSING_ARGUMENT);
            return;
        }

        User.findOne({
            where: { account: username }
        }).then(function(record) {

            if (record == null) {
                res.error(GE.NOT_EXISTS);
                return;
            }

            if (record.password != password) {
                res.error(GE.INVALID_PASSWORD);
                return;
            }

            var user = {
                id:         record.id,
                name:       record.name,
                parentID:   record.parentID,
                agent:      record.agent
            };

            var scope = record.scope;

            tokenUtils.generateAccessToken(user, scope, function(err, token) {
                res.success(token);
            });
        }).catch(function(e) {

            next(e);
        })
    };
};
/**
 * Export constructor.
 */

module.exports = new AuthServer();
