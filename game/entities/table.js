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
            return {userID: userID, bid: true, bidRate: rate};
        },

        show: function() {

        },

        draw: function() {

        },

        end: function() {

        }
    });
}(DejuPoker));