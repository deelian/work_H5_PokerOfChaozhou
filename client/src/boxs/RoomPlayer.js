/**
 * 游戏房间中玩家的头像显示
 */
var RoomPlayerBox = (function(_super) {
    function RoomPlayerBox(playerInfo) {
        RoomPlayerBox.super(this);

        this._userId        = playerInfo.userID;
        this._wasDealTime   = 0;//*发了多少张牌

        this._handPokerList = [];//*手牌
        this._showPokerList = [];//*要显示的牌

        this._rotate        = [-25, 0, 25];//*角度
        this._handPos       = [100, 122, 142];//*手牌的位置
        this._showPos       = [0, 50, 100];
        this._rotatePos     = [50, 60, 70];

        this._isCustomized  = false; //*是否是定制模式

        this._goldLab       = null; //*分数显示的label

        this.init();
    }

    Laya.class(RoomPlayerBox, "RoomPlayerBox", _super);

    //*改变下注显示的位置
    RoomPlayerBox.prototype.changeBetLabPos = function (posInTable) {
        posInTable = posInTable || 0;
        var maxChairs = App.tableManager.getRoom().maxChairs;
        var tablePos = RoomPlayerBox.BET_LAB_POS[maxChairs];
        var posNode = this.getChildByName("labPos" + tablePos[posInTable]);
        this.bidRate.x = posNode.x;
        this.bidRate.y = posNode.y;
    };

    //*播放音效
    RoomPlayerBox.prototype.playHandPokerSound = function (info) {
        var type                = info.pokerType;
        var fancy               = info.fancy || "normal";
        var score               = info.point || 0;
        var multiple            = Game.Game.FANCY_MULTIPLE[fancy];
        var isPlayMultipleSound = false;

        var soundName   = "";
        if (type != Game.Game.POKER_MODELS.POINT) {
            soundName = type;
            if (type == Game.Game.POKER_MODELS.GOD_EIGHT || type == Game.Game.POKER_MODELS.GOD_NINE) {
                isPlayMultipleSound = true;
            }
        }
        else {
            var pokerPoint = score % 10;
            soundName = GameRoomView.POINT_NAME[pokerPoint];
            isPlayMultipleSound = true;
        }
        var self = this;
        var complete = new Laya.Handler(this, function () {
            var subSound = "";
            if (multiple == 2) {
                subSound = "double";
            }
            else if (multiple == 3) {
                subSound = "triple";
            }
            App.soundManager.playSound(subSound);
        });

        if (isPlayMultipleSound && multiple > 1) {
            App.soundManager.playSound(soundName, complete);
        }
        else {
            App.soundManager.playSound(soundName);
        }
    };

    //*结束状态
    RoomPlayerBox.prototype.endRound = function (isEnd) {
        if (isEnd) {

            this._wasDealTime = 0;
            //*倍数消除
            this.setBidLabText(0);
            //this.setReadyDown();

            //*手牌
            for (var handPokerIndex = 0;  handPokerIndex < this._handPokerList.length; handPokerIndex ++) {
                if (this._handPokerList[handPokerIndex]) {
                    this._handPokerList[handPokerIndex].dispose();
                }
            }
            this._handPokerList = [];

            //*显示的poker
            for (var showIndex = 0; showIndex < this._showPokerList.length; showIndex ++) {
                if (this._showPokerList[showIndex]) {
                    this._showPokerList[showIndex].dispose();
                }
            }
            this._showPokerList = [];

            this.showPokerNode.visible = false;
            this.pokerBox.visible = true;

            this.removeGoldLab();
        }
    };

    RoomPlayerBox.prototype.removeGoldLab = function () {
        if (this._goldLab) {
            this._goldLab.removeSelf();
            this._goldLab = null;
        }
    };

    //*显示分数
    RoomPlayerBox.prototype.showGoldOfRound = function (gold, txt) {
        var color = RoomPlayerBox.COLOR_LAB.GREED;
        if (gold < 0) {
            color = RoomPlayerBox.COLOR_LAB.RED;
        }

        if (this._goldLab) {
            this._goldLab.text = gold + " : " + txt;
            this._goldLab.color = color;
            return;
        }

        var lab = new Laya.Label();
        lab.text = gold + " : " + txt;
        lab.color = color;
        lab.fontSize = 25;
        lab.font = "Microsoft YaHei";
        lab.align = "center";
        lab.anchorX = 0.5;
        lab.anchorY = 0.5;
        lab.x = this.width/2;
        lab.y = this.height/2;
        this.addChild(lab);
        this._goldLab = lab;

        var moveBy = MoveBy.create(0.5, 0, - 90);
        App.actionManager.addAction(moveBy, lab);
    };

    RoomPlayerBox.prototype.executeDraw = function (type, gamble) {
        gamble = gamble || {};
        switch (type) {
            case Game.Game.DRAW_COMMAND.OPEN: {
                App.tableManager.openHandPokers(this._userId);
                break;
            }
            case Game.Game.DRAW_COMMAND.PASS:{
                App.tableManager.nextPlayerCanDraw();
                break;
            }
            case Game.Game.DRAW_COMMAND.DRAW:{
                App.tableManager.playerDrawPoker(this._userId);
                break;
            }
            case Game.Game.DRAW_COMMAND.RUBBED:{
                //*搓牌
                App.tableManager.rubbedPoker(this._userId);
                break;
            }
            case Game.Game.DRAW_COMMAND.BET_ALL:{
                //*庄家全开
                break;
            }
            case Game.Game.DRAW_COMMAND.BET_DRAW:{
                App.tableManager.betDraw(gamble);
                break;
            }
            default: {
                break;
            }
        }

        //*执行完成就返回说完成了，进行下一条
        App.tableManager.commandNext();
    };

    RoomPlayerBox.prototype.setGoldLabText = function (gold) {
        gold = gold || 0;
        this.balanceLab.text = gold;
    };

    //*明牌显示
    RoomPlayerBox.prototype.showAllPokers = function (info) {
        this.showAllPokerToOther(info, true);
        //*通知下一个人可以操作了
        App.tableManager.nextPlayerCanDraw();
    };

    //*显示所有牌
    RoomPlayerBox.prototype.showAllPokerToOther = function (gambleInfo, isShowAll) {
        //*isShowAll 是否是明牌
        var userId = gambleInfo.userId;
        var isShowResult = gambleInfo.isShowResult ? true : false;

        var handPokers;
        var showInfo;
        if (!isShowAll) {
            showInfo = gambleInfo.info;
            handPokers = showInfo.handPokers || [];
        }
        else {
            handPokers = gambleInfo.handPokers || [];
        }

        var isSelfBox = this.checkIsSelfBox(userId);
        var isSelf = this.checkIsSelf();
        if (isSelfBox) {
            //*定制模式翻开第三张牌
            if (isSelf && this._isCustomized) {
                var lastPoker = this._handPokerList[2];
                var lastPokerInfo = handPokers[2];
                lastPoker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                lastPoker.setPokerScale({x:0.3, y:0.3});
                lastPoker.setPokerPosition({x:this._handPos[2], y:35});
                lastPoker.changePokerSkin(Poker.POKER_TYPE.POSITIVE, lastPokerInfo);
            }

            if (isSelf && isShowResult) {
                for (var pokerBackIndex = 0; pokerBackIndex < this._handPokerList.length; pokerBackIndex ++) {
                    this._handPokerList[pokerBackIndex].dispose();
                }
                this._handPokerList = [];

                var handPokerNum = 0;
                for (var index in handPokers) {
                    var resultPokerInfo = handPokers[index];
                    var resultPoker = new Poker(resultPokerInfo);
                    resultPoker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                    resultPoker.setPokerScale({x:0.3, y:0.3});
                    resultPoker.setPokerPosition({x:this._handPos[handPokerNum], y:35});
                    this.positivePokerBox.addChild(resultPoker);
                    this._handPokerList[handPokerNum] = resultPoker;
                    handPokerNum ++;
                }
            }

            //*自己就不用在做了
            if (!isSelf) {
                //*别人显示出来
                //*去掉别人的手牌牌背
                for (var handPokerIndex = 0; handPokerIndex < this._handPokerList.length; handPokerIndex ++) {
                    if (this._handPokerList[handPokerIndex]) {
                        this._handPokerList[handPokerIndex].dispose();
                    }
                }
                this._handPokerList = [];
                this.pokerBox.visible = false;

                var pokerIndex;
                var pokerNum = 0;
                for (pokerIndex in handPokers) {
                    var pokerInfo = handPokers[pokerIndex];
                    var ghostList = App.tableManager.getGhostInTable();
                    var poker = new Poker(pokerInfo, ghostList);
                    poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                    poker.setPokerScale({x:0.3, y:0.3});
                    poker.setPokerPosition({x:this._showPos[pokerNum], y:35});
                    this.showPokerNode.visible = true;
                    this.showPokerNode.addChild(poker);
                    this._showPokerList.push(poker);
                    pokerNum ++;
                }
            }
        }

        //*自己才会播放音效
        if (userId == App.player.getId() && !isShowAll) {
            this.playHandPokerSound(showInfo);
        }
    };

    //*翻开补牌
    RoomPlayerBox.prototype.showOutsPoker = function (info) {
        var userId          = info.userId;
        var roomInfo        = App.tableManager.getRoom();
        var clients         = roomInfo.table.clients || {};
        var handPokers      = clients[userId].handPokers || [];

        if (handPokers.length <= 0) {
            //*这个时候是已经pay了，pay了client身上就没有信息了，那就拿roomLog的信息
            var roomLog = roomInfo.roomLog;
            var rounds = roomLog.rounds || [];
            var lastRound = rounds.length - 1;
            if (lastRound >= 0) {
                var roundInfo = rounds[lastRound] || {};
                clients = roundInfo.clients || {};
                handPokers = clients[userId].handPokers || [];
            }
        }

        var isSelf          = this.checkIsSelf();
        var isSelfBox       = this.checkIsSelfBox(userId);
        var lastPokerIndex  = 2;
        var lastPokerInfo   = handPokers[lastPokerIndex] || {};

        var poker;
        if (isSelf && isSelfBox) {
            //*自己显示
            var ghostList = App.tableManager.getGhostInTable();
            poker = new Poker(lastPokerInfo, ghostList);
            poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
            poker.setPokerScale({x:0.3, y:0.3});
            poker.setPokerPosition({x:this._handPos[lastPokerIndex], y:35});
            this.positivePokerBox.addChild(poker);
            this._handPokerList[lastPokerIndex] = poker;
        }
        else {
            //*别人显示
            poker = new Poker();
            poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
            poker.setPokerScale({x: 0.3, y: 0.3});
            poker.setPokerPosition({x:this._rotatePos[lastPokerIndex], y:37});
            poker.rotation = this._rotate[lastPokerIndex];
            this.pokerBox.addChild(poker);
            this._handPokerList[lastPokerIndex] = poker;
        }

        this._wasDealTime ++;

        App.soundManager.playSound("pokerOptionSound");
        //*通知下一个人可以操作了
        App.tableManager.nextPlayerCanDraw();
    };

    //*显示手牌
    RoomPlayerBox.prototype.showHandPokers = function (opt) {
        var userId          = opt.userId;
        var handPokers      = opt.info || {}; //*手牌
        var isCustomized    = opt.isCustomized; //*是否是定制模式

        var isSelfBox = this.checkIsSelfBox(userId);
        if (!isSelfBox) {
            return;
        }

        var ghostList = App.tableManager.getGhostInTable();
        var isSelf = this.checkIsSelf();
        var poker;
        var handPokerNum = 0;
        var isRubbing = false;
        if (isSelf) {
            //*给自己看
            //*先删除发牌的牌背
            for (var pokerBackIndex = 0; pokerBackIndex < this._handPokerList.length; pokerBackIndex ++) {
                this._handPokerList[pokerBackIndex].dispose();
            }
            this._handPokerList = [];
            //*创建扑克
            var handPokerIndex;

            var clients = App.tableManager.getTableClients();
            if (clients[this._userId] && clients[this._userId].isRubbing) {
                isRubbing = true;
            }

            for (handPokerIndex in handPokers) {
                var pokerInfo = handPokers[handPokerIndex];
                //*手上有三张牌，但是第三张牌正在搓牌的时候就不出现在手牌上
                if (handPokerIndex >= 2 && isRubbing) {
                    break;
                }
                poker = new Poker(pokerInfo, ghostList);
                poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                poker.setPokerScale({x:0.3, y:0.3});
                poker.setPokerPosition({x:this._handPos[handPokerNum], y:35});
                this.positivePokerBox.addChild(poker);
                this._handPokerList[handPokerNum] = poker;
                handPokerNum ++;
            }

            if (isCustomized) {
                //*第三张是牌背
                var selfPokerBack = new Poker();
                selfPokerBack.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                selfPokerBack.setPokerScale({x:0.6, y:0.6});
                selfPokerBack.setPokerPosition({x:this._handPos[2], y:35});
                this.positivePokerBox.addChild(selfPokerBack);
                this._handPokerList[2] = selfPokerBack;

                this._isCustomized  = isCustomized;
            }
        }
        else {
            if (isCustomized) {
                for (var pokerIndex = 0; pokerIndex < this._handPokerList.length; pokerIndex ++) {
                    this._handPokerList[pokerIndex].dispose();
                }
                this._handPokerList = [];

                var clients = App.tableManager.getTableClients();
                if (clients[this._userId] && clients[this._userId].isRubbing) {
                    isRubbing = true;
                }

                if (handPokers.length >= 3 && handPokers[2].type && handPokers[2].value && !isRubbing) {
                    //*已经翻开的了
                    this.showAllPokers({userId:userId, handPokers:handPokers});
                    return;
                }

                //*定制模式要显示前面两张牌
                //*定制模式一开始是能够显示两张手牌给别人看的
                var showHandNum = 0;
                for (var i in handPokers) {
                    var pokers = new Poker(handPokers[i], ghostList);
                    pokers.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                    pokers.setPokerScale({x:0.2, y:0.2});
                    pokers.setPokerPosition({x:this._rotatePos[showHandNum], y:35});
                    this.pokerBox.addChild(pokers);
                    this._handPokerList[showHandNum] = pokers;
                    showHandNum ++;
                }

                //*第三张是牌背
                var pokerBack = new Poker();
                pokerBack.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                pokerBack.setPokerScale({x:0.4, y:0.4});
                pokerBack.setPokerPosition({x:this._rotatePos[2], y:35});
                this.pokerBox.addChild(pokerBack);
                this._handPokerList[2] = pokerBack;
            }
            else {
                var handPokerShowLength = this._handPokerList.length;
                if (handPokerShowLength <= 0) {
                    var index;
                    for (index in handPokers) {
                        var pokerValue = handPokers[index].value;
                        var pokerType = handPokers[index].type;
                        if (pokerValue && pokerType) {
                            //*明牌了
                            poker = new Poker(handPokers[index], ghostList);
                            poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                            poker.setPokerScale({x:0.3, y:0.3});
                            poker.setPokerPosition({x:this._showPos[handPokerNum], y:35});
                            this.showPokerNode.visible = true;
                            this.showPokerNode.addChild(poker);
                            this._showPokerList.push(poker);
                        }
                        else {
                            poker = new Poker();
                            poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
                            poker.setPokerScale({x: 0.3, y: 0.3});
                            poker.setPokerPosition({x:this._rotatePos[handPokerNum], y:37});
                            poker.rotation = this._rotate[handPokerNum];
                            this.pokerBox.addChild(poker);
                            this._handPokerList[handPokerNum] = poker;
                        }
                        handPokerNum ++;
                        this._wasDealTime ++;
                    }
                }
            }
        }
    };

    RoomPlayerBox.prototype.showBidingLab = function () {
        var roomType = App.tableManager.getRoomType();
        //*房主不用显示下注中，定制模式不需要下注
        if (this._userId != App.tableManager.getRoomBanker() && roomType != Game.Game.ROOM_TYPE.CUSTOMIZED && this._userId != App.player.getId()) {
            this.bidRate.visible = true;
            this.bidRateLab.text = "下注中";
        }
    };

    RoomPlayerBox.prototype.setBidLabText = function (bidRate) {
        if (bidRate > 0 && this._userId != App.tableManager.getRoomBanker()) {
            this.bidRate.visible = true;
            this.bidRateLab.text = "×" + bidRate;
        }
        else {
            this.bidRate.visible = false;
            this.bidRateLab.text = "";
        }
    };

    RoomPlayerBox.prototype.setReadyDown = function () {
        this.setReadyIconVisible(false);
    };

    //*标记准备状态
    RoomPlayerBox.prototype.setReadyIconVisible = function (isReady) {
        var readyIconVisible = false;
        if (isReady) {
            readyIconVisible = true;
        }
        this.readyIcon.visible = readyIconVisible;
    };

    //*准备动作
    RoomPlayerBox.prototype.readyAction = function (isReady) {
        this.setReadyIconVisible(isReady);
        //*执行完成就返回说完成了，进行下一条
        App.tableManager.commandNext();
    };

    //*发牌
    RoomPlayerBox.prototype.showDealPoker = function () {
        var isSelf = this.checkIsSelf();

        var poker = new Poker();
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerScale({x: 0.3, y: 0.3});
        poker.y = 37;
        if (isSelf) {
            //*发摆正
            poker.x = this._rotatePos[this._wasDealTime];
        }
        else {
            //*要有倾斜的
            poker.x = this._rotatePos[this._wasDealTime];
            poker.rotation = this._rotate[this._wasDealTime];
        }

        this.pokerBox.addChild(poker);
        this._handPokerList[this._wasDealTime] = poker;
        this._wasDealTime ++;

        App.soundManager.playSound("pokerOptionSound");
        //*可以下一个发牌了
        App.tableManager.nextFlyPoker();
    };

    RoomPlayerBox.prototype.updateDisplay = function () {
        var roomLogUser = App.tableManager.getRoomLogUsers();
        var name = roomLogUser[this._userId].name || "游客";
        var avatar = roomLogUser[this._userId].avatar || "";
        this.headTouch.skin = avatar;
        this.nameLab.text = name;
        this.balanceLab.text = "0";
    };

    RoomPlayerBox.prototype.touchHeadIcon = function () {
        App.soundManager.playSound("btnSound");

        var isHost = App.tableManager.isRoomHost();
        var opts = {
            userID: this._userId,
            isHost: isHost
        };
        App.uiManager.showPlayerDlg(opts);
    };

    RoomPlayerBox.prototype.checkIsSelfBox = function (userId) {
        userId = userId || 0;
        var isSelfBox = false;
        if (userId == this._userId) {
            isSelfBox = true;
        }

        return isSelfBox;
    };

    //*是不是自己
    RoomPlayerBox.prototype.checkIsSelf = function () {
        var isSelf = false;
        var selfId = App.player.getId();
        if (selfId == this._userId) {
            isSelf = true;
        }
        return isSelf;
    };

    RoomPlayerBox.prototype.initEvent = function () {
        //*点击玩家头像
        this.headTouch.on(Laya.Event.CLICK, this, this.touchHeadIcon);

        App.tableManager.on(RoomTableMgr.EVENT.SHOW_HAND_POKER, this, this.showHandPokers);
        App.tableManager.on(RoomTableMgr.EVENT.BID, this, this.showBidingLab);
    };

    RoomPlayerBox.prototype.init = function() {
        this.initEvent();
        this.updateDisplay();
    };

    RoomPlayerBox.prototype.dispose = function () {
        this.removeSelf();
    };

    RoomPlayerBox.SELF_NAME_LAB_COLOR = "#40E6FF";

    RoomPlayerBox.COLOR_LAB = {
        GREED: "#7fff5c",
        RED: "#FF2626"
    };

    RoomPlayerBox.BET_LAB_POS = {
        "8": ["Left", "Left", "Right", "Bottom", "Bottom", "Bottom", "Left", "Left"],
        "10":["Left", "Left", "Right", "BottomRight", "Bottom", "Bottom", "Bottom", "BottomLeft", "Left", "Left"]
    };

    return RoomPlayerBox;
}(RoomPlayerUI));