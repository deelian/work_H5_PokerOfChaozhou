
(function(root){
    var _super = root.Entity;

    var Code = root.Code;
    var ROUTE = root.ROUTE;
    var Game = root.Game;
    var Table = root.Table;
    var Room = root.Room = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        // private members
        this._service           = opts.service;                      //房间服务
        this._queue             = [];                                //消息队列
        this._timerID           = null;                              //定时器

        // public members
        this.id                 = opts.id;
        this.type               = opts.type;
        this.settings           = {};
        this.state              = opts.state || Room.STATE_READY;

        this.host               = opts.host;                        //房主
        this.members            = [];                               //玩家 [ userID, userID, ... ]
        this.bids               = opts.bids || {};                  //下注倍数 { userID: bid, ... }

        this.banker             = opts.banker || 0;                 //庄家 (0 - 无庄家 userID)

        this.table              = null;                             //桌子

        this.chairs             = opts.chairs || new Array(10);     //椅子 [ userID, userID, ... ]
        this.maxChairs          = opts.maxChairs || 10;

        this.round              = opts.round || 0;                  //局数
        this.maxRound           = opts.maxRound || 10;

        this.init(opts);
    };

    root.inherits(Room, _super);

    Room.STATE_READY       = 0;             //等待准备状态
    Room.STATE_START       = 1;             //准备好后发牌和返鬼牌
    Room.STATE_BID         = 2;             //等待下注状态
    Room.STATE_DRAW        = 3;             //下注完闲家要牌
    Room.STATE_BANKER      = 4;             //闲家要完牌庄家处理阶段 这里包括了结算
    Room.STATE_END         = 5;             //牌局结束 请求下一局
    Room.STATE_CLOSED      = 6;             //所有牌局完成房间解散
    Room.STATE_DISMISS     = 7;             //

    root.extend(Room.prototype, {
        settingInit: function(settings) {
            settings = settings || {};
            this.settings.condition      = settings.condition || 0;                                           //经典模式上庄条件
            this.settings.times          = settings.times || 10;                                              //局数
            this.settings.ghostCount     = settings.ghostCount || 0;                                          //鬼牌数
            this.settings.betType        = settings.betType || Game.BET_TYPE.ARBITRARILY;                     //下注类型
            this.settings.universalGhost = settings.universalGhost || true;                                   //鬼牌万能
            this.settings.formationGhost = settings.formationGhost || {"god_nine":true, "god_eight":true};    //鬼牌成型
            this.settings.isDouble       = settings.isDouble || false;                                        //翻倍
            this.settings.zeroPoint      = settings.zeroPoint || {"three_zero":false, "two_zero":false};      //0点赢鬼牌

            this.settings.pokerModels    = {};
            var pokerModels = settings.pokerModels || {};
            for (var i in Game.POKER_MODELS.POKER_MODELS) {
                var modelKey = Game.POKER_MODELS.POKER_MODELS[i];
                this.settings.pokerModels[modelKey] = pokerModels[modelKey] || 4;
            }

            this.settings.pokerPoint     = [];
            var pokerPoint = settings.pokerPoint || [];
            for (var index = 0; index < pokerPoint.length; index++) {
                this.settings.pokerPoint[index] = pokerPoint[index] || 1;
            }
        },

        init: function(opts) {
            var self = this;

            // init table
            if (this.state === Room.STATE_READY) {
                this.ready();
            }
            else if (opts.table) {
                this.table = new Table(opts.table);
            }

            this.settingInit(opts.settings);

            // start timer 一段时间检查一下房间游戏进程
            this._timerID = setInterval(function() {
                self.update();
            }, 100);
        },

        getMember: function(userID) {
            return (this.members.indexOf(userID) != -1);
        },

        getMembers: function() {
            return this.members;
        },

        sitDown: function(userID, pos) {
            if (this.chairs.indexOf(userID) != -1) {
                return -1;
            }

            if (pos != null && pos >= 0 && pos < this.maxChairs) {
                this.chairs[pos] = userID;
                return pos;
            }

            for (var i = 0, size = this.maxChairs; i < size; i++) {
                if (this.chairs[i] != null) {
                    continue;
                }

                this.chairs[i] = userID;

                if (this.state === Room.STATE_READY) {
                    this.table.enter(userID);
                }

                return i;
            }

            return -1;
        },

        standUp: function(userID) {
            for (var i = 0, size = this.chairs.length; i < size; i++) {
                if (this.chairs[i] === userID) {
                    this.chairs[i] = null;
                    this.table.leave(userID);
                    return true;
                }
            }

            return false;
        },

        enter: function(userID) {
            if (this.getMember(userID) === true) {
                return false;
            }

            this.members.push(userID);
            var pos = this.sitDown(userID);
            this.broadcast(ROUTE.ROOM.ENTER, {userID: userID, pos: pos});
        },

        leave: function(userID) {
            this.standUp(userID);

            var index = this.members.indexOf(userID);
            if (index != -1) {
                this.members.splice(index, 1);
            }
        },

        dismiss: function() {

        },

        ready: function() {
            var i;
            var size;

            var table = new Table();

            for (i = 0, size = this.chairs.length; i < size; i++) {
                var userID = this.chairs[i];
                if (userID == null) {
                    continue;
                }

                table.enter(userID);
            }

            this.table = table;
        },

        destroy: function() {
            if (this._timerID) {
                clearInterval(this._timerID);
                this._timerID = null;
            }

            this._service.destroyRoom(this.id);
            this.table = null;
            this.members = null;
            this.chairs = null;
            this.bids = null;
        },

        send: function(userID, route, msg, opts, cb) {
            this._service && this._service.send(this.id, userID, route, msg, opts, cb);
        },

        broadcast: function(route, msg, opts, cb) {
            this._service && this._service.broadcast(this.id, route, msg, opts, cb);
        },

        process: function() {
            var results = [];

            while (this._queue.length) {
                // 从操作队列中获取第一个操作
                var command = this._queue.shift();
                var userID = command.id;
                if (userID == null) {
                    continue;
                }

                command.msg = command.msg || {};
                var fn = command.msg.fn;
                if (fn && typeof this.table[fn] === "function") {
                    var result = this.table[fn](userID, command.msg.data);
                    if (result != null) {
                        results.push(result);
                    }
                }
            }

            if (results.length > 0) {
                this.broadcast(ROUTE.ROOM.COMMAND, results);
            }
        },

        queue: function(userID, msg) {
            this._queue.push({
                id: userID,
                msg: msg
            });
        },

        update: function() {
            //更新前完成积压的所有工作
            this.process();

            var i;

            switch (this.state) {
                case Room.STATE_READY:
                    if (this.table.getClientReady()) {
                        this.state++;
                    }
                    break;
                case Room.STATE_START:
                    var msg = {};

                    // 开始-洗牌-发牌
                    this.table.start(this.type);
                    this.table.shuffle();
                    // 暂时按座位顺序发牌 这里要做个规则传入发牌顺序的userID数组
                    var sitUsers = [];
                    for (i = 0; i < this.maxChairs; i++) {
                        if (this.chairs[i]) {
                            sitUsers.push(this.chairs[i]);
                        }
                    }
                    this.table.deal(sitUsers);
                    // 翻鬼牌 暂时直接2张
                    this.table.ghost(2);

                    this.state++;
                    
                    this.broadcast(ROUTE.ROOM.DEAL, this.clone());
                    break;
                case Room.STATE_BID:
                    if (this.table.getClientBid()) {
                        this.state++;
                    }
                    break;
                case Room.STATE_DRAW:
                    break;
                case Room.STATE_BANKER:
                    if (this.table.getClientStarted()) {
                        this.state++;
                    }
                    break;
                case Room.STATE_END:
                    if (this.table.getClientEnd()) {
                        this.round++;

                        if (this.round >= this.maxRound) {
                            this.state = Room.STATE_CLOSED;
                        } else {
                            this.state = Room.STATE_READY;
                        }
                    }
                    break;
                case Room.STATE_CLOSED:
                    this.destroy();
                    break;
                case Room.STATE_DISMISS:
                    break;
            }
        }
    });
}(DejuPoker));

