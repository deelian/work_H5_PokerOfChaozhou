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
