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

module.exports = function(app) {
    return new Remote(app);
};

var Remote = function(app) {
    this.app = app;
};

var proto = Remote.prototype;

proto.getHostRoom = function(uid, callback) {
    var service = this.app.get('roomService');
    var roomID = service.getHostRoom(uid);

    callback && callback(null, roomID);
};

proto.userLeave = function(uid, callback) {
    var userID = uid;
    var service = this.app.get('roomService');

    logger.info("room-user-leave", uid);
    service.leaveRoom(userID, function(err, roomID) {
        callback && callback(err, roomID);
    });
};

proto.userAfk = function(uid, callback) {
    var userID = uid;
    var service = this.app.get('roomService');

    logger.info("room-user-leave", uid);
    service.afk(userID, function(err, roomID) {
        callback && callback(err, roomID);
    });
};
