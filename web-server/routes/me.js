/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:route:me');
var app = require('../app');
var GameDB = require('../../models/game');
var User = GameDB.models.user;

/*
 * UModules Dependencies
 */
var Game = require('../../game');
var GE = Game.ERROR;

module.exports = {
    path: "/me",
    route: router
};

router.use(app.authServer.authenticate());

router.get('/',function(req, res, next) {
    var token = req.token;
    var user  = req.user;
    User.findOne({
        where: { id: user.id }
    }).then(function(record) {
        res.success(record);
    }).catch(function(e) {
        next(e);
    });
});

router.put('/password', function(req, res, next) {
});

