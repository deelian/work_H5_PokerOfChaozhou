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
    this.service = app.get('authService');
};

Handler.prototype.verify = function(msg, session, next) {
    var self = this;

    if (msg.udid == null) {
        next(null, Game.wrapMsg(Code.REQUEST.INVALID_PARAMS));
        return;
    }

    self.service.verifyUser(msg, function(err, user) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }
        
        session.bind(user.id, function(err, result) {
            next(null, Game.wrapMsg(null, user));
        });
    });
};
