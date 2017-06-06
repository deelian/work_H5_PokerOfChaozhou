/*
 * Base Dependencies
 */

/*
 * Server Dependencies
 */
var pomelo = require('../../../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);

/*
 * Game Dependencies
 */
var Game = require('../../../../../game');
var Code = Game.Code;

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};
