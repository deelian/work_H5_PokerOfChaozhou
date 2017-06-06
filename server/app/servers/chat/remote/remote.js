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

module.exports = function(app) {
    return new Remote(app);
};

var Remote = function(app) {
    this.app = app;
};

var pro = Remote.prototype;