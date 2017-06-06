'use strict';

/**
 * Module dependencies.
 */
var StandardHttpError = require('standard-http-error');
var util = require('util');

/*
 * Server Dependencies
 */
var debug = require('debug')('deju-poker:errors:server');

/*
 * UModules Dependencies
 */
var Game = require('../../game/');
var MESSAGE = Game.MESSAGE;

/**
 * Constructor.
 */
function ServerError(code, message) {
    var status = MESSAGE[code][0] || 500;
    message = message || MESSAGE[code][1] || "unspecified server error";
    var properties = {
        value: code,
        name: MESSAGE[code][1] || "InternalServerError"
    };

    StandardHttpError.call(this, status, message, properties);
}

/**
 * Inherit prototype.
 */
util.inherits(ServerError, StandardHttpError);

/**
 * Export constructor.
 */
module.exports = ServerError;
