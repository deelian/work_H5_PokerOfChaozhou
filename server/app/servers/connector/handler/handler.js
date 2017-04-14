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

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
    if (msg.udid == null) {
        next(null, Game.wrapMsg(Code.ROUTE.INVALID_PARAMS));
        return;
    }
    
    session.set('udid', msg.udid);
    session.on('closed', function(session, reason) {
        console.log("session closed");
    });
    session.pushAll(function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(Code.SYSTEM.SESSION_ERROR));
            return;
        }
        
        next(null, { code: Code.OK });
    });

    console.log(session);
};
