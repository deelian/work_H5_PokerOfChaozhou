/*
 * Base Dependencies
 */
var async = require('async');

/*
 * Server Dependencies
 */
var pomelo = require('../../../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);
var GameDB = require('../../../models/game');
var User = GameDB.models.user;

/*
 * Game Dependencies
 */
var Game = require('../../../game');
var Code = Game.Code;
var ROUTE = Game.ROUTE;
var Conf = Game.Game;
var Room = Game.Room;
var Player = Game.Player;

var RoomService = function(app) {
    this.app                = app;
    this.rooms              = {};           // { roomID: Game.Room }
    this.users              = {};           // { userID: roomID }
};

module.exports = RoomService;

var proto = RoomService.prototype;

proto.enterRoom = function(userID, serverID, roomID, callback) {
    var room = this.getRoom(roomID);
    if (room == null) {
        callback(Code.ROOM.NOT_EXIST);
        return;
    }

    if (room.locked && room.getMember(userID) == false) {
        callback(Code.ROOM.IS_LOCKED);
        return;
    }

    if (room.isGotPos() == false && room.getMember(userID) == false) {
        callback(Code.ROOM.IS_FULL);
        return;
    }

    var self = this;

    User.findOne({
        where: { id: userID }
    }).then(function(record) {
        room.enter(record.player);
        self.users[userID] = roomID;

        // 离开房间频道
        self.app.get('channelService')
            .getChannel(roomID, true)
            .leave(userID);

        // 加入房间频道
        self.app.get('channelService')
            .getChannel(roomID, true)
            .add(userID, serverID);

        callback(null, room.infoToPlayer(userID));
    }).catch(function(e) {
        callback(Code.ROOM.IS_LOCKED);
    });
};

proto.leaveRoom = function(userID, callback) {
    var roomID = this.users[userID];
    if (roomID == null) {
        callback(Code.ROOM.NOT_IN_ROOM);
        return
    }

    var room = this.getRoom(roomID);
    if (room == null) {
        delete this.users[userID];

        callback(Code.ROOM.NOT_EXIST);
        return;
    }

    room.leave(userID);
    delete this.users[userID];

    // 离开房间频道
    this.app.get('channelService')
        .getChannel(roomID, true)
        .leave(userID);
    
    callback(null, roomID);
};

// 离线了
proto.afk = function(userID, callback) {
    var roomID = this.users[userID];
    if (roomID == null) {
        callback(null, 0);
        return
    }

    var room = this.getRoom(roomID);
    if (room == null) {
        delete this.users[userID];
        callback(null, 0);
        return;
    }

    room.afk(userID);

    // 离开房间频道
    this.app.get('channelService')
        .getChannel(roomID, true)
        .leave(userID);
    
    callback(null, roomID);
};

proto.createRoom = function(opts, callback) {
    opts = opts || {};
    opts.settings = opts.settings || {};

    var self = this;
    var room = null;
    var exception = false;
    var times = opts.settings.times || 10;
    var type = opts.type || Conf.ROOM_TYPE.STATIC;
    var cost = 1;
    var nowTokens = 0;

    switch (type) {
        case Conf.ROOM_TYPE.CUSTOMIZED: {
            if (times <= 10) {
                times = 10;
                cost = 5;
            }
            else if (times <= 20) {
                times = 20;
                cost = 8;
            }
            else {
                times = 30;
                cost = 10;
            }
            break;
        }
        default: {
            if (times <= 10) {
                times = 10;
                cost = 3;
            }
            else {
                times = 20;
                cost = 6;
            }
        }
    }

    opts.settings.times = times;
    opts.cost = cost;

    // 检查够不够钱
    var checkToken = function(cb) {
        User.findOne({
            where: { id: opts.host }
        }).then(function(record) {
            if (record == null) {
                cb(Code.SYSTEM.MySQL_ERROR);
                return;
            }
            nowTokens = record.tokens;

            if (nowTokens < cost) {
                cb(Code.ROOM.NOT_ENOUGH_TOKENS);
                return;
            }
            cb(null);
        }).catch(function(e) {
            cb(Code.SYSTEM.MySQL_ERROR);
        });
    };

    var consume = function(cb) {
        User.update({
            tokens: nowTokens - cost
        },
        {
            where: { id: opts.host }
        }).then(function(record) {
            cb(null);
        }).catch(function(err){
            cb(err);
        })
    };

    // 创建一个房间
    var buildRoom = function(cb) {
        async.until(
            // test
            function() {
                return (room !== null) || (exception === true);
            },

            // iterator
            function(untilCB) {
                var roomID = Game.sprintf("%06d", Game.m.range_between(0, 999999));

                GameDB.models.room.findOne({
                    where: { id: roomID }
                }).then(function(record) {
                    if (record != null) {
                        return record;
                    }

                    opts.id = roomID;
                    opts.service = self;

                    room = new Room(opts);
                    return GameDB.models.room.create({
                        id:   roomID,
                        data: room.toString()
                    })
                }).then(function(record) {
                    if (roomID != null && room != null && self.rooms[roomID] == null) {
                        self.rooms[roomID] = room;
                    }

                    untilCB(null);
                }).catch(function(e) {
                    logger.error("create room error: ", e);
                    untilCB(Code.SYSTEM.MySQL_ERROR);
                })
            },

            // end if (test() ==== true)
            function(err) {
                cb(err);
            }
        );
    };

    async.series([
        checkToken,
        buildRoom,
        consume
    ],
    function(err) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, room.id);
    });
};

