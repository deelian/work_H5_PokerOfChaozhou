/*
 * Base Dependencies
 */
var express = require('express');
var router = express.Router();
var UUID = require('uuid');
var request = require('request');

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:route:portal');
var app = require('../app');
var GameDB = require('../../models/game');

/*
 * UModules Dependencies
 */
var Game = require('../../game');
var GE = Game.ERROR;

module.exports = {
    path: "/portal",
    route: router
};

router.get('/', function(req, res, next) {
    res.locals.name = "欢乐木虱";
    res.locals.url  = "http://h5.glfun.cn/deju-poker/index.html?state=PORTAL_RELEASE&v=" + UUID.v4();

    res.render('portal');
});

router.get('/beta', function(req, res, next) {
    res.locals.name = "欢乐木虱";
    res.locals.url  = "http://h5.glfun.cn/deju-poker-test/index.html?state=PORTAL_BETA&v=" + UUID.v4();

    res.render('portal');
});

router.get('/alpha', function(req, res, next) {
    res.locals.name = "欢乐木虱";
    res.locals.url  = "http://192.168.80.253/DejuPoker/index.html";

    res.render('portal');
});

router.get('/dev1', function(req, res, next) {
    res.locals.name = "欢乐木虱";
    res.locals.url  = "http://192.168.80.185/deju-poker/dist/client/latest/index.html";

    res.render('portal');
});

router.get('/dev2', function(req, res, next) {
    res.locals.name = "欢乐木虱";
    res.locals.url  = "http://192.168.1.106/deju-poker/dist/client/latest/index.html";

    res.render('portal');
});

