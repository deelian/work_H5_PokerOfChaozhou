/**
 * Created by monkey on 2017/3/25.
 */

(function(root){
    var _super = root.Entity;

    var Poker = root.Poker;
    var Game = root.Game;
    var StaticGamble = root.StaticGamble;
    var CustomizedGamble = root.CustomizedGamble;
    var FancyPayTypes = [Game.POKER_MODELS.GOD_NINE, Game.POKER_MODELS.GOD_EIGHT, Game.POKER_MODELS.POINT];

    var Utils = root.Utils;

    var Client = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.userID        = opts.userID || 0;          // id
        this.chairID       = opts.chairID || 0;         // 座位ID
        this.name          = opts.name || "";           // 玩家名字
        this.avatar        = opts.avatar || 0;          // 玩家头像
        this.ready         = opts.ready || false;       // 是否准备好
        this.started       = opts.started || false;     // 是否开始过游戏
        this.bid           = opts.bid || false;         // 是否下注
        this.bidRate       = opts.bidRate || 0;         // 下注倍数
        this.end           = opts.end || false;         // 是否结束
        this.compared      = opts.compared || false;    // 是否比过牌
        this.notBank       = opts.notBank || false;     // 不坐庄 true就不做
        this.isRubbing     = opts.isRubbing || false;   // 是否在搓牌
        this.showResult    = opts.showResult || false;  // 是否需要展示牌局结果 这个在reset的时候不能重置
        this.isAfk         = opts.isAfk || false;       // 是否离线

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

        this.deck           = null;                     // 整副牌
        this.ghostPokers    = null;                     // 桌面鬼牌
        this.dealSequence   = opts.dealSequence || [];  // 发牌列表
        this.drawList       = opts.drawList || [];      // 要牌列表
        this.banker         = opts.banker || 0;         // 庄家
        this.scoreBak       = opts.scoreBak || 0;       // 用于暂存下个庄家的分数以便分辨大小
        this.typeBak        = opts.typeBak || null;     // 用于暂存下个庄家的牌型评分
        this.bankerBak      = opts.bankerBak || this.banker;    // 经典模式下个庄家
        this.bankerDraw     = opts.bankerDraw || 0;     // 庄家操作情况
        this.settings       = opts.settings || {};
        this.type           = opts.type;                // 牌局类型

        this.indicator      = opts.indicator || 0;      // 指示器
        this.clients        = {};                       // 客人列表
        this.golds          = opts.golds || {};         // 参与过的用户在房间中的金币情况
        this.lastBidRates   = opts.lastBidRates || {};  // 参与过的用户 上次投注倍数的列表
        this.whosRubbing    = opts.whosRubbing || 0;

        this.roundLog       = opts.roundLog || {clients: {}};

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
                    this.clients[userID] = new Client(opts.clients[userID]);
                }
            }
        },

        enter: function(userID, chairID) {
            var client = this.clients[userID];
            if (client != null) {
                return;
            }

            this.clients[userID] = new Client({userID: userID, chairID: chairID});
        },

        leave: function(userID) {
            delete this.clients[userID];
        },
        
        changeChair: function(userID, chairID) {
            var client = this.clients[userID];
            if (client == null) {
                return false;
            }
            
            client.chairID = chairID;
            return true;
        },

        genDealSequence: function() {
            var chairs = new Array(8);
            var sequence = [];

            for (var userID in this.clients) {
                chairs[this.clients[userID].chairID] = this.clients[userID].userID;
            }

            var bankerIndex = -1;
            if (this.type != Game.ROOM_TYPE.CHAOS) {
                bankerIndex = chairs.indexOf(this.banker);
            }

            var index;
            for (index = bankerIndex + 1; index < chairs.length; index++) {
                if (chairs[index] == null) {
                    continue;
                }

                sequence.push(chairs[index]);
            }

            if (bankerIndex >= 0) {
                for (index = 0; index <= bankerIndex; index++) {
                    if (chairs[index] == null) {
                        continue;
                    }

                    sequence.push(chairs[index]);
                }
            }

            this.dealSequence = sequence;
        },

        decreaseGold: function(userID, amount) {
            if (this.golds[userID] == null) {
                this.golds[userID] = 0;
            }

            this.golds[userID] -= Math.abs(amount);

            if (this.roundLog.clients[userID] != null) {
                this.roundLog.clients[userID].gold -= Math.abs(amount);
            }
        },

        increaseGold: function(userID, amount) {
            if (this.golds[userID] == null) {
                this.golds[userID] = 0;
            }

            this.golds[userID] += Math.abs(amount);

            if (this.roundLog.clients[userID] != null) {
                this.roundLog.clients[userID].gold += Math.abs(amount);
            }
        },

        ready: function(userID, data) {
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            client.ready = data ? true : false;
            if (client.showResult == true) {
                client.showResult = false;
            }
            return {userID: userID, ready: client.ready};
        },

        isClientReady: function(userID) {
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            return client.ready;
        },

        getClient: function(userID) {
            return this.clients[userID];
        },

        setAwk: function(userID, state) {
            var client = this.getClient(userID);
            if (client) {
                client.isAfk = state;
            }
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
                var client = this.getClient(userID);

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

        getClientFight: function() {
            return this.getClientState("compared");
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
                    // 有没有翻倍牌呢
                    if (value === Poker.DOUBLE_POKER_VALUE && this.settings.isDouble != true) {
                        continue;
                    }

                    this.deck.push(new Poker({value: value, type: type}));
                }
            }
        },

        //洗牌
        shuffle: function() {
            var newDeck = [];

            while (this.deck.length) {
                var min = 0;
                var max = this.deck.length;

                var index = Math.floor(Math.random()*(max-min) + min);
                newDeck.push(this.deck[index]);
                this.deck.splice(index, 1);
            }

            this.deck = newDeck;
        },

        //根据规则发牌
        deal: function() {
            var i;
            var j;
            var client;
            
            // 清理手牌
            for (i in this.clients) {
                client = this.getClient(i);
                client.handPokers = [];
            }
            
            // 发两张牌
            for (i = 0; i < 2; i++) {
                //按顺序发牌
                for (j = 0; j < this.dealSequence.length; j++) {
                    var userID = this.dealSequence[j];
                    client = this.getClient(userID);
                    if (client && this.deck.length > 0) {
                        client.handPokers.push(this.deck.shift());
                    }
                }
            }
        },

        // 翻鬼牌
        ghost: function() {
            var amount = this.settings.ghostCount;
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
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            if (typeof rate != "number") {
                rate = 1;
            }

            // 一杠到底
            if (this.settings.betType === Game.BET_TYPE.MORE_THEN_MORE) {
                var lastBidRate = this.lastBidRates[userID] || 1;
                // 当前倍数 不小于 上一次倍数
                if (rate < lastBidRate) {
                    return null;
                }
            }

            client.bid = true;
            client.bidRate = rate;
            this.lastBidRates[userID] = rate;
            for (var i in client.handPokers) {
                // 定制模式直接开牌
                if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                    client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
                }
                else {
                    client.handPokers[i].setShow(Poker.SHOW_TARGET.ME);
                }
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

        rob: function(userID, data) {
            if (this.banker != 0) {
                return null;
            }

            this.banker = userID;
            return {userID: userID};
        },

        draw: function(userID, type) {
            //排队来
            if (userID != this.drawList[0]) {
                return null;
            }

            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            var i;
            var poker;
            var results = {
                userID: userID
            };

            var ghostArray = [];
            for (i in this.ghostPokers) {
                poker = this.ghostPokers[i];
                if (poker && poker.type != Poker.TYPE.JOKER) {
                    ghostArray.push(poker.value);
                }
            }

            // 双鬼判断
            var ghostCnt = 0;
            // 天公判断 累计点数
            var totalValue = 0;
            for (i in client.handPokers) {
                poker = client.handPokers[i];
                if (poker) {
                    if (poker.type === Poker.TYPE.JOKER || ghostArray.indexOf(poker.value) != -1) {
                        ghostCnt++;
                        totalValue += 10;
                    }
                    else {
                        if (poker.value > 10) {
                            totalValue += 10;
                        }
                        else {
                            totalValue += poker.value;
                        }
                    }
                }
            }

            totalValue = totalValue % 10;

            var cantOpen = false;
            var cantPass = false;
            var cantDraw = false;
            var cantRubbed = false;

            switch (this.type) {
                // 长庄
                case Game.ROOM_TYPE.STATIC: {
                    // 一只鬼的时候
                    if (ghostCnt === 1) {
                        // 鬼牌万能 只能补牌
                        if (this.settings.universalGhost == true) {
                            cantOpen = true;
                            cantPass = true;
                        }
                    }
                    // 天公不能过牌
                    if (totalValue == 8 || totalValue == 9) {
                        cantPass = true;
                    }
                    break;
                }
                // 经典
                case Game.ROOM_TYPE.CLASSICAL: {
                    // 一只鬼的时候
                    if (ghostCnt === 1) {
                        // 鬼牌万能 只能补牌
                        if (this.settings.universalGhost == true) {
                            cantOpen = true;
                            cantPass = true;
                        }
                    }
                    // 天公不能过牌
                    if (totalValue == 8 || totalValue == 9) {
                        cantPass = true;
                    }
                    break;
                }
                // 混战
                case Game.ROOM_TYPE.CHAOS: {
                    // 一只鬼的时候
                    if (ghostCnt === 1) {
                        // 鬼牌万能 只能补牌
                        if (this.settings.universalGhost == true) {
                            cantOpen = true;
                            cantPass = true;
                        }
                    }
                    break;
                }
                // 定制
                case Game.ROOM_TYPE.CUSTOMIZED: {
                    // 定制模式不能明牌和过牌 只能补牌和搓牌
                    cantPass = true;
                    cantOpen = true;
                    break;
                }
            }

            switch (type) {
                // 明牌 不补牌 直接将牌面公开
                case Game.DRAW_COMMAND.OPEN: {
                    if (cantOpen) {
                        return null;
                    }

                    for (i in client.handPokers) {
                        client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
                    }
                    break;
                }
                // 要一张牌
                case Game.DRAW_COMMAND.DRAW: {
                    if (cantDraw) {
                        return null;
                    }

                    poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                        poker.setShow(Poker.SHOW_TARGET.ALL);
                    }
                    client.handPokers.push(poker);
                    break;
                }
                // 搓牌 要扣东西的
                case Game.DRAW_COMMAND.RUBBED: {
                    if (cantRubbed) {
                        return null;
                    }

                    this.whosRubbing = userID;
                    client.isRubbing = true;

                    poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    if (this.type == Game.ROOM_TYPE.CUSTOMIZED) {
                        poker.setShow(Poker.SHOW_TARGET.ALL);
                    }
                    client.handPokers.push(poker);
                    break;
                }
                // 过牌
                default: {
                    if (cantPass) {
                        return null;
                    }

                    type = Game.DRAW_COMMAND.PASS;
                    break;
                }
            }

            this.drawList.shift();
            results.type = type;
            
            if (this.drawList.length <= 0) {
                if (this.type === Game.ROOM_TYPE.CHAOS
                    || this.type === Game.ROOM_TYPE.CUSTOMIZED
                ) {
                    this.doPay();
                }
            }

            return results;
        },

        doBankerDraw: function(userID, type) {
            //闲家捣乱
            if (userID != this.banker) {
                return null;
            }

            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            var i;
            var j;
            var results = {
                userID: userID
            };

            var ghostArray = [];
            for (i in this.ghostPokers) {
                poker = this.ghostPokers[i];
                if (poker && poker.type != Poker.TYPE.JOKER) {
                    ghostArray.push(poker.value);
                }
            }

            // 双鬼判断
            var ghostCnt = 0;
            for (i in client.handPokers) {
                poker = client.handPokers[i];
                if (poker && (poker.type === Poker.TYPE.JOKER || ghostArray.indexOf(poker.value) != -1)) {
                    ghostCnt++;
                }
            }

            var cantBetAll = false;
            var cantBetDraw = false;
            var cantDraw = false;
            var cantRubbed = false;
            
            // 一只鬼的时候
            if (ghostCnt === 1) {
                // 鬼牌万能 只能补牌
                if (this.settings.universalGhost == true) {
                    cantBetAll = true;
                    cantBetDraw = true;
                }
            }

            var gambleList = [];

            switch (type) {
                // 开补 对已经补牌的玩家进行开牌比牌操作 已经明牌的也要加上
                case Game.DRAW_COMMAND.BET_DRAW: {
                    if (cantBetDraw) {
                        return null;
                    }
                    
                    this.bankerDraw = 1;
                    var drawCnt = 0;
                    var openCnt = 0;
                    var openArr = [];
                    var playerCnt = 0;

                    for (i in this.clients) {
                        var c = this.getClient(i);
                        if (c == null) {
                            continue;
                        }

                        //庄家自己
                        if (c.userID == userID) {
                            continue;
                        }

                        playerCnt++;
                        if (c.handPokers.length > 2) {
                            gambleList.push(c.userID);
                            drawCnt++;
                        }
                        else {
                            // 两张牌都是开牌的
                            if (c.handPokers[0].showTarget == Poker.SHOW_TARGET.ALL
                                && c.handPokers[1].showTarget == Poker.SHOW_TARGET.ALL) {
                                openCnt++;
                                openArr.push(c.userID);
                            }
                        }

                        // 闲家开牌
                        for (j in c.handPokers) {
                            c.handPokers[j].setShow(Poker.SHOW_TARGET.ALL);
                        }
                    }

                    // 有人补牌 并且补牌+明牌的人数小于总人数 则走开补流程
                    if (drawCnt > 0 && drawCnt + openCnt < playerCnt) {
                        for (i in client.handPokers) {
                            client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
                        }
                        // 联合补牌和明牌的人
                        gambleList = gambleList.concat(openArr);
                        results.gamble = this.fight(gambleList);
                    }
                    // 其他情况都全部开牌
                    else {
                        this.bankerDraw = 2;
                    }
                    break;
                }
                // 补牌 要一张牌
                case Game.DRAW_COMMAND.DRAW: {
                    if (cantDraw) {
                        return null;
                    }
                    
                    var poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    client.handPokers.push(poker);
                    this.bankerDraw = 2;
                    break;
                }
                // 搓牌 要扣东西的
                case Game.DRAW_COMMAND.RUBBED: {
                    if (cantRubbed) {
                        return null;
                    }

                    this.whosRubbing = userID;
                    client.isRubbing = true;
                    
                    var poker = this.deck.shift();
                    poker.setShow(Poker.SHOW_TARGET.ME);
                    client.handPokers.push(poker);
                    this.bankerDraw = 2;
                    break;
                }
                // 全开 不补牌直接跟全部人比较
                default: {
                    if (cantBetAll) {
                        return null;
                    }
                    type = Game.DRAW_COMMAND.BET_ALL;

                    this.bankerDraw = 2;
                    break;
                }
            }

            results.type = type;
            
            if (this.bankerDraw == 2) {
                this.doPay();
            }

            return results;
        },

        rubDone: function(userID, data) {
            if (userID == this.whosRubbing) {
                this.whosRubbing = 0;

                var client = this.getClient(this.banker);
                if (client != null) {
                    client.isRubbing = false;
                }
            }

            return {userID: userID};
        },

        doPay: function() {
            var client = this.getClient(this.banker);
            if (client == null) {
                return null;
            }

            if (this.roundLog.ghostPokers == null) {
                this.roundLog.ghostPokers = Utils.object_clone(this.ghostPokers);
            }

            var i;
            var j;
            var gambleList = [];
            for (i in this.clients) {
                var c = this.getClient(i);
                if (c == null) {
                    continue;
                }

                // 比牌要展示结果
                c.showResult = true;

                //庄家自己 非混战模式不参与
                if (this.type != Game.ROOM_TYPE.CHAOS) {
                    if (c.userID == this.banker) {
                        continue;
                    }
                }

                if (c.compared == false) {
                    gambleList.push(c.userID);
                }

                // 闲家开牌
                for (j in c.handPokers) {
                    c.handPokers[j].setShow(Poker.SHOW_TARGET.ALL);
                }
            }

            // 庄家操作之后 就可以展示所有牌给大家看了
            for (i in client.handPokers) {
                client.handPokers[i].setShow(Poker.SHOW_TARGET.ALL);
            }

            var gamble = this.fight(gambleList);
            return {gamble: gamble};
        },

        end: function(userID, data) {
            var client = this.getClient(userID);
            if (client == null || client.end == true) {
                return null;
            }

            client.end = true;
            return {
                userID: userID,
                end: true
            };
        },

        rejectBanker: function(userID, data) {
            var client = this.getClient(userID);
            if (client == null) {
                return null;
            }

            if (client.notBank) {
                client.notBank = false;
            }
            else {
                client.notBank = true;
            }

            return {
                userID: userID,
                notBank: client.notBank
            };
        },

        //比牌的入口 一般情况下是庄家与list里面的玩家比牌
        fight: function(list) {
            var l = Utils.object_clone(list);

            switch (this.type) {
                // 长庄模式
                case Game.ROOM_TYPE.STATIC: {
                    return this.staticFight(l);
                }
                // 经典模式
                case Game.ROOM_TYPE.CLASSICAL: {
                    return this.classicalFight(l);
                }
                // 混战模式
                case Game.ROOM_TYPE.CHAOS: {
                    return this.chaosFight(l);
                }
                // 定制模式
                case Game.ROOM_TYPE.CUSTOMIZED: {
                    return this.customizedFight(l);
                }
            }
        },

        // 长庄模式比牌
        staticFight: function(list) {
            var results  = {};
            var gamble = new StaticGamble(this.clone());
            var bankerObj = this.getClient(this.banker);

            if (bankerObj == null) {
                return null;
            }

            var bankerScore = gamble.pokerScore(Utils.object_clone(bankerObj.handPokers));
            if (bankerScore == null) {
                return null;
            }

            bankerObj.compared = true;
            results.bankerScore = bankerScore;

            var pokerId;

            if (this.roundLog.clients == null) {
                this.roundLog.clients = {};
            }

            if (this.roundLog.clients[this.banker] == null) {
                this.roundLog.clients[this.banker] = {
                    gold:       0,    // 需要初始化一个gold
                    fightTimes: 0,
                    winTimes:   0,
                    bidRate:    bankerObj.bidRate
                };
            }

            this.roundLog.clients[this.banker].score = bankerScore.score;
            this.roundLog.clients[this.banker].type = bankerScore.type;
            this.roundLog.clients[this.banker].isBanker = true;
            this.roundLog.clients[this.banker].point = bankerScore.point;
            this.roundLog.clients[this.banker].fancy = bankerScore.fancy;
            this.roundLog.clients[this.banker].handPokers = [];
            for (pokerId = 0; pokerId < bankerObj.handPokers.length; pokerId++) {
                if (bankerObj.handPokers[pokerId]) {
                    this.roundLog.clients[this.banker].handPokers.push(bankerObj.handPokers[pokerId].clone());
                }
            }

            var i;
            var playerScore;
            var client;

            for (i = 0; i < list.length; i++) {
                var userID = list[i];
                // 只处理闲家
                if (userID === this.banker) {
                    continue;
                }

                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = playerScore.score;
                this.roundLog.clients[userID].type = playerScore.type;
                this.roundLog.clients[userID].point = playerScore.point;
                this.roundLog.clients[userID].fancy = playerScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                for (pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                client.compared = true;
                if (playerScore.score > bankerScore.score) {
                    playerScore.result = "win";             //闲家胜利
                }
                else if (playerScore.score == bankerScore.score) {
                    playerScore.result = "draw";            //平局
                    // 比牌算花式
                    if (this.settings.fancyWin && bankerScore.type === playerScore.type) {
                        if (FancyPayTypes.indexOf(bankerScore.type) != -1) {
                            if (Game.FANCY_MULTIPLE[playerScore.fancy] > Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "win";             //闲家胜利
                            }
                            else if (Game.FANCY_MULTIPLE[playerScore.fancy] < Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "lose";            //输牌
                            }
                        }
                    }
                }
                else {
                    playerScore.result = "lose";            //输牌
                }

                // 需要判断0点赢双鬼
                var winGhostMultiple = 0;
                // 任何木虱赢双鬼
                if (this.settings.beatDBLGhost === Game.BEAT_DBL_GHOST.ALL_BEAT) {
                    // 闲家双鬼 庄家0点
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && bankerScore.score === 100) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && playerScore.score === 100) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * playerScore.double_poker;
                    }
                }
                // 三条同花木虱赢双鬼
                else {
                    // 闲家双鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                // 三条同花木虱赢三鬼
                if (this.settings.beatThreeGhost) {
                    // 闲家三鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家三鬼
                    else if (bankerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                var payMultiple = 0;
                // 闲家赢牌 庄家输牌
                if (playerScore.result == "win") {
                    this.roundLog.clients[userID].winTimes++;
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = playerScore.multiple;
                    }
                    
                    this.increaseGold(userID, payMultiple * client.bidRate);
                    this.decreaseGold(this.banker, payMultiple * client.bidRate);
                }
                // 闲家输牌 庄家赢牌
                else if (playerScore.result == "lose") {
                    this.roundLog.clients[this.banker].winTimes++;
                    // 需要用庄家的牌型倍率
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = bankerScore.multiple;
                    }
                    
                    this.increaseGold(this.banker, payMultiple * client.bidRate);
                    this.decreaseGold(userID, payMultiple * client.bidRate);
                }

                this.roundLog.clients[this.banker].fightTimes++;
                this.roundLog.clients[userID].fightTimes++;

                results[userID] = playerScore;
            }

            return results;
        },

        // 经典模式比牌
        classicalFight: function(list) {
            var results  = {};
            var gamble = new StaticGamble(this.clone());
            var bankerObj = this.getClient(this.banker);

            if (bankerObj == null) {
                return null;
            }

            var bankerScore = gamble.pokerScore(Utils.object_clone(bankerObj.handPokers));
            if (bankerScore == null) {
                return null;
            }

            bankerObj.compared = true;
            results.bankerScore = bankerScore;

            var pokerId;

            if (this.roundLog.clients == null) {
                this.roundLog.clients = {};
            }

            if (this.roundLog.clients[this.banker] == null) {
                this.roundLog.clients[this.banker] = {
                    gold:       0,    // 需要初始化一个gold
                    fightTimes: 0,
                    winTimes:   0,
                    bidRate:    bankerObj.bidRate
                };
            }

            this.roundLog.clients[this.banker].score = bankerScore.score;
            this.roundLog.clients[this.banker].type = bankerScore.type;
            this.roundLog.clients[this.banker].isBanker = true;
            this.roundLog.clients[this.banker].point = bankerScore.point;
            this.roundLog.clients[this.banker].fancy = bankerScore.fancy;
            this.roundLog.clients[this.banker].handPokers = [];
            for (pokerId = 0; pokerId < bankerObj.handPokers.length; pokerId++) {
                if (bankerObj.handPokers[pokerId]) {
                    this.roundLog.clients[this.banker].handPokers.push(bankerObj.handPokers[pokerId].clone());
                }
            }

            var self = this;
            var bankerChangeCalc = function(userID, scoreInfo) {
                // 第一次处理总是庄家 所以可以直接存相应信息
                if (self.typeBak == null) {
                    self.typeBak = scoreInfo.type;
                    return;
                }

                // 下面就是闲家了

                // 顺子上庄：双鬼 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）
                // 天公上庄：双鬼 > 天公9 > 天公8 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）

                // 点数牌的话就别想了
                if (scoreInfo.type == Game.POKER_MODELS.POINT) {
                    return;
                }

                if (self.settings.condition === Game.BANKER_CONDITION.NORMAL) {
                    // 顺子上庄 天公8 天公9 不上庄
                    if (scoreInfo.type == Game.POKER_MODELS.GOD_EIGHT || scoreInfo.type == Game.POKER_MODELS.GOD_NINE) {
                        return;
                    }
                }

                var typeGrade = {};
                // 第一波 双鬼 最屌
                typeGrade[Game.POKER_MODELS.THREE_GHOST] = 2000;
                typeGrade[Game.POKER_MODELS.DOUBLE_GHOST] = 1000;

                // 第二波 天公9 > 天公8  直接用 9 和 8 来评分
                typeGrade[Game.POKER_MODELS.GOD_NINE] = 109;
                typeGrade[Game.POKER_MODELS.GOD_EIGHT] = 108;

                // 第三波 同花顺 三条 顺子
                // 用设置的倍数来判断 如果倍数相同 按 同花顺 > 三条 > 顺子
                typeGrade[Game.POKER_MODELS.STRAIGHT_FLUSH]
                    = self.settings.pokerModels[Game.POKER_MODELS.STRAIGHT_FLUSH];

                typeGrade[Game.POKER_MODELS.THREES]
                    = self.settings.pokerModels[Game.POKER_MODELS.THREES];

                typeGrade[Game.POKER_MODELS.STRAIGHT]
                    = self.settings.pokerModels[Game.POKER_MODELS.STRAIGHT];

                typeGrade[Game.POKER_MODELS.POINT] = 0;

                var bakGrade = typeGrade[self.typeBak] || 0;
                var currGrade = typeGrade[scoreInfo.type] || 0;

                // 大于就直接换
                if (currGrade > bakGrade) {
                    self.typeBak = scoreInfo.type;
                    self.bankerBak = userID;
                    return;
                }

                // 相等的话 按发牌顺序
                if (currGrade == bakGrade) {
                    var bankerOrder = self.dealSequence.indexOf(self.bankerBak);
                    var clientOrder = self.dealSequence.indexOf(userID);

                    if (clientOrder != -1 && clientOrder < bankerOrder) {
                        self.typeBak = scoreInfo.type;
                        self.bankerBak = userID;
                    }
                }
            };

            bankerChangeCalc(this.banker, bankerScore);

            var i;
            var playerScore;
            var client;

            for (i = 0; i < list.length; i++) {
                var userID = list[i];
                // 只处理闲家
                if (userID === this.banker) {
                    continue;
                }

                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = playerScore.score;
                this.roundLog.clients[userID].type = playerScore.type;
                this.roundLog.clients[userID].point = playerScore.point;
                this.roundLog.clients[userID].fancy = playerScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                for (pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                client.compared = true;
                if (playerScore.score > bankerScore.score) {
                    playerScore.result = "win";             //闲家胜利
                }
                else if (playerScore.score == bankerScore.score) {
                    playerScore.result = "draw";            //平局
                    // 比牌算花式
                    if (this.settings.fancyWin && bankerScore.type === playerScore.type) {
                        if (FancyPayTypes.indexOf(bankerScore.type) != -1) {
                            if (Game.FANCY_MULTIPLE[playerScore.fancy] > Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "win";             //闲家胜利
                            }
                            else if (Game.FANCY_MULTIPLE[playerScore.fancy] < Game.FANCY_MULTIPLE[bankerScore.fancy]) {
                                playerScore.result = "lose";            //输牌
                            }
                        }
                    }
                }
                else {
                    playerScore.result = "lose";            //输牌
                }

                // 需要判断0点赢双鬼
                var winGhostMultiple = 0;
                // 任何木虱赢双鬼
                if (this.settings.beatDBLGhost === Game.BEAT_DBL_GHOST.ALL_BEAT) {
                    // 闲家双鬼 庄家0点
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && bankerScore.score === 100) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && playerScore.score === 100) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * playerScore.double_poker;
                    }
                }
                // 三条同花木虱赢双鬼
                else {
                    // 闲家双鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家双鬼
                    else if (bankerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                // 三条同花木虱赢三鬼
                if (this.settings.beatThreeGhost) {
                    // 闲家三鬼 庄家0点并且是三张同花
                    if (playerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && bankerScore.score === 100
                        && bankerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "lose";            //闲家输牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * bankerScore.double_poker;
                    }
                    // 闲家0点并且是三张同花 庄家三鬼
                    else if (bankerScore.type === Game.POKER_MODELS.THREE_GHOST
                        && playerScore.score === 100
                        && playerScore.fancy === Game.FANCY.FLUSH_THREE
                    ) {
                        playerScore.result = "win";             //闲家赢牌
                        winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                    }
                }

                var payMultiple = 0;
                // 闲家赢牌 庄家输牌
                if (playerScore.result == "win") {
                    this.roundLog.clients[userID].winTimes++;
                    // 用闲家的牌型倍率
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = playerScore.multiple;
                    }
                    
                    this.increaseGold(userID, payMultiple * client.bidRate);
                    this.decreaseGold(this.banker, payMultiple * client.bidRate);

                    // 上庄设定 闲家赢牌才有资格上庄
                    // 这里判断的是他是否选择了不坐庄
                    if (client.notBank != true) {
                        bankerChangeCalc(userID, playerScore);
                    }
                }
                // 闲家输牌 庄家赢牌
                else if (playerScore.result == "lose") {
                    this.roundLog.clients[this.banker].winTimes++;
                    // 需要用庄家的牌型倍率
                    if (winGhostMultiple > 0) {
                        payMultiple = winGhostMultiple;
                    }
                    else {
                        payMultiple = bankerScore.multiple;
                    }
                    
                    this.increaseGold(this.banker, payMultiple * client.bidRate);
                    this.decreaseGold(userID, payMultiple * client.bidRate);
                }

                this.roundLog.clients[this.banker].fightTimes++;
                this.roundLog.clients[userID].fightTimes++;

                results[userID] = playerScore;
            }

            return results;
        },

        // 混战模式比牌
        chaosFight: function(list) {
            var results  = {};
            var scoreList = {};

            var gamble = new StaticGamble(this.clone());
            var i;
            var j;
            var playerScore;
            var client;
            var userID;

            for (i = 0; i < list.length; i++) {
                userID = list[i];
                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                scoreList[userID] = playerScore;
            }

            var gambleResult = {};
            for (i = 0; i < list.length; i++) {
                userID = list[i];
                var baseScore = scoreList[userID];
                if (baseScore == null) {
                    continue;
                }

                if (this.roundLog.clients == null) {
                    this.roundLog.clients = {};
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = baseScore.score;
                this.roundLog.clients[userID].type = baseScore.type;
                this.roundLog.clients[userID].point = baseScore.point;
                this.roundLog.clients[userID].fancy = baseScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                client = this.getClient(userID);
                for (var pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                gambleResult[userID] = {};

                for (j = 0; j < list.length; j++) {
                    var pId = list[j];
                    if (pId == userID) {
                        continue;
                    }

                    playerScore = scoreList[pId];
                    if (playerScore.score > baseScore.score) {
                        gambleResult[userID][pId] = "lose";            //userID失败
                    }
                    else if (playerScore.score == baseScore.score) {
                        gambleResult[userID][pId] = "draw";            //平局
                        // 比牌算花式
                        if (this.settings.fancyWin && baseScore.type === playerScore.type) {
                            if (FancyPayTypes.indexOf(baseScore.type) != -1) {
                                if (Game.FANCY_MULTIPLE[playerScore.fancy] > Game.FANCY_MULTIPLE[baseScore.fancy]) {
                                    gambleResult[userID][pId] = "lose";            //userID失败
                                }
                                else if (Game.FANCY_MULTIPLE[playerScore.fancy] < Game.FANCY_MULTIPLE[baseScore.fancy]) {
                                    gambleResult[userID][pId] = "win";             //userID胜利
                                }
                            }
                        }
                    }
                    else {
                        gambleResult[userID][pId] = "win";             //userID胜利
                    }

                    var target = this.getClient(pId);

                    // 需要判断0点赢双鬼
                    var winGhostMultiple = 0;
                    // 任何木虱赢双鬼
                    if (this.settings.beatDBLGhost === Game.BEAT_DBL_GHOST.ALL_BEAT) {
                        // 闲家双鬼 庄家0点
                        if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST && baseScore.score === 100) {
                            gambleResult[userID][pId] = "win";            //userID胜利
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * baseScore.double_poker;
                        }
                        // 闲家0点 庄家双鬼
                        else if (baseScore.type === Game.POKER_MODELS.DOUBLE_GHOST && playerScore.score === 100) {
                            gambleResult[userID][pId] = "lose";            //userID失败
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.DOUBLE_GHOST] * playerScore.double_poker;
                        }
                    }
                    // 三条同花木虱赢双鬼
                    else {
                        // 闲家双鬼 庄家0点并且是三张同花
                        if (playerScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                            && baseScore.score === 100
                            && baseScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "win";            //userID胜利
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * baseScore.double_poker;
                        }
                        // 闲家0点并且是三张同花 庄家双鬼
                        else if (baseScore.type === Game.POKER_MODELS.DOUBLE_GHOST
                            && playerScore.score === 100
                            && playerScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "lose";            //userID失败
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                        }
                    }

                    // 三条同花木虱赢三鬼
                    if (this.settings.beatThreeGhost) {
                        // 闲家三鬼 庄家0点并且是三张同花
                        if (playerScore.type === Game.POKER_MODELS.THREE_GHOST
                            && baseScore.score === 100
                            && baseScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "win";            //userID胜利
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * baseScore.double_poker;
                        }
                        // 闲家0点并且是三张同花 庄家三鬼
                        else if (baseScore.type === Game.POKER_MODELS.THREE_GHOST
                            && playerScore.score === 100
                            && playerScore.fancy === Game.FANCY.FLUSH_THREE
                        ) {
                            gambleResult[userID][pId] = "lose";            //userID失败
                            winGhostMultiple = this.settings.pokerModels[Game.POKER_MODELS.THREE_GHOST] * playerScore.double_poker;
                        }
                    }

                    //设置已经比牌的状态
                    client.compared = true;

                    // 技巧: 因为这里重复比较了 所以这里在扣费和增费 只做单方面的 比如 userID 赢 只给他钱 不扣 pId的钱 当pId为主的时候就会扣了
                    var payMultiple = 0;
                    if (gambleResult[userID][pId] == "win") {
                        this.roundLog.clients[userID].winTimes++;
                        // 赢的时候要用自己的牌型倍数
                        if (winGhostMultiple > 0) {
                            payMultiple = winGhostMultiple;
                        }
                        else {
                            payMultiple = baseScore.multiple;
                        }
                        this.increaseGold(userID, payMultiple * target.bidRate * client.bidRate);
                    }
                    else if (gambleResult[userID][pId] == "lose") {
                        // 赢的时候要用自己的牌型倍数
                        if (winGhostMultiple > 0) {
                            payMultiple = winGhostMultiple;
                        }
                        else {
                            payMultiple = playerScore.multiple;
                        }
                        this.decreaseGold(userID, payMultiple * target.bidRate * client.bidRate);
                    }
                    
                    this.roundLog.clients[userID].fightTimes++;
                }
            }

            results.gambleResult = gambleResult;
            results.scoreList = scoreList;

            return results;
        },

        // 定制模式比牌
        customizedFight: function(list) {
            var results  = {};
            var gamble = new CustomizedGamble(this.clone());
            var bankerObj = this.getClient(this.banker);

            if (bankerObj == null) {
                return null;
            }

            var bankerScore = gamble.pokerScore(Utils.object_clone(bankerObj.handPokers));
            if (bankerScore == null) {
                return null;
            }

            bankerObj.compared = true;
            results.bankerScore = bankerScore;

            var pokerId;

            if (this.roundLog.clients == null) {
                this.roundLog.clients = {};
            }

            if (this.roundLog.clients[this.banker] == null) {
                this.roundLog.clients[this.banker] = {
                    gold:       0,    // 需要初始化一个gold
                    fightTimes: 0,
                    winTimes:   0,
                    bidRate:    bankerObj.bidRate
                };
            }

            this.roundLog.clients[this.banker].score = bankerScore.score;
            this.roundLog.clients[this.banker].type = bankerScore.type;
            this.roundLog.clients[this.banker].isBanker = true;
            this.roundLog.clients[this.banker].point = bankerScore.point;
            this.roundLog.clients[this.banker].fancy = bankerScore.fancy;
            this.roundLog.clients[this.banker].handPokers = [];
            for (pokerId = 0; pokerId < bankerObj.handPokers.length; pokerId++) {
                if (bankerObj.handPokers[pokerId]) {
                    this.roundLog.clients[this.banker].handPokers.push(bankerObj.handPokers[pokerId].clone());
                }
            }

            var i;
            var playerScore;
            var client;

            for (i = 0; i < list.length; i++) {
                var userID = list[i];
                // 只处理闲家
                if (userID === this.banker) {
                    continue;
                }

                client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                playerScore = gamble.pokerScore(Utils.object_clone(client.handPokers));
                if (playerScore == null) {
                    continue;
                }

                if (this.roundLog.clients[userID] == null) {
                    this.roundLog.clients[userID] = {
                        gold:       0,    // 需要初始化一个gold
                        fightTimes: 0,
                        winTimes:   0,
                        bidRate:    client.bidRate
                    };
                }

                this.roundLog.clients[userID].score = playerScore.score;
                this.roundLog.clients[userID].type = playerScore.type;
                this.roundLog.clients[userID].point = playerScore.point;
                this.roundLog.clients[userID].fancy = playerScore.fancy;
                this.roundLog.clients[userID].handPokers = [];
                for (pokerId = 0; pokerId < client.handPokers.length; pokerId++) {
                    if (client.handPokers[pokerId]) {
                        this.roundLog.clients[userID].handPokers.push(client.handPokers[pokerId].clone());
                    }
                }

                client.compared = true;
                if (playerScore.score > bankerScore.score) {
                    playerScore.result = "win";             //闲家胜利
                    this.roundLog.clients[userID].winTimes++;
                    this.increaseGold(userID, playerScore.multiple * client.bidRate);
                    this.decreaseGold(this.banker, playerScore.multiple * client.bidRate);
                }
                else if (playerScore.score == bankerScore.score) {
                    playerScore.result = "draw";            //平局
                }
                else {
                    playerScore.result = "lose";            //输牌  用庄家的牌型倍数
                    this.roundLog.clients[this.banker].winTimes++;
                    this.increaseGold(this.banker, bankerScore.multiple * client.bidRate);
                    this.decreaseGold(userID, bankerScore.multiple * client.bidRate);
                }

                this.roundLog.clients[this.banker].fightTimes++;
                this.roundLog.clients[userID].fightTimes++;

                results[userID] = playerScore;
            }

            return results;
        },

        reset: function() {
            switch (this.type) {
                // 长庄模式
                case Game.ROOM_TYPE.STATIC: {
                    break;
                }
                // 经典模式
                case Game.ROOM_TYPE.CLASSICAL: {
                    // 上庄
                    // 如果庄家不同了
                    if (this.banker != this.bankerBak) {
                        this.lastBidRates = {};
                    }
                    this.banker = this.bankerBak;
                    this.scoreBak = 0;
                    this.typeBak = null;
                    break;
                }
                // 混战模式
                case Game.ROOM_TYPE.CHAOS: {
                    break;
                }
                // 定制模式
                case Game.ROOM_TYPE.CUSTOMIZED: {
                    // 去掉庄家 要重新抢
                    this.banker = 0;
                    break;
                }
            }

            this.deck           = [];       // 整副牌
            this.ghostPokers    = [];       // 桌面鬼牌
            this.drawList       = [];       // 要牌列表
            this.bankerDraw     = 0;        // 庄家操作情况
            this.whosRubbing    = 0;        // 搓牌信息刷新
            this.roundLog       = {clients: {}};       // 比牌记录

            for (var userID in this.clients) {
                var client = this.getClient(userID);
                if (client == null) {
                    continue;
                }

                client.ready        = false;        // 是否准备好
                client.started      = false;        // 是否开始过游戏
                client.bid          = false;        // 是否下注
                client.bidRate      = 0;            // 下注倍数
                client.compared     = false;        // 是否比过牌
                client.end          = false;        // 是否结束
                client.handPokers   = [];           // 手牌
                client.isRubbing    = false;        // 是否在搓牌
            }
        },

        infoToPlayer: function(userID) {
            var info = {};
            info.ghostPokers        = Utils.object_clone(this.ghostPokers);
            info.drawList           = Utils.object_clone(this.drawList);
            info.dealSequence       = Utils.object_clone(this.dealSequence);
            info.roundLog           = Utils.object_clone(this.roundLog);
            info.banker             = this.banker;
            info.bankerDraw         = this.bankerDraw;
            info.indicator          = this.indicator;
            info.whosRubbing        = this.whosRubbing;

            info.clients = {};
            for (var uid in this.clients) {
                info.clients[uid] = {};
                var client = info.clients[uid];
                var c = this.getClient(uid);
                client.userID       = c.userID;
                client.chairID      = c.chairID;
                client.gold         = this.golds[uid] || 0;
                client.lastBidRate  = this.lastBidRates[uid] || 0;
                client.ready        = c.ready;
                client.started      = c.started;
                client.bid          = c.bid;
                client.bidRate      = c.bidRate;
                client.end          = c.end;
                client.compared     = c.compared;
                client.notBank      = c.notBank;
                client.isRubbing    = c.isRubbing;
                client.showResult   = c.showResult;
                client.isAfk        = c.isAfk;

                client.handPokers = [];                        // 手牌
                var showRight = Poker.SHOW_TARGET.ALL;
                if (client.userID == userID) {
                    showRight = Poker.SHOW_TARGET.ME;
                }
                if (c.handPokers) {
                    for (var i = 0, size = c.handPokers.length; i < size; i++) {
                        if (showRight > c.handPokers[i].showTarget) {
                            client.handPokers.push({showTarget: c.handPokers[i].showTarget});
                            continue;
                        }
                        client.handPokers.push(
                            {
                                type: c.handPokers[i].type,
                                value: c.handPokers[i].value,
                                showTarget: c.handPokers[i].showTarget
                            }
                        );
                    }
                }
            }
            
            return info;
        }
    });
}(DejuPoker));