proto.destroyRoom = function(roomID) {
    var i;
    var size;
    var self = this;
    var userID;

    // 删除用户索引
    var room = this.getRoom(roomID);
    if (room != null) {
        for (i = 0, size = room.members.length; i < size; i++) {
            userID = room.members[i];
            if (userID && this.users[userID] == roomID) {
                delete this.users[userID];
            }
        }
    }

    // 删除房间频道
    this.app.get('channelService').destroyChannel(roomID);
    var roomLog = room.roomLog || {};
    var userLog = roomLog.users || {};
    
    var userString = "";
    for (userID in userLog) {
        userString += ("u" + userID + "#");
    }

    async.series([
        function(callback) {
            // 没生成成绩的话就不存空数据
            if (room.firstPay == false) {
                callback(null);
                return;
            }

            GameDB.models.record.create({
                roomID:    roomID,
                userInfo:  userString,
                data:      JSON.stringify(roomLog)
            }).then(function(record) {
                callback(null);
            }).catch(function(e) {
                logger.error(e);
                callback(null);
            })
        },
        
        function(callback) {
            // 没生成成绩的话就不存空数据
            if (room.firstPay == false) {
                // 没生成成绩的话要给房主补回钱财
                User.findOne({
                    where: { id: room.host }
                }).then(function(record) {
                    if (record == null) {
                        callback(Code.SYSTEM.MySQL_ERROR);
                        return;
                    }
                    var cost = room.cost || 1;
                    record.tokens += cost;

                    record.save().then(function(result) {
                        callback(null);
                    });
                }).catch(function(e) {
                    callback(Code.SYSTEM.MySQL_ERROR);
                });
                return;
            }

            var users = Object.keys(userLog);
            var iterator = function(uid, cb) {
                if (uid == "ghostPokers") {
                    cb(null);
                    return;
                }

                uid = Number(uid);

                User.find({
                    where: { id: uid }
                }).then(function(record) {
                    if (record == null) {
                        cb(null);
                        return;
                    }

                    var log = userLog[uid];
                    var player = new Player(record.player);
                    player.addPlayTimes(log.playTimes);
                    player.addWinTimes(log.winTimes);
                    player.addFightTimes(log.fightTimes);
                    player.addGodTimes(log.godTimes);
                    player.addGhostTimes(log.ghostTimes);

                    record.data = JSON.stringify(player.data);
                    record.save().then(function(result) {
                        if (typeof cb == "function") {
                            cb(null);
                        }
                    }).catch(function(e) {
                        debug(e);
                        if (typeof cb == "function") {
                            cb(e);
                        }
                    });
                }).catch(function(e) {
                    logger.error(e);
                    cb(Code.SYSTEM.MySQL_ERROR, null);
                });
            };

            async.eachSeries(users, iterator, function(err) {
                if (err != null) {
                    callback(err);
                    return;
                }

                if (typeof callback == "function") {
                    callback(null);
                }
            });
        },

        function(callback) {
            GameDB.models.room.destroy({
                where: {id: roomID}
            }).then(function (result){
                // 操作结果
            }).catch(function(err){
                // 出错了
                logger.error(err);
            });

            // 删除房间索引
            delete self.rooms[roomID];
            callback(null);
        }
    ], function(err) {
    });
};

proto.getRoom = function(roomID) {
    return this.rooms[roomID];
};

proto.getHostRoom = function(userID) {
    var keys = Object.keys(this.rooms);
    
    for (var i = 0, size = keys.length; i < size; i++) {
        var roomID = keys[i];
        var room = this.getRoom(roomID);
        if (room == null) {
            continue;
        }

        if (room.members.indexOf(userID) != -1) {
            return roomID;
        }
    }

    return null;
};

proto.loadRooms = function(callback) {
    var self = this;

    GameDB.models.room.findAll().then(function(records) {
        records.forEach(function(record) {
            var opts = JSON.parse(record.data);

            opts.service = self;
            
            self.rooms[record.id] = new Room(opts);

            logger.info("room %d loaded...", record.id);
        });

        callback && callback(true);
    }).catch(function(e) {
        logger.error("load all rooms error: ", e);
        callback && callback(false);
    });
};

