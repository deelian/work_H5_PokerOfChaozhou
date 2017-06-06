/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:route:system');
var app = require('../app');
var GameDB = require('../../models/game');

/*
 * UModules Dependencies
 */
var Game = require('../../game');
var GE = Game.ERROR;

module.exports = {
    path: "/system",
    route: router
};

router.get('/', function(req, res, next) {
    res.send();
});

