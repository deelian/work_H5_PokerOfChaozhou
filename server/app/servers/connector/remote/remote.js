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
var Code = Game.Code;

module.exports = function(app) {
    return new Remote(app);
};

var Remote = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

var proto = Remote.prototype;
//
// //加入频道
// proto.add = function(uid, channelName, cb) {
//     var serverId = this.app.get("serverId");
//     var channel = this.channelService.getChannel(channelName, true);
//     if (channel) {
//         console.log("User:[%s] add channel:[%s] ServerId:[%s]", uid, channelName, serverId);
//         channel.add(uid, serverId);
//     }
//
//     if (typeof cb === "function") {
//         cb();
//     }
// };
//
// //退出频道
// proto.kick = function(uid, channelName, cb) {
//     var serverId = this.app.get("serverId");
//     var channel = this.channelService.getChannel(channelName, false);
//     if (channel) {
//         console.log("User:[%s] leave channel:[%s]", uid, channelName);
//         channel.leave(uid, serverId);
//     }
//
//     if (typeof cb === "function") {
//         cb();
//     }
// };
//
// //广播
// proto.broadcast = function (routeName, channelName, msg, cb) {
//     var channel = this.channelService.getChannel(channelName, false);
//     if (channel) {
//         channel.pushMessage(routeName, msg, null, cb);
//     }
// };
//
// //发送给个人
// proto.sendOne = function (uid, routeName, channelName, msg, cb) {
//     var channel = this.channelService.getChannel(routeName, false);
//     if (!channel) {
//         console.log("Get Channel error---");
//         return;
//     }
//     var memberInfo = channel.getMember(uid);
//     if (!memberInfo) {
//         return;
//     }
//     var sid = memberInfo['sid'];
//     if (!sid) {
//         return;
//     }
//     var list = [{
//         uid: uid,
//         sid: sid
//     }];
//
//     this.channelService.pushMessageByUids(routeName, msg, list, null, cb);
// };
//
// //发送给多个人
// proto.sendMul = function (uids, routeName, channelName, msg, cb) {
//     var channel = this.channelService.getChannel(channelName, false);
//     var list = [];
//
//     for (var i in uids) {
//         var memberInfo = channel.getMember(uids[i]);
//         if (!memberInfo) {
//             continue;
//         }
//         var sid = memberInfo['sid'];
//         if (!sid) {
//             continue;
//         }
//         list.push({uid:uids[i],sid:sid});
//     }
//
//     this.channelService.pushMessageByUids(routeName, msg, list, null, cb);
// };