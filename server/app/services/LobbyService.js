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
        .spread(route, msg, opts, cb);
};

proto.buyUserTokens = function(uid, productInfo, cb) {
    var User = GameDB.models.user;

    productInfo = productInfo || {};
    var diamonds = productInfo.diamonds || 3;
    var price = productInfo.price || 6;

    User.findOne({
        where: { id: uid }
    }).then(function(record) {
        if (record == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        var tokens = record.tokens || 0;
        tokens += diamonds;
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

proto.getLogs = function(uid, page, cb) {
    var data = [];
    var searchUid = "%u" + uid + "#%";
    var leastDay = Moment().subtract(3, 'days').format("YYYY-MM-DD HH:mm:ss");
    var offset = Number(page) * 10;

    // 三天内 userInfo包含searchUid 时间倒序 100条以内
    GameDB.models.record.findAll({
        where: {
            userInfo: {$like: searchUid},
            createdAt: {$gt: leastDay}
        },
        order: 'createdAt DESC',
        offset: offset,
        limit: 10
    }).then(function(records) {
        if (records == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        records.forEach(function(record) {
            var d = record.toJSON();
            if (d.data) {
                var roomData = JSON.parse(d.data);
                var sendData = {info: roomData.info, users: roomData.users};
                sendData.info.times = roomData.rounds.length;
                sendData.id = d.id;

                data.push(sendData);
            }
        });

        cb(null, data);
    }).catch(function(e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};

// 单个房间的具体战绩获取
proto.getRecord = function(uid, recordId, cb) {
    GameDB.models.record.findOne({
        where: {
            id: recordId
        }
    }).then(function(record) {
        if (record == null) {
            cb(Code.ROUTE.INVALID_SESSION);
            return;
        }

        var data = {};
        var d = record.toJSON();
        if (d.data) {
            data = JSON.parse(d.data);
        }

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

proto.getOrderID = function(uid, productId, env, cb) {
    var product = Game.Game.DIAMOND_TYPE[productId];
    if (product == null) {
        cb(Code.ROUTE.INVALID_PARAMS);
        return;
    }

    var type = 0;
    if (env == "ios") {
        type = Game.ORDER_TYPE.IOS;
    } else if (env == "android") {
        type = Game.ORDER_TYPE.ANDROID;
    } else if (env == "h5") {
        type = Game.ORDER_TYPE.H5;
    } else {
        cb(Code.ROUTE.INVALID_PARAMS);
        return;
    }

    var Order = GameDB.models.order;
    Order.create({
        offerId:        0,
        userId:         uid,
        productId:      product.id,
        productName:    product.name,
        productPrice:   product.price * 100,
        tokens:         product.diamonds,
        env:            env,
        type:           type
    }).then(function (record) {
        cb(null, record.orderId);
    }).catch(function (e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};

proto.queryOrder = function(uid, cb) {
    var User = GameDB.models.user;
    var Order = GameDB.models.order;
    var sequelize = GameDB.sequelize;

    Order.findAndCountAll({
        where: {
            userId: uid,
            status: Game.ORDER_STATUS.SUCCESS,
            env: {
                $in: [ "ios", "android", "h5" ]
            }
        }
    }).then(function (results) {
        var count = results.count;
        var records = results.rows;

        var idArray = [];
        var data = [];
        var tokens = 0;
        records.forEach(function (record) {
            tokens += record.tokens;

            data.push({
                orderId:     record.orderId,
                productName: record.productName,
                tokens:      record.tokens
            });

            idArray.push(record.id);
        });

        sequelize.transaction(function (t) {

            return User.findOne(
                {
                    where: { id: uid }
                },
                {
                    transaction: t
                }
            ).then(function (record) {
                if (record == null) {
                    throw new Error("invalid session");
                }

                record.tokens += tokens;

                return record.save();
            }).then(function (result) {
                return Order.update(
                    {
                        status: Game.ORDER_STATUS.PROCESSED
                    },
                    {
                        where: {
                            id: {
                                $in: idArray
                            }
                        }
                    },
                    {
                        transaction: t
                    }
                );
            });
        }).then(function (result) {
            logger.info("query results uid:%d orders:%j", uid, data);

            cb(null, data);
        }).catch(function (e) {
            logger.error(e);
            cb(Code.SYSTEM.MySQL_ERROR);
        });
    }).catch(function (e) {
        logger.error(e);
        cb(Code.SYSTEM.MySQL_ERROR);
    });
};