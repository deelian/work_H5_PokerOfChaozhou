/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:route:bulletins');
var app = require('../app');
var GameDB = require('../../models/game');
var bulletins = require('../controllers').bulletins;

/*
 * UModules Dependencies
 */
var Game = require('../../game');
var GE = Game.ERROR;

module.exports = {
    path: "/bulletins",
    route: router
};

router.get('/', bulletins.list);
router.post('/', bulletins.create);

router.get('/:id', bulletins.get);
router.put('/:id', bulletins.update);
router.delete('/:id', bulletins.delete);

