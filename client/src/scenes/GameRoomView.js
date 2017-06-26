/**
 * 游戏房间界面
 */
//*离开房间，站起锁定，灯光优化,站起坐下
var GameRoomView = (function(_super) {
    function GameRoomView(roomData) {
        GameRoomView.super(this);

        //console.log(roomData);

        this._deckNodeShow          = null;
        this._ghostBoxShow          = null;
        this._lightBoxShow          = null;

        this._playerSpriteList      = []; //*玩家信息显示的位置
        this._userPosInTable        = []; //*玩家在桌子上的位置
        this._sitTagList            = []; //*坐下标志
        this._betBtnList            = []; //*下注按钮
        this._lightList             = []; //*灯光
        this._playerBoxList         = {};
        this._ghostList             = [];
        this._showGhostList         = [];
        this._bankerId              = 0;

        this._canShowEffort         = false; //*是否能显示房间，上一局战绩
        this._bankerTagImg          = null;

        this._isLockRoom            = false;

        this._pokerImgList          = [];
        this._dealUser              = 0;
        this._dealRound             = 1;

        this._canUpdateGhostPoker   = true;
        this._selfChariId           = 0; //玩家自己的位置

        this._showChatList          = []; //
        this._canUpdateChatShow     = true;

        this.init();
        this.initEvent();
    }

    Laya.class(GameRoomView, "GameRoomView", _super);

    var __proto = GameRoomView.prototype;

    __proto.init = function() {
        this.initViewShow();
        App.soundManager.playMusic("roomMusic");
    };

    __proto.initEvent = function () {
        var viewBtn = [
            {"btn": this.lobbyBtn, "btnFuc": this.backToLobby},
            {"btn": this.readyBtn, "btnFuc": this.touchReadyBtn},
            {"btn": this.grabBankerBtn, "btnFuc": this.onGrabBanker},
            //*解散房间
            {"btn": this.disbandBtn, "btnFuc": this.checkCanCloseRoom},
            //*站起
            {"btn": this.standUpBtn, "btnFuc": this.touchStandUp},
            //*战绩
            {"btn": this.recordbtn, "btnFuc": this.onShowEffort},
            //*聊天按钮
            {"btn": this.chatBtn, "btnFuc": this.onShowChatPanel},
            //*规则显示按钮
            {"btn": this.showRuleBtn, "btnFuc": this.onShowRulePanel},
            //*设置
            {"btn": this.settingBtn, "btnFuc": this.onSetting},
            //* 牌型
            {btn:this.pokerTypeBtn, "btnFuc": this.onPokerType},
            //*不做庄
            {btn:this.noDoBanker, "btnFuc": this.onNoDoBanker},

            //*补牌操作按钮
            {"btn": this.allOpenBtn, "btnFuc": this.allPlayerPokerOpen},
            {"btn": this.openOutsBtn, "btnFuc": this.openOutsPlayerPoker},
            {"btn": this.showToOtherBtn, "btnFuc": this.showPokerToPlayer},
            {"btn": this.bankerOutsBtn, "btnFuc": this.outsPoker},
            {"btn": this.outsBtn, "btnFuc": this.outsPoker},
            {"btn": this.outsActionBtn, "btnFuc": this.outsActionShow},
            {"btn": this.bankerOutsActionBtn, "btnFuc": this.outsActionShow},
            {"btn": this.passBtn, "btnFuc": this.onPass},

            //*结算按钮
            {"btn": this.finalBtn, "btnFuc": this.showFinalPanel}
        ];

        //*下注按钮注册
        for (var i = 0; i < 4; i++) {
            var betBtn = this.bidBox.getChildByName("bet_" + i);
            betBtn.on(Laya.Event.CLICK, this, this.touchBetBtn, [i + 1]);
            this._betBtnList.push(betBtn);
        }

        var index;
        for (index in viewBtn) {
            var btnInfo = viewBtn[index];
            var btn = btnInfo["btn"];
            var func = btnInfo["btnFuc"];
            btn.on(Laya.Event.CLICK, this, func);
        }
    };

    __proto.unregEvent = function () {
        var viewBtn = [
            {"btn": this.lobbyBtn, "btnFuc": this.backToLobby},
            {"btn": this.readyBtn, "btnFuc": this.touchReadyBtn},
            {"btn": this.grabBankerBtn, "btnFuc": this.onGrabBanker},
            {"btn": this.disbandBtn, "btnFuc": this.checkCanCloseRoom},
            {"btn": this.standUpBtn, "btnFuc": this.touchStandUp},
            {"btn": this.recordbtn, "btnFuc": this.onShowEffort},
            {"btn": this.chatBtn, "btnFuc": this.onShowChatPanel},
            {"btn": this.showRuleBtn, "btnFuc": this.onShowRulePanel},
            {"btn": this.settingBtn, "btnFuc": this.onSetting},
            {"btn":this.pokerTypeBtn, "btnFuc": this.onPokerType},
            {"btn":this.noDoBanker, "btnFuc": this.onNoDoBanker},
            {"btn": this.allOpenBtn, "btnFuc": this.allPlayerPokerOpen},
            {"btn": this.openOutsBtn, "btnFuc": this.openOutsPlayerPoker},
            {"btn": this.showToOtherBtn, "btnFuc": this.showPokerToPlayer},
            {"btn": this.bankerOutsBtn, "btnFuc": this.outsPoker},
            {"btn": this.outsBtn, "btnFuc": this.outsPoker},
            {"btn": this.outsActionBtn, "btnFuc": this.outsActionShow},
            {"btn": this.bankerOutsActionBtn, "btnFuc": this.outsActionShow},
            {"btn": this.passBtn, "btnFuc": this.onPass},
            {"btn": this.finalBtn, "btnFuc": this.showFinalPanel}
        ];

        //*下注按钮注册
        for (var i = 0; i < 4; i++) {
            var betBtn = this.bidBox.getChildByName("bet_" + i);
            betBtn.off(Laya.Event.CLICK, this, this.touchBetBtn);
        }

        var index;
        for (index in viewBtn) {
            var btnInfo = viewBtn[index];
            var btn = btnInfo["btn"];
            var func = btnInfo["btnFuc"];
            btn.off(Laya.Event.CLICK, this, func);
        }
    };

    __proto.initViewShow = function () {
        this._deckNodeShow = this.playersBox.getChildByName("deckNode"); //* 发牌的位置
        this._ghostBoxShow = this.playersBox.getChildByName("ghostBox"); //* 鬼牌的位置
        this._lightBoxShow = this.playersBox.getChildByName("lightBox"); //* 灯光的box

        var playersBox = this.playersBox;
        var roomInfo = App.tableManager.getRoomInfo();
        var maxChairs = roomInfo.maxChairs;
        for (var i = 0; i < maxChairs; i++) {
            var spriteOfPlayer = playersBox.getChildByName("player_" + i); //*桌面显示精灵
            if (spriteOfPlayer) {
                // 坐下的标志
                var sitTag = this.createSitTag(i);
                spriteOfPlayer.addChild(sitTag);

                this._sitTagList.push(sitTag);
                this._playerSpriteList.push(spriteOfPlayer);
            }

            // 灯光光柱
            var light = this._lightBoxShow.getChildByName("light_" + i);
            light.visible = false;
            this._lightList.push(light);
        }

        this.setPlayerPos();
        this.updatePlayerSitPos();

        var roomId = roomInfo.id;
        this.roomIdLab.text = roomId;
    };

    //*设置玩家座位
    __proto.setPlayerPos = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var clients = App.tableManager.getClients() || {};
        var chairs = App.tableManager.getRoomCharis() || [];
        var maxChairs = roomInfo.maxChairs;

        var selfId  = this.getSelfId();
        var selfPos = chairs.indexOf(selfId);
        for (var index = 0; index < maxChairs; index++) {
            var sitId = selfPos + index;
            if (sitId >= maxChairs) {
                sitId = sitId - maxChairs;
            }
            var userID = chairs[sitId];
            if (userID) {
                this.createPlayerIcon(userID);
            }
        }
    };

    __proto.updatePlayerSitPos = function () {
        var selfId = App.player.getId();
        var chairs = App.tableManager.getRoomCharis() || [];
        var playerBoxList = this._playerBoxList;
        for (var chairsId = 0; chairsId < chairs.length; chairsId++) {
            var userID = chairs[chairsId];
            if (userID) {
                if (playerBoxList[userID]) {

                }
                else {
                    this.createPlayerIcon(userID);
                }
            }
        }

        for (var index in playerBoxList) {
            var userId = index;
            if (userId != null) {
                if (chairs.indexOf(Number(userId)) == -1 && this._playerBoxList[index]) {
                    this.playerStand(Number(userId));
                }
            }
        }
        App.tableManager.continueUpdateState();
    };

    __proto.deletePlayerBox = function (userId) {
        if (this._playerBoxList[userId]) {
            this._playerBoxList[userId].dispose();
            this._playerBoxList[userId] = null;
            delete this._playerBoxList[userId];
        }
    };

    __proto.clearTableIconById = function (userId) {
        var index = this._userPosInTable.indexOf(userId);
        if (index != -1) {
            this._userPosInTable[index] = null;
            //*站起显示坐下的标志
            this._sitTagList[index].visible = true;
        }

        var roomInfo = App.tableManager.getRoomInfo();
        var roomBanker = roomInfo.banker;
        //*如果是庄家删除增加标志
        if (roomBanker == userId && this._bankerTagImg) {
            this._bankerTagImg.removeSelf();
            this._bankerTagImg = null;
        }
    };

    //*有玩家加入
    GameRoomView.prototype.joinPlayer = function (playerInfo) {
        var pos    = playerInfo.pos; //*位置
        var userId = playerInfo.userID;
        if (pos < 0) {
            //*站起的状态
            return;
        }

        //*加入新玩家
        this.createPlayerIcon(userId, pos);
    };

    //*点击站起
    GameRoomView.prototype.touchStandUp = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var roomState = roomInfo.state;
        if (roomState != Game.Room.STATE_READY) {
            return;
        }
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {};
        App.netManager.send(
            "room.handler.stand_up",
            {
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*站起
    __proto.playerStand = function (userId) {
        console.log(App.tableManager.getClients());
        this.deletePlayerBox(userId);
        this.clearTableIconById(userId);
    };

    //*坐下
    __proto.playerSitDown = function (info) {
        var userId = info.userID;
        //*如果是自己换位，重新刷新一下坐下的标志
        if (userId == App.player.getId()) {
            for (var index in this._sitTagList) {
                this._sitTagList[index].visible = true;
            }
        }
        //*刷新头像显示
        var chairs = App.tableManager.getRoomCharis();
        var roomInfo = App.tableManager.getRoomInfo();
        for (var i = 0; i < chairs.length; i++) {
            if (chairs[i]) {
                this.clearTableIconById(chairs[i]);
                this.joinPlayer({userID: chairs[i]});
            }
        }
    };

    __proto.dispose = function () {
        App.soundManager.playSound("btnSound");
        App.soundManager.playMusic("lobbyMusic");
        App.lobbyView.updateView();
        App.uiManager.removeGameRoomView();
    };

    __proto.leaveRoom = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {
                return;
            }

            App.tableManager.quitRoom();
        };
        //*退出房间
        App.netManager.send(
            "room.handler.leave",
            {
                data: {}
            },
            Laya.Handler.create(null, complete)
        );

    };

    //*返回大厅
    __proto.backToLobby = function () {
        if (this._isLockRoom) {
            return;
        }

        var roomInfo = App.tableManager.getRoomInfo();
        var roomHost = roomInfo.host;
        var selfId = App.player.getId();
        if (selfId == roomHost) {
            this.dispose();
        }
        else {
            this.leaveRoom();
        }
    };

    __proto.clearRoomShow = function () {
        this._dealUser  = 0;
        this._dealRound = 1;
        this._canUpdateGhostPoker = false;

        for (var i in this._pokerImgList) {
            if (this._pokerImgList[i]) {
                this._pokerImgList[i].dispose();
            }
        }

        //this.clearGhostPokers();
    };

    //*庄家标记飞行
    __proto.bankerTagFly = function (bankerId) {
        if (!bankerId) {
            return;
        }

        var playerBoxList = this._playerBoxList;
        if (playerBoxList[bankerId] && this._bankerTagImg) {
            var posX = playerBoxList[bankerId].x + 15;
            var posY = playerBoxList[bankerId].y + 5;
            var moveTo = MoveTo.create(0.5, posX, posY);
            App.actionManager.addAction(moveTo, this._bankerTagImg);
            this._bankerTagImg.zOrder = 100;
        }
    };

    //*创建庄家标记
    __proto.createBankerTagImg = function (bankerId) {
        if (!bankerId) {
            return;
        }

        var roomInfo = App.tableManager.getRoomInfo();
        var roomType = roomInfo.type;
        var playerBoxList = this._playerBoxList;
        if (playerBoxList[bankerId] && !this._bankerTagImg && roomType != Game.Game.ROOM_TYPE.CHAOS) {
            var img = new Laya.Image("assets/ui.room/icon_banker.png");
            this.playersBox.addChild(img);
            img.zOrder = 100;
            img.scaleX = 1.5;
            img.scaleY = 1.5;
            img.x = playerBoxList[bankerId].x + 15;
            img.y = playerBoxList[bankerId].y + 5;
            this._bankerTagImg = img;
        }
    };

    __proto.changeBankerTagShow = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var roomBanker = table.banker || 0;

        if (roomBanker != 0) {
            if (this._bankerTagImg) {

            }
            else {
                this.createBankerTagImg(roomBanker);
                if (Number(roomBanker) != Number(this._bankerId)) {
                    this._bankerId = roomBanker;
                }
            }
        }
        else {
            if (this._bankerTagImg) {
                this._bankerTagImg.removeSelf();
                this._bankerTagImg = null;
            }
        }
    };

    __proto.CheckBankerCanFly = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var roomBanker = table.banker || 0;
        if (Number(roomBanker) != Number(this._bankerId)) {
            this.bankerTagFly(roomBanker);
            this._bankerId = roomBanker;
        }
    };

    __proto.updateRoomRoundShow = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var round = roomInfo.round + 1;
        var maxRound = roomInfo.maxRound;
        if (round >= maxRound) {
            round = maxRound;
        }

        this.roundLab.text = round + "/" + maxRound;
    };

    //*弹出结算界面
    __proto.showFinalPanel = function () {
        if (this._finalView) {
            return;
        }
        var roomInfo    = App.tableManager.getRoomInfo();
        var roomLog     = roomInfo.roomLog || {};
        //*弹出结算窗口
        this._finalView = App.uiManager.addUiLayer(FinalDialog,roomLog);
    };

    //*站起按钮状态
    __proto.changeStandUpState = function () {
        var roomInfo    = App.tableManager.getRoomInfo();
        var selfId      = App.player.getId();
        var table       = roomInfo.table || {};
        var roomBanker  = table.banker || 0;
        var roomState   = roomInfo.state;
        var roomType    = roomInfo.type;
        var clients     = App.tableManager.getClients() || {};
        var canStanUp   = true;

        if (roomState != Game.Room.STATE_READY) {
            canStanUp = false;
        }
        else {
            if (clients[selfId] != null) {
                if (clients[selfId].ready == false) {
                    if (roomBanker == selfId) {
                        if (roomType != Game.Game.ROOM_TYPE.CHAOS) {
                            canStanUp = false;
                        }
                        else {
                            canStanUp = true;
                        }
                    }
                    else {
                        canStanUp = true;
                    }
                }
                else {
                    canStanUp = false;
                   }
            }
            else {
                //*没有在牌桌
                canStanUp = false;
            }
        }

        if (canStanUp) {
            this.standUpGray.visible = false;
            this.standUpBtn.visible = true;
        }
        else {
            this.standUpGray.visible = true;
            this.standUpBtn.visible = false;
        }
    };

    //*解散房间按钮状态
    __proto.changeDisbandBtnState = function () {
        var selfId              = App.player.getId();
        var roomInfo            = App.tableManager.getRoomInfo();
        var dismissNeedConfirm  = roomInfo.dismissNeedConfirm ? true : false;
        var roomHost            = roomInfo.host;
        var whoCandisband       = dismissNeedConfirm ? "all" : "host";
        var selfIsHost          = (selfId == roomHost);

        if (whoCandisband == "host") {
            if (selfIsHost) {
                this.disbandGray.visible = false;
                this.disbandBtn.visible = true;
            }
            else {
                this.disbandGray.visible = true;
                this.disbandBtn.visible = false;
            }
        }
        else if (whoCandisband == "all") {
            this.disbandGray.visible = false;
            this.disbandBtn.visible = true;
        }
    };

    // 房间是不是上锁
    __proto.changeLockRoomState = function () {
        var roomInfo    = App.tableManager.getRoomInfo();
        var isLock      = roomInfo.locked ? true : false;

        if (isLock) {
            this.lobbyGray.visible = true;
            this.lobbyBtn.visible = false;
            this._isLockRoom = true;
        }
        else {
            this._isLockRoom = false;
            this.lobbyGray.visible = false;
            this.lobbyBtn.visible = true;
        }
    };

    // 改变房间战绩按钮的显示
    __proto.changeEffortBtnState = function () {
        var roomInfo        = App.tableManager.getRoomInfo();
        var roomLog         = roomInfo.roomLog || {};
        var rounds          = roomLog.rounds || {};
        var effortLength    = Object.keys(rounds).length;

        var canShowEffort = false;
        if (effortLength >= 1) {
            canShowEffort = true;
        }

        var skin = "";
        var stateNum = 2;
        if (canShowEffort) {
            skin = "assets/ui.room/icon_Record.png";
        }
        else {
            skin = "assets/ui.room/icon_Record_j.png";
            stateNum = 1;
        }

        this._canShowEffort     = canShowEffort;
        this.recordbtn.skin     = skin;
        this.recordbtn.stateNum = stateNum;
    };

    //*房间结束，显示查看战绩按钮
    __proto.showCloseRoom = function () {
        this.finalBtn.visible = true;
    };

    //*清除鬼牌显示
    __proto.clearGhostPokers = function () {
        for (var ghostIndex = 0; ghostIndex < this._ghostList.length; ghostIndex++) {
            this._ghostList[ghostIndex].dispose();
        }
        this._ghostList = [];
        for (var showGhostIndex = 0; showGhostIndex < this._showGhostList.length; showGhostIndex ++) {
            this._showGhostList[showGhostIndex].dispose();
        }
        this._showGhostList = [];
    };
    
    __proto.resetRob = function() {
        this._prepareRobShowed = null;
        this._robBegin = null;
    };

    //*全部准备完成之后，定制模式，需要显示抢庄，显示倒计时
    __proto.prepareRob = function () {
        if (this.isClientInTable() == false) {
            return;
        }

        var nowTime = App.getTime();
        if (this._prepareRobShowed) {
            return;
        }
        
        if (this._robBegin == null) {
            this._robBegin = nowTime;
            this.countdownLab.visible = true;
            this._grabBankerTime = 3;
        }

        this._grabBankerTime = 3 - (nowTime - this._robBegin);
        if (this._grabBankerTime <= 0) {
            this.countdownLab.visible = false;
            this._prepareRobShowed = true;
            //*显示抢庄按钮
            this.showGrabBanker();
        }
        else {
            this.countdownImg.skin = "assets/ui.room/img_Count_down" + this._grabBankerTime + ".png";
        }
    };

    __proto.unShowGrabBanker = function () {
        this.countdownLab.visible = false;
        this.grabBankerBtn.visible = false;
    };

    // 玩家是否参与了牌局
    __proto.isClientInTable = function() {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var clients = table.clients;
        var selfId = App.player.getId();

        if (clients[selfId] == null) {
            return false;
        }

        return true;
    };

    //*显示抢庄按钮
    __proto.showGrabBanker = function () {
        if (this.isClientInTable() == false) {
            return;
        }
        var roomInfo = App.tableManager.getRoomInfo();
        var roomType = roomInfo.type;

        if (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            this.grabBankerBtn.visible = true;
        }
        else {
            this.grabBankerBtn.visible = false;
        }
    };

    //*按下抢庄
    __proto.onGrabBanker = function () {
        var self = this;
        App.soundManager.playSound("btnSound");
        var complete = function (err, data) {
            if (err) {
                console.log(err);
            }
        };
        App.netManager.send(
            "room.handler.command",
            {
                fn: "rob",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    __proto.touchReadyBtn = function () {
        var self = this;
        var complete = function (err, data) {
            if (!err) {
                self.CheckBankerCanFly();
                self.clearGhostPokers();
            }
        };
        App.soundManager.playSound("btnSound");
        var clients = App.tableManager.getClients();
        var selfId = this.getSelfId();
        var ready = ! (clients[selfId].ready);

        //*点击准备
        App.netManager.send(
            "room.handler.command",
            {
                fn: "ready",
                data: ready
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*发送信息显示，聊天信息显示
    __proto.showSendChat = function (info) {
        //var userID = info.userID; //*谁发送的
        //var msg = info.msg;
        //this._chatShowList.addItem({userID: userID, msg: msg});
        //
        //var chatListLength = this._chatShowList.length;
        //this._chatShowList.scrollTo(chatListLength - 1);

        // 弹幕
        var userID = info.userID; //*谁发送的
        var name = info.name || "游客";
        var msg = info.msg;

        var barrageItem = new Laya.Box();

        var msgLab;
        var nameLab;

        var expressions = Game.Game.Chat.expression;
        if(msg.indexOf("/") != -1) {
            for (var i = 0; i < expressions.length; i++) {
                if (expressions[i].code == msg) {
                    msgLab = new Laya.Image();
                    msgLab.skin =  "assets/ui.room/chat/expression/" + expressions[i].img;
                    break;
                }
            }
        }
        else
        {
            msgLab = new Laya.Label();
            msgLab.font = "Microsoft YaHei";
            msgLab.fontSize = 22;
            msgLab.text = msg;
            msgLab.color = "#ffffff";
        }

        nameLab = new Laya.Label();
        nameLab.font = "Microsoft YaHei";
        nameLab.fontSize = 22;
        nameLab.text = name;
        nameLab.color = "#ffb16c";

        barrageItem.width = nameLab.width + msgLab.width;
        barrageItem.height = msgLab.height > nameLab.height? msgLab.height : nameLab.height;

        nameLab.pivot(0,nameLab.height/2);
        msgLab.pivot(0,nameLab.height/2);

        nameLab.x = 0;
        nameLab.y = barrageItem.height/2;

        msgLab.x = nameLab.x + nameLab.width;
        msgLab.y = barrageItem.height/2;

        barrageItem.addChild(msgLab);
        barrageItem.addChild(nameLab);

        barrageItem.x = this.width + barrageItem.width;
        barrageItem.y = DejuPoker.Utils.range_value(barrageItem.height,this.height/2);

        this.addChild(barrageItem);

        var seq = Sequence.create([
            MoveTo.create(10,{x:-barrageItem.width/2,y:barrageItem.y}),
            CallFunc.create(Laya.Handler.create(null,function(){
                barrageItem.removeSelf();
            }))
        ]);

        App.actionManager.addAction(seq,barrageItem);
    };

    __proto.checkCanCloseRoom = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var roomState = roomInfo.state;
        var firstPay = roomInfo.firstPay;
        if (roomState == Game.Room.STATE_READY && !firstPay) {
            //*第一局没开始的时候有弹框
            var self = this;
            var msgInfo = {
                msg: "解锁房间不扣除钻石，是否解散？",
                cb: self.closeRoomOfBanker,
                canCancel: true
            };
            App.uiManager.showMessage(msgInfo);
        }
        else {
            this.closeRoomOfBanker();
        }
    };

    //*显示不做庄家操作
    __proto.notDoBankerState = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var roomType = roomInfo.type;
        var table = roomInfo.table || {};
        var banker = table.banker || 0;
        var clients = App.tableManager.getClients() || {};
        if (roomType == Game.Game.ROOM_TYPE.CLASSICAL) {
            var selfId = App.player.getId();
            if (clients[selfId] && selfId != banker) {
                this.noDoBanker.visible = true;
                this.bankerTick.visible = clients[selfId].notBank ? true : false;
            }
            else {
                this.noDoBanker.visible = false;
                this.bankerTick.visible = false;
            }
        }
        else {
            this.noDoBanker.visible = false;
            this.bankerTick.visible = false;
        }
    };


    //*解散房间
    __proto.closeRoomOfBanker = function () {
        App.soundManager.playSound("btnSound");

        var self = this;
        var complete = function (err, data) {};
        App.netManager.send(
            "room.handler.destroy",
            {
                fn: "",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*显示战绩
    __proto.onShowEffort = function () {
        if (!this._canShowEffort) {
            // 灰色按钮不能点击
            return;
        }

        App.soundManager.playSound("btnSound");

        var roomInfo    = App.tableManager.getRoomInfo();
        var roomLog     = roomInfo.roomLog || {};
        var rounds      = roomLog.rounds || {};
        App.uiManager.addUiLayer(EffortOfRoomDialog, rounds);
    };

    //*聊天
    __proto.onShowChatPanel = function () {
        App.soundManager.playSound("btnSound");
        App.uiManager.addUiLayer(ChatViewDialog);
    };

    //*设置界面
    __proto.onSetting = function () {
        App.soundManager.playSound("btnSound");
        var settingPanel = App.uiManager.addUiLayer(SettingDialog);
        settingPanel.on(SettingDialog.Events.CHANGE_TABLE, this, this.changeTableShow);
    };

    //*规则查看
    __proto.onShowRulePanel = function () {
        App.soundManager.playSound("btnSound");

        var roomInfo    = App.tableManager.getRoomInfo();
        var setting     = roomInfo.settings || {};
        var type        = roomInfo.type;
        var info        = {};
        for (var index in setting) {
            info[index] = setting[index];
        }
        info.type = type;
        App.uiManager.addUiLayer(ShowRuleDialog, info);
    };

    //*牌型
    __proto.onPokerType = function () {
        App.uiManager.addUiLayer(ShowPokerTypeDialog);
    };

    //*点击不做庄家
    __proto.onNoDoBanker = function () {
        var self = this;
        var complete = function (err, data) {};
        App.netManager.send(
            "room.handler.command",
            {
                fn: "rejectBanker",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*过牌
    __proto.onPass = function () {
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {};
        App.netManager.send(
            "room.handler.command",
            {
                fn: "draw",
                data: Game.Game.DRAW_COMMAND.PASS
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*搓牌
    __proto.outsActionShow = function () {
        App.soundManager.playSound("btnSound");

        var self        = this;
        var selfId      = App.player.getId();
        var roomInfo    = App.tableManager.getRoomInfo();
        var table       = roomInfo.table || {};
        var roomBanker  = table.banker || 0;
        var roomType    = roomInfo.type;
        var isBanker    = (selfId == roomBanker);
        var complete    = function (err, data) {};

        var fn = "draw";
        if (isBanker && roomType != Game.Game.ROOM_TYPE.CHAOS && roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
            fn = "doBankerDraw";
        }

        App.netManager.send(
            "room.handler.command",
            {
                fn: fn,
                data: Game.Game.DRAW_COMMAND.RUBBED
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*补牌动作
    __proto.playerDrawPoker = function (userId) {
        if (!userId) {
            App.tableManager.continueUpdateState();
            return;
        }

        var roomInfo = App.tableManager.getRoomInfo();
        var roomType = roomInfo.type;

        if (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            //*定制模式是的话就是直接明牌
            this.showPokerToPlayerAction(userId);
        }
        else {
            //*飞牌的动作
            var deckNode = this._deckNodeShow;
            var playerBox = this._playerBoxList;
            var pokers = new Poker();
            pokers.setPokerPosition({x:deckNode.x, y:deckNode.y});
            pokers.setPokerScale();
            this.playersBox.addChild(pokers);
            this._pokerImgList.push(pokers);
            var pos = playerBox[userId];
            var moveTo = MoveTo.create(0.5, pos.x, pos.y);
            var scaleTo = ScaleTo.create(0.5, 0, 0);
            var spa = Spawn.create(moveTo, scaleTo);
            var self = this;
            var callBack = CallFunc.create(Laya.Handler.create(null,
                function () {
                    playerBox[userId].showOutsPoker();
                    App.tableManager.continueUpdateState();
                }
            ));
            var seq = Sequence.create(spa, callBack);
            App.actionManager.addAction(seq, pokers);
        }
    };

    //*普通补牌
    __proto.outsPoker = function () {
        App.soundManager.playSound("btnSound");

        var roomInfo    = App.tableManager.getRoomInfo();
        var table       = roomInfo.table || {};
        var banker      = table.banker || 0;
        var selfId      = App.player.getId();
        var isBanker    = (banker == selfId);
        var roomType    = roomInfo.type;
        var self        = this;
        var complete;
        if (isBanker && roomType != Game.Game.ROOM_TYPE.CHAOS && roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
            complete = function (err, data) {};
            App.netManager.send(
                "room.handler.command",
                {
                    fn: "doBankerDraw",
                    data: Game.Game.DRAW_COMMAND.DRAW
                },
                Laya.Handler.create(null, complete)
            );
        }
        else {
            complete = function (err, data) {};
            App.netManager.send(
                "room.handler.command",
                {
                    fn: "draw",
                    data: Game.Game.DRAW_COMMAND.DRAW
                },
                Laya.Handler.create(null, complete)
            );
        }
    };

    //*明牌的动作
    __proto.showPokerToPlayerAction = function (userId) {
        if (!userId) {
            App.tableManager.continueUpdateState();
            return;
        }

        var playerBox = this._playerBoxList[userId];
        if (playerBox) {
            playerBox.showAllPokers();
        }
        App.tableManager.continueUpdateState();
    };

    //*明牌
    __proto.showPokerToPlayer = function () {
        App.soundManager.playSound("btnSound");

        var self        = this;
        var roomInfo    = App.tableManager.getRoomInfo();
        var roomType    = roomInfo.type;
        var complete    = function (err, data) {};
        if (roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
            App.netManager.send(
                "room.handler.command",
                {
                    fn: "draw",
                    data: Game.Game.DRAW_COMMAND.OPEN
                },
                Laya.Handler.create(null, complete)
            );
        }
        else {
            //*定制模式为普通补牌
            App.netManager.send(
                "room.handler.command",
                {
                    fn: "draw",
                    data: Game.Game.DRAW_COMMAND.DRAW
                },
                Laya.Handler.create(null, complete)
            );
        }
    };

    //*庄家开补
    __proto.openOutsPlayerPoker = function () {
        App.soundManager.playSound("btnSound");
        var roomInfo    = App.tableManager.getRoomInfo();
        var table       = roomInfo.table || {};
        var banker      = table.banker || 0;
        var selfId      = App.player.getId();
        var isBanker    = (banker == selfId);
        if (isBanker) {
            var self = this;
            var complete = function (err, data) {};

            App.netManager.send(
                "room.handler.command",
                {
                    fn: "doBankerDraw",
                    data: Game.Game.DRAW_COMMAND.BET_DRAW
                },
                Laya.Handler.create(null, complete)
            );
        }
    };

    //*庄家全开
    __proto.allPlayerPokerOpen = function () {
        App.soundManager.playSound("btnSound");
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var banker = table.banker || 0;
        var selfId = App.player.getId();
        var isBanker = (banker == selfId);
        if (isBanker) {
            var self = this;
            var complete = function (err, data) {};
            App.netManager.send(
                "room.handler.command",
                {
                    fn: "doBankerDraw",
                    data: Game.Game.DRAW_COMMAND.BET_ALL
                },
                Laya.Handler.create(null, complete)
            );
        }
    };

    __proto.touchBetBtn = function (betNum) {
        var selfId = this.getSelfId();
        var clients = App.tableManager.getClients();
        if (clients[selfId] && clients[selfId].bid && clients[selfId].bidRate > 0) {
            return;
        }

        betNum = betNum || 1;
        var self = this;
        var complete = function (err, data) {};
        //*下注
        App.netManager.send(
            "room.handler.command",
            {
                fn: "bid",
                data: betNum
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*关闭所有的操作选项按钮
    __proto.unShowDrawOption = function () {
        this.bankerOperationBox.visible = false;
        this.operationBox.visible = false;
    };

    //*关闭所有灯光
    __proto.unShowAllLight = function () {
        for (var index = 0; index < this._lightList.length; index ++) {
            this._lightList[index].visible = false;
        }
    };

    //*显示操作灯光
    __proto.showLightByUserId = function (userId) {
        this.unShowAllLight();
        if (this._userPosInTable.indexOf(userId) != -1) {
            var index = this._userPosInTable.indexOf(userId);
            this._lightList[index].visible = true;
        }
    };

    __proto.showDrawOption = function (rubbedDrawer) {
        //*开始补牌的操作
        var roomInfo        = App.tableManager.getRoomInfo();
        var table           = roomInfo.table || {};
        var clients         = table.clients || {};
        var drawList        = table.drawList || [];
        var roomBanker      = table.banker || 0;
        var drawerPlayer    = drawList[0] || roomBanker;
        var ghostPokers     = table.ghostPokers || [];
        var roomType        = roomInfo.type;
        var roomSettings    = roomInfo.settings || {};
        var drawer          = rubbedDrawer || drawerPlayer;

        this.showLightByUserId(drawer);//光柱
        var selfId = App.player.getId();
        var handPokers = clients[selfId] ? clients[selfId].handPokers : [];
        var isSelfOption = (selfId == drawer);
        if (!isSelfOption) {
            this.bankerOperationBox.visible = false;
            this.operationBox.visible = false;
            return;
        }

        //App.soundManager.playSound("optionSound");
        var ghostArray = [];
        for (i in ghostPokers) {
            poker = ghostPokers[i];
            if (poker && poker.type != Game.Poker.TYPE.JOKER) {
                ghostArray.push(poker.value);
            }
        }

        var ghostCnt = 0;
        var i;
        var poker;
        // 天公判断 累计点数
        var totalValue = 0;
        for (i in handPokers) {
            poker = handPokers[i];
            if (poker) {
                if (poker.type == Game.Poker.TYPE.JOKER || ghostArray.indexOf(poker.value) != -1) {
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

        var isOuts = false;
        var index;
        var clientHandPokers;
        for (index in clients) {
            clientHandPokers = clients[index].handPokers;

            if (clientHandPokers.length >= 3 && isOuts == false) {
                isOuts = true;
                break;
            }
        }

        var cantOpen = false;
        var cantPass = false;
        var cantDraw = false;
        var cantRubbed = false;
        //*庄家，全开，开补
        var cantBetAll = false;
        var cantBetDraw = false;

        var isDrawShow = true;
        var isPassShow = true;

        switch (roomType) {
            // 长庄
            case Game.Game.ROOM_TYPE.STATIC: {
                // 一只鬼的时候
                if (ghostCnt === 1) {
                    // 鬼牌万能 只能补牌
                    if (roomSettings.universalGhost == true) {
                        cantOpen = true;
                        cantPass = true;

                        cantBetAll = true;
                        cantBetDraw = true;
                    }
                }
                // 天公不能过牌
                if (totalValue == 8 || totalValue == 9) {
                    cantPass = true;
                }
                break;
            }
            // 经典
            case Game.Game.ROOM_TYPE.CLASSICAL: {
                // 一只鬼的时候
                if (ghostCnt === 1) {
                    // 鬼牌万能 只能补牌
                    if (roomSettings.universalGhost == true) {
                        cantOpen = true;
                        cantPass = true;

                        cantBetAll = true;
                        cantBetDraw = true;
                    }
                }
                // 天公不能过牌
                if (totalValue == 8 || totalValue == 9) {
                    cantPass = true;
                }
                break;
            }
            // 混战
            case Game.Game.ROOM_TYPE.CHAOS: {
                // 一只鬼的时候
                if (ghostCnt === 1) {
                    // 鬼牌万能 只能补牌
                    if (roomSettings.universalGhost == true) {
                        cantOpen = true;
                        cantPass = true;

                        cantBetAll = true;
                        cantBetDraw = true;
                    }
                }
                break;
            }
            // 定制
            case Game.Game.ROOM_TYPE.CUSTOMIZED: {
                // 定制模式不能补牌和过牌
                cantPass = true;
                cantDraw = true;
                isDrawShow = false;
                isPassShow = false;
                break;
            }
        }

        if (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED || roomType == Game.Game.ROOM_TYPE.CHAOS) {
            this.bankerOperationBox.visible = false;
            this.operationBox.visible = true;
        }
        else {
            //var roomBanker = roomInfo.banker;
            var isBanker = (selfId == roomBanker);
            if (isBanker) {
                this.bankerOperationBox.visible = true;
                this.operationBox.visible = false;

                if (roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
                    cantPass = true;
                    cantOpen = true;
                    if (roomType == Game.Game.ROOM_TYPE.CHAOS) {
                        cantPass = false;
                        cantOpen = false;

                        cantBetAll = true;
                        cantBetDraw = true;
                    }
                    else {
                        //*没有补牌，就不能开补
                        if (isOuts == false) {
                            cantBetDraw = true;
                        }
                    }
                }
                else {
                    cantBetAll = true;
                    cantBetDraw = true;
                }
            }
            else {
                this.bankerOperationBox.visible = false;
                this.operationBox.visible = true;
            }
        }

        this.showToOtherBtn.disabled        = cantOpen;
        this.passBtn.disabled               = cantPass;
        this.outsBtn.disabled               = cantDraw;
        this.bankerOutsBtn.disabled         = cantDraw;
        this.outsActionBtn.disabled         = cantRubbed;
        this.bankerOutsActionBtn.disabled   = cantRubbed;

        this.allOpenBtn.disabled            = cantBetAll;
        this.openOutsBtn.disabled           = cantBetDraw;

        this.passBtn.visible                = isPassShow;
        this.outsBtn.visible                = isDrawShow;
    };

    //*关闭下注显示
    __proto.unShowBidOption = function () {
        this.bidBox.visible = false;
    };

    //* 显示下注操作
    __proto.showBidOption = function () {
        var userID      = this.getSelfId();
        var roomInfo    = App.tableManager.getRoomInfo();
        var table       = roomInfo.table || {};
        //var clients     = table.clients || {};
        var lastBidRates= table.lastBidRates || {};
        var roomBanker  = table.banker || 0;
        var roomBidList = table.bidList || [];
        //var roomType    = roomInfo.type;
        var roomSetting = roomInfo.settings || {};

        var selfIndexInBidList = roomBidList.indexOf(userID);
        var canShowBidBtnBox = false;
        if (selfIndexInBidList != -1) {
            canShowBidBtnBox = true;
        }
        else {
            canShowBidBtnBox = false;
        }

        var lastBidRate = lastBidRates[userID] || 1;
        if (canShowBidBtnBox) {
            var length = this._betBtnList.length;

            var isMoreThenMore = false;
            if (roomSetting.betType == Game.Game.BET_TYPE.MORE_THEN_MORE) {
                isMoreThenMore = true;
            }

            for (var index = 0; index < length; index ++) {
                if (isMoreThenMore && index < lastBidRate - 1) {
                    this._betBtnList[index].disabled = true;
                }
                else {
                    this._betBtnList[index].disabled = false;
                }
            }

            this.bidBox.visible = true;
        }
        else {
            this.bidBox.visible = false;
        }
    };

    __proto.updateGhostPoker = function () {
        if (!this._canUpdateGhostPoker) {
            return;
        }

        var showGhostList = this._showGhostList.length;
        for (var num = 0; num < showGhostList; num ++) {
            if (this._showGhostList[num]) {
                this._showGhostList[num].dispose();
            }
        }
        this._showGhostList = [];

        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var ghostPokers = table.ghostPokers || [];

        for (var index = 0; index < ghostPokers.length; index++) {
            var pokerInfo = ghostPokers[index];
            var showPoker = new Poker(pokerInfo, ghostPokers);
            showPoker.scaleX = 0.3;
            showPoker.scaleY = 0.3;
            showPoker.x += 80 * index;
            this._ghostBoxShow.addChild(showPoker);
            this._showGhostList.push(showPoker);
        }
    };

    //*显示鬼牌
    __proto.showGhostPoker = function () {
        if (this._showGhostList[this._ghostIndex]) {
            this._showGhostList[this._ghostIndex].visible = true;
        }
        this._ghostIndex++;
        if (this._ghostIndex >= this._showGhostList.length) {
            this._canUpdateGhostPoker = true;
            //*鬼牌表现做完
            App.tableManager.continueUpdateState();
        }
    };

    //* 鬼牌移动
    __proto.ghostPokersMove = function () {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var ghostPoker = table.ghostPokers || []; //*鬼牌
        if (ghostPoker.length <= 0) {
            App.tableManager.continueUpdateState();
            return;
        }
        var index;
        var pokerInfo;
        this._ghostList = [];
        this._showGhostList = [];
        this._ghostIndex = 0;
        for (index in ghostPoker) {
            pokerInfo = ghostPoker[index];

            var poker = new Poker(pokerInfo, ghostPoker);
            poker.scaleX = 0.5;
            poker.scaleY = 0.5;
            poker.x = this._deckNodeShow.x + 100 * Number(index);
            this.playersBox.addChild(poker);
            this._ghostList.push(poker);

            var showPoker = new Poker(pokerInfo, ghostPoker);
            showPoker.scaleX = 0.3;
            showPoker.scaleY = 0.3;
            showPoker.x += 80 * Number(index);
            showPoker.visible = false;
            this._ghostBoxShow.addChild(showPoker);
            this._showGhostList.push(showPoker);
        }

        //*fly
        for (var i = 0; i < this._ghostList.length; i++) {
            var ghost       = this._ghostList[i];
            var moveTo      = MoveTo.create(0.5, this._ghostBoxShow.x, this._ghostBoxShow.y);
            var scaleTo     = ScaleTo.create(0.5, 0, 0);
            var spawn       = Spawn.create(moveTo, scaleTo);
            var self        = this;
            var callBack    = CallFunc.create(Laya.Handler.create(null, function () {
                self.showGhostPoker();
            }));
            var seq         = Sequence.create(spawn, callBack);
            App.actionManager.addAction(seq, ghost);
        }
    };

    __proto.pokerFlying = function () {
        if (this._doDealList && this._doDealList.length > 0) {
            // 获取当前发牌列表的第一个元素(当前要发给牌的玩家userId)
            var userId = this._doDealList.shift();
            var dealPokerNode = this._deckNodeShow;
            var poker = new Poker();
            poker.setPokerPosition({x: dealPokerNode.x, y: dealPokerNode.y});
            poker.setPokerScale({x: 0.5, y: 0.5});
            this.playersBox.addChild(poker);
            this._pokerImgList.push(poker);

            var pos = this._playerBoxList[userId];
            if (pos) {
                var moveTo = MoveTo.create(0.25, pos.x, pos.y);
                var scaleTo = ScaleTo.create(0.25, 0, 0);
                var spa = Spawn.create(moveTo, scaleTo);
                var self = this;
                var callBack = CallFunc.create(Laya.Handler.create(null, function () {
                    if (self._playerBoxList && self._playerBoxList[userId]) {
                        self._playerBoxList[userId].showDealPoker();
                        // 运行完一个就继续运行自己
                        self.pokerFlying();
                    }
                }));
                var seq = Sequence.create(spa, callBack);
                App.actionManager.addAction(seq, poker);
            }
        }
        else {
            //*发牌完毕就发鬼牌
            this.ghostPokersMove();
        }
    };

    //*发牌表演
    __proto.dealPokerAction = function () {
        // 运行期间不会再次运行
        if (this._doDealList && this._doDealList.length > 0) {
            return;
        }
        
        this._canUpdateGhostPoker = false;
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var dealPokerList = table.dealSequence ||[]; //*发牌列表
        var roomType = roomInfo.type;

        // 将发牌人群按人头/发牌数量 来排布成为一个大数组
        // 将两个 dealPokerList 链接在一起
        this._doDealList = dealPokerList.concat(dealPokerList);
        this._dealCount = 2;
        if (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            // 再链接多一个 dealPokerList
            this._doDealList = this._doDealList.concat(dealPokerList);
            this._dealCount = 3;
        }

        this.pokerFlying();
    };

    __proto.showReadyBtn = function (isShow) {
        var roomInfo = App.tableManager.getRoomInfo();
        var clients = App.tableManager.getClients();
        var table = roomInfo.table || {};
        var selfId = App.player.getId();
        if (clients[selfId]) {
            isShow = isShow ? true : false;

            var skin = "assets/ui.room/img_GetReady.png";
            var btnSkin  = "assets/ui.room/btn_yellow.png";
            if (clients[selfId].ready) {
                skin = "assets/ui.room/img_cancel.png";
                btnSkin = "assets/ui.room/btn_blue.png";
            }
            else {
                var roomBanker = table.banker;
                var isRoomHost = (roomInfo.host == selfId);
                var roomType = roomInfo.type;
                if ( (roomBanker == selfId && roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) ||
                    (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED && isRoomHost)) {
                    skin = "assets/ui.room/img_Go.png";
                    btnSkin = "assets/ui.room/btn_blue.png";
                }
            }
            this.readyBtnImg.skin = skin;
            this.readyBtn.skin = btnSkin;
        }
        else {
            //*站起来的时候就不能显示
            isShow = false;
        }

        this.readyBtn.visible = isShow;
    }

    __proto.createPlayerIcon = function (playerUserId, pos) {
        var roomInfo = App.tableManager.getRoomInfo();
        var table = roomInfo.table || {};
        var roomBanker = table.banker || 0;
        var maxChairs = roomInfo.maxChairs;
        //*判断自己是不是站起的状态，没有在椅子上
        var selfUserID = this.getSelfId();
        var chairs = App.tableManager.getRoomCharis();
        //*自己的位置
        var selfIndexInChair = chairs.indexOf(selfUserID);
        //*加进来的人的位置
        var playerIndexInChair = pos || chairs.indexOf(playerUserId);

        var playerIcon;
        var posInTable;
        var canCreate = false;
        if (selfIndexInChair == -1) {
            //*自己没有坐下就按chairs的位置显示
            if (this._userPosInTable.indexOf(playerUserId) == -1) {
                posInTable = playerIndexInChair;
                canCreate = true;
            }
        }
        else {
            //*自己坐下根据自己的位置显示别人的座位
            if (this._userPosInTable.indexOf(playerUserId) == -1) {
                var indexDiff = playerIndexInChair - selfIndexInChair;
                if (indexDiff < 0) {
                    indexDiff = maxChairs + indexDiff;
                }
                posInTable = indexDiff;
                canCreate = true;
            }
        }

        if (canCreate) {
            if (this._playerBoxList[playerUserId]) {
                playerIcon = this._playerBoxList[playerUserId];
            }
            else {
                playerIcon = new RoomPlayerBox({userID: playerUserId});
                this._playerBoxList[playerUserId] = playerIcon;
            }

            playerIcon.y = this._playerSpriteList[posInTable].y - 67;
            playerIcon.x = this._playerSpriteList[posInTable].x - 91;
            playerIcon.zOrder = -10;
            playerIcon.changeBetLabPos(posInTable);
            this.playersBox.addChild(playerIcon);
            this._sitTagList[posInTable].visible = false;
            this._userPosInTable[posInTable] = playerUserId;
        }
    };

    // 点击座位
    __proto.touchSitBtn = function (sitTagIndex) {
        //*不是准备状态不能坐下或者换位置
        var self = this;
        var selfId = App.player.getId();
        var roomInfo = App.tableManager.getRoomInfo();
        var chairs = App.tableManager.getRoomCharis();
        var roomState = roomInfo.state;
        var maxChair = roomInfo.maxChairs;
        var selfChairId = chairs.indexOf(selfId);
        var sitId = sitTagIndex;
        var pos = 0;
        if (selfChairId == -1) {
            var roomChariMinPos = 0;
            var roomChariMinUser = 0;
            for (var i = 0; i < chairs.length; i ++) {
                if (chairs[i] != null) {
                    roomChariMinPos = i;
                    roomChariMinUser = chairs[i];
                    break;
                }
            }

            var tablePos = this._userPosInTable.indexOf(roomChariMinUser);
            if (tablePos != -1) {
                pos = maxChair - tablePos + sitTagIndex + roomChariMinPos;
                if (pos >= maxChair) {
                    pos -= maxChair;
                }
            }
        }
        else {
            if (sitId < 0 || sitId >= maxChair) {
                sitId = 0;
            }
            pos = sitId + selfChairId;
            if (pos >= maxChair) {
                pos -= maxChair;
                console.log(pos);
            }
        }

        var complete = function (err, data) {
            if (err) {
            }
        };
        App.netManager.send(
            "room.handler.sit_down",
            {
                data: pos
            },
            Laya.Handler.create(null, complete)
        );
    };

    __proto.createSitTag = function (index) {
        var sitBg = new Laya.Image("assets/ui.room/img_Sitdown_1.png");
        sitBg.anchorX = 0.5;
        sitBg.anchorY = 0.5;
        sitBg.on(Laya.Event.CLICK, this, this.touchSitBtn, [index]);

        return sitBg;
    };

    //*更换桌布
    __proto.changeTableShow = function () {
        var tableColor = App.storageManager.getItem("TABLE_COLOR");
        var isYellowTable = false;
        if (tableColor != undefined) {
            if (tableColor == SettingDialog.TABLE_TYPE.GREEN) {
                isYellowTable = false;
            }
            else if (tableColor == SettingDialog.TABLE_TYPE.YELLOW) {
                isYellowTable = true;
            }
        }
        else {
            App.storageManager.setItem("TABLE_COLOR", SettingDialog.TABLE_TYPE.GREEN);
        }
        this.yellowTable.visible = isYellowTable;
    };

    __proto.getSelfId = function () {
        return App.player.getId();
    };

    __proto.getPlayerBoxs = function () {
        return this._playerBoxList;
    };

    __proto.getPlayerBoxByUserId = function (userID) {
        if (this._userPosInTable.indexOf(userID) != -1) {
            var index = this._userPosInTable.indexOf(userID);
            return this._playerBoxList[index];
        }
    };

    __proto.onClosed = function () {
        this.unregEvent();
    };

    //-----------聊天显示------------------

    __proto.createChatShowLab = function (name, lab) {
        var width = this.chatInfoBg.width;
        var height = this.chatInfoBg.height;

        var box = new Laya.Box();

        var nameLab = new Laya.Label();
        nameLab.text = "[" + name + "]";
        nameLab.fontSize = 20;
        nameLab.color = "#e5aa51"
        nameLab.font = "Microsoft YaHei";
        nameLab.x = 5;

        //表情
        //var expressions = Game.Game.Chat.expression;
        //if(lab.indexOf("/") != -1) {
        //    for (var i = 0; i < expressions.length; i++) {
        //        if (expressions[i].code == msg) {
        //            msg = "assets/ui.room/chat/expression/" + expressions[i].img;
        //            break;
        //        }
        //    }
        //}
        var chatLab = new Laya.Label();
        chatLab.text = lab;
        chatLab.fontSize = 20;
        chatLab.font = "Microsoft YaHei";
        chatLab.x = 5;
        chatLab.y = 25;
        chatLab.color = "#FFFFFF";
        chatLab.wordWrap = true;
        chatLab.width = width;

        box.addChild(nameLab);
        box.addChild(chatLab);

        return box;
    };

    __proto.setChatShowInfo = function (info) {
        if (info) {
            this._showChatList.push(info);
        }
    };

    __proto.updateChatShow = function () {
        if (this._showChatList.length > 0 && this._canUpdateChatShow) {
            this._canUpdateChatShow = false;
            this.chatShowAction();
        }
    };

    __proto.chatShowAction = function () {
        var chatInfo = this._showChatList.shift();
        if (chatInfo) {
            var userId = chatInfo.userID;
            var msg = chatInfo.msg;
            var users = App.tableManager.getRoomLogUsers() || {};
            var name = users[userId].name || "游客";

            var chatBox = this.createChatShowLab(name, msg);
            this.chatInfoBg.addChild(chatBox);
        }
    };

    GameRoomView.POINT_NAME = [
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

    return GameRoomView;
}(GameRoomViewUI));