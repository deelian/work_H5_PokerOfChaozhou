/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:route:index');
var app = require('../app');
var GameDB = require('../../models/game');
var tokenUtils = require('../utils/token-utils');

/*
 * UModules Dependencies
 */
var Game = require('../../game');

var GE = Game.ERROR;
var User = GameDB.models.user;

module.exports = {
    path: "/",
    route: router
};

router.get('/', function(req, res, next) {
    res.send();
});

router.post('/token', app.authServer.token());

router.get('/summary', function(req, res, next) {

});
