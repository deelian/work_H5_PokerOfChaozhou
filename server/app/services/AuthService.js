/*
 * Base Dependencies
 */

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
var Player = Game.Player;


var AuthService = function(app) {
    this.app = app;
};

module.exports = AuthService;

AuthService.prototype.verifyUser = function(msg, callback) {
    var udid = msg.udid;
    var User = GameDB.models.user;

    User.find({
        where: { udid: udid }
    }).then(function(record) {
        if (record == null) {
            if (record == null) {
                var player = new Player();

                return User.create({
                    udid: udid,
                    data: player.toString()
                });
            }
        }

        return record;
    }).then(function(record) {
        var player = new Player(JSON.parse(record.data));
        if (!player.id) {
            player.setId(record.id);
            record.data = player.toString();
            record.save();
        }

        callback(null, player.clone());
    }).catch(function(e) {
        logger(e);
        callback(Code.SYSTEM.MySQL_ERROR, null);
    });
};