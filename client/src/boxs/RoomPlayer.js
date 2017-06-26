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
        this._handPos       = [52, 86, 120];//*手牌的位置
        this._showPos       = [0, 50, 100];
        this._rotatePos     = [50, 60, 70];
        this._customizedPos = [82, 116, 140];

        this._isCustomized  = false; //*是否是定制模式

        this._goldLab       = null; //*分数显示的label

        this._isShowResult  = false; //*是否已经显示了最后的结算了

        this.init();
    }

    Laya.class(RoomPlayerBox, "RoomPlayerBox", _super);

    RoomPlayerBox.prototype.init = function() {
        this.initEvent();
        this.updateDisplay();
    };

    RoomPlayerBox.prototype.initEvent = function () {
        //*点击玩家头像
        this.headTouch.on(Laya.Event.CLICK, this, this.touchHeadIcon);
    };

    RoomPlayerBox.prototype.unregEvent = function () {
        this.headTouch.off(Laya.Event.CLICK, this, this.touchHeadIcon);
    };

    RoomPlayerBox.prototype.updateDisplay = function () {
        var roomLogUser = App.tableManager.getRoomLogUsers();
        var userInfo = roomLogUser[this._userId] || {};
        var name = userInfo.name || "游客";
        var avatar = userInfo.avatar || "";
        this.headTouch.skin = avatar;
        this.nameLab.text = name;
        this.balanceLab.text = "0";

        this.setIconSize();
    };

    RoomPlayerBox.prototype.setIconSize = function () {
        var selfID = App.player.getId();
        if (selfID == this._userId) {
            this.headTouch.scaleX = 1.1;
            this.headTouch.scaleY = 1.1;
            this.iconBroder.scaleX = 1.1;
            this.iconBroder.scaleY = 1.1;
        }
        else {
            this.headTouch.scaleX = 0.9;
            this.headTouch.scaleY = 0.9;
            this.iconBroder.scaleX = 0.9;
            this.iconBroder.scaleY = 0.9;
        }
    };

    //*播放音效
    RoomPlayerBox.prototype.playHandPokerSound = function (info) {
        var type                = info.pokerType;
        var fancy               = info.fancy || "normal";
        var score               = info.point || 0;
        var multiple            = Game.Game.FANCY_MULTIPLE[fancy];
        var isPlayMultipleSound = false;
        var roomInfo            = App.tableManager.getRoomInfo();
        var roomType            = roomInfo.type;

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
        
        // 定制模式不报倍数
        if (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            isPlayMultipleSound = false;
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

    RoomPlayerBox.prototype.updateGoldScroe = function () {
        var clients = App.tableManager.getRoomLogUsers();
        var gold = 0;
        if (clients[this._userId]) {
            gold = clients[this._userId].total || 0;
        }

        this.balanceLab.text = gold;
    };

    //设置下注显示和手牌显示的位置
    RoomPlayerBox.prototype.changeBetLabPos = function (posInTable) {
        posInTable = posInTable || 0;
        var roomInfo = App.tableManager.getRoomInfo();
        var maxChairs = roomInfo.maxChairs;
        var tablePos = RoomPlayerBox.BET_LAB_POS[maxChairs];
        var posNode = this.getChildByName("labPos" + tablePos[posInTable]);
        this.bidRate.x = posNode.x;
        this.bidRate.y = posNode.y;
        var handPokerPos = RoomPlayerBox.HAND_POKER_POS[maxChairs];
        var handPokerSprite = this.getChildByName("handPokerPos" + handPokerPos[posInTable]);
        this.pokerBox.x = handPokerSprite.x;
        this.pokerBox.y = handPokerSprite.y;
    };

    RoomPlayerBox.prototype.initShowResultTag = function () {
        this._isShowResult = false;
        this.cleanHandPokerShow();
        this.cleanPokersOfShowPlayer();
        //*结算
        this.removeGoldLab();
    };

    RoomPlayerBox.prototype.cleanShow = function () {
        //this._isShowResult = false;
        //*下注
        this.setBidStateShow(false);
        //*手牌
        this.cleanHandPokerShow();
        this.cleanPokersOfShowPlayer();
        //*结算
        this.removeGoldLab();

        this._wasDealTime = 0;
    };

    RoomPlayerBox.prototype.removeGoldLab = function () {
        if (this._goldLab) {
            this._goldLab.removeSelf();
            this._goldLab = null;
        }
        this.pokerType.visible = false;
    };

    RoomPlayerBox.prototype.showGoldLab = function (gold, txt) {
        var color = RoomPlayerBox.COLOR_LAB.GREED;
        var font = "win";

        if (gold < 0) {
            color = RoomPlayerBox.COLOR_LAB.RED;
            font = "lost";
        }
        else if (gold > 0) {
            gold = "+" + gold;
        }

        if (this._goldLab) {
            this._goldLab.text = gold;
            this._goldLab.color = color;
            this._goldLab.font = font;
            return;
        }

        if (typeof (txt) == "number") {
            this.pokerType.visible = true;
            var textName = RoomPlayerBox.POINT_NAME[txt];
            this.pokerTypeName.skin = "assets/ui.room/resultLab/" + textName + ".png";
        }
        else if (typeof (txt) == "string"){
            this.pokerType.visible = true;
            this.pokerTypeName.skin = "assets/ui.room/resultLab/" + txt + ".png";
        }

        var lab = new Laya.Label();
        lab.text = gold;
        lab.color = color;
        lab.font = font;
        lab.align = "center";
        lab.anchorX = 0.5;
        lab.anchorY = 0.5;
        lab.scaleX = 1.5;
        lab.scaleY = 1.5;
        lab.x = this.width/2;
        lab.y = this.height/2;
        this.addChild(lab);
        this._goldLab = lab;
        var moveBy = MoveBy.create(0.5, 0, - 125);
        App.actionManager.addAction(moveBy, lab);
    };

    RoomPlayerBox.prototype.createResultPokerOfOther = function (num, handPokers, ghostPokers) {
        num = num || 0;
        if (!handPokers) {
            return;
        }

        var pokerCount = handPokers.length;
        var centerPosX = this.showPokerNode.width/2;
        var scaleNum = 0.22;
        var sizeNum = 219;
        var posX = 0;
        if (pokerCount == 2) {
            posX = centerPosX + (num - 1) * ((sizeNum * scaleNum) / 2) + 10;
        }
        else if (pokerCount == 3) {
            posX = centerPosX + (num - 1) * ((sizeNum * scaleNum) / 2);
        }

        ghostPokers = ghostPokers || [];
        var pokerInfo = handPokers[num];
        var poker = new Poker(pokerInfo, ghostPokers);
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerScale({x:scaleNum, y:scaleNum});
        poker.setPokerPosition({x:posX, y:55});
        this.showPokerNode.addChild(poker);
        this._showPokerList[num] = poker;
    };

    RoomPlayerBox.prototype.createResultPokerOfSelf = function (num, handPokers, ghostPokers) {
        num = num || 0;
        if (!handPokers) {
            return;
        }

        var pokerInfo = handPokers[num];
        var poker = new Poker(pokerInfo, ghostPokers);
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerScale({x:0.3, y:0.3});
        poker.setPokerPosition({x:this._handPos[num], y:28});
        this.positivePokerBox.addChild(poker);
        this._handPokerList[num] = poker;
    };

    //*明牌显示
    RoomPlayerBox.prototype.showAllPokers = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var clients = table.clients || {};
        var isSelfBox = (App.player.getId() == this._userId);
        if (clients[this._userId]) {
            this.cleanHandPokerShow();
            this.cleanPokersOfShowPlayer();

            var handPokers = clients[this._userId].handPokers || [];
            var ghostPokers = table.ghostPokers || [];

            for (var num = 0; num < handPokers.length; num++) {
                if (isSelfBox) {
                    this.createPokerOfSelfCanSee(num);
                }
                else {
                    this.createResultPokerOfOther(num, handPokers, ghostPokers);
                }
            }
        }
    };

    //*恢复状态时候显示结果
    RoomPlayerBox.prototype.showResult = function () {
        var isSelfBox = (App.player.getId() == this._userId);
        var roomInfo = App.tableManager.getRoomInfo();
        var roomLog = roomInfo.roomLog || {};
        var roundLog = roomLog.rounds || {};
        var round = roomInfo.round - 1;

        var roundInfo = roundLog[round] || {};
        var lastRoundInfo = roundInfo.clients || {};
        var ghostPokers = roundInfo.ghostPokers || [];

        this.cleanHandPokerShow();
        this.cleanPokersOfShowPlayer();

        var userResult = lastRoundInfo[this._userId];
        if (userResult == null) {
            return;
        }

        var handPokers      = userResult.handPokers || [];
        var pokerLength     = handPokers.length;
        var gold            = userResult.gold || 0;
        var pokerType       = userResult.type;
        var modelNames      = Game.Game.POKER_MODEL_NAMES;
        var txt             = modelNames[pokerType];
        var point           = userResult.point;

        //*显示手牌
        for (var num = 0; num < pokerLength ; num++) {
            if (isSelfBox) {
                this.createResultPokerOfSelf(num, handPokers, ghostPokers);
            }
            else {
                this.createResultPokerOfOther(num, handPokers, ghostPokers);
            }
        }

        if (pokerType == "point") {
            txt = point % 10;
        }
        //*显示分数
        this.showGoldLab(gold, txt);

        if (!this._isShowResult) {
            if (App.player.getId() == this._userId) {
                //*播放声音
                var info = {
                    pokerType: pokerType,
                    fancy:     lastRoundInfo[this._userId].fancy,
                    point:     point
                };
                this.playHandPokerSound(info);
            }
        }

        this._isShowResult = true;
    };

    RoomPlayerBox.prototype.showBankerStatePoker = function (whoRubbing) {
        whoRubbing = whoRubbing || 0;
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var clients = App.tableManager.getClients() || {};
        var roundLog = table.roundLog || {};
        var clientsOfRoundLog = roundLog.clients || {};
        var roomType = roomInfo.type;
        var isCustomized = (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED);
        var selfId = App.player.getId();

        if (!clients[this._userId]) {
            return;
        }

        this.cleanHandPokerShow();
        this.cleanPokersOfShowPlayer();

        var isSelfBox = (App.player.getId() == this._userId);
        var handPokers = clients[this._userId].handPokers || [];
        var handPokerLength = handPokers.length;
        var num = 0;
        var ghostPokers;

        if (isCustomized) {
            if (handPokerLength <= 2) {
                for (num = 0; num < 3; num ++) {
                    if (isSelfBox) {
                        this.createPokerOfSelfByCustomized(num);
                    }
                    else {
                        this.createPokerIfOtherByCustomized(num);
                    }
                }
            }
            else {
                for (num = 0; num < 3; num ++) {
                    if (isSelfBox){
                        this.createPokerOfSelfByCustomized(num, whoRubbing);
                    }
                    else {
                        if (whoRubbing <= 0 && whoRubbing != this._userId) {
                            this.createResultPokerOfOther(num, handPokers);
                        }
                        else {
                            this.createPokerIfOtherByCustomized(num, whoRubbing);
                        }
                    }
                }
            }

            return;
        }

        if (clientsOfRoundLog[this._userId] && whoRubbing <= 0) {
            //*有就是开补的了
            handPokers = clientsOfRoundLog[this._userId].handPokers;
            for (var index = 0; index < handPokers.length; index ++) {
                if (isSelfBox) {
                    this.createPokerOfSelfCanSee(index);
                }
                else {
                    ghostPokers = table.ghostPokers || [];
                    this.createResultPokerOfOther(index, handPokers, ghostPokers);
                }

                var gold = clientsOfRoundLog[this._userId].gold;
                var pokerType = clientsOfRoundLog[this._userId].type;
                var modelNames = Game.Game.POKER_MODEL_NAMES;
                var txt = modelNames[pokerType];
                var point = clientsOfRoundLog[this._userId].point;

                if (pokerType == "point") {
                    txt = point % 10;
                }
                //*显示分数
                this.showGoldLab(gold, txt);
            }
        }
        else {
            //*没有开补的
            for (num = 0; num < handPokerLength; num ++) {
                if (isSelfBox) {
                    if (whoRubbing == this._userId) {
                        if (num > 1) {
                            continue;
                        }
                    }
                    this.createPokerOfSelfCanSee(num);
                }
                else {
                    //是不是有明牌
                    if (handPokers[num].showTarget >= Game.Poker.SHOW_TARGET.ALL
                        && handPokers[num].type
                        && handPokers[num].value
                    ) {
                        ghostPokers = table.ghostPokers || [];
                        this.createResultPokerOfOther(num, handPokers, ghostPokers);
                    }
                    else {
                        this.createBackPokerInHand(num);
                    }
                }
            }
        }
    };

    RoomPlayerBox.prototype.cleanPokersOfShowPlayer = function () {
        for (var i = 0; i < this._showPokerList.length; i ++) {
            if (this._showPokerList[i]) {
                this._showPokerList[i].dispose();
            }
        }
        this._showPokerList = [];
    };

    RoomPlayerBox.prototype.cleanHandPokerShow = function () {
        for (var i = 0 ; i < this._handPokerList.length; i ++) {
            if (this._handPokerList[i]) {
                this._handPokerList[i].dispose();
            }
        }
        this._handPokerList = [];
    };

    //*补牌给自己看的
    RoomPlayerBox.prototype.showOutsPoker = function () {
        if (this._isShowResult) {
            return;
        }

        var selfId = App.player.getId();
        var isSelfBox = (selfId == this._userId);

        this.cleanHandPokerShow();
        this.cleanPokersOfShowPlayer();

        var i = 0;
        if (isSelfBox) {
            //*自己显示第三张牌
            for (i = 0; i < 3; i ++) {
                this.createPokerOfSelfCanSee(i);
            }
        }
        else {
            //*别人的只能看见牌背
            for (i = 0; i < 3; i ++) {
                this.createBackPokerInHand(i);
            }
        }
    };

    RoomPlayerBox.prototype.createPokerIfOtherByCustomized = function (index, whoRubbing) {
        var clients = App.tableManager.getClients() || {};
        whoRubbing = whoRubbing || 0;
        var isShowLastPoker = true;

        if (index == 2 && whoRubbing > 0 && whoRubbing == this._userId) {
            isShowLastPoker = false;
        }

        if (!clients[this._userId]) {
            return;
        }

        var handPokers = clients[this._userId].handPokers || [];
        var pokerInfo = handPokers[index];
        var poker;
        if (pokerInfo && isShowLastPoker) {
            poker = new Poker(pokerInfo, {});
            poker.setPokerScale({x:0.23, y:0.23});
        }
        else {
            poker = new Poker();
            poker.setPokerScale({x:0.45, y:0.45});
        }
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerPosition({x:this._customizedPos[index], y:28});
        this.positivePokerBox.addChild(poker);
        this._handPokerList[index] = poker;
    };

    //*定制模式下自己的手牌
    RoomPlayerBox.prototype.createPokerOfSelfByCustomized = function (index, whoRubbing) {
        var clients = App.tableManager.getClients() || {};
        whoRubbing = whoRubbing || 0;
        var isShowLastPoker = true;
        var selfId = App.player.getId();

        if (index == 2 && whoRubbing > 0 && selfId == whoRubbing) {
            isShowLastPoker = false;
        }

        if (!clients[this._userId]) {
            return;
        }

        var handPokers = clients[this._userId].handPokers || [];
        var pokerInfo = handPokers[index];
        var poker;
        if (pokerInfo && isShowLastPoker) {
            poker = new Poker(pokerInfo, {});
            poker.setPokerScale({x:0.3, y:0.3});
        }
        else {
            poker = new Poker();
            poker.setPokerScale({x:0.6, y:0.6});
        }
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerPosition({x:this._handPos[index], y:28});
        this.positivePokerBox.addChild(poker);
        this._handPokerList[index] = poker;
    };

    RoomPlayerBox.prototype.createPokerOfSelfCanSee = function (index) {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var ghostPokers = table.ghostPokers || [];
        var clients = table.clients || {};
        var selfId = App.player.getId();

        if (!clients[selfId]) {
            return;
        }
        var pokerInfo = clients[selfId].handPokers[index];
        var poker = new Poker(pokerInfo, ghostPokers);
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerScale({x:0.3, y:0.3});
        poker.setPokerPosition({x:this._handPos[index], y:28});
        this.positivePokerBox.addChild(poker);
        this._handPokerList[index] = poker;
    };

    //*牌背的创建
    RoomPlayerBox.prototype.createBackPokerInHand = function (index) {
        var isSelf = this.checkIsSelf();

        var poker = new Poker();
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerScale({x: 0.3, y: 0.3});
        poker.y = 37;

        if (isSelf) {
            //*发摆正
            poker.x = this._rotatePos[index];
        }
        else {
            //*要有倾斜的
            poker.x = this._rotatePos[index];
            poker.rotation = this._rotate[index];
        }

        this.pokerBox.addChild(poker);
        this._handPokerList[index] = poker;
    };

    //*显示下注状态下的手牌
    RoomPlayerBox.prototype.showBidPoker = function (bidInfo) {
        var bid             = bidInfo.bid ? true : false;
        var bidRate         = bidInfo.bidRate;
        var selfId          = App.player.getId();
        var isSelfShow      = (selfId == this._userId);
        var roomInfo        = App.tableManager.getRoomInfo();
        var roomType        = roomInfo.type;
        var isCustomized    = (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED);
        var showBackCount   = isCustomized ? 3 : 2;

        this.cleanHandPokerShow();
        this.cleanPokersOfShowPlayer();

        var num = 0;
        if (isSelfShow) {
            if (bid && bidRate > 0) {
                //*下注了就可以显示自己的牌
                for (num = 0; num < showBackCount; num ++) {
                    if (isCustomized) {
                        //*定制模式
                        this.createPokerOfSelfByCustomized(num);
                    }
                    else {
                        this.createPokerOfSelfCanSee(num);
                    }
                }
            }
            else {
                //*显示牌背
                for (num = 0; num < showBackCount; num ++) {
                    this.createBackPokerInHand(num);
                }
            }
        }
        else {
            //*显示别人的牌背
            for (num = 0; num < showBackCount; num ++) {
                if (isCustomized) {

                }
                else {
                    this.createBackPokerInHand(num);
                }
            }
        }
    };

    //*搓牌状态
    RoomPlayerBox.prototype.setRubbedState = function (rubbing) {
        rubbing = rubbing ? true : false;
        this.rubbedTag.visible = rubbing;
    };

    //*离线状态
    RoomPlayerBox.prototype.setAfkSate = function (isAfk) {
        isAfk = isAfk ? true : false;
        if (isAfk) {
            //*离线了
            this.afkTag.visible = true;
            this.setReady(false);
            if (this.bettingLab.visible || this.rubbedTag.visible) {
                this.afkTag.y = 25;
                this.bettingLab.y = 59;
                this.rubbedTag.y = 59;
            }
            else {
                this.afkTag.y = 48;
                this.bettingLab.y = 48;
                this.rubbedTag.y = 48;
            }
        }
        else {
            this.afkTag.visible = false;
            this.afkTag.y = 48;
            this.bettingLab.y = 48;
            this.rubbedTag.y = 48;
        }
    };

    //*下注状态
    RoomPlayerBox.prototype.setBidStateShow = function (isShow, bidInfo) {
        isShow = isShow ? true : false;
        var selfId = this._userId;
        var roomInfo = App.tableManager.getRoomInfo();
        var roomSetting = roomInfo.settings || {};
        var roomBanker = roomInfo.banker;
        var roomType = roomInfo.type;
        var gameRoomType = Game.Game.ROOM_TYPE;
        var cantShowRoomType = (roomType == gameRoomType.CHAOS || roomType == gameRoomType.CUSTOMIZED);
        var selfIsBanker = (selfId == roomBanker);
        if (isShow) {
            var bid = bidInfo.bid;
            var bidRate = bidInfo.bidRate;

            if (bid && bidRate) {
                //*显示下注金额
                if (!selfIsBanker || cantShowRoomType) {
                    this.bidRateLab.text = "×" + bidRate;
                    this.bidRate.visible = true;
                    this.bettingLab.visible = false;
                }
                else{
                    this.bidRate.visible = false;
                }
            }
            else {
                //*显示下注中
                if (!selfIsBanker || cantShowRoomType) {
                    if (roomSetting.chaosBet == false && roomType == gameRoomType.CHAOS) {
                        this.bettingLab.visible = false;
                    }
                    else {
                        this.bettingLab.visible = true;
                    }
                    this.bidRate.visible = false;
                    this.bidRateLab.text = "";
                }
                else{
                    this.bettingLab.visible = false;
                    this.bidRate.visible = false;
                }
            }
        }
        else {
            this.bidRate.visible = false;
        }
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
        this._handPokerList.push(poker);
        this._wasDealTime ++;

        App.soundManager.playSound("pokerOptionSound");
    };

    //*显示玩家信息
    RoomPlayerBox.prototype.touchHeadIcon = function () {
        App.soundManager.playSound("btnSound");

        var roomInfo = App.tableManager.getRoomInfo();
        var host = roomInfo.host;
        var selfId = App.player.getId();
        var isHost = (selfId == host);

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

    RoomPlayerBox.prototype.setReady = function (isReady) {
        isReady = isReady ? true : false;
        this.readyIcon.visible = isReady;
    };

    RoomPlayerBox.prototype.dispose = function () {
        this.removeSelf();
    };

    RoomPlayerBox.prototype.onClosed = function () {
        this.unregEvent();
    };

    RoomPlayerBox.SELF_NAME_LAB_COLOR = "#40E6FF";

    RoomPlayerBox.COLOR_LAB = {
        GREED: "#7fff5c",
        RED: "#FF2626"
    };

    RoomPlayerBox.BET_LAB_POS = {
        "8": ["Left", "Left", "Right", "Bottom", "Bottom", "Bottom", "Left", "Left"]
    };

    RoomPlayerBox.HAND_POKER_POS = {
        "8": ["Left", "Left", "Right", "Left", "Left", "Left","Left","Left"]
    };

    RoomPlayerBox.POINT_NAME = [
        "bung",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
    ];

    return RoomPlayerBox;
}(RoomPlayerUI));