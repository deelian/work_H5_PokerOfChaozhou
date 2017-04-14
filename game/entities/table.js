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
    var Deck  = root.Deck;

    var Client = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.userID        = opts.userID || 0;          // id
        this.ready         = opts.ready || false;       // 是否准备好
        this.started       = opts.started || false;     // 是否开始过游戏
        this.bid           = opts.bid || false;         // 是否下注
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

            this.deck = opts.deck && [] || new Deck();
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

        //
        start: function() {
        },

        shuffle: function() {

        },

        deal: function() {

        },

        bid: function() {

        },

        show: function() {

        },

        draw: function() {

        },

        end: function() {

        }
    });
}(DejuPoker));