/**
 * 游戏房间界面
 */
var GameRoomView = (function(_super) {
    function GameRoomView(roomData) {
        GameRoomView.super(this);
        console.log(roomData);
        this._clientShowBox         = null; //*显示的容器
        this._deckNodeShow          = null;
        this._ghostBoxShow          = null;
        this._lightBoxShow          = null;

        this._room                  = roomData;
        this._roomId                = roomData.id;
        this._roomType              = roomData.type;
        this._chairs                = roomData.chairs;
        this._roomBanker            = roomData.banker;
        this._roomMaxChairs         = roomData.maxChairs;

        this._playerBoxs            = []; //*玩家信息显示的位置
        this._userPosInTable        = []; //*玩家在桌子上的位置
        this._sitTagList            = []; //*坐下标志
        this._betBtnList            = []; //*下注按钮
        this._lightList             = []; //*灯光
        this._ghostList             = [];
        this._showGhostList         = [];

        this._canShowEffort         = false; //*是否能显示房间，上一局战绩
        this._isReady               = false; //*是否准备了，用于准备按钮的切换
        this._bankerTagImg          = null;

        this._isLockRoom            = false;

        App.tableManager.saveGameRoom(this);

        this.init();
    }

    Laya.class(GameRoomView, "GameRoomView", _super);

    //*弹出结算界面
    GameRoomView.prototype.showFinalPanel = function () {
        var room = App.tableManager.getRoom();
        var roomLog = room.roomLog;
        //*弹出结算窗口
        var finalView = new FinalDialog(roomLog);
        App.uiManager.addUiLayer(finalView, {isAddShield:true,alpha:0.5,isDispose:false});
    };

    GameRoomView.prototype.showFinalBtn = function () {
        this.finalBtn.visible = true;
    };

    GameRoomView.prototype.changeStandUpState = function () {
        //*庄家不能站起
        var banker = App.tableManager.getRoomBanker();
        var selfId = App.player.getId();
        var roomState = App.tableManager.getRoomState();
        if (banker == selfId || roomState != Game.Room.STATE_READY) {
            this.standUpGray.visible = true;
            this.standUpBtn.visible = false;
        }
        else {
            this.standUpGray.visible = false;
            this.standUpBtn.visible = true;
        }
    };

    GameRoomView.prototype.changeLockRoomState = function (isLock) {
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

    //*发送信息显示，聊天信息显示
    GameRoomView.prototype.showSendChat = function (info) {
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
        //barrageItem.y = Math.random() * ;
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

    //*进行下一轮
    GameRoomView.prototype.nextRound = function (roomInfo) {
        //*清除显示
        this.clearGhostPokers();

        //*是否有切换庄家
        var isChangeBanker = false;
        if (this._roomBanker != roomInfo.banker) {
            isChangeBanker = true;
        }

        this._room       = roomInfo;
        this._roomId     = roomInfo.id;
        this._roomBanker = roomInfo.banker;
        this._chairs     = roomInfo.chairs;

        this.setReadyBtnState();

        //*下注按钮，操作按钮不显示
        this.bankerOperationBox.visible = false;
        this.operationBox.visible = false;
        this.bidBox.visible = false;

        //*有切换庄家
        if (isChangeBanker && this._roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
            this.bankerTagFly();
        }

        if (this._roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            if (this._bankerTagImg) {
                this._bankerTagImg.removeSelf();
                this._bankerTagImg = null;
            }
        }

        //*更新局数
        this.updateRoundNumLab();

        //*清除灯光
        this.unShowAllLight();
    };

    //*更新局数显示
    GameRoomView.prototype.updateRoundNumLab = function () {
        var roundText = App.tableManager.getRoundText();
        this.roundLab.text = roundText;
    };

    //*关闭操作按钮显示
    GameRoomView.prototype.closeOptionBoxs = function () {
        this.bankerOperationBox.visible = false;
        this.operationBox.visible = false;
    };

    GameRoomView.prototype.showNextRoundBtn = function () {
        this.closeOptionBoxs();
        this._isReady = false;

        var selfId = App.player.getId();
        var clients = App.tableManager.getTableClients();
        if (clients[selfId]) {
            this.setStartBoxVisible(true);
        }
        else {
            this.setStartBoxVisible(false);
        }
    };

    //*清除poker结果显示
    GameRoomView.prototype.clearResultPokers = function () {
        this.nextRoundBtn.visible = false;
    };

    GameRoomView.prototype.changeEffortBtnState = function (effortLength) {
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

        this._canShowEffort = canShowEffort;
        this.recordbtn.skin = skin;
        this.recordbtn.stateNum = stateNum;
    };

    //*显示战绩
    GameRoomView.prototype.onShowEffort = function () {
        if (!this._canShowEffort) {
            return;
        }

        App.soundManager.playSound("btnSound");
        var func = function (rounds) {
            var view = new EffortOfRoomDialog(rounds);
            App.uiManager.addUiLayer(view);
        };
        App.tableManager.showRoundEffort(func);
    };

    GameRoomView.prototype.checkCanCloseRoom = function () {
        var roomState = App.tableManager.getRoomState();
        var room = App.tableManager.getRoom();
        var firstPay = room.firstPay;
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

    //*解散房间
    GameRoomView.prototype.closeRoomOfBanker = function () {
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {
            if (err) {
                //*错误提示
            }
        };
        App.netManager.send(
            "room.handler.destroy",
            {
                fn: "",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    GameRoomView.prototype.endRound = function () {
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {
            if (err) {
                //*错误提示
            }
            else {
                self.clearResultPokers();
            }
        };
        App.netManager.send(
            "room.handler.command",
            {
                fn: "end",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*过牌
    GameRoomView.prototype.onPass = function () {
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {
            if (err) {
                //*错误提示
            }
        };
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
    GameRoomView.prototype.outsActionShow = function () {
        App.soundManager.playSound("btnSound");
        var self = this;
        var isBanker = this.selfIsBanker();
        var complete = function (err, data) {
            if (err) {
                //*错误提示
            }

        };

        var fn = "draw";
        if (isBanker && this._roomType != Game.Game.ROOM_TYPE.CHAOS && this._roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
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

    //*普通补牌
    GameRoomView.prototype.outsPoker = function () {
        App.soundManager.playSound("btnSound");
        var isBanker = this.selfIsBanker();
        var self = this;
        var complete;
        if (isBanker && this._roomType != Game.Game.ROOM_TYPE.CHAOS && this._roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
            complete = function (err, data) {
                if (err) {
                    //*错误提示
                }
                else {
                    self.openOutsBtn.disabled = true;
                }
            };
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
            complete = function (err, data) {
                if (err) {
                    //*错误提示
                }
            };
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

    //*明牌
    GameRoomView.prototype.showPokerToPlayer = function () {
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {
            if (err) {
                //*错误提示
            }
        };
        if (this._roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
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
    GameRoomView.prototype.openOutsPlayerPoker = function () {
        App.soundManager.playSound("btnSound");
        var isBanker = this.selfIsBanker();
        if (isBanker) {
            var self = this;
            var complete = function (err, data) {
                if (err) {
                    //*错误提示
                }
            };

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
    GameRoomView.prototype.allPlayerPokerOpen = function () {
        App.soundManager.playSound("btnSound");
        var isBanker = this.selfIsBanker();
        if (isBanker) {
            var self = this;
            var complete = function (err, data) {
                if (err) {
                    //*错误提示
                }
                else {

                }
            };

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

    GameRoomView.prototype.gameWasStarted = function () {
        this.setStartBoxVisible(false);
        //*显示鬼牌
        var table = App.tableManager.getRoom().table;
        var ghostPokers = table.ghostPokers;
        for (var index in ghostPokers) {
            var pokerInfo = ghostPokers[index];
            var showPoker = new Poker(pokerInfo, ghostPokers);
            showPoker.scaleX = 0.3;
            showPoker.scaleY = 0.3;
            showPoker.x += 80 * Number(index);
            this._showGhostList.push(showPoker);
            this._ghostBoxShow.addChild(showPoker);
        }

        this.showNoDoBankerBtn();
    };

    //*开始补牌的操作
    GameRoomView.prototype.playerDrawPoker = function (opt) {
        var userId = opt.userId;
        var handPokers = opt.handPokers;
        this.showLightByUserId(userId);
        var isSelf = this.isSelf(userId);
        if (!isSelf) {
            this.bankerOperationBox.visible = false;
            this.operationBox.visible = false;
            return;
        }
        App.soundManager.playSound("optionSound");
        var ghostArray = [];
        var ghostPokers = App.tableManager.getGhostPokers();
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
                if (poker.type === Game.Poker.TYPE.JOKER || ghostArray.indexOf(poker.value) != -1) {
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
        var clients = App.tableManager.getTableClients();
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

        switch (this._roomType) {
            // 长庄
            case Game.Game.ROOM_TYPE.STATIC: {
                // 一只鬼的时候
                if (ghostCnt === 1) {
                    // 鬼牌万能 只能补牌
                    if (this._room.settings.universalGhost == true) {
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
                    if (this._room.settings.universalGhost == true) {
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
                    if (this._room.settings.universalGhost == true) {
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
                // 定制模式不能明牌和过牌 只能补牌和搓牌
                cantPass = true;
                cantOpen = true;
                break;
            }
        }

        if (this._roomType == Game.Game.ROOM_TYPE.CUSTOMIZED || this._roomType == Game.Game.ROOM_TYPE.CHAOS) {
            this.bankerOperationBox.visible = false;
            this.operationBox.visible = true;
        }
        else {
            var isBanker = this.selfIsBanker();
            if (isBanker) {
                this.bankerOperationBox.visible = true;
                this.operationBox.visible = false;

                if (this._roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
                    cantPass = true;
                    cantOpen = true;
                    if (this._roomType == Game.Game.ROOM_TYPE.CHAOS) {
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

        this.showToOtherBtn.disabled = cantOpen;
        this.passBtn.disabled = cantPass;
        this.outsBtn.disabled = cantDraw;
        this.bankerOutsBtn.disabled = cantDraw;
        this.outsActionBtn.disabled = cantRubbed;
        this.bankerOutsActionBtn.disabled = cantRubbed;

        this.allOpenBtn.disabled = cantBetAll;
        this.openOutsBtn.disabled = cantBetDraw;
    };

    //*下注结束
    GameRoomView.prototype.bidEnd = function () {
        this.bidBox.visible = false;
    };

    GameRoomView.prototype.touchBetBtn = function (betNum) {
        var selfId = App.player.getId();
        var clients = App.tableManager.getTableClients();
        if (clients[selfId] && clients[selfId].bid && clients[selfId].bidRate > 0) {
            return;
        }

        betNum = betNum || 1;
        var self = this;
        var complete = function (err, data) {
            if (err) {
                //*错误提示
            }
        };
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

    //*恢复房间状态的时候显示下注按钮
    GameRoomView.prototype.showBidOptionOnInitRoom = function (opt) {
        var userId = App.player.getId();
        var clients = App.tableManager.getTableClients();
        var roomSetting = this._room.settings;
        var chaosBet = roomSetting.chaosBet;

        if (this._room.type == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            //*定制模式自动下注
            this.touchBetBtn();
        }
        else if (this._room.type == Game.Game.ROOM_TYPE.CHAOS) {
            //*混战模式，是不是自由下注
            if (chaosBet) {
                this.showBidOption(opt);
            }
            else {
                this.touchBetBtn();
            }
        }
        else if (App.tableManager.getRoomBanker() == userId) {
            this.touchBetBtn();
        }
        else {
            this.showBidOption(opt);
        }
    };

    GameRoomView.prototype.showBidOption = function (opt) {
        var userId = opt.userID;
        var lastBidRate = opt.lastBidRate;

        //*恢复下注按钮的可点击
        var length = this._betBtnList.length;
        for (var index = 0; index < length; index ++) {
            this._betBtnList[index].disable = false;
        }

        //*是否是一肛到底
        var isMoreThenMore = false;
        if (this._room.settings["betType"] == Game.Game.BET_TYPE.MORE_THEN_MORE) {
            isMoreThenMore = true;
        }

        var isSelf = this.isSelf(userId);
        var isShowBidBox = false;
        if (isSelf) {
            isShowBidBox = true;

            if (isMoreThenMore && lastBidRate > 0) {
                for (var i = 0; i < lastBidRate - 1; i++) {
                    this._betBtnList[i].disabled = true;
                }
            }
            else {
                for (var index = 0; index < this._betBtnList.length; index++) {
                    this._betBtnList[index].disabled = false;
                }
            }

        }

        this.bidBox.visible = isShowBidBox;
    };

    //*开始下注
    GameRoomView.prototype.pokerBid = function (opt) {
        this.showBidOptionOnInitRoom(opt);
    };

    //*清除鬼牌显示
    GameRoomView.prototype.clearGhostPokers = function () {
        for (var ghostIndex = 0; ghostIndex < this._ghostList.length; ghostIndex++) {
            this._ghostList[ghostIndex].dispose();
        }
        this._ghostList = [];

        for (var showGhostIndex = 0; showGhostIndex < this._showGhostList.length; showGhostIndex ++) {
            this._showGhostList[showGhostIndex].dispose();
        }
        this._showGhostList = [];
    };

    //*显示鬼牌
    GameRoomView.prototype.showGhostPoker = function () {
        if (this._showGhostList[this._ghostIndex]) {
            this._showGhostList[this._ghostIndex].visible = true;
        }
        this._ghostIndex++;
        if (this._ghostIndex >= this._showGhostList.length) {
            //*鬼牌表现做完
            App.tableManager.ghostFinish();
        }
    };

    //*飞出来的鬼牌动作
    GameRoomView.prototype.ghostPokersAction = function (ghostPoker) {
        ghostPoker = ghostPoker || [];
        if (ghostPoker.length <= 0) {
            App.tableManager.ghostFinish();
        }
        var index;
        var pokerInfo;
        this._ghostList     = [];
        this._showGhostList = [];
        this._ghostIndex    = 0;
        for (index in ghostPoker) {
            pokerInfo = ghostPoker[index];

            var poker = new Poker(pokerInfo, ghostPoker);
            poker.scaleX = 0.5;
            poker.scaleY = 0.5;
            poker.x = this._deckNodeShow.x + 100 * Number(index);
            this._clientShowBox.addChild(poker);
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

    GameRoomView.prototype.setStartBoxVisible = function (visible) {
        visible = visible ? true : false;
        this.readyBtn.visible = visible;
        this.setReadyBtnState();
    };

    //*房间中游戏开始
    GameRoomView.prototype.gameStart = function () {
        this.setStartBoxVisible(false);
        //*start animation

        //*通知可以给每个人做发牌的表现
        App.tableManager.dealPlayerPokerAction();
    };

    //*抢庄结束
    GameRoomView.prototype.robFinish = function (banker) {
        this._roomBanker = banker;
        //*关闭抢庄按钮
        this.grabBankerBtn.visible = false;
        //*创建庄家标记
        if (!this._bankerTagImg) {
            this.createBankerTagImg();
        }
        else {
            this.bankerTagFly();
        }
    };

    //*抢庄的倒计时
    GameRoomView.prototype.readyGrabBanker = function () {
        this._grabBankerTime --;
        if (this._grabBankerTime <= 0) {
            Laya.timer.clear(this, this.readyGrabBanker);
            this.countdownLab.visible = false;
            //*显示抢庄按钮
            this.showGrabBanker();
        }
        else {
            this.countdownImg.skin = "assets/ui.room/img_Count_down" + this._grabBankerTime + ".png";
        }
    };

    GameRoomView.prototype.showGrabBanker = function () {
        //*显示抢庄按钮
        this.grabBankerBtn.visible = true;
    };

    //*全部准备完成之后，定制模式，需要显示抢庄，显示倒计时
    GameRoomView.prototype.readyFinish = function () {
        if (this._roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            this.setStartBoxVisible(false);
            this.countdownLab.visible = true;
            this._grabBankerTime = 3;
            this.countdownImg.skin = "assets/ui.room/img_Count_down" + this._grabBankerTime + ".png";
            //*开始三秒倒计时
            Laya.timer.loop(1000, this, this.readyGrabBanker);
        }
    };

    //*按下抢庄
    GameRoomView.prototype.onGrabBanker = function () {
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

    //*设置准备按钮的状态
    GameRoomView.prototype.setReadyBtnState = function () {
        var skin = "assets/ui.room/img_GetReady.png";
        var btnSkin  = "assets/ui.room/btn_yellow.png";
        if (this._isReady) {
            skin = "assets/ui.room/img_cancel.png";
            btnSkin = "assets/ui.room/btn_blue.png";
        }
        else {
            var roomBanker = App.tableManager.getRoomBanker();
            var selfId = App.player.getId();
            var isRoomHost = App.tableManager.isRoomHost();
            if ( (roomBanker == selfId && this._roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) ||
                (this._roomType == Game.Game.ROOM_TYPE.CUSTOMIZED && isRoomHost)) {
                skin = "assets/ui.room/img_Go.png";
                btnSkin = "assets/ui.room/btn_blue.png";
            }
        }
        this.readyBtnImg.skin = skin;
        this.readyBtn.skin = btnSkin;
    };

    GameRoomView.prototype.setReadyValue = function () {
        var selfId = App.player.getId();
        var clients = App.tableManager.getTableClients();
        if (clients[selfId]) {
            this._isReady = !this._isReady;
            this.setReadyBtnState();
        }
    };

    GameRoomView.prototype.touchReadyBtn = function () {
        //*清除桌面上的东西
        var room = App.tableManager.getRoom();
        this.nextRound(room);
        App.tableManager.startNextRound();

        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
            else {
                self.setReadyValue();
            }
        };
        App.soundManager.playSound("btnSound");
        var ready = !this._isReady;

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

    GameRoomView.prototype.setOpenOutBtnDisabled = function () {
        this.openOutsBtn.disabled = true;
    };

    //*不做庄，勾选显示
    GameRoomView.prototype.setNoDoBankerTick = function () {
        var selfId = App.player.getId();
        var notBanker = App.tableManager.checkNotBanker(selfId) ? true : false;
        this.bankerTick.visible = notBanker;
    };

    //*显示不做庄家操作
    GameRoomView.prototype.showNoDoBankerBtn = function () {
        var roomType = this._room.type;
        if (roomType == Game.Game.ROOM_TYPE.CLASSICAL) {
            this.noDoBanker.visible = true;
        }
        else {
            this.noDoBanker.visible = false;
        }

        var selfId = App.player.getId();
        var notBanker = App.tableManager.checkNotBanker(selfId);
        this.setNoDoBankerTick(notBanker);
    };

    //*点击不做庄家
    GameRoomView.prototype.onNoDoBanker = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
        };
        App.netManager.send(
            "room.handler.command",
            {
                fn: "rejectBanker",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*更换桌布
    GameRoomView.prototype.changeTableShow = function () {
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

    //*设置界面
    GameRoomView.prototype.onSetting = function () {
        App.soundManager.playSound("btnSound");
        var settingPanel = new SettingDialog();
        App.uiManager.addUiLayer(settingPanel);
        settingPanel.on(SettingDialog.Events.CHANGE_TABLE, this, this.changeTableShow);
    };

    GameRoomView.prototype.onPokerType = function () {
        var showPokerType = new ShowPokerTypeDialog();
        this.addChild(showPokerType);
    };

    //*规则查看
    GameRoomView.prototype.onShowRulePanel = function () {
        App.soundManager.playSound("btnSound");
        var setting = this._room.settings;
        var type = this._room.type;
        var info = {};
        for (var index in setting) {
            info[index] = setting[index];
        }
        info.type = type;
        var rulePanel = new ShowRuleDialog(info);
        App.uiManager.addUiLayer(rulePanel);
    };

    //*聊天
    GameRoomView.prototype.onShowChatPanel = function () {
        App.soundManager.playSound("btnSound");
        this.chatView = new ChatViewDialog();
        App.uiManager.addUiLayer(this.chatView, {isAddShield:true,alpha:0,isDispose:true});
    };

    //*点击站起
    GameRoomView.prototype.touchStandUp = function () {
        var roomState = App.tableManager.getRoomState();
        if (roomState != Game.Room.STATE_READY) {
            return;
        }
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
        };
        App.netManager.send(
            "room.handler.stand_up",
            {
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*点击坐下
    GameRoomView.prototype.touchSitBtn = function (sitId) {
        //*不是准备状态不能坐下或者换位置
        var roomState = App.tableManager.getRoomState();

        var self = this;
        var selfChairId = App.tableManager.getCharis().indexOf(App.player.getId());
        var maxChair = this._roomMaxChairs;

        if (sitId < 0 || sitId >= maxChair) {
            sitId = 0;
        }

        var pos = sitId + selfChairId;
        if (pos >= maxChair) {
            pos -= maxChair;
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

    //*庄家标记飞行
    GameRoomView.prototype.bankerTagFly = function () {
        var bankerId = this._roomBanker;
        if (bankerId) {
            var sitSprite = this.getTableIndexByUserId(bankerId);
            var posX = sitSprite.x - 40;
            var posY = sitSprite.y - 50;
            var moveTo = MoveTo.create(0.5, posX, posY);
            App.actionManager.addAction(moveTo, this._bankerTagImg);
            this._bankerTagImg.zOrder = 100;
        }
    };

    //*创建庄家标记
    GameRoomView.prototype.createBankerTagImg = function () {
        var bankerId = App.tableManager.getRoomBanker();
        //*找到庄家的位置
        var sitSprite = this.getTableIndexByUserId(bankerId);
        if (!this._bankerTagImg && sitSprite) {
            var img = new Laya.Image("assets/ui.room/icon_banker.png");
            this._clientShowBox.addChild(img);
            img.zOrder = 100;
            img.scaleX = 1.5;
            img.scaleY = 1.5;
            img.x = sitSprite.x - 50;
            img.y = sitSprite.y - 70;
            this._bankerTagImg = img;
        }
    };

    //*解散房间按钮状态
    GameRoomView.prototype.changeDisbandBtnState = function (whoCanDisband) {
        whoCanDisband = whoCanDisband || "banker";
        var roomHost = this._room.host;
        var selfId = App.player.getId();

        switch (whoCanDisband) {
            case "banker" : {
                if (roomHost == selfId) {
                    this.disbandGray.visible = false;
                    this.disbandBtn.visible = true;
                }
                else {
                    this.disbandGray.visible = true;
                    this.disbandBtn.visible = false;
                }
                break;
            }

            case "all" : {
                this.disbandGray.visible = false;
                this.disbandBtn.visible = true;
                break;
            }
        }
    };

    GameRoomView.prototype.updateViewShow = function () {
        this.roomIdLab.text = this._roomId;
        //*恢复状态
        App.tableManager.stateRestore();

        //*混战模式不显示庄家，自定模式一开始不显示庄家
        if (this._roomType != Game.Game.ROOM_TYPE.CHAOS && this._roomType != Game.Game.ROOM_TYPE.CUSTOMIZED) {
            this.createBankerTagImg();
        }

        this.setReadyBtnState();

        this.updateRoundNumLab();

        this.changeTableShow();

        this.showNoDoBankerBtn();
    };

    GameRoomView.prototype.clearTableIconById = function (userId) {
        var index = this._userPosInTable.indexOf(userId);
        if (index != -1) {
            this._userPosInTable[index] = null;
            //*站起显示坐下的标志
            this._sitTagList[index].visible = true;
        }

        if (userId == App.player.getId()) {
            this.setStartBoxVisible(false);
        }

        //*如果是庄家删除增加标志
        if (App.tableManager.getRoomBanker() == userId && this._bankerTagImg) {
            this._bankerTagImg.removeSelf();
            this._bankerTagImg = null;
        }
    };

    //*站起
    GameRoomView.prototype.playerStand = function (userId) {
        this._isReady = false;
        var isSelf = this.isSelf(userId);
        if (isSelf) {
            //*清除桌面上东西
            var room = App.tableManager.getRoom();
            this.nextRound(room);
            App.tableManager.startNextRound();
        }

        this.clearTableIconById(userId);
    };

    //*坐下
    GameRoomView.prototype.playerSitDown = function (info) {
        var userId = info.userID;
        //*如果是自己换位，重新刷新一下坐下的标志
        if (userId == App.player.getId()) {
            for (var index in this._sitTagList) {
                this._sitTagList[index].visible = true;
            }
        }
        //*刷新头像显示
        var chairs = App.tableManager.getCharis();
        for (var i = 0; i < chairs.length; i++) {
            if (chairs[i]) {
                this.clearTableIconById(chairs[i]);
                this.joinPlayer({userID: chairs[i]});
                var roomState = App.tableManager.getRoomState();
                if (roomState == Game.Room.STATE_READY) {
                    this.setStartBoxVisible(true);
                }
            }
        }
    };

    //*有人退出
    GameRoomView.prototype.playerExit = function () {

    };

    //*有玩家加入
    GameRoomView.prototype.joinPlayer = function (playerInfo) {
        var pos    = playerInfo.pos; //*位置
        var userId = playerInfo.userID;
        console.log(playerInfo);
        if (pos < 0) {
            //*站起的状态
            return;
        }

        //*加入新玩家
        this.createPlayerIcon(userId, pos);
    };

    GameRoomView.prototype.createPlayerIcon = function (playerUserId, pos) {
        var roomBanker = App.tableManager.getRoomBanker();
        //*判断自己是不是站起的状态，没有在椅子上
        var selfUserID = App.player.getId();
        var chairs = App.tableManager.getCharis();
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
                    indexDiff = this._roomMaxChairs + indexDiff;
                }
                posInTable = indexDiff;
                canCreate = true;
            }
        }

        if (canCreate) {
            var playerBoxList = App.tableManager.getRoomPlayerBox();
            if (playerBoxList[playerUserId]) {
                playerIcon = playerBoxList[playerUserId];
            }
            else {
                playerIcon = new RoomPlayerBox({userID: playerUserId});
            }

            playerIcon.y = this._playerBoxs[posInTable].y - 70;
            playerIcon.x = this._playerBoxs[posInTable].x - 70;
            playerIcon.zOrder = -10;
            playerIcon.changeBetLabPos(posInTable);
            this._clientShowBox.addChild(playerIcon);
            this._sitTagList[posInTable].visible = false;
            this._userPosInTable[posInTable] = playerUserId;

            App.tableManager.addPlayerBox(playerUserId, playerIcon);

            //*恢复庄家标识
            if (roomBanker && this._roomType != Game.Game.ROOM_TYPE.CHAOS && roomBanker == playerUserId) {
                if (this._bankerTagImg) {
                    this.bankerTagFly();
                }
                else {
                    this.createBankerTagImg();
                }
            }
        }
    };

    GameRoomView.prototype.showChairsInRoom = function () {
        //*显示房间头像
        var selfId  = App.player.getId();
        var selfPos = this._chairs.indexOf(selfId);
        for (var index = 0; index < this._roomMaxChairs; index++) {
            var sitId = selfPos + index;
            if (sitId >= this._roomMaxChairs) {
                sitId = sitId - this._roomMaxChairs;
            }
            var userID = this._chairs[sitId];
            if (userID) {
                this.createPlayerIcon(userID);
            }
        }
    };

    GameRoomView.prototype.unShowAllLight = function () {
        for (var index in this._lightList) {
            this._lightList[index].visible = false;
        }
    };

    //*显示操作灯光
    GameRoomView.prototype.showLightByUserId = function (userId) {
        this.unShowAllLight();
        if (this._userPosInTable.indexOf(userId) != -1) {
            var index = this._userPosInTable.indexOf(userId);
            this._lightList[index].visible = true;
        }
    };

    //*初始化房间玩家头像信息
    GameRoomView.prototype.initPlayerInfoIconShow = function () {
        this._clientShowBox = this.playersBox_eight;
        this.playersBox.visible = false;

        this._deckNodeShow = this._clientShowBox.getChildByName("deckNode"); //* 发牌的位置
        this._ghostBoxShow = this._clientShowBox.getChildByName("ghostBox"); //* 鬼牌的位置
        this._lightBoxShow = this._clientShowBox.getChildByName("lightBox"); //* 灯光的box
        //*获取位置
        var playersBox = this._clientShowBox;

        for (var i = 0; i < this._room.maxChairs; i++) {
            var playerSprite = playersBox.getChildByName("player_" + i);
            //*注册坐下的按钮
            if (playerSprite) {
                //*创建坐下的标志
                var sitBg = new Laya.Image("assets/ui.room/img_Sitdown_1.png");
                sitBg.anchorX = 0.5;
                sitBg.anchorY = 0.5;
                var sitTag = new Laya.Image("assets/ui.room/img_Sitdown.png");
                sitTag.anchorX = 0.5;
                sitTag.anchorY = 0.5;
                sitTag.x = 54.5;
                sitTag.y = 54.5;
                sitBg.addChild(sitTag);
                sitBg.on(Laya.Event.CLICK, this, this.touchSitBtn, [i]);
                playerSprite.addChild(sitBg);

                this._sitTagList.push(sitBg);

                this._playerBoxs.push(playerSprite);
            }

            //*储存显示灯光
            var light = this._lightBoxShow.getChildByName("light_" + i);
            light.visible = false;
            this._lightList.push(light);
        }

        //*进入房间时候，显示坐下的人
        this.showChairsInRoom();
    };

    //*返回大厅
    GameRoomView.prototype.backToLobby = function () {
        if (this._isLockRoom) {
            return;
        }

        var roomHost = this._room.host;
        var selfId = App.player.getId();
        if (selfId == roomHost) {
            this.dispose();
        }
        else {
            this.leaveRoom();
        }
    };

    GameRoomView.prototype.initEvent = function () {
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

        var tableEvent = [
            {"eventName":RoomTableMgr.EVENT.JOIN_PLYER, "eventFunc":this.joinPlayer},
            {"eventName":RoomTableMgr.EVENT.GAME_START, "eventFunc":this.gameStart},
            {"eventName":RoomTableMgr.EVENT.ROOM_STATE_ROB, "eventFunc":this.showGrabBanker},
            {"eventName":RoomTableMgr.EVENT.READY_FINISH, "eventFunc":this.readyFinish},
            {"eventName":RoomTableMgr.EVENT.ROB_FINISH, "eventFunc":this.robFinish},
            {"eventName":RoomTableMgr.EVENT.GHOST_POKER, "eventFunc":this.ghostPokersAction},
            {"eventName":RoomTableMgr.EVENT.BID, "eventFunc":this.pokerBid},
            {"eventName":RoomTableMgr.EVENT.BID_END, "eventFunc":this.bidEnd},
            {"eventName":RoomTableMgr.EVENT.DRAW_POKERS, "eventFunc":this.playerDrawPoker},
            {"eventName":RoomTableMgr.EVENT.GAME_WAS_STRATED, "eventFunc":this.gameWasStarted},
            {"eventName":RoomTableMgr.EVENT.SHOW_BID_OPTION, "eventFunc":this.showBidOptionOnInitRoom},
            {"eventName":RoomTableMgr.EVENT.DO_PAY, "eventFunc":this.closeOptionBoxs},
            {"eventName":RoomTableMgr.EVENT.COMPARISON_END, "eventFunc":this.showNextRoundBtn},
            {"eventName":RoomTableMgr.EVENT.NEXT_ROUND, "eventFunc":this.nextRound},
            {"eventName":RoomTableMgr.EVENT.STAND, "eventFunc":this.playerStand},
            {"eventName":RoomTableMgr.EVENT.SITDOWN, "eventFunc":this.playerSitDown},
            {"eventName":RoomTableMgr.EVENT.CLOSE_ROOM, "eventFunc":this.dispose},
            {"eventName":RoomTableMgr.EVENT.LOCKED_ROOM, "eventFunc":this.changeLockRoomState},
            {"eventName":RoomTableMgr.EVENT.CHANGE_EFFORT_BTN, "eventFunc":this.changeEffortBtnState},
            {"eventName":RoomTableMgr.EVENT.REJECT_BANKER, "eventFunc":this.setNoDoBankerTick},
            {"eventName":RoomTableMgr.EVENT.CANT_OPEN_OUTS, "eventFunc":this.setOpenOutBtnDisabled},
            {"eventName":RoomTableMgr.EVENT.CHANGE_DISBAND_STATE, "eventFunc":this.changeDisbandBtnState},
        ];

        for (var eventIndex in tableEvent) {
            var eventInfo = tableEvent[eventIndex];
            var eventName = eventInfo["eventName"];
            var eventFunc = eventInfo["eventFunc"];
            App.tableManager.on(eventName, this, eventFunc);
        }
    };

    GameRoomView.prototype.init = function() {
        App.tableManager.setRoomInfo(this._room);
        this.initEvent();
        this.initPlayerInfoIconShow();
        this.updateViewShow();
        App.soundManager.playMusic("roomMusic");
    };

    //*检查自己是不是房主
    GameRoomView.prototype.selfIsBanker = function () {
        var isBanker = false;
        var selfId = App.player.getId();
        var roomBanker = App.tableManager.getRoomBanker();
        if (selfId == roomBanker) {
            isBanker = true;
        }

        return isBanker;
    };

    //*检查是否是自己
    GameRoomView.prototype.isSelf = function (userId) {
        var isSelfId = true;
        var selfId = App.player.getId();
        if (selfId != userId) {
            isSelfId = false;
        }

        return isSelfId;
    };

    GameRoomView.prototype.refurbishTableShow = function (room) {
        this._userPosInTable = [];

        this._room = room;
        this._chairs = this._room.chairs;

        this.clearGhostPokers();
        //*更新局数
        this.updateRoundNumLab();
        //*清除灯光
        this.unShowAllLight();

        this.showChairsInRoom();

        //*下注按钮，操作按钮不显示
        this.bankerOperationBox.visible = false;
        this.operationBox.visible = false;
        this.bidBox.visible = false;
    };

    GameRoomView.prototype.getTableIndexByUserId = function (userId) {
        if (this._userPosInTable.indexOf(userId) != -1) {
            var index = this._userPosInTable.indexOf(userId);
            return this._playerBoxs[index];
        }
    };

    GameRoomView.prototype.getDeckNode = function () {
        return this._deckNodeShow;
    };

    GameRoomView.prototype.getPlayersBox = function () {
        return this._clientShowBox;
    };

    GameRoomView.prototype.leaveRoom = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {
                return;
            }

            self.dispose();
            App.tableManager.quitRoom();
        };
        //*退出房间
        App.netManager.send(
            "room.handler.leave",
            {
                //fn: "leave",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );

    };

    GameRoomView.prototype.dispose = function () {
        App.soundManager.playSound("btnSound");
        App.soundManager.playMusic("lobbyMusic");
        Laya.timer.clearAll(this);
        App.uiManager.removeGameRoomView();
        App.lobbyView.updateView();
    };

    GameRoomView.SHOW_POKER_TYPE = {
        BANKER: 1,
        PLYER: 2
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