//
// (function(root){
//     var _super = root.Entity;
//
//     var Game= root.Game;
//     var PokerSet = root.PokerSet;
//     var Utils = root.Utils;
//
//     var Room = root.Room = function(opts) {
//         opts = opts || {};
//
//         _super.call(this, opts);
//
//         this.id                 = opts.id || 0;
//         this.type               = opts.type || Game.ROOM_TYPE.STATIC;
//         this.host               = opts.host;                        //房主
//         this.players            = opts.players || [];
//         this.banker             = opts.banker || 0;                 //庄家 默认是房主 -1为没有庄家
//         this.pokerSet           = new PokerSet(opts.pokerSet);
//         this.handPokers         = opts.handPokers || [];            //所有人的手牌
//         this.ghostPokers        = opts.ghostPokers || [];           //翻出的鬼牌
//         this.showOnPokers       = opts.showOnPokers || [];          //翻鬼牌时候翻出的牌 由于翻到joker需要重新翻 所以这里跟鬼牌可能会有区别
//         this.setting            = {};
//
//         this.init(opts);
//     };
//
//     root.inherits(Room, _super);
//
//     root.extend(Room.prototype, {
//         init: function(opts) {
//             var setting = opts.setting || {};
//             this.setting.condition      = setting.condition || 0;                                           //经典模式上庄条件
//             this.setting.times          = setting.times || 10;                                              //局数
//             this.setting.ghostCount     = setting.ghostCount || 0;                                          //鬼牌数
//             this.setting.betType        = setting.betType || Game.BET_TYPE.ARBITRARILY;                     //下注类型
//             this.setting.universalGhost = setting.universalGhost || true;                                   //鬼牌万能
//             this.setting.formationGhost = setting.formationGhost || {"god_nine":true, "god_eight":true};    //鬼牌成型
//             this.setting.isDouble       = setting.isDouble || false;                                        //翻倍
//             this.setting.zeroPoint      = setting.zeroPoint || {"three_zero":false, "two_zero":false};      //0点赢鬼牌
//
//             this.setting.pokerModels    = {};
//             var pokerModels = opts.pokerModels || {};
//             for (var i in Game.POKER_MODELS.POKER_MODELS) {
//                 var modelKey = Game.POKER_MODELS.POKER_MODELS[i];
//                 this.setting.pokerModels[modelKey] = pokerModels[modelKey] || 4;
//             }
//
//             this.setting.pokerPoint     = [];
//             var pokerPoint = opts.pokerPoint || [];
//             for (var index = 0; index < pokerPoint.length; index++) {
//                 this.setting.pokerPoint[index] = pokerPoint[index] || 1;
//             }
//         },
//
//         //给每一位坐下的玩家发一张牌
//         deal: function() {
//             var banker = this.banker || 0;
//
//             for (var i = 0; i < this.players.length; i++) {
//                 //从庄家的下一位玩家开始发牌
//                 var sitID = i + banker + 1;
//                 if (sitID >= this.players.length) {
//                     sitID = sitID - this.players.length;
//                 }
//
//                 //暂时不判断是否站起
//                 if (this.players[sitID]) {
//                     if (this.handPokers[sitID] == null) {
//                         this.handPokers[sitID] = [];
//                     }
//                     this.handPokers[sitID].push(this.pokerSet.extract());
//                 }
//             }
//         },
//
//         //翻鬼牌 一直翻到有两张非joker的牌为止
//         extractGhost: function() {
//             this.ghostPokers = [];
//             this.showOnPokers = [];
//
//             var ghostCount = 0;
//             while (ghostCount < 2) {
//                 var poker = this.pokerSet.extract();
//                 if (poker.number != 0) {
//                     this.ghostPokers.push(poker);
//                     ghostCount++;
//                 }
//
//                 this.showOnPokers.push(poker);
//             }
//         },
//
//         //已经在房间里就返回true
//         isPlayerIn: function(playerId) {
//             return this.players.indexOf(playerId) != -1;
//         },
//
//         playerJoin: function(playerId) {
//             var arrId = 0;
//             while (true) {
//                 if (this.players[arrId] == null) {
//                     this.players[arrId] = playerId;
//                     return;
//                 }
//                 arrId++;
//             }
//         },
//
//         //拷贝一份房间信息给玩家 针对这个玩家能看到的部分
//         infoToPlayer: function(playerId) {
//             var info = {};
//             info.id = this.id;
//             info.type = this.type;
//             info.host = this.host;
//             info.banker = this.banker;
//             info.players = Utils.object_clone(this.players);
//             info.ghostPokers = Utils.object_clone(this.ghostPokers);
//             info.showOnPokers = Utils.object_clone(this.showOnPokers);
//             info.setting = Utils.object_clone(this.setting);
//
//             info.handPokers = [];
//             for (var sitID = 0; sitID < this.players.length; sitID++) {
//                 var sitPlayer = this.players[sitID];
//                 var handPoker = this.handPokers[sitID];
//                 if (sitPlayer && handPoker) {
//                     var showRight = PokerSet.SHOW_TARGET.ALL;
//                     if (sitPlayer == playerId) {
//                         showRight = PokerSet.SHOW_TARGET.ME;
//                     }
//                     info.handPokers[sitID] = [];
//                     for (var pokerId = 0; pokerId < handPoker.length; pokerId++) {
//                         var poker = handPoker[pokerId];
//                         if (poker == null) {
//                             info.handPokers[sitID][pokerId] = null;
//                             continue;
//                         }
//                         if (showRight < poker.showTarget) {
//                             info.handPokers[sitID][pokerId] = {showTarget: poker.showTarget};
//                             continue;
//                         }
//                         info.handPokers[sitID][pokerId] = Utils.object_clone(poker);
//                     }
//                 }
//             }
//
//             return info;
//         }
//     });
// }(DejuPoker));