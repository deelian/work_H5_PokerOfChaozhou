/*
 * Base Dependencies
 */
var async = require('async');

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
    this.app            = app;
    this.service        = app.get('lobbyService');
};

Handler.prototype.enter = function(msg, session, next) {
    var self = this;
    var data = {};
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    this.app.get('channelService')
        .getChannel('lobby', true)
        .add(session.uid, session.frontendId);

    this.service.enter(uid, function(err, player) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        self.app.rpc.room.remote.getHostRoom(session, session.uid, function(err, roomID) {
            if (err != null) {
                next(null, Game.wrapMsg(Code.SYSTEM.RPC_ERROR));
            }

            data.player = player;
            data.roomID = roomID;

            session.set('lobby', true);
            session.pushAll(function(err) {
                next(null, Game.wrapMsg(null, data));
            });
        });
    });
};
