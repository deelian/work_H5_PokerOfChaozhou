
(function(root){
    var _super = root.Entity;

    var Code = root.Code;
    var ROUTE = root.ROUTE;
    var Game = root.Game;
    var Table = root.Table;

    var Utils = root.Utils;
    
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
        this.cost               = opts.cost || 1;
        this.settings           = {};
        this.state              = opts.state || Room.STATE_READY;

        this.host               = opts.host;                        //房主
        this.members            = opts.members || [];               //玩家 [ userID, userID, ... ]
        this.locked             = opts.locked || false;

        this.banker             = opts.banker || this.host;         //庄家 (0 - 无庄家 userID)

        this.table              = null;                             //桌子

        this.chairs             = opts.chairs || new Array(8);      //椅子 [ userID, userID, ... ]
        this.maxChairs          = opts.maxChairs || 8;

        this.round              = opts.round || 0;                  //局数
        this.maxRound           = opts.maxRound || 10;

        this.roomLog            = opts.roomLog;
        this.forbidden          = opts.forbidden || [];             //禁言列表

        this.dismissStamp       = opts.dismissStamp || 0;           //申请解散的时间戳
        this.dismissNeedConfirm = opts.dismissNeedConfirm || false; //是否可以申请解散
        this.dismissConfirmList = opts.dismissConfirmList || {};    //解散确认列表

        this.firstPay           = opts.firstPay || false;           //是否有过结算 用于判断是否存盘和是否需要支付房卡

        this.init(opts);
    };

    root.inherits(Room, _super);

    Room.STATE_READY       = 0;             //等待准备状态
    Room.STATE_ROB         = 1;             //抢庄
    Room.STATE_START       = 2;             //准备好后发牌和返鬼牌
    Room.STATE_BID         = 3;             //等待下注状态
    Room.STATE_DRAW        = 4;             //下注完闲家要牌
    Room.STATE_BANKER      = 5;             //闲家要完牌庄家处理阶段
    Room.STATE_PAY         = 6;             //结算
    Room.STATE_END         = 7;             //牌局结束 请求下一局
    Room.STATE_CLOSED      = 8;             //所有牌局完成房间解散
    Room.STATE_DISMISS     = 9;             //申请解散房间

    root.extend(Room.prototype, {
        settingInit: function(settings) {
            settings = settings || {};
            this.settings.condition      = settings.condition || Game.BANKER_CONDITION.NORMAL;                //经典模式上庄条件
            this.settings.times          = settings.times || 10;                                              //局数
            this.settings.ghostCount     = settings.ghostCount || 0;                                          //鬼牌数
            this.settings.betType        = settings.betType || Game.BET_TYPE.ARBITRARILY;                     //下注类型
            this.settings.chaosBet       = settings.chaosBet || false;                                        //混战模式是否可以自由下注
            this.settings.universalGhost = settings.universalGhost || false;                                  //true的时候鬼牌万能/false的时候鬼牌成型
            this.settings.fancyGod       = settings.fancyGod || false;                                        //鬼牌成型的时候鬼9鬼8是否为花式天公
            this.settings.isDouble       = settings.isDouble || false;                                        //是否有翻倍牌
            this.settings.beatDBLGhost   = settings.beatDBLGhost || Game.BEAT_DBL_GHOST.ALL_BEAT;             //0点赢双鬼条件
            this.settings.beatThreeGhost = settings.beatThreeGhost || false;                                  //是否赢三鬼
            this.settings.fancyWin       = settings.fancyWin || false;                                        //比牌是否算牌型

            // 牌型倍数
            this.settings.pokerModels    = {};
            var mul;
            var pokerModels = settings.pokerModels || {};
            for (var i in Game.POKER_MODELS) {
                var modelKey = Game.POKER_MODELS[i];
                // 顺子将固定为4倍
                if (i == "STRAIGHT" && this.type != Game.ROOM_TYPE.CUSTOMIZED) {
                    this.settings.pokerModels[modelKey] = 4;
                    continue;
                }
                // 双鬼固定为10倍
                if (i == "DOUBLE_GHOST") {
                    this.settings.pokerModels[modelKey] = 10;
                    continue;
                }
                // 三鬼固定为30倍
                if (i == "THREE_GHOST") {
                    this.settings.pokerModels[modelKey] = 30;
                    continue;
                }

                var multiple = Game.POKER_FORMATION_MULTIPLE[i] || {};
                mul = multiple.min || 1;
                
                this.settings.pokerModels[modelKey] = pokerModels[modelKey] || mul;
            }

            this.settings.pokerPoint = [];
            mul = Game.CUSTOMIZED_SETTINGS.POINT_MULTIPLE.min || 1;

            var pokerPoint = settings.pokerPoint || [];
            this.settings.pokerPoint[0] = 0;
            for (var index = 1; index < 10; index++) {
                this.settings.pokerPoint[index] = pokerPoint[index] || mul;
            }

            this.maxRound = this.settings.times;
        },

        init: function(opts) {
            var self = this;
            var userID;
            var i;

            this.settingInit(opts.settings);

            // init table
            if (opts.table == null) {
                // 确保在这个状态下定制模式没有庄家 需要下一个状态来抢
                if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                    this.banker = 0;
                }

                this.table = new Table({banker: this.banker, settings: Utils.object_clone(this.settings), type: this.type});
            }
            else if (opts.table) {
                this.table = new Table(opts.table);
            }

            if (this.roomLog == null) {
                this.roomLog = {};
                this.roomLog.info = {
                    createTime: Number(root.moment().format('x')),
                    id: this.id,
                    type: this.type
                };

                this.roomLog.users = {};
                this.roomLog.rounds = [];
            }

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

        isGotPos: function() {
            return this.members.length < this.maxChairs;
        },

        getChairs: function() {
            return this.chairs;
        },

        sitDown: function(userID, pos) {
            // 已经点击了准备 就不给换位置
            if (this.table.isClientReady(userID) == true) {
                return -1;
            }

            var nowChairID = this.chairs.indexOf(userID);

            // 已经坐下的要换位
            if (nowChairID != -1) {
                // 坑里有人
                if (this.chairs[pos] != null) {
                    return -1;
                }
                // 庄家不能换
                if (userID == this.banker) {
                    return -1;
                }
                
                this.chairs[nowChairID] = null;
                this.chairs[pos] = userID;
                this.table.changeChair(userID, pos);
                return pos;
            }

            if (pos >= 0 && pos < this.maxChairs) {
                if (this.chairs[pos] != null) {
                    return -1;
                }
                this.chairs[pos] = userID;
                
                if (this.state === Room.STATE_READY) {
                    this.table.enter(userID, pos);
                }
                return pos;
            }

            for (var i = 0, size = this.maxChairs; i < size; i++) {
                if (this.chairs[i] != null) {
                    continue;
                }

                this.chairs[i] = userID;

                if (this.state === Room.STATE_READY) {
                    this.table.enter(userID, i);
                }

                return i;
            }

            return -1;
        },

        standUp: function(userID) {
            //牌局期间不能操作
            if (this.state != Room.STATE_READY) {
                return false;
            }

            // 庄家不能站起
            if (userID == this.banker) {
                return false;
            }

            // 已经点击了准备 就不给换位置
            if (this.table.isClientReady(userID) == true) {
                return false;
            }

            for (var i = 0, size = this.chairs.length; i < size; i++) {
                if (this.chairs[i] === userID) {
                    this.chairs[i] = null;
                    this.table.leave(userID);
                    return true;
                }
            }

            return false;
        },

        letStandUp: function(userID, targetID) {
            //牌局期间不能操作
            if (this.state != Room.STATE_READY) {
                return false;
            }

            if (userID != this.host) {
                return false;
            }
            
            return this.standUp(targetID);
        },

        enter: function(player) {
            var userID = player.id;

            if (this.roomLog.users[userID] == null) {
                this.roomLog.users[userID] = {
                    name: player.name || "游客",
                    avatar: player.avatar,
                    gender: player.gender,
                    total: 0
                };
            }

            if (this.getMember(userID) === false) {
                this.members.push(userID);
            }

            if (this.table.getClient(userID) == null) {
                var pos = this.sitDown(userID);
                this.sendInfoToEveryOne(ROUTE.ROOM.ENTER, {userID: userID, pos: pos});
            }
            else {
                this.table.setAwk(userID, false);
                this.sendInfoToEveryOne(ROUTE.ROOM.AFK, {userID: userID, isAwk: false});
            }
        },

        leave: function(userID, isKick) {
            // 已经锁住房间就不能自由离开
            if (this.locked && !isKick) {
                return;
            }

            if (userID == this.host) {
                return;
            }

            // 发牌之后不能被踢出
            if (this.state >= Room.STATE_START) {
                return;
            }

            this.standUp(userID);

            var index = this.members.indexOf(userID);
            if (index != -1) {
                this.members.splice(index, 1);
            }

            this.sendInfoToEveryOne(ROUTE.ROOM.LEAVE, {userID: userID});
        },

        kick: function(userID, targetID) {
            if (userID != this.host) {
                return false;
            }

            this.leave(targetID, true);
            return true;
        },

        afk: function(userID) {
            this.table.setAwk(userID, true);
            this.sendInfoToEveryOne(ROUTE.ROOM.AFK, {userID: userID, isAwk: true});
        },

        ready: function() {
            var i;
            var size;

            // 这里主要是处理刚坐下的小朋友们
            for (i = 0, size = this.chairs.length; i < size; i++) {
                var userID = this.chairs[i];
                if (userID == null) {
                    continue;
                }

                this.table.enter(userID, i);
            }
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
            this.forbidden = null;
            this.settings = null;
            this.dismissConfirmList = null;
        },

        save: function() {
            this._service && this._service.save(this.id);
        },

        send: function(userID, route, msg, opts, cb) {
            this._service && this._service.send(this.id, userID, route, msg, opts, cb);
        },

        broadcast: function(route, msg, opts, cb) {
            this._service && this._service.broadcast(this.id, route, msg, opts, cb);
        },

        sendEachMsg: function(route, opts) {
            if (!this._service) {
                return;
            }

            //转换状态的时候存盘
            this.save();

            for (var i in this.members) {
                var userID = this.members[i];
                this._service && this._service.send(this.id, userID, route, this.infoToPlayer(userID), opts, null);
            }
        },

        sendInfoToEveryOne: function(route, sendInfo) {
            for (var i in this.members) {
                var userID = this.members[i];
                sendInfo = sendInfo || {};
                // 添加每个人不同的room信息
                sendInfo.room = this.infoToPlayer(userID);
                this._service && this._service.send(this.id, userID, route, sendInfo, null, null);
            }
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
                        result.fn = fn;
                        results.push(result);
                    }
                }
            }

            if (results.length > 0) {
                if (!this._service) {
                    return;
                }

                this.sendInfoToEveryOne(ROUTE.ROOM.COMMAND, {queue: results});
            }
        },

        queueFilter: function(fn) {
            if (fn == null || typeof this.table[fn] != "function") {
                return false;
            }

            if (fn == "rejectBanker") {
                return true;
            }

            switch (this.state) {
                case Room.STATE_READY:
                    if (fn == "ready") {
                        return true;
                    }
                    break;
                case Room.STATE_ROB:
                    if (fn == "rob") {
                        return true;
                    }
                    break;
                case Room.STATE_START:
                    break;
                case Room.STATE_BID:
                    if (fn == "bid") {
                        return true;
                    }
                    break;
                case Room.STATE_DRAW:
                    if (fn == "draw") {
                        if (this.table.whosRubbing == 0) {
                            return true;
                        }
                    }
                    if (fn == "rubDone") {
                        return true;
                    }
                    break;
                case Room.STATE_BANKER:
                    if (fn == "doBankerDraw") {
                        if (this.table.whosRubbing == 0) {
                            return true;
                        }
                    }
                    if (fn == "rubDone") {
                        return true;
                    }
                    break;
                case Room.STATE_PAY:
                    break;
                case Room.STATE_END:
                    break;
                case Room.STATE_CLOSED:
                    break;
            }

            return false;
        },

        queue: function(userID, msg) {
            if (msg == null) {
                return;
            }
            if (this.queueFilter(msg.fn) == false) {
                return;
            }

            this._queue.push({
                id: userID,
                msg: msg
            });
        },

        update: function() {
            var i;

            if (this.dismissStamp > 0) {
                var agreeCnt = 0;
                var notSelect = 0;
                var memberCnt = this.members.length;
                var duration = 2*60;

                var nowTime = Number(root.moment().format('X'));
                for (i = 0; i < memberCnt; i++) {
                    var u = this.members[i];
                    if (this.dismissConfirmList[u] == null) {
                        notSelect++;
                        continue;
                    }
                    if (this.dismissConfirmList[u] == true) {
                        agreeCnt++;
                        continue;
                    }

                    if (this.dismissConfirmList[u] == false) {
                        // 发现有人拒绝就关房失败
                        this.dismissStamp = 0;
                        this.dismissConfirmList = {};
                        this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: false}, null, null);
                        return;
                    }
                }

                // 时间到了
                if (nowTime > this.dismissStamp + duration) {
                    // 所有人要么同意 要么还没选择默认同意
                    if (notSelect + agreeCnt >= memberCnt) {
                        this.dismissStamp = 0;
                        this.state = Room.STATE_CLOSED;
                        this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: true}, null, null);
                        return;
                    }
                    else {
                        this.dismissStamp = 0;
                        this.dismissConfirmList = {};
                        this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: false}, null, null);
                        return;
                    }
                }
                // 时间没到
                else {
                    // 所有人都操作了
                    if (notSelect == 0) {
                        // 所有人都同意
                        if (agreeCnt >= memberCnt) {
                            this.dismissStamp = 0;
                            this.state = Room.STATE_CLOSED;
                            this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: true}, null, null);
                            return;
                        }
                        // 如果不是就取消
                        else {
                            this.dismissStamp = 0;
                            this.dismissConfirmList = {};
                            this.broadcast(ROUTE.ROOM.DISMISS_RESULT, {result: false}, null, null);
                            return;
                        }
                    }
                }

                return;
            }
            //更新前完成积压的所有工作
            this.process();

            switch (this.state) {
                case Room.STATE_READY:
                    if (this.table.getClientReady()) {
                        this.state++;
                        this.locked = true;

                        // 开始了就不是说解散就解散了
                        if (this.dismissNeedConfirm == false) {
                            this.dismissNeedConfirm = true;
                        }

                        this.sendEachMsg(ROUTE.ROOM.READY, null);
                    }
                    break;
                case Room.STATE_ROB:
                    // 只有定制模式需要抢庄
                    if (this.type != Game.ROOM_TYPE.CUSTOMIZED) {
                        this.state++;
                    }
                    else {
                        // 抢庄成功
                        if (this.table.banker != 0) {
                            this.banker = this.table.banker;
                            this.state++;
                            this.sendEachMsg(ROUTE.ROOM.ROB, null);
                        }
                    }
                    break;
                case Room.STATE_START:
                    // 开始-洗牌-发牌
                    this.table.start(this.type);
                    this.table.shuffle();
                    // 暂时按座位顺序发牌 这里要做个规则传入发牌顺序的userID数组
                    this.table.clearDraw();
                    this.table.genDealSequence();
                    for (i = 0; i < this.table.dealSequence.length; i++) {
                        var userID = this.table.dealSequence[i];
                        if (userID && this.table.getClient(userID)) {
                            //要牌行列
                            // 长庄模式 经典模式 庄家不进入行列
                            if (userID == this.banker) {
                                if (this.type == Game.ROOM_TYPE.STATIC || this.type == Game.ROOM_TYPE.CLASSICAL) {
                                    continue;
                                }
                            }

                            this.table.insertDraw(userID);
                        }
                    }
                    this.table.deal();
                    // 翻鬼牌
                    // 非定制模式才需要翻鬼牌
                    if (this.type != Game.ROOM_TYPE.CUSTOMIZED) {
                        this.table.ghost();
                    }

                    this.state++;

                    this.sendEachMsg(ROUTE.ROOM.DEAL, null);
                    break;
                case Room.STATE_BID:
                    if (this.table.getClientBid()) {
                        this.state++;
                        this.sendEachMsg(ROUTE.ROOM.BID, null);
                    }
                    break;
                case Room.STATE_DRAW:
                    if (this.table.getClientDraw()) {
                        this.state++;
                        this.sendEachMsg(ROUTE.ROOM.DRAW, null);
                    }
                    break;
                case Room.STATE_BANKER:
                    // 混战模式 定制模式 直接跳过
                    if (this.type == Game.ROOM_TYPE.CHAOS || this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                        if (this.table.whosRubbing == 0) {
                            this.state++;
                            this.sendEachMsg(ROUTE.ROOM.BANKER_DRAW, null);
                        }
                    }
                    // 非混战模式 需要庄家操作
                    else {
                        if (this.table.bankerDraw == 2 && this.table.whosRubbing == 0) {
                            this.state++;
                            this.sendEachMsg(ROUTE.ROOM.BANKER_DRAW, null);
                        }
                    }
                    break;
                case Room.STATE_PAY:
                    if (this.table.getClientFight()) {
                        var roundLog = this.table.roundLog || {};
                        var userLog = roundLog.clients || {};

                        this.roomLog.rounds.push(roundLog);
                        for (var uid in userLog) {
                            var log = userLog[uid];
                            var user = this.roomLog.users[uid] = this.roomLog.users[uid] || {};

                            user.fightTimes  = user.fightTimes || 0;
                            user.winTimes    = user.winTimes || 0;
                            user.playTimes   = user.playTimes || 0;
                            user.total       = user.total || 0;
                            user.ghostTimes  = user.ghostTimes || 0;
                            user.godTimes    = user.godTimes || 0;

                            user.fightTimes += log.fightTimes;
                            user.winTimes   += log.winTimes;
                            user.playTimes  += 1;
                            user.total      += log.gold;
                            if (log.type == Game.POKER_MODELS.GOD_NINE
                            ||  log.type == Game.POKER_MODELS.GOD_EIGHT) {
                                user.godTimes++;
                            }

                            if (log.type == Game.POKER_MODELS.DOUBLE_GHOST) {
                                user.ghostTimes++;
                            }
                        }

                        //记录是否有进行过第一次结算
                        if (this.firstPay == false) {
                            this.firstPay = true;
                        }
                        this.round++;

                        //重整牌局 更换庄家等
                        this.table.reset();
                        this.banker = this.table.banker;

                        if (this.round >= this.settings.times) {
                            this.state = Room.STATE_CLOSED;
                        } else {
                            this.state = Room.STATE_READY;
                            // 房间自身的准备工作
                            this.ready();
                        }
                        
                        this.sendEachMsg(ROUTE.ROOM.PAY, null);
                    }
                    break;
                case Room.STATE_END:
                    if (this.table.getClientEnd()) {
                        this.round++;

                        //重整牌局 更换庄家等
                        this.table.reset();
                        this.banker = this.table.banker;
                        
                        if (this.round >= this.settings.times) {
                            this.state = Room.STATE_CLOSED;
                        } else {
                            this.state = Room.STATE_READY;
                            // 房间自身的准备工作
                            this.ready();
                        }
                        this.sendEachMsg(ROUTE.ROOM.END, null);
                    }
                    break;
                case Room.STATE_CLOSED:
                    this.sendEachMsg(ROUTE.ROOM.CLOSE, null);
                    this.destroy();
                    break;
                case Room.STATE_DISMISS:
                    break;
            }
        },
        
        makeDestroy: function(userID) {
            if (this.members.indexOf(userID) == -1) {
                return null;
            }

            if (this.dismissNeedConfirm) {
                if (this.dismissStamp > 0) {
                    return null;
                }

                this.dismissStamp = Number(root.moment().format('X'));
                this.dismissConfirmList[userID] = true;
                var name = this.roomLog[userID] == null ? "游客" : this.roomLog[userID].name;
                this.broadcast(ROUTE.ROOM.DISMISS_APPLY, {userID: userID, name: name}, null, null);
            }
            else {
                if (userID != this.host) {
                    return null;
                }

                this.state = Room.STATE_CLOSED;
            }
        },

        dismissConfirm: function(userID, confirm) {
            if (this.members.indexOf(userID) == -1) {
                return null;
            }

            confirm = confirm || false;
            this.dismissConfirmList[userID] = confirm;
            this.sendEachMsg(ROUTE.ROOM.DISMISS_CONFIRM, null);
            this.broadcast(ROUTE.ROOM.DISMISS_CONFIRM, {userID: userID, confirm: confirm}, null, null);
        },

        getForbidden: function() {
            return this.forbidden;
        },

        //如果在禁言列表中 则返回true
        isForbidden: function(userID) {
            if (this.forbidden == null) {
                this.forbidden = [];
            }

            return this.forbidden.indexOf(userID) != -1;
        },

        addForbidden: function(userID, targetID) {
            if (this.forbidden == null) {
                this.forbidden = [];
            }

            if (userID != this.host) {
                return null;
            }
            
            if (this.forbidden.indexOf(targetID) != -1) {
                return null;
            }

            this.forbidden.push(targetID);

            return this.forbidden;
        },

        delForbidden: function(userID, targetID) {
            if (this.forbidden == null) {
                this.forbidden = [];
            }

            if (userID != this.host) {
                return;
            }

            var index = this.forbidden.indexOf(targetID);
            if (index == -1) {
                return null;
            }

            this.forbidden.splice(index, 1);
            return this.forbidden;
        },

        //拷贝一份房间信息给玩家 针对这个玩家能看到的部分
        infoToPlayer: function(userID) {
            var info = {};
            info.id                     = this.id;
            info.type                   = this.type;
            info.state                  = this.state;
            info.host                   = this.host;
            info.banker                 = this.banker;
            info.locked                 = this.locked;
            info.firstPay               = this.firstPay;
            info.dismissStamp           = this.dismissStamp || 0;
            info.dismissNeedConfirm     = this.dismissNeedConfirm || false;
            info.maxChairs              = this.maxChairs;
            info.round                  = this.round;
            info.maxRound               = this.maxRound;

            info.dismissConfirmList     = Utils.object_clone(this.dismissConfirmList);
            info.settings               = Utils.object_clone(this.settings);
            info.members                = Utils.object_clone(this.members);
            info.chairs                 = Utils.object_clone(this.chairs);
            info.roomLog                = Utils.object_clone(this.roomLog);

            info.table = this.table.infoToPlayer(userID);

            return info;
        }
    });
}(DejuPoker));
