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
var Game = require('../../../../../Game');
var Code = Game.Code;

module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

Handler.prototype.getEntry = function(msg, session, next) {
    var connectors = this.app.getServersByType('connector');
    if(!connectors || connectors.length === 0) {
        next(null, Game.wrapMsg(Code.GATE.NOT_EXIST_ENTRY));
        return;
    }

    var connector = connectors[parseInt(Math.random() * connectors.length)];

    var data = {
        host: connector.host,
        port: connector.clientPort
    };

    next(null, Game.wrapMsg(null, data));
};
