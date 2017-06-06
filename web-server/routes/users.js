/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:route:users');
var app = require('../app');
var GameDB = require('../../models/game');
var users = require('../controllers').users;

/*
 * UModules Dependencies
 */
var Game = require('../../game');
var GE = Game.ERROR;

module.exports = {
    path: "/users",
    route: router
};

router.use(app.authServer.authenticate());

router.get('/', users.list);
router.post('/', users.create);
router.put('/:id/tokens', users.rechargeTokens);

router.get('/:id', users.get);
router.put('/:id', users.update);
router.delete('/:id', users.delete);
