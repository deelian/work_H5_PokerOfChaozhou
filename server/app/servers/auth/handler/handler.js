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
    this.service = app.get('authService');
};

// 微信认证
Handler.prototype.verify = function(msg, session, next) {
    var self = this;

    if (msg.udid == null) {
        next(null, Game.wrapMsg(Code.REQUEST.INVALID_PARAMS));
        return;
    }

    self.service.verifyUser(msg, function(err, data) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }
        
        session.bind(data.player.id, function(err, result) {
            next(null, Game.wrapMsg(null, data));
        });
    });
};

// 游客登录
Handler.prototype.guest = function(msg, session, next) {
    var self = this;

    if (msg.udid == null) {
        next(null, Game.wrapMsg(Code.REQUEST.INVALID_PARAMS));
        return;
    }

    self.service.verifyGuest(msg, function(err, data) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        session.bind(data.player.id, function(err, result) {
            next(null, Game.wrapMsg(null, data));
        });
    });
};

// 令牌刷新
Handler.prototype.refresh = function(msg, session, next) {
    var self = this;

    if (msg.udid == null) {
        next(null, Game.wrapMsg(Code.REQUEST.INVALID_PARAMS));
        return;
    }

    self.service.verifyToken(msg, function(err, data) {
        if (err) {
            next(null, Game.wrapMsg(err));
            return;
        }

        session.bind(data.player.id, function(err, result) {
            next(null, Game.wrapMsg(null, data));
        });
    });
};
