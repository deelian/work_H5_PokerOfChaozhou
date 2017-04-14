/*
 * Base Dependencies
 */

/*
 * Server Dependencies
 */
var pomelo = require('../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);

/*
 * Game Dependencies
 */
var Game = require('../../../Game');
var Room = Game.Room;

var ChatService = function(app) {
    this.app                = app;
    this.users              = {};
};

module.exports = ChatService;