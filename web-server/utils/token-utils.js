/**
 * Module dependencies.
 */
var UUID = require('uuid');
var JWT = require('jsonwebtoken');

/*
 * Server Dependencies
 */
var app = require('../app');
var ServerError = require('../errors/server-error');

/*
 * Game Modules Dependencies
 */
var Game = require('../../game');
var GE = Game.ERROR;

var JWT_SECRET = "!vo*Rz2[[YXwEP1gL8j.qpuMU]^(9N$^";

module.exports = {
    generateAccessToken: function(user, scope, callback) {
        var payload = {
            user:    user,
            scope:   scope
        };

        var options = {
            algorithm: "HS256",
            issuer:    "DejuPoker Inc.",
            subject:   "AccessToken",
            audience:  "User",
            expiresIn: 900,
            jwtid:     UUID.v4()
        };

        JWT.sign(payload, JWT_SECRET, options, function(err, token) {
            callback && callback(err, token);
        });
    },

    verifyToken: function(token, callback) {
        var dtoken = null;
        try {
            dtoken = JWT.decode(token, { complete: true }) || {};
        } catch (err) {
            callback && callback(err);
            return;
        }

        JWT.verify(token, JWT_SECRET, function(err, decoded) {
            if (err != null) {
                callback && callback(err);
                return;
            }

            callback && callback(null, decoded);
        });
    }
};
