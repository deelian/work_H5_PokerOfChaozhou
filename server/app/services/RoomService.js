/*
 * Base Dependencies
 */
var async = require('async');

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
var Room = Game.Room;

var RoomService = function(app) {
    this.app                = app;
    this.rooms              = {};           // { roomID: Game.Room }
    this.users              = {};           // { userID: roomID }
};

module.exports = RoomService;

var proto = RoomService.prototype;

proto.enterRoom = function(session, roomID, callback) {
    var userID = session.uid;

    var room = this.getRoom(roomID);
    if (room == null) {
        callback(Code.ROOM.NOT_EXIST);
        return;
    }

    room.enter(userID);
    this.users[userID] = roomID;

    // 加入房间频道
    this.app.get('channelService')
        .getChannel(roomID, true)
        .add(session.uid, session.frontendId);

    callback(null, room.clone());
};

proto.leaveRoom = function(session, callback) {
    var userID = session.uid;
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
    self.app.get('channelService')
        .getChannel(roomID, true)
        .leave(session.uid);
    
    callback(null, roomID);
};

proto.createRoom = function(opts, callback) {
    opts = opts || {};

    var self = this;
    var room = null;
    var exception = false;

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
                if (roomID != null) {
                    self.rooms[roomID] = room;
                }

                untilCB(null, room);
            }).catch(function(e) {
                logger.error("create room error: ", e);
                untilCB(Code.SYSTEM.MySQL_ERROR);
            })
        },

        // end if (test() ==== true)
        function(err, room) {
            callback(err, room.id);
        }
    )
};

proto.destroyRoom = function(roomID) {
    var i;
    var size;

    // 删除用户索引
    var room = this.getRoom(roomID);
    if (room != null) {
        for (i = 0, size = room.members.length; i < size; i++) {
            var userID = room.members[i];
            if (userID && this.users[userID] == roomID) {
                delete this.users[userID];
            }
        }
    }

    // 删除房间频道
    this.app.get('channelService').destroyChannel(roomID);

    // 删除房间索引
    delete this.rooms[roomID];
};

proto.getRoom = function(roomID) {
    return this.rooms[roomID];
};

proto.getHostRoom = function(userID) {
    var keys = Object.keys(this.rooms);
    console.log(this.rooms);
    for (var i = 0, size = keys.length; i < size; i++) {
        var roomID = keys[i];
        var room = this.getRoom(roomID);
        if (room == null) {
            continue;
        }

        if (room.host === userID) {
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
        .broadcast(route, msg, opts, cb);
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

//
// proto.extractID = function() {
//     //没有了就重新整一批
//     if (this.roomIDPool.length <= 0) {
//         this.reloadIDPool();
//     }
//
//     var i = Game.Utils.random_number(this.roomIDPool.length);
//     var result = this.roomIDPool[i];
//     this.roomIDPool.splice(i, 1);
//     return result;
// };
//
// proto.reloadIDPool = function() {
//     while (this.roomIDPool.length < this.MAX_ID_POOL) {
//         var id = Game.Utils.gen_room_id(6);
//         if (this.rooms[id] === undefined && this.roomIDPool.indexOf(id) === -1) {
//             this.roomIDPool.push(id);
//         }
//     }
// };
//
// proto.start = function() {
//     //加载数据库中剩余的room
//     //载入房间ID池
//     this.reloadIDPool();
// };
//
// proto.create = function(opts) {
//     opts = opts || {};
//     opts.id = this.extractID();
//
//     var room = new Room(opts);
//     this.rooms[room.id] = room;
//     this.mapPlayer(room.id, opts.host);
//
//     return room.infoToPlayer(opts.host);
// };
//
// proto.find = function(id) {
//     return this.rooms[id];
// };
//
// proto.destroy = function(id) {
//     var room = this.find(id);
//     if (room) {
//         if (typeof room.destroy === 'function') {
//             room.destroy();
//         }
//         delete this.rooms[id];
//     }
// };
//
// proto.join = function(roomId, playerId) {
//     var room = this.find(roomId);
//
//     if (room == null) {
//         return null;
//     }
//
//     if (room.isPlayerIn(playerId)) {
//         return room.infoToPlayer(playerId);
//     }
//
//     room.playerJoin(playerId);
//     this.mapPlayer(room.id, playerId);
//     return room.infoToPlayer(playerId);
// };
//
// proto.mapPlayer = function(roomId, playerId) {
//     this.playerMap[playerId] = roomId;
// };
//
// proto.disMapPlayer = function (playerId) {
//     delete this.playerMap[playerId];
// };
//
// proto.disMapPlayerFromRoom = function(roomId) {
//     for (var id in this.playerMap) {
//         if (this.playerMap[id] == roomId) {
//             delete this.playerMap[id];
//         }
//     }
// };
//
// proto.search = function(playerId) {
//     var roomId = this.playerMap[playerId];
//
//     if (!roomId) {
//         return null;
//     }
//
//     if (this.rooms[roomId]) {
//         return this.rooms[roomId].infoToPlayer(playerId);
//     }
//
//     this.disMapPlayer(playerId);
//     return null;
// };