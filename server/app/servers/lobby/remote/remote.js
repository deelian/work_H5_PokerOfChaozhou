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
    this.service = app.get('lobbyService');
};

var proto = Remote.prototype;

proto.getUser = function(args, callback) {
    var uid = args.uid;

    this.service.getUser(uid, function(err, user) {
        callback && callback(err, user);
    });
};

proto.userLeave = function(uid, callback) {
    logger.info("lobby-user-leave", uid);

    this.app.get('channelService')
        .getChannel('lobby', true)
        .leave(uid);

    callback && callback(null);
};
