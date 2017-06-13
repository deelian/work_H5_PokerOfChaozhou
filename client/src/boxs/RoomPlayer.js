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

        this._isShowResult  = false; //*是否已经显示了最后的结算了

        this.init();
    }

    Laya.class(RoomPlayerBox, "RoomPlayerBox", _super);




    //
    ////*播放音效
    //RoomPlayerBox.prototype.playHandPokerSound = function (info) {
    //    var type                = info.pokerType;
    //    var fancy               = info.fancy || "normal";
    //    var score               = info.point || 0;
    //    var multiple            = Game.Game.FANCY_MULTIPLE[fancy];
    //    var isPlayMultipleSound = false;
    //    //var roomType            = App.tableManager.getRoom().type;
    //
    //    var soundName   = "";
    //    if (type != Game.Game.POKER_MODELS.POINT && roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
    //        soundName = type;
    //        if (type == Game.Game.POKER_MODELS.GOD_EIGHT || type == Game.Game.POKER_MODELS.GOD_NINE) {
    //            isPlayMultipleSound = true;
    //        }
    //    }
    //    else {
    //        var pokerPoint = score % 10;
    //        soundName = GameRoomView.POINT_NAME[pokerPoint];
    //        isPlayMultipleSound = true;
    //    }
    //    var self = this;
    //    var complete = new Laya.Handler(this, function () {
    //        var subSound = "";
    //        if (multiple == 2) {
    //            subSound = "double";
    //        }
    //        else if (multiple == 3) {
    //            subSound = "triple";
    //        }
    //        App.soundManager.playSound(subSound);
    //    });
    //
    //    if (isPlayMultipleSound && multiple > 1) {
    //        App.soundManager.playSound(soundName, complete);
    //    }
    //    else {
    //        App.soundManager.playSound(soundName);
    //    }
    //};
    //
    ////*结束状态
    //RoomPlayerBox.prototype.endRound = function (isEnd) {
    //    if (isEnd) {
    //
    //        this._wasDealTime = 0;
    //        //*倍数消除
    //        this.setBidLabText(0);
    //        //this.setReadyDown();
    //
    //        //*手牌
    //        for (var handPokerIndex = 0;  handPokerIndex < this._handPokerList.length; handPokerIndex ++) {
    //            if (this._handPokerList[handPokerIndex]) {
    //                this._handPokerList[handPokerIndex].dispose();
    //            }
    //        }
    //        this._handPokerList = [];
    //
    //        //*显示的poker
    //        for (var showIndex = 0; showIndex < this._showPokerList.length; showIndex ++) {
    //            if (this._showPokerList[showIndex]) {
    //                this._showPokerList[showIndex].dispose();
    //            }
    //        }
    //        this._showPokerList = [];
    //
    //        this.showPokerNode.visible = false;
    //        this.pokerBox.visible = true;
    //
    //        this.removeGoldLab();
    //    }
    //};
    //


    //RoomPlayerBox.prototype.setGoldLabText = function (gold) {
    //    gold = gold || 0;
    //    this.balanceLab.text = gold;
    //};

    //
    ////*显示所有牌
    //RoomPlayerBox.prototype.showAllPokerToOther = function (gambleInfo, isShowAll) {
    //    //*isShowAll 是否是明牌
    //    var userId = gambleInfo.userId;
    //    var isShowResult = gambleInfo.isShowResult ? true : false;
    //
    //    var handPokers;
    //    var showInfo;
    //    if (!isShowAll) {
    //        showInfo = gambleInfo.info;
    //        handPokers = showInfo.handPokers || [];
    //    }
    //    else {
    //        handPokers = gambleInfo.handPokers || [];
    //    }
    //
    //    var isSelfBox = this.checkIsSelfBox(userId);
    //    var isSelf = this.checkIsSelf();
    //    if (isSelfBox) {
    //        //*定制模式翻开第三张牌
    //        if (isSelf && this._isCustomized) {
    //            var lastPoker = this._handPokerList[2];
    //            var lastPokerInfo = handPokers[2];
    //            lastPoker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //            lastPoker.setPokerScale({x:0.3, y:0.3});
    //            lastPoker.setPokerPosition({x:this._handPos[2], y:35});
    //            lastPoker.changePokerSkin(Poker.POKER_TYPE.POSITIVE, lastPokerInfo);
    //        }
    //
    //        if (isSelf && isShowResult) {
    //            for (var pokerBackIndex = 0; pokerBackIndex < this._handPokerList.length; pokerBackIndex ++) {
    //                this._handPokerList[pokerBackIndex].dispose();
    //            }
    //            this._handPokerList = [];
    //
    //            var handPokerNum = 0;
    //            for (var index in handPokers) {
    //                var resultPokerInfo = handPokers[index];
    //                var resultPoker = new Poker(resultPokerInfo);
    //                resultPoker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //                resultPoker.setPokerScale({x:0.3, y:0.3});
    //                resultPoker.setPokerPosition({x:this._handPos[handPokerNum], y:35});
    //                this.positivePokerBox.addChild(resultPoker);
    //                this._handPokerList[handPokerNum] = resultPoker;
    //                handPokerNum ++;
    //            }
    //        }
    //
    //        //*自己就不用在做了
    //        if (!isSelf) {
    //            //*别人显示出来
    //            //*去掉别人的手牌牌背
    //            for (var handPokerIndex = 0; handPokerIndex < this._handPokerList.length; handPokerIndex ++) {
    //                if (this._handPokerList[handPokerIndex]) {
    //                    this._handPokerList[handPokerIndex].dispose();
    //                }
    //            }
    //            this._handPokerList = [];
    //            this.pokerBox.visible = false;
    //
    //            var posList = [];
    //            var pokerCount = handPokers.length;
    //            var centerPosX = this.showPokerNode.width/2;
    //            if (pokerCount == 2) {
    //                for (var tempNum = 0; tempNum < pokerCount; tempNum ++) {
    //                    var posX = centerPosX + (tempNum - 1) * ((219 * 0.22) / 2) + 10;
    //                    posList.push(posX);
    //                }
    //            }
    //            else if (pokerCount == 3) {
    //                for (var tempIndex = 0; tempIndex < pokerCount; tempIndex ++) {
    //                    var posX = centerPosX + (tempIndex - 1) * ((219 * 0.22) / 2);
    //                    posList.push(posX);
    //                }
    //            }
    //
    //            var pokerIndex;
    //            var pokerNum = 0;
    //            for (pokerIndex in handPokers) {
    //                var pokerInfo = handPokers[pokerIndex];
    //                //var ghostList = App.tableManager.getGhostInTable();
    //                var poker = new Poker(pokerInfo, ghostList);
    //                poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //                poker.setPokerScale({x:0.22, y:0.22});
    //                poker.setPokerPosition({x:posList[pokerNum], y:40});
    //                this.showPokerNode.visible = true;
    //                this.showPokerNode.addChild(poker);
    //                this._showPokerList.push(poker);
    //                pokerNum ++;
    //            }
    //        }
    //    }
    //
    //    //*自己才会播放音效
    //    if (userId == App.player.getId() && !isShowAll) {
    //        this.playHandPokerSound(showInfo);
    //    }
    //};
    //

    //
    ////*显示手牌
    //RoomPlayerBox.prototype.showHandPokers = function (opt) {
    //    var userId          = opt.userId;
    //    var handPokers      = opt.info || {}; //*手牌
    //    var isCustomized    = opt.isCustomized; //*是否是定制模式
    //
    //    var isSelfBox = this.checkIsSelfBox(userId);
    //    if (!isSelfBox) {
    //        return;
    //    }
    //
    //    //var ghostList = App.tableManager.getGhostInTable();
    //    var isSelf = this.checkIsSelf();
    //    var poker;
    //    var handPokerNum = 0;
    //    var isRubbing = false;
    //    if (isSelf) {
    //        //*给自己看
    //        //*先删除发牌的牌背
    //        for (var pokerBackIndex = 0; pokerBackIndex < this._handPokerList.length; pokerBackIndex ++) {
    //            this._handPokerList[pokerBackIndex].dispose();
    //        }
    //        this._handPokerList = [];
    //        //*创建扑克
    //        var handPokerIndex;
    //
    //        var clients = App.tableManager.getTableClients();
    //        if (clients[this._userId] && clients[this._userId].isRubbing) {
    //            isRubbing = true;
    //        }
    //
    //        for (handPokerIndex in handPokers) {
    //            var pokerInfo = handPokers[handPokerIndex];
    //            //*手上有三张牌，但是第三张牌正在搓牌的时候就不出现在手牌上
    //            if (handPokerIndex >= 2 && isRubbing) {
    //                break;
    //            }
    //            poker = new Poker(pokerInfo, ghostList);
    //            poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //            poker.setPokerScale({x:0.3, y:0.3});
    //            poker.setPokerPosition({x:this._handPos[handPokerNum], y:35});
    //            this.positivePokerBox.addChild(poker);
    //            this._handPokerList[handPokerNum] = poker;
    //            handPokerNum ++;
    //        }
    //
    //        if (isCustomized) {
    //            //*第三张是牌背
    //            var selfPokerBack = new Poker();
    //            selfPokerBack.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //            selfPokerBack.setPokerScale({x:0.6, y:0.6});
    //            selfPokerBack.setPokerPosition({x:this._handPos[2], y:35});
    //            this.positivePokerBox.addChild(selfPokerBack);
    //            this._handPokerList[2] = selfPokerBack;
    //
    //            this._isCustomized  = isCustomized;
    //        }
    //    }
    //    else {
    //        if (isCustomized) {
    //            for (var pokerIndex = 0; pokerIndex < this._handPokerList.length; pokerIndex ++) {
    //                this._handPokerList[pokerIndex].dispose();
    //            }
    //            this._handPokerList = [];
    //
    //            var clients = App.tableManager.getTableClients();
    //            if (clients[this._userId] && clients[this._userId].isRubbing) {
    //                isRubbing = true;
    //            }
    //
    //            if (handPokers.length >= 3 && handPokers[2].type && handPokers[2].value && !isRubbing) {
    //                //*已经翻开的了
    //                this.showAllPokers({userId:userId, handPokers:handPokers});
    //                return;
    //            }
    //
    //            //*定制模式要显示前面两张牌
    //            //*定制模式一开始是能够显示两张手牌给别人看的
    //            var showHandNum = 0;
    //            for (var i in handPokers) {
    //                var pokers = new Poker(handPokers[i], ghostList);
    //                pokers.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //                pokers.setPokerScale({x:0.2, y:0.2});
    //                pokers.setPokerPosition({x:this._rotatePos[showHandNum], y:35});
    //                this.pokerBox.addChild(pokers);
    //                this._handPokerList[showHandNum] = pokers;
    //                showHandNum ++;
    //            }
    //
    //            //*第三张是牌背
    //            var pokerBack = new Poker();
    //            pokerBack.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //            pokerBack.setPokerScale({x:0.4, y:0.4});
    //            pokerBack.setPokerPosition({x:this._rotatePos[2], y:35});
    //            this.pokerBox.addChild(pokerBack);
    //            this._handPokerList[2] = pokerBack;
    //        }
    //        else {
    //            var handPokerShowLength = this._handPokerList.length;
    //            if (handPokerShowLength <= 0) {
    //                var index;
    //                for (index in handPokers) {
    //                    var pokerValue = handPokers[index].value;
    //                    var pokerType = handPokers[index].type;
    //                    if (pokerValue && pokerType) {
    //                        //*明牌了
    //                        poker = new Poker(handPokers[index], ghostList);
    //                        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //                        poker.setPokerScale({x:0.3, y:0.3});
    //                        poker.setPokerPosition({x:this._showPos[handPokerNum], y:35});
    //                        this.showPokerNode.visible = true;
    //                        this.showPokerNode.addChild(poker);
    //                        this._showPokerList.push(poker);
    //                    }
    //                    else {
    //                        poker = new Poker();
    //                        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
    //                        poker.setPokerScale({x: 0.3, y: 0.3});
    //                        poker.setPokerPosition({x:this._rotatePos[handPokerNum], y:37});
    //                        poker.rotation = this._rotate[handPokerNum];
    //                        this.pokerBox.addChild(poker);
    //                        this._handPokerList[handPokerNum] = poker;
    //                    }
    //                    handPokerNum ++;
    //                    this._wasDealTime ++;
    //                }
    //            }
    //        }
    //    }
    //};
    //

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

    RoomPlayerBox.prototype.cleanShow = function () {
        this._isShowResult = false;
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
    };

    RoomPlayerBox.prototype.showGoldLab = function (gold, txt) {
        var color = RoomPlayerBox.COLOR_LAB.GREED;
        if (gold < 0) {
            color = RoomPlayerBox.COLOR_LAB.RED;
        }
        if (this._goldLab) {
            this._goldLab.text = gold + " : " + txt
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

    RoomPlayerBox.prototype.createResultPokerOfOther = function (num, handPokers, ghostPokers) {
        num = num || 0;
        if (!handPokers) {
            return;
        }

        var pokerInfo = handPokers[num];
        var poker = new Poker(pokerInfo, ghostPokers);
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerScale({x:0.3, y:0.3});
        poker.setPokerPosition({x:this._showPos[num], y:35});
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
        poker.setPokerPosition({x:this._handPos[num], y:35});
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
            var ghostPokers = roomInfo.ghostPokers || [];

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
        if (this._isShowResult) {
            //*已经显示了结果就不用再显示了
            return;
        }

        this._isShowResult = true;

        var isSelfBox = (App.player.getId() == this._userId);
        var roomInfo = App.tableManager.getRoomInfo();
        var roomLog = roomInfo.roomLog || {};
        var roundLog = roomLog.rounds || {};
        var round = roomInfo.round - 1;

        var lastRoundInfo = roundLog[round].clients || {};
        var ghostPokers = roundLog[round].ghostPokers || [];
        var handPokers = [];
        if (lastRoundInfo[this._userId]) {
            handPokers = lastRoundInfo[this._userId].handPokers || [];
        }
        var pokerLength = handPokers.length;

        this.cleanHandPokerShow();
        this.cleanPokersOfShowPlayer();

        //*显示手牌
        for (var num = 0; num < pokerLength ; num++) {
            if (isSelfBox) {
                this.createResultPokerOfSelf(num, handPokers, ghostPokers);
            }
            else {
                this.createResultPokerOfOther(num, handPokers, ghostPokers);
            }
        }

        var gold = lastRoundInfo[this._userId].gold;
        var pokerType = lastRoundInfo[this._userId].type;
        var modelNames = Game.Game.POKER_MODEL_NAMES;
        var txt = modelNames[pokerType];
        var point = lastRoundInfo[this._userId].point;

        if (pokerType == "point") {
            txt += (" " + point % 10 + "点");
        }
        //*显示分数
        this.showGoldLab(gold, txt);
    };

    RoomPlayerBox.prototype.showBankerStatePoker = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var clients = App.tableManager.getClients() || {};
        var roundLog = table.roundLog || {};
        var clientsOfRoundLog = roundLog.clients || {};

        if (!clients[this._userId]) {
            return;
        }

        this.cleanHandPokerShow();

        var isSelfBox = (App.player.getId() == this._userId);
        var handPokers = clients[this._userId].handPokers || [];
        var handPokerLength = handPokers.length;
        var num = 0;

        if (clientsOfRoundLog[this._userId]) {
            //*有就是开补的了
            handPokers = clientsOfRoundLog[this._userId].handPokers;
            for (var index = 0; index < handPokers.length; index ++) {
                if (isSelfBox) {
                    this.createPokerOfSelfCanSee(index);
                }
                else {
                    this.createResultPokerOfOther(index, handPokers, ghostPokers);
                }

                var gold = clientsOfRoundLog[this._userId].gold;
                var pokerType = clientsOfRoundLog[this._userId].type;
                var modelNames = Game.Game.POKER_MODEL_NAMES;
                var txt = modelNames[pokerType];
                var point = clientsOfRoundLog[this._userId].point;

                if (pokerType == "point") {
                    txt += (" " + point % 10 + "点");
                }
                //*显示分数
                this.showGoldLab(gold, txt);
            }
        }
        else {
            //*没有开补的
            for (num = 0; num < handPokerLength; num ++) {
                if (isSelfBox) {
                    this.createPokerOfSelfCanSee(num);
                }
                else {
                    //是不是有明牌
                    if (handPokers[num].type && handPokers[num].value && Object.keys(clientsOfRoundLog).length <= 0) {
                        var ghostPokers = roomInfo.ghostPokers || [];
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

    RoomPlayerBox.prototype.createPokerOfSelfCanSee = function (index) {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var ghostPokers = roomInfo.ghostPokers || [];
        var clients = table.clients || {};
        var selfId = App.player.getId();

        if (!clients[selfId]) {
            return;
        }

        var pokerInfo = clients[selfId].handPokers[index];
        var poker = new Poker(pokerInfo, ghostPokers);
        poker.setPokerAnchor({anchorX:0.5, anchorY:0.5});
        poker.setPokerScale({x:0.3, y:0.3});
        poker.setPokerPosition({x:this._handPos[index], y:35});
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

        var num = 0;
        if (isSelfShow) {
            if (bid && bidRate > 0) {
                //*下注了就可以显示自己的牌
                for (num = 0; num < showBackCount; num ++) {
                    if (isCustomized) {
                        //*定制模式
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
        }
        else {
            this.afkTag.visible = false;
        }
    };

    //*下注状态
    RoomPlayerBox.prototype.setBidStateShow = function (isShow, bidInfo) {
        isShow = isShow ? true : false;
        var selfId = this._userId;
        var roomInfo = App.tableManager.getRoomInfo();
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
                    this.bettingLab.visible = true;
                    this.bidRate.visible = true;
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
        this._handPokerList[this._wasDealTime] = poker;
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

    RoomPlayerBox.prototype.updateDisplay = function () {
        var roomLogUser = App.tableManager.getRoomLogUsers();
        var userInfo = roomLogUser[this._userId] || {};
        var name = userInfo.name || "游客";
        var avatar = userInfo.avatar || "";
        this.headTouch.skin = avatar;
        this.nameLab.text = name;
        this.balanceLab.text = "0";
    };

    RoomPlayerBox.prototype.initEvent = function () {
        //*点击玩家头像
        this.headTouch.on(Laya.Event.CLICK, this, this.touchHeadIcon);
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
        "8": ["Left", "Left", "Right", "Bottom", "Bottom", "Bottom", "Left", "Left"]
    };

    RoomPlayerBox.HAND_POKER_POS = {
        "8": ["Left", "Left", "Right", "Left", "Left", "Left","Left","Left"]
    };

    return RoomPlayerBox;
}(RoomPlayerUI));