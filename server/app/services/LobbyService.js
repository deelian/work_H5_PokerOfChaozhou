/*
 * Base Dependencies
 */

/*
 * Server Dependencies
 */
var pomelo = require('../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);
var GameDB = require('../../../models/game');
var Moment = require('moment');

/*
 * Game Dependencies
 */
var Game = require('../../../game');
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
        logger.error(e);
        callback(Code.SYSTEM.MySQL_ERROR);
    });
};

proto.leave = function(uid, callback) {
    delete this.users[uid];
};

proto.broadcast = function(route, msg, opts, cb) {
    this.app.get('channelService')
        .getChannel('lobby', true)
        .broadcast(route, msg, opts, cb);
};

proto.buyUserTokens = function(uid, cb) {
    var User = GameDB.models.user;

    User.findOne({
        where: { id: uid }
    }).then(function(record) {
        if (record == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        var tokens = record.tokens || 0;
        tokens += 5;
        record.tokens = tokens;
        
        record.save().then(function() {
            cb(null, tokens);
        }).catch(function(e) {
            logger.error(e);
            cb(Code.SYSTEM.MySQL_ERROR);
        });
    }).catch(function(e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};

proto.getUserTokens = function(uid, cb) {
    var User = GameDB.models.user;

    User.findOne({
        where: { id: uid }
    }).then(function(record) {
        if (record == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        var tokens = record.tokens || 0;
        cb(null, tokens);
    }).catch(function(e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};

proto.getUserInfo = function(uid, cb) {
    var User = GameDB.models.user;

    User.findOne({
        where: { id: uid }
    }).then(function(record) {
        if (record == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        var data = record.player;
        cb(null, data);
    }).catch(function(e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};

proto.getLogs = function(logIDs, cb) {
    logIDs = logIDs || [];
    var data = [];

    GameDB.models.record.findAll({
        where: { id: {$in: logIDs} }
    }).then(function(records) {
        if (records == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        records.forEach(function(record) {
            var d = record.toJSON();
            if (d.data) {
                d.data = JSON.parse(d.data);
            }
            data.unshift(d);
        });

        cb(null, data);
    }).catch(function(e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};

proto.getBulletins = function(uid, cb) {
    var Bulletin = GameDB.models.bulletin;
    var currTime = Moment().format('YYYY-MM-DD HH:mm:ss');

    Bulletin.findAll({
        where: {
            startTime: { $lt: currTime },
            endTime: { $gt: currTime }
        },
        order: "startTime desc"
    }).then(function(records) {
        if (records == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        var data = [];
        
        records.forEach(function(record) {
            var d = record.toJSON();
            data.push(d);
        });
        
        cb(null, data);
    }).catch(function(e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};