proto.broadcast = function(roomID, route, msg, opts, cb) {
    this.app.get('channelService')
        .getChannel(roomID, true)
        .spread(route, msg, opts, cb);
};

proto.send = function(roomID, userID, route, msg, opts, cb) {
    this.app.get('channelService')
        .getChannel(roomID, true)
        .send(userID, route, msg, opts, cb);
};

proto.processMsg = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    room.queue(userID, msg);
    cb && cb(null);
};

//-----------------------------about chat-------------------------------
proto.chat = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    if (room.isForbidden(userID)) {
        cb && cb(Code.ROOM.USER_IS_FORBIDDEN);
        return;
    }
    
    var self = this;

    User.findOne({
        where: { id: userID }
    }).then(function(record) {
        self.broadcast(roomID, ROUTE.CHAT.SEND, {userID: userID, name: record.player.name, msg: msg.data}, null);
        cb && cb(null);
    }).catch(function(e) {
        callback(Code.ROOM.IS_LOCKED);
    });
};

proto.get_forbidden = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var result = room.getForbidden();
    
    cb && cb(null, result);
};

proto.add_forbidden = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var result = room.addForbidden(userID, msg.data);

    if (result != null) {
        this.broadcast(roomID, ROUTE.CHAT.FORBID, {userID: msg.data}, null);
    }
    cb && cb(null, result);
};

proto.del_forbidden = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var result = room.delForbidden(userID, msg.data);

    if (result != null) {
        this.broadcast(roomID, ROUTE.CHAT.FORBID_CANCEL, {userID: msg.data}, null);
    }
    cb && cb(null, result);
};
//-----------------------------about chat end---------------------------

//-----------------------------about chair------------------------------
proto.sit_down = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var data = -1;
    if (msg.data) {
        data = parseInt(msg.data);
    }

    var result = room.sitDown(userID, data);

    if (result != -1) {
        var chairs = room.getChairs();
        var roomSend = {
            table: {
                clients: {}
            }
        };

        var client = room.table.getClient(userID);
        if (client) {
            roomSend.table.clients[userID] = client;
        }
        this.broadcast(roomID, ROUTE.CHAIR.SIT_DOWN, {userID: userID, pos: result, chairs: chairs, room: roomSend}, null);
    }
    cb && cb(null, result);
};

proto.stand_up = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var result = room.standUp(userID, msg);

    if (result != false) {
        this.broadcast(roomID, ROUTE.CHAIR.STAND_UP, {userID: userID, room: {table: {deleteClient: [userID]}}}, null);
    }
    cb && cb(null, result);
};

proto.let_stand_up = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var result = room.letStandUp(userID, msg.data);

    if (result != false) {
        this.broadcast(roomID, ROUTE.CHAIR.LET_STAND_UP, {userID: msg.data, room: {table: {deleteClient: [msg.data]}}}, null);
    }
    cb && cb(null, result);
};
//-----------------------------about chair end--------------------------

proto.kick = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var self = this;
    var kickedUserID = msg.data;
    var result = room.kick(userID, kickedUserID);

    if (result != false) {
        this.send(roomID, kickedUserID, ROUTE.ROOM.KICK, {userID: msg.data}, null, function () {
            delete self.users[kickedUserID];

            self.app.get('channelService')
                .getChannel(roomID, true)
                .leave(kickedUserID);
        });
    }

    cb && cb(null, result);
};

proto.makeDestroy = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    room.makeDestroy(userID, msg);
    cb && cb(null);
};

proto.dismissConfirm = function(userID, msg, cb) {
    var roomID = this.users[userID];
    var room = this.getRoom(roomID);
    if (room == null) {
        cb && cb(Code.ROOM.NOT_EXIST);
        return;
    }

    var confirm = msg.confirm || false;

    room.dismissConfirm(userID, confirm);
    cb && cb(null);
};

proto.save = function(roomID, callback) {
    var room = this.getRoom(roomID);
    if (room == null) {
        if (typeof callback == "function") {
            callback(null);
        }
        return;
    }
    
    GameDB.models.room.findOne({
        where: { id: roomID }
    }).then(function(record) {
        if (record == null) {
            return;
        }

        record.data = room.toString();
        record.save().then(function() {
            if (typeof callback == "function") {
                callback(null);
            }
        }).catch(function(e) {
            debug(e);
            if (typeof callback == "function") {
                callback(e);
            }
        });
    }).catch(function(e) {
        logger.error("save room error: ", e);
        if (typeof callback == "function") {
            callback(e);
        }
    })
};

proto.saveRooms = function(callback) {
    var self = this;
    var keys = Object.keys(this.rooms);

    var iterator = function(uuid, callback) {
        self.save(uuid, function(e) {
            callback(e);
        });
    };

    logger.info('stopping room service...');
    async.eachSeries(keys, iterator, function(err) {
        if (err != null) {
            callback(err);
            return;
        }

        if (typeof callback == "function") {
            callback(null);
        }
    });
};
