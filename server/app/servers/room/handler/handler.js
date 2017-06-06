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
        members:  [session.uid],
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

    this.service.enterRoom(session.uid, session.frontendId, msg.roomID, function(err, data) {
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

    this.service.leaveRoom(session.uid, function(err, roomID) {
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

proto.destroy = function(msg, session, next) {
    var self = this;

    this.service.makeDestroy(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};

proto.dismiss_confirm = function(msg, session, next) {
    var self = this;

    this.service.dismissConfirm(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};

//--------------------chat begin-----------------------
proto.chat = function(msg, session, next) {
    var self = this;

    this.service.chat(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};

proto.get_forbidden = function(msg, session, next) {
    var self = this;

    this.service.get_forbidden(session.uid, msg, function(err, result) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, result));
    });
};

proto.add_forbidden = function(msg, session, next) {
    var self = this;

    this.service.add_forbidden(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};

proto.del_forbidden = function(msg, session, next) {
    var self = this;

    this.service.del_forbidden(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};
//--------------------chat end-------------------------

//--------------------chair begin----------------------
proto.sit_down = function(msg, session, next) {
    var self = this;

    this.service.sit_down(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};

proto.stand_up = function(msg, session, next) {
    var self = this;

    this.service.stand_up(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};

proto.let_stand_up = function(msg, session, next) {
    var self = this;

    this.service.let_stand_up(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};
//--------------------chair end------------------------

proto.kick = function(msg, session, next) {
    var self = this;

    this.service.kick(session.uid, msg, function(err) {
        if (err != null) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, {}));
    });
};
