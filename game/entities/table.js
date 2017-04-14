/**
 * Created by monkey on 2017/3/25.
 * room
 * ..players []
 * ..pokerSet Object
 * ..handPokers []
 * ..ghostPokers []
 * ..showOnPokers []
 * ..setting {}
 */

(function(root){
    var _super = root.Entity;

    var Poker = root.Poker;
    var Game = root.Game;

    var Utils = root.Utils;

    var Client = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.userID        = opts.userID || 0;          // id
        this.ready         = opts.ready || false;       // 是否准备好
        this.started       = opts.started || false;     // 是否开始过游戏
        this.bid           = opts.bid || false;         // 是否下注
        this.bidRate       = opts.bidRate || 0;         // 下注倍数
        this.action        = opts.action || false;      // 是否操作过
        this.end           = opts.end || false;         // 是否结束

        this.handPokers    = [];                        // 手牌
        if (opts.handPokers) {
            for (var i = 0, size = opts.handPokers.length; i < size; i++) {
                this.handPokers.push(
                    new Poker(opts.handPokers[i])
                );
            }
        }
    };

    var Table = root.Table = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.deck           = null;                 // 整副牌
        this.ghostPokers    = null;                 // 桌面鬼牌
        this.drawList       = opts.drawList || [];  // 要牌列表

        this.indicator      = opts.indicator || 0;  // 指示器
        this.clients        = {};                   // 客人列表

        this.init(opts);
    };

    root.inherits(Table, _super);

    root.extend(Table.prototype, {
        init: function(opts) {
            var i;
            var size;

            this.deck = [];
            //如果新桌子 就等start的时候才拿牌出来
            //旧桌子 有牌就把牌拿出来
            if (opts.deck) {
                for (i = 0, size = opts.deck.length; i < size; i++) {
                    this.deck.push(
                        new Poker(opts.deck[i])
                    );
                }
            }

            this.ghostPokers = [];
            if (opts.ghostPokers) {
                for (i = 0, size = opts.ghostPokers.length; i < size; i++) {
                    this.ghostPokers.push(
                        new Poker(opts.ghostPokers[i])
                    );
                }
            }

            if (opts.clients) {
                var keys = Object.keys(opts.clients);
                for (i = 0, size = keys.length; i < size; i++) {
                    var userID = keys[i];
                    this.clients[userID] = new Client(opts.clients[i]);
                }
            }
        },

        enter: function(userID) {
            var client = this.clients[userID];
            if (client != null) {
                return;
            }

            this.clients[userID] = new Client(userID);
        },

        leave: function(userID) {
            delete this.clients[userID];
        },

        ready: function(userID, data) {
            var client = this.clients[userID];
            if (client == null) {
                return null;
            }

            this.clients[userID].ready = data ? true : false;
            return {userID: userID, ready: this.clients[userID].ready};
        },

        //是否全部客人都做了某操作
        getClientState: function(state) {
            var i;
            var size;
            var keys;

            keys = Object.keys(this.clients);
            size = keys.length;
            // 一个人就不能成型
            if (size <= 1) {
                return false;
            }

            for (i = 0; i < size; i++) {
                var userID = keys[i];
                var client = this.clients[userID];

                if (client[state] != true) {
                    return false;
                }
            }

            return true;
        },

        getClientReady: function() {
            return this.getClientState("ready");
        },

        getClientStarted: function() {
            return this.getClientState("started");
        },

        getClientBid: function() {
            return this.getClientState("bid");
        },

        getClientEnd: function() {
            return this.getClientState("end");
        },

        getClientDraw: function() {
            return this.drawList.length <= 0;
        },

        //开局
        start: function(roomType) {
            //先拿出一副新牌
            this.deck = [];
            for (var typeKey in Poker.TYPE) {
                var type = Poker.TYPE[typeKey];

                //定制模式没有王牌
                if (roomType === Game.ROOM_TYPE.CUSTOMIZED && type === Poker.TYPE.JOKER) {
                    continue;
                }

                for (var valId = 0; valId < Poker.VALUES[type].length; valId++) {
                    var value = Poker.VALUES[type][valId];

                    this.deck.push(new Poker({value: value, type: type}));
                }
            }
        },

        //洗牌
        shuffle: function() {
            var newDeck = [];

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length - 1;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
        },

        //根据规则发牌
        deal: function(sitUsers) {
            var i;
            var j;
            
            // 清理手牌
            for (i in this.clients) {
                this.clients[i].handPokers = [];
            }
            
            // 发两张牌
            for (i = 0; i < 2; i++) {
                //按顺序发牌
                for (j = 0; j < sitUsers.length; j++) {
                    var userID = sitUsers[j];
                    var client = this.clients[userID];
                    if (client && this.deck.length > 0) {
                        client.handPokers.push(this.deck.shift());
                    }
                }
            }
        },

        // 翻鬼牌 参数是要翻多少张
        ghost: function(amount) {
            this.ghostPokers = [];

            var i = 0;
            while (i < amount) {
                var poker = this.deck.shift();
                this.ghostPokers.push(poker);
                if (poker.type != Poker.TYPE.JOKER) {
                    i++;
                }
            }
        },

        bid: function(userID, rate) {
            var client = this.clients[userID];
            if (client == null) {
                return null;
            }

            if (typeof rate != "number") {
                rate = 1;
            }

            this.clients[userID].bid = true;
            this.clients[userID].bidRate = rate;
            for (var i in this.clients[userID].handPokers) {
                this.clients[userID].handPokers[i].setShow(Poker.SHOW_TARGET.ME);
            }
            return {userID: userID, bidRate: rate};
        },

        clearDraw: function() {
            this.drawList = [];
        },

        insertDraw: function(userID) {
            if (!(this.drawList instanceof Array)) {
                this.drawList = [];
            }

            this.drawList.push(userID);
        },

        show: function() {

        },

        draw: function(userID, type) {
            //排队来
            if (userID != this.drawList[0]) {
                return null;
            }

            var client = this.clients[userID];
            if (client == null) {
                return null;
            }

            var i;
            var results = {
                userID: userID
            };

            switch (type) {
                // 明牌 不补牌 直接将牌面公开
                case Game.DRAW_COMMAND.OPEN: {
                    for (i in client.handPokers) {
                        client.handPokers.setShow(Poker.SHOW_TARGET.ALL);
                    }
                    break;
                }
                // 要一张牌
                case Game.DRAW_COMMAND.DRAW: {
                    var poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    client.handPokers.push(poker);
                    break;
                }
                // 搓牌 要扣东西的
                case Game.DRAW_COMMAND.RUBBED: {
                    var poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    client.handPokers.push(poker);
                    break;
                }
                // 过牌
                default: {
                    type = Game.DRAW_COMMAND.PASS;
                    break;
                }
            }

            this.drawList.shift();
            results.type = type;

            return results;
        },

        end: function() {

        },

        infoToPlayer: function(userID) {
            var info = {};
            info.ghostPokers = Utils.object_clone(this.ghostPokers);
            info.drawList = Utils.object_clone(this.drawList);
            info.indicator = this.indicator;
            info.clients = {};
            for (var uid in this.clients) {
                info.clients[uid] = {};
                var client = info.clients[uid];
                client.userID   = this.clients[uid].userID;
                client.ready    = this.clients[uid].ready;
                client.started  = this.clients[uid].started;
                client.bid      = this.clients[uid].bid;
                client.bidRate  = this.clients[uid].bidRate;
                client.end      = this.clients[uid].end;

                client.handPokers = [];                        // 手牌
                var showRight = Poker.SHOW_TARGET.ALL;
                if (client.userID == userID) {
                    showRight = Poker.SHOW_TARGET.ME;
                }
                if (this.clients[uid].handPokers) {
                    for (var i = 0, size = this.clients[uid].handPokers.length; i < size; i++) {
                        if (showRight > this.clients[uid].handPokers[i].showTarget) {
                            client.handPokers.push({showTarget: this.clients[uid].handPokers[i].showTarget});
                            continue;
                        }
                        client.handPokers.push(
                            {
                                type: this.clients[uid].handPokers[i].type,
                                value: this.clients[uid].handPokers[i].value,
                                showTarget: this.clients[uid].handPokers[i].showTarget
                            }
                        );
                    }
                }
            }
            
            return info;
        }
    });
}(DejuPoker));