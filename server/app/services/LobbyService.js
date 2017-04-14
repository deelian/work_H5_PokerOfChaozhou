/*
 * Base Dependencies
 */

/*
 * Server Dependencies
 */
var pomelo = require('../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);
var GameDB = require('../models/game');

/*
 * Game Dependencies
 */
var Game = require('../../../Game');
var Code = Game.Code;

var LobbyService = function(app) {
    this.app        = app;
    this.users      = {};           // { userID: Instance Of Game.models.user }
};

module.exports = LobbyService;

var proto = LobbyService.prototype;

proto.getUser = function(uid, callback) {
    callback(null, this.users[uid]);
};

proto.enter = function(uid, callback) {
    var self = this;

    if (this.users[uid]) {
        callback(null, this.users[uid].player);
        return;
    }

    var User = GameDB.models.user;

    User.findOne({
        where: { id: uid }
    }).then(function(record) {
        if (record == null) {
            callback(Code.ROUTE.INVALID_SESSION);
            return;
        }

        self.users[uid] = record;

        callback(null, record.player);
    }).catch(function(e) {
        logger.error("load user error: %j", e);
        callback(Code.SYSTEM.MySQL_ERROR);
    });
};

proto.leave = function(uid, callback) {
    delete this.users[uid];
    delete this.players[uid];
};

proto.broadcast = function(route, msg, opts, cb) {
    this.app.get('channelService')
        .getChannel('lobby', true)
        .broadcast(route, msg, opts, cb);
};
