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
    this.service = app.get('roomService');
};

var proto = Handler.prototype;

/**
 * 创建房间
 * @param msg
 * @param session
 * @param next
 *
 * @callback data=roomID
 */
proto.create = function(msg, session, next) {
    var self = this;

    // 已经创建了房间
    var roomID = this.service.getHostRoom(session.uid);
    if (roomID) {
        next(null, Game.wrapMsg(Code.ROOM.ALREADY_HAVE_ROOM, roomID));
        return;
    }
    
    var opts = {
        host:     session.uid,
        type:     msg.type,
        settings: msg.settings
    };

    this.service.createRoom(opts, function(err, roomID) {
        next(null, Game.wrapMsg(err, roomID));
    });
};

/**
 * 进入房间
 * @param msg
 * @param session
 * @param next
 *
 * @callback data={ player: 玩家数据 roomID: 自己创建的房间 }
 */
proto.enter = function(msg, session, next) {
    var self = this;

    this.service.enterRoom(session, msg.roomID, function(err, data) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, data));
    });
};

/**
 * 离开房间
 * @param msg
 * @param session
 * @param next
 *
 * @callback data={}
 */
proto.leave = function(msg, session, next) {
    var self = this;

    this.service.leaveRoom(session, function(err, roomID) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }
        
        next(null, Game.wrapMsg(null, {}));
    });
};

proto.command = function(msg, session, next) {
    var self = this;

    this.service.processMsg(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};

