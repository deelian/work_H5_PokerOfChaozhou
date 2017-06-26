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
var Game = require('../../../../../game');
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

Handler.prototype.get_user = function(msg, session, next) {
    var uid = msg.id || session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    this.service.getUserInfo(uid, function(err, data) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, data));
    });
};

Handler.prototype.buy_user_tokens = function(msg, session, next) {
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    var productID = msg.productID;
    if (!productID) {
        next(null, Game.wrapMsg(Code.LOBBY.NOT_PRODUCT));
        return;
    }

    var diamondType = Game.Game.DIAMOND_TYPE;
    var productDiamond = diamondType[productID];
    if (!productDiamond) {
        next(null, Game.wrapMsg(Code.LOBBY.NOT_PRODUCT));
        return;
    }

    var diamonds = productDiamond.diamonds;
    var price = productDiamond.price;
    var productInfo = {
        diamonds: diamonds,
        price: price
    };

    this.service.buyUserTokens(uid, productInfo, function(err, tokens) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, tokens));
    });
};

Handler.prototype.get_user_tokens = function(msg, session, next) {
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    this.service.getUserTokens(uid, function(err, tokens) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, tokens));
    });
};

Handler.prototype.get_logs = function(msg, session, next) {
    var self = this;
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    msg = msg || {};
    var page = msg.page || 0;
    
    self.service.getLogs(uid, page, function(err, data) {
        if (err != null) {
            next(null, Game.wrapMsg(Code.SYSTEM.RPC_ERROR));
        }

        next(null, Game.wrapMsg(null, data));
    });
};

Handler.prototype.get_record = function(msg, session, next) {
    var self = this;
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    msg = msg || {};
    var id = msg.id || 0;

    self.service.getRecord(uid, id, function(err, data) {
        if (err != null) {
            next(null, Game.wrapMsg(Code.SYSTEM.RPC_ERROR));
        }

        next(null, Game.wrapMsg(null, data));
    });
};

Handler.prototype.get_bulletins = function(msg, session, next) {
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    this.service.getBulletins(uid, function(err, player) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, player));
    });
};

Handler.prototype.get_orderid = function(msg, session, next) {
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }

    var productId = msg.productID;
    var env       = msg.env;

    logger.info("generating order: %d %j", uid, msg);

    this.service.getOrderID(uid, productId, env, function(err, orderId) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, orderId));
    });
};

Handler.prototype.query_order = function(msg, session, next) {
    var uid = session.uid;
    if (!uid) {
        next(null, Game.wrapMsg(Code.ROUTE.UNAUTHORIZED));
        return;
    }
    
    this.service.queryOrder(uid, function(err, data) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        next(null, Game.wrapMsg(null, data));
    });
};
