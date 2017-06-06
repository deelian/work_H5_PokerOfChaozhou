/**
 * 房间桌面状态显示管理器
 */
var RoomTableMgr = (function(_super) {

    function RoomTableMgr() {

        this.init();
    }

    Laya.class(RoomTableMgr, "RoomTableMgr", _super);

    RoomTableMgr.prototype.getGhostInTable = function () {
        return this._ghostPokers || {};
    };

    RoomTableMgr.prototype.getRoomLogUsers = function () {
        return this._roomInfo.roomLog["users"];
    };

    RoomTableMgr.prototype.getRoomPlayerBox = function () {
        return this._playerBoxList;
    };

    RoomTableMgr.prototype.getChatSaveList = function () {
        return this._chatSaveList;
    };

    //*是否不做庄家
    RoomTableMgr.prototype.checkNotBanker = function (userId) {
        var notBanker = false;
        if (this._roomInfo) {
            var table = this._roomInfo.table;
            var clients = table.clients;
            if (clients[userId]) {
                notBanker = clients[userId].notBank;
            }
        }

        return notBanker;
    };

    //*查询是否被禁言
    RoomTableMgr.prototype.checkForbiddenByUserId = function (userId) {
        var isForbidden = false;
        if (this._forbiddenList.indexOf(userId) != -1) {
            isForbidden = true;
        }
        return isForbidden;
    };

    //*获取禁言列表
    RoomTableMgr.prototype.getForbidden = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
            else {
                self._forbiddenList = data;
            }
        };
        App.netManager.send(
            "room.handler.get_forbidden",
            {

            },
            Laya.Handler.create(null, complete)
        );
    };

    //*局数
    RoomTableMgr.prototype.getRoundText = function () {
        var text = "";
        var maxRound = this._roomInfo.maxRound;
        var round = this._roomInfo.round + 1;
        text = round + "/" + maxRound;
        return text;
    };

    RoomTableMgr.prototype.getRoomType = function () {
        return this._roomInfo.type;
    };

    RoomTableMgr.prototype.getRoomBanker = function () {
        return this._roomInfo.banker;
    };

    //*是不是房主
    RoomTableMgr.prototype.isRoomHost = function (userId) {
        userId = userId || App.player.getId();
        var isHost = false;
        if (userId == this._roomInfo.host) {
            isHost = true;
        }

        return isHost;
    };

    RoomTableMgr.prototype.getRoomMembers = function () {
        return this._roomInfo.members;
    };

    RoomTableMgr.prototype.getCharis = function () {
        return this._chairs || this._roomInfo.chairs;
    };

    RoomTableMgr.prototype.getTableClients = function () {
        return this._roomInfo.table.clients;
    };

    RoomTableMgr.prototype.getGhostPokers = function () {
        var rooInfo = this._roomInfo || {};
        if (rooInfo.table && rooInfo.table.ghostPokers) {
            return rooInfo.table.ghostPokers;
        }
        else {
            return {};
        }
    };

    RoomTableMgr.prototype.getRoomState = function () {
        return this._roomInfo.state;
    };

    RoomTableMgr.prototype.getRoom = function () {
        return this._roomInfo;
    };

    //*离开房间
    RoomTableMgr.prototype.leaveRoom = function (info) {
        this._roomInfo = info.room;
        this._chairs = this._roomInfo.chairs;

        var userId = info.userID;
        //*删掉头像
        this.delPlayerBox(userId);
        this.event(RoomTableMgr.EVENT.STAND, [userId]);
    };

    //*确认/取消 解散
    RoomTableMgr.prototype.disMissConfirm = function (info) {
        var confirm = info.confirm;
        var userId;
        if (confirm == null) {
            this._roomInfo = info;
            this._chairs = this._roomInfo.chairs;
        }
        else if (confirm == true) {
            userId = info.userID;
            if (this._disbandPanel) {
                this._disbandPanel.changePanelShow(userId, confirm);
            }
        }
        else if (confirm == false) {
            this._confirmFalseUser = info.userID;
        }
    };

    RoomTableMgr.prototype.disMissResult = function (info) {
        var result = info.result;
        if (!result) {
            //*解散失败，弹出提示框
            var roomLog = this._roomInfo.roomLog || {};
            var users = roomLog.users || {};
            var name = "游客";
            if (users[this._confirmFalseUser] != null && users[this._confirmFalseUser].name != null) {
                name = users[this._confirmFalseUser].name;
            }
            
            var str = "由于" + name + "拒绝，房间解散失败，游戏继续！";
            App.uiManager.showMessage({msg:str});
        }

        if (this._disbandPanel) {
            this._disbandPanel.close();
            this._disbandPanel = null;
        }
    };

    //*申请解散
    RoomTableMgr.prototype.disMissRoom = function (info,disMissInfo) {
        info = info || {};
        var userID = info.userID || App.player.getId();
        var name = info.name || "游客";
        var panelInfo = null;
        if (disMissInfo) {
            var dismissConfirmList = disMissInfo.dismissConfirmList || {};
            var dismissStamp = disMissInfo.dismissStamp || 0;
            panelInfo = {dismissConfirmList: dismissConfirmList, dismissStamp: dismissStamp};
        }
        //*弹出确认的窗口
        if (!this._disbandPanel && this._roomInfo) {
            var disbandRoomDialog = new DisbandDialog(userID, panelInfo, name);
            App.uiManager.addUiLayer(disbandRoomDialog, {isAddShield:true,alpha:0.5,isDispose:false});
            this._disbandPanel = disbandRoomDialog;
        }
    };

    //*坐下
    RoomTableMgr.prototype.sitDown = function (info) {
        this._chairs = info.chairs;
        this.event(RoomTableMgr.EVENT.SITDOWN, [info]);
    };

    //*自动站起
    RoomTableMgr.prototype.standUp = function (info) {
        var userId = info.userID;
        //*删掉头像
        this.delPlayerBox(userId);
        this.event(RoomTableMgr.EVENT.STAND, [userId]);
    };

    //*强制站起
    RoomTableMgr.prototype.letStandUp = function (info) {
        var userId = info.userID;
        //*删除自己的头像
        this.delPlayerBox(userId);
        this.event(RoomTableMgr.EVENT.STAND, [userId]);
    };

    //*踢出房间
    RoomTableMgr.prototype.kickUser = function (info) {
        var userId = info.userID;
        var selfId = App.player.getId();
        if (selfId == userId) {
            this.quitRoom();
        }
        else {
            //*删掉头像
            this.delPlayerBox(userId);
        }
    };

    //*解除禁言
    RoomTableMgr.prototype.forbidCancelPlayer = function (info) {
        var userId = info.userID;
        var index = this._forbiddenList.indexOf(userId);
        if (index != -1) {
            this._forbiddenList.splice(index, 1);
            this.event(RoomTableMgr.EVENT.CANCEL_FORBIDDEN, [userId]);
        }
    };

    //*禁言
    RoomTableMgr.prototype.forbidPlayer = function (info) {
        var userId = info.userID;
        if (this._forbiddenList.indexOf(userId) == -1) {
            this._forbiddenList.push(userId);
            this.event(RoomTableMgr.EVENT.FORBIDDEN_PLYAER, [userId]);
        }
    };

    //*发送聊天信息
    RoomTableMgr.prototype.sandChat = function (info) {
        var userId = info.userID;
        var msg = info.msg;
        var normalChat = Game.Game.Chat.normal;
        var index = normalChat.indexOf(msg);
        if (index != -1) {
            //*播放语音
            App.soundManager.playSound("chat_normal_" + index);
        }
        this._chatSaveList.push(info);
        this.event(RoomTableMgr.EVENT.SAND_CHAT_DATA, [info]);
    };

    //*显示战绩
    RoomTableMgr.prototype.showRoundEffort = function (cb) {
        var rounds = this._roomInfo.roomLog["rounds"];
        cb && cb(rounds);
    };

    RoomTableMgr.prototype.quitRoom = function () {
        App.removeRoomID();
        App.tableManager.clearGameRoom();
        //*关闭房间
        this.event(RoomTableMgr.EVENT.CLOSE_ROOM);
    };

    //*局数到达上限，结束房间
    RoomTableMgr.prototype.closeAndRemoveRoom = function (info) {
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
        var roomLog = this._roomInfo.roomLog;
        var firstPay = this._roomInfo.firstPay;
        var round = this._roomInfo.round + 1;
        var maxRound = this._roomInfo.maxRound;
        var gameRoom = App.uiManager.getGameRoom();
        if (firstPay) {
            if (round >= maxRound) {
                //*结算按钮
                gameRoom.showFinalBtn();
                gameRoom.closeOptionBoxs();
            }
            else{
                //*弹出结算窗口
                gameRoom.showFinalPanel();
            }
        }
        else {
            this.quitRoom();
        }
    };

    RoomTableMgr.prototype.startNextRound = function () {
        if (this._deckPoker) {
            this._deckPoker.dispose();
            this._deckPoker = null;
        }

        this.clearPokerImgList();
        this._ghostPokers    = null; //*鬼牌
        this._dealRound      = 1; //*第几轮的牌
        this._dealUser       = 0; //*到谁
        this._openPokerIndex = 0;
        this._outOpenIndex   = 0;
        this._commadSate     = RoomTableMgr.COMMAND_STATE.CHECK; //*消息处理的状态
        this._pokerImgList   = [];

        //*初始化界面，提示准备
        for (var index in this._playerBoxList) {
            this._playerBoxList[index].endRound(true);
        }
    };

    RoomTableMgr.prototype.endRound = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {
                //*错误提示
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

    //*刷新比分
    RoomTableMgr.prototype.refurbishGold = function () {
        var client = this._roomInfo.table.clients;

        for (var i in client) {
            var playerId = client[i].userID;
            var gold = client[i].gold || 0;
            this._playerBoxList[playerId].setGoldLabText(gold);
        }
    };

    RoomTableMgr.prototype.bankerOptionEnd = function (info) {
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
    };

    //*开补的比牌
    RoomTableMgr.prototype.nextOutsComparison = function () {
        var outComparisonLength = this._outsComparisonList.length;
        if (this._outOpenIndex >= outComparisonLength) {
            //*下一个指令
            this.commandNext();
        }
        else {
            var nextComparisonUser = this._outsComparisonList[this._outOpenIndex];
            this._outOpenIndex ++;
            if (nextComparisonUser == "ghostPokers") {
                this.nextOutsComparison();
            }
            else {
                if (nextComparisonUser != "bankerScore") {
                    Laya.timer.once(800, this, this.comparisonPoker, [nextComparisonUser, true]);
                }
                else {
                    this.nextOutsComparison();
                }
            }
        }
    };

    //*进行下一个比牌
    RoomTableMgr.prototype.nextComparison = function () {
        var comparisonLength = this._comparisonList.length;
        var roomState = this._roomInfo.state;
        if (this._openPokerIndex >= comparisonLength) {
            if (roomState == Game.Room.STATE_READY) {
                //*比牌完毕，显示准备按钮
                this.event(RoomTableMgr.EVENT.COMPARISON_END);
                //*下一个指令
                this.commandNext();
            }
        }
        else {
            var nextComparisonUser = this._comparisonList[this._openPokerIndex];
            this._openPokerIndex ++;
            if (nextComparisonUser == "ghostPokers") {
                this.nextComparison();
            }
            else {
                if (this._roomInfo.type == Game.Game.ROOM_TYPE.CHAOS) {
                    Laya.timer.once(800, this, this.comparisonPoker, [nextComparisonUser]);
                }
                else {
                    if (Number(nextComparisonUser) != this._roomInfo.banker) {
                        Laya.timer.once(800, this, this.comparisonPoker, [nextComparisonUser]);
                    }
                    else {
                        this.nextComparison();
                    }
                }
            }
        }
    };

    RoomTableMgr.prototype.comparisonPoker = function (userId, isOpenOuts) {
        //*isOpenOuts 是不是开补了
        isOpenOuts = isOpenOuts ? true : false;
        userId = userId || App.player.getId();

        var pokerType;
        var handPokers;
        var score;
        var fancy;
        var gold;
        var point;

        if (isOpenOuts) {
            //*开补就用table.roundLog
            var gambleUser = userId;
            // if (userId == this.getRoomBanker()) {
            //     gambleUser = "bankerScore";
            // }

            var clients = this._roomInfo.table.clients;
            handPokers = clients[userId].handPokers || [];
            pokerType = this._gamble[gambleUser].type || "point";
            score = this._gamble[gambleUser].score || 101;
            gold = this._gamble[gambleUser].gold || 0;
            fancy = this._gamble[gambleUser].fancy || "normal";
            point = this._gamble[gambleUser].point;
        }
        else {
            var roomLog = this._roomInfo.roomLog;
            var round = this._roomInfo.round - 1;
            var roundInfo = roomLog.rounds[round].clients || {};
            var userInfoInRound = roundInfo[userId] || {};

            //*正常比牌就是用roomLog
            pokerType = userInfoInRound.type || "point";
            handPokers = userInfoInRound.handPokers || [];
            score = userInfoInRound.score || 101;
            fancy = userInfoInRound.fancy || "normal";
            gold = userInfoInRound.gold || 0;
            point  = userInfoInRound.point;
        }

        //*显示手牌
        var info = {
            fancy: fancy,
            pokerType: pokerType,
            handPokers: handPokers,
            score: score,
            point: point
        };
        this._playerBoxList[userId].showAllPokerToOther({userId:userId, info:info});

        //*显示玩家分数
        var modelNames = Game.Game.POKER_MODEL_NAMES;
        var txt = modelNames[pokerType];

        if (pokerType == "point") {
            txt += (" " + point % 10 + "点");
        }
        this._playerBoxList[userId].showGoldOfRound(gold, txt);

        if (!isOpenOuts) {
            this.nextComparison();
        }
        else {
            this.nextOutsComparison();
        }
    };

    //*结算
    RoomTableMgr.prototype.bankerPay = function (info) {
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;

        var roomType = this._roomInfo.type;
        var banker = this._roomInfo.banker;

        //*谁需要比牌
        var roomLog = this._roomInfo.roomLog;
        var round = this._roomInfo.round - 1;
        var roundInfo = roomLog.rounds[round].clients || {};
        this._comparisonList = Object.keys(roundInfo);
        this._openPokerIndex = 0;

        if (roomType == Game.Game.ROOM_TYPE.CHAOS || roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            //*混战模式和定制模式没有庄家，所以直接比牌，不用先开庄家的
            this.nextComparison();
        }
        else {
            //*非混战模式比牌
            //*先开庄家的牌
            this.comparisonPoker(banker);
        }

        this.refurbishGold();
    };

    //*开补显示
    RoomTableMgr.prototype.betDraw = function () {
        var roundInfo = this._roomInfo.table.roundLog || {};
        var roundLogClients = roundInfo.clients || {};
        this._outsComparisonList = Object.keys(roundLogClients);//*开补的信息
        this._gamble = roundLogClients;
        if (this._outsComparisonList.length > 0) {
            this._outOpenIndex = 0;
            var banker = this.getRoomBanker();
            //*翻开开补
            this.comparisonPoker(banker, true);
            this.event(RoomTableMgr.EVENT.CANT_OPEN_OUTS);
        }
    };


    RoomTableMgr.prototype.rubbedPokerDone = function (userId) {
        if(this.rubbedDialog)
        {
            this.rubbedDialog.dispose();
            this.rubbedDialog = null;
        }

        userId = userId || this._rubbedInfo.userId;
        if (this._roomInfo.type != Game.Game.ROOM_TYPE.CUSTOMIZED) {
            this._playerBoxList[userId].showOutsPoker(this._rubbedInfo);
        }
        else {
            this._playerBoxList[userId].showAllPokers(this._rubbedInfo);
        }
    };

    //*搓牌操作
    RoomTableMgr.prototype.rubbedPoker = function (userId) {
        this._isTouchPokerBack = false;
        this._mouseY = 0;
        var table = this._roomInfo.table;
        var clients = table.clients;
        var handPokers = clients[userId].handPokers;
        var rubbedPoker = handPokers[2];
        this._rubbedInfo = {userId: userId, handPokers: handPokers};
        if (userId != App.player.getId()) {
        }
        else {
            this.rubbedDialog = new RubbedPokerDialog(rubbedPoker);
            App.uiManager.addUiLayer(this.rubbedDialog,{isAddShield:true,alpha:0.5,isDispose:false});
        }

    };

    //*补牌操作
    RoomTableMgr.prototype.playerDrawPoker = function (userId) {
        //*更新信息
        var table = this._roomInfo.table;
        var client = table.clients;
        var handPokers = client[userId].handPokers;
        var gameRoom = App.uiManager.getGameRoom();
        if (this._roomInfo.type == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            this._playerBoxList[userId].showAllPokers({userId:userId, handPokers:handPokers});
        }
        else {
            //*补牌动画
            var deckNode = gameRoom.getDeckNode();
            var playerBox = gameRoom.getPlayersBox();
            var pokers = new Poker();
            pokers.x = deckNode.x;
            pokers.y = deckNode.y;
            pokers.setPokerScale();
            playerBox.addChild(pokers);
            this._pokerImgList.push(pokers);
            var pos = gameRoom.getTableIndexByUserId(userId);
            var moveTo = MoveTo.create(0.5, pos.x, pos.y);
            var scaleTo = ScaleTo.create(0.5, 0, 0);
            var spa = Spawn.create(moveTo, scaleTo);
            var self = this;
            var callBack = CallFunc.create(Laya.Handler.create(null, function () {
                self._playerBoxList[userId].showOutsPoker({userId: userId, handPokers: handPokers});
            }));
            var seq = Sequence.create(spa, callBack);
            App.actionManager.addAction(seq, pokers);
        }
    };

    //*明牌
    RoomTableMgr.prototype.openHandPokers = function (userId) {
        var table = this._roomInfo.table;
        var client = table.clients;
        var handPokers = client[userId].handPokers;
        this._playerBoxList[userId].showAllPokers({userId:userId, handPokers:handPokers});
    };

    //*下个玩家进行补牌操作
    RoomTableMgr.prototype.nextPlayerCanDraw = function () {
        var table = this._roomInfo.table;
        var drawer;
        var handPokers;
        if (table.drawList.length > 0) {
            drawer = table.drawList[0];
            if (this._roomInfo.state == Game.Room.STATE_BANKER && this._roomInfo.type != Game.Game.ROOM_TYPE.CHAOS) {
                drawer = this._roomInfo.banker;
            }

            if (drawer) {
                handPokers = this._roomInfo.table.clients[drawer].handPokers;
                this.event(RoomTableMgr.EVENT.DRAW_POKERS, [{userId: drawer, handPokers: handPokers}]);
            }
        }
        else {
            //*庄家操作
            if (this._roomInfo.state == Game.Room.STATE_BANKER && this._roomInfo.type != Game.Game.ROOM_TYPE.CHAOS) {
                drawer = this._roomInfo.banker;
                handPokers = this._roomInfo.table.clients[drawer].handPokers;
                this.event(RoomTableMgr.EVENT.DRAW_POKERS, [{userId: drawer, handPokers: handPokers}]);
            }
        }
    };

    RoomTableMgr.prototype.saveDrawPokerCommand = function (info) {
        this.setPlayerReadyDown();
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
    };

    //*下注完毕
    RoomTableMgr.prototype.showHandPoker = function (info) {
        this.setPlayerReadyDown();
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
        this.event(RoomTableMgr.EVENT.BID_END);
        //*执行操作
        this.nextPlayerCanDraw();
        this.clearPokerImgList();
    };

    //*下注完先显示显示自己的牌
    RoomTableMgr.prototype.playerBidFinish = function (userID) {
        this.setPlayerReadyDown();
        var table = this._roomInfo.table;
        var client = table.clients;
        var player = client[userID];
        if (player) {
            var handPokers = player.handPokers;
            var isCustomized = false;
            if (this._roomInfo.type == Game.Game.ROOM_TYPE.CUSTOMIZED) {
                isCustomized = true;
            }

            this.event(RoomTableMgr.EVENT.SHOW_HAND_POKER, [{userId: userID, info: handPokers, isCustomized: isCustomized}]);
        }

        if (userID == App.player.getId()) {
            this.event(RoomTableMgr.EVENT.BID_END);
        }

        this.commandNext();
    };

    RoomTableMgr.prototype.ghostFinish = function () {
        var table = this._roomInfo.table;
        var clients = table.clients;
        var selfId = App.player.getId();

        if (clients[selfId]) {
            var userId = clients[selfId].userID;
            if (this._roomInfo.settings["betType"] == Game.Game.BET_TYPE.MORE_THEN_MORE) {
                var lastBidRate = clients[selfId].lastBidRate;
            }

            //*发完牌要下注了，房间状态是下注的话就提醒下注
            if (this._roomState == Game.Room.STATE_BID) {
                this.event(RoomTableMgr.EVENT.BID, [{userID:userId, lastBidRate: lastBidRate}]);
            }
        }
    };

    //*通知发鬼牌
    RoomTableMgr.prototype.ghostPokersMove = function () {
        this.event(RoomTableMgr.EVENT.GHOST_POKER, [this._ghostPokers]);
    };

    RoomTableMgr.prototype.nextFlyPoker = function () {
        this.pokerFlyIsDown();
    };

    //*有没有发过一轮牌
    RoomTableMgr.prototype.checkPokerFlyRound = function () {
        var length = this._dealPokerList.length;
        var userId;
        if (this._dealUser >= length) {
            this._dealUser = 0;
            //*轮数加一
            this._dealRound ++;
            this.nextFlyPoker();
        }
        else {
            userId = this._dealPokerList[this._dealUser];
            this._dealUser ++;
            this.flyPoker(userId);
        }
    };

    //*是不是已经发完牌了
    RoomTableMgr.prototype.pokerFlyIsDown = function () {
        if (this._dealRound > this._dealCount) {
            //*发牌完毕就发鬼牌
            this.ghostPokersMove();
        }
        else {
            this.checkPokerFlyRound();
        }
    };

    RoomTableMgr.prototype.flyPoker = function (userId) {
        if (!userId) {
            this.nextFlyPoker();
            return;
        }

        var gameRoom = App.uiManager.getGameRoom();
        //*创建要飞的牌
        var deckNode = gameRoom.getDeckNode();
        var playerBox = gameRoom.getPlayersBox();
        var pokers = new Poker();
        pokers.x = deckNode.x;
        pokers.y = deckNode.y;
        pokers.scaleX = 0.5;
        pokers.scaleY = 0.5;
        playerBox.addChild(pokers);
        this._pokerImgList.push(pokers);

        var pos = gameRoom.getTableIndexByUserId(userId);
        var moveTo = MoveTo.create(0.5, pos.x, pos.y);
        var scaleTo = ScaleTo.create(0.5, 0, 0);
        var spa = Spawn.create(moveTo, scaleTo);
        var self = this;
        var callBack = CallFunc.create(Laya.Handler.create(null, function () {
            if (self._playerBoxList && self._playerBoxList[userId]) {
                self._playerBoxList[userId].showDealPoker();
            }
        }));
        var seq = Sequence.create(spa, callBack);
        App.actionManager.addAction(seq, pokers);
    };

    //*每个人发扑克牌的表现
    RoomTableMgr.prototype.dealPlayerPokerAction = function () {
        //*总共要发多少张牌,定制模式发三张牌
        this._dealCount = 2;
        if (this._roomInfo.type == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            this._dealCount = 3;
        }

        //*发牌飞行
        this.flyPoker();
    };

    //*发牌表演
    RoomTableMgr.prototype.dealPoker = function (info) {
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
        //*表演发牌的列表
        this._dealPokerList = this._roomInfo.table.dealSequence ||[];

        //*翻出的鬼牌
        this._ghostPokers = this._roomInfo.table.ghostPokers;

        this._roomState = this._roomInfo.state;

        //*通知桌面准备，游戏正式开始
        this.event(RoomTableMgr.EVENT.GAME_START);

        this.setPlayerReadyDown();
    };

    //*抢庄
    RoomTableMgr.prototype.robFinish = function (info) {
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
        var banker = this._roomInfo.banker;
        this.setPlayerReadyDown();
        this.event(RoomTableMgr.EVENT.ROB_FINISH, [banker]);
    };

    RoomTableMgr.prototype.setPlayerReadyDown = function () {
        var clients = this._roomInfo.table.clients;
        //*修改头像的显示
        for (var index in clients) {
            var userId = clients[index].userID;
            this._playerBoxList[userId] && this._playerBoxList[userId].setReadyDown();
        }
    };

    //*准备完毕
    RoomTableMgr.prototype.allReadyFinish = function (info) {
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
        //*自定模式显示抢庄
        this.event(RoomTableMgr.EVENT.READY_FINISH);
    };

    RoomTableMgr.prototype.checkBtnState = function () {
        if (this._roomInfo) {
            //*解散按钮状态
            var dismissNeedConfirm = this._roomInfo.dismissNeedConfirm;
            if (!dismissNeedConfirm) {
                //*房主能够解散
                this.event(RoomTableMgr.EVENT.CHANGE_DISBAND_STATE, ["banker"]);
            }
            else {
                //*所有人可以解散进入解散
                this.event(RoomTableMgr.EVENT.CHANGE_DISBAND_STATE, ["all"]);
            }

            //*房间战绩按钮状态
            var rounds = this._roomInfo.roomLog["rounds"];
            var roundsLength = rounds.length;
            this.event(RoomTableMgr.EVENT.CHANGE_EFFORT_BTN, [roundsLength]);

            //*返回大厅按钮状态
            var isLock = this._roomInfo.locked;
            this.event(RoomTableMgr.EVENT.LOCKED_ROOM, [isLock]);

            var gameRoom = App.uiManager.getGameRoom();
            if (gameRoom) {
                gameRoom.changeStandUpState();
            }
        }
    };


    //*执行下一条指令
    RoomTableMgr.prototype.commandNext = function () {
        this._commadList.shift();
        if (this._commadList.length <= 0) {
            //*没有信息
            this._commadSate = RoomTableMgr.COMMAND_STATE.CHECK;
        }
        else {
            this.executionCommand();
        }
    };

    //*执行这些指令做表现
    RoomTableMgr.prototype.executionCommand = function () {
        var command = this._commadList[0];
        if (command) {
            var userId = command.userID;
            var fn = command.fn;
            var playerBox = this._playerBoxList[userId];
            var gamble = {};
            switch (fn) {
                case "ready": {
                    var ready = command.ready? true: false;
                    playerBox.readyAction(ready);

                    var selfId = App.player.getId();
                    var clients = this.getTableClients();
                    if (!clients[selfId]) {
                        //*自己站起，就清理牌桌
                        this.startNextRound();
                        this.event(RoomTableMgr.EVENT.NEXT_ROUND, [this._roomInfo]);
                    }
                    break;
                }
                case "rob": {
                    this.commandNext();
                    break;
                }
                case "bid": {
                    var bidRate = command.bidRate || 1;
                    playerBox.setBidLabText(bidRate);
                    this.playerBidFinish(userId);
                    break;
                }
                case "draw":
                case "doBankerDraw": {
                    var optionType = command.type;
                    gamble = command.gamble || {}; //*开补
                    playerBox.executeDraw(optionType, gamble);
                    break;
                }
                case "rubDone": {
                    this.rubbedPokerDone(userId);
                    this.commandNext();
                    break;
                }
                case "doPay": {
                    this.commandNext();
                    break;
                }
                case "end": {
                    var isEnd = command.end ? true: false;
                    playerBox.endRound(isEnd);
                    this.commandNext();
                    break;
                }
                case "rejectBanker": {
                    this.event(RoomTableMgr.EVENT.REJECT_BANKER);
                    this.commandNext();
                    break;
                }
            }

        }
    };

    //*检查是否有信息
    RoomTableMgr.prototype.checkCommand = function () {
        var commandLength = this._commadList.length;
        if (commandLength > 0) {
            this._commadSate = RoomTableMgr.COMMAND_STATE.WAITING_EXECUTION;
            this.executionCommand();
        }
    };

    //*接受信息，储存到这里
    RoomTableMgr.prototype.commandHandler = function (info) {
        var queue = info.queue;
        var room = info.room;
        this._roomInfo = room;
        this._chairs = this._roomInfo.chairs;
        for (var i = 0; i < queue.length; i++) {
            this._commadList.push(queue[i]);
        }
    };

    RoomTableMgr.prototype.joinPlayer = function (info) {
        this._roomInfo = info.room;
        this._chairs = this._roomInfo.chairs;
        this.event(RoomTableMgr.EVENT.JOIN_PLYER, info);
    };

    RoomTableMgr.prototype.delPlayerBox = function (userId) {
        if (this._playerBoxList[userId]) {
            this._playerBoxList[userId].dispose();
            this._playerBoxList[userId] = null;
            delete this._playerBoxList[userId];
        }
    };

    RoomTableMgr.prototype.addPlayerBox = function (userId, playerBox) {
        if (this._playerBoxList[userId]) {
            return;
        }

        if (playerBox) {
            this._playerBoxList[userId] = playerBox;
        }
    };

    RoomTableMgr.prototype.update = function () {
        this.checkBtnState();
        switch (this._commadSate) {
            case RoomTableMgr.COMMAND_STATE.CHECK: {
                this.checkCommand();
                break;
            }
            case RoomTableMgr.COMMAND_STATE.WAITING_EXECUTION: {
                break;
            }
            case RoomTableMgr.COMMAND_STATE.EXECUTION_END: {
                this._commadSate = RoomTableMgr.COMMAND_STATE.CHECK;
                break;
            }
        }
    };

    RoomTableMgr.prototype.initEvent = function () {
        Laya.timer.loop(100, this, this.update);
    };

    RoomTableMgr.prototype.initMgrData = function () {
        this._commadList     = [];
        this._playerBoxList  = {}; //*玩家Box列表，用作表演的
        this._chairs         = null;
        this._ghostPokers    = null; //*鬼牌
        this._roomInfo       = null; //*保存的room数据

        this._dealRound      = 1; //*第几轮的牌
        this._dealUser       = 0; //*到谁

        this._openPokerIndex = 0; //*正常开牌
        this._outOpenIndex   = 0; //*开补

        this._commadSate     = RoomTableMgr.COMMAND_STATE.CHECK; //*消息处理的状态

        this._pokerImgList   = [];
        this._deckPoker      = null;

        this._forbiddenList  = []; //*禁言列表

        this._chatSaveList   = []; //*聊天记录储存
    };

    RoomTableMgr.prototype.init = function () {
        this.initMgrData();
        this.initEvent();
    };

    //*恢复状态时候显示倍数
    RoomTableMgr.prototype.showBidRateOnRestore = function () {
        var table = this._roomInfo.table;
        var clients = table.clients;
        for (var index in clients) {
            var userId = clients[index].userID;
            var bidRate = clients[index].bidRate;
            if (this._playerBoxList[userId]) {
                if (bidRate <= 0) {
                    //*这里就是没有下注，没有下注就显示下注的按钮
                    this.showBidOption(userId);
                }
                else {
                    this._playerBoxList[userId].setBidLabText(bidRate);
                }
            }
        }
    };

    //*恢复状态，显示押注操作
    RoomTableMgr.prototype.showBidOption = function (userId) {
        var table = this._roomInfo.table;
        var clients = table.clients;
        var playerInfo = clients[userId];
        var lastBidRate = 0;
        if (this._roomInfo.settings["betType"] == Game.Game.BET_TYPE.MORE_THEN_MORE) {
            lastBidRate = playerInfo.lastBidRate;
        }

        this.event(RoomTableMgr.EVENT.BID, [{userID:userId, lastBidRate: lastBidRate}]);
        this.event(RoomTableMgr.EVENT.SHOW_BID_OPTION, [{userID: userId, lastBidRate:lastBidRate}]);
    };

    RoomTableMgr.prototype.checkOpenOutsOnRestore = function () {
        var room = this._roomInfo;
        var table = room.table;
        var clients = table.clients || {};
        var roundLog = table.roundLog || {};
        var roundLogClients = roundLog.clients || {};
        var clientLength = Object.keys(roundLogClients).length;

        if (clientLength > 0) {
            for (var index in roundLogClients) {
                if (clients[index] && roundLogClients[index] && this._playerBoxList[index]) {
                    var pokerType = roundLogClients[index].type;
                    var gold = roundLogClients[index].gold;
                    var point = roundLogClients[index].point;

                    //*显示玩家分数
                    var modelNames = Game.Game.POKER_MODEL_NAMES;
                    var txt = modelNames[pokerType];

                    if (pokerType == "point") {
                        txt += (" " + point % 10 + "点");
                    }
                    this._playerBoxList[index].showGoldOfRound(gold, txt);
                }
            }
        }
    };

    //*恢复状态时候显示手牌
    RoomTableMgr.prototype.showHandPokersOnRestore = function () {
        var table = this._roomInfo.table;
        var clients = table.clients;
        var roundLog = table.roundLog || {};
        var roundLogClients = roundLog.clients || {};
        var roundLogClientLength = Object.keys(roundLogClients).length;
        var type = this._roomInfo.type;
        var isCustomized = false;
        if (type == Game.Game.ROOM_TYPE.CUSTOMIZED) {
            isCustomized = true;
        }

        if (roundLogClientLength <= 0) {
            for (var index in clients) {
                var userId = clients[index].userID;
                var handPokers = clients[index].handPokers;
                this.event(RoomTableMgr.EVENT.SHOW_HAND_POKER, [{userId: userId, info: handPokers, isCustomized: isCustomized}]);
            }
        }
        else {
            for (var i in clients) {
                if (roundLogClients[i]) {
                    var clientId = clients[i].userID;
                    var clientHandPokers = clients[i].handPokers;
                    this.event(RoomTableMgr.EVENT.SHOW_HAND_POKER, [{userId: clientId, info: clientHandPokers, isCustomized: isCustomized}]);
                }
                else {
                    var pokers = clients[i].handPokers;
                    var showPoker = {};
                    for (var pokerIndex in pokers) {
                        showPoker[pokerIndex] = {};
                    }
                    this.event(RoomTableMgr.EVENT.SHOW_HAND_POKER, [{userId: clients[i].userID, info: showPoker, isCustomized: isCustomized}]);
                }
            }
        }
    };

    RoomTableMgr.prototype.showGoldOnRestore = function () {
        var table = this._roomInfo.table;
        var clients = table.clients;
        for (var index in clients) {
            var userId = clients[index].userID;
            if (userId) {
                var gold = clients[index].gold;
                this._playerBoxList[userId].setGoldLabText(gold);
            }
        }
    };

    //*恢复准备状态
    RoomTableMgr.prototype.showReadyOnRestore = function () {
        var table = this._roomInfo.table;
        var clients = table.clients;
        for (var index in clients) {
            var userId = clients[index].userID;
            if (userId) {
                var isReady = clients[index].ready;
                this._playerBoxList[userId].setReadyIconVisible(isReady);
            }
        }
    };

    //*恢复状态显示结果
    RoomTableMgr.prototype.showResultOnRestore = function () {
        var room = this._roomInfo;
        var lastRound = room.round - 1; //*上一局
        var roomLog = this._roomInfo.roomLog;
        var lastRoundInfo = roomLog.rounds[lastRound].clients; //*上一局的结果
        var client = room.table.clients;

        for (var index in lastRoundInfo) {
            if (client[index] && lastRoundInfo[index]) {
                var handPoker = lastRoundInfo[index].handPokers;
                var pokerType = lastRoundInfo[index].type;
                var gold = lastRoundInfo[index].gold;
                var point = lastRoundInfo[index].point;

                var info = {
                    fancy:lastRoundInfo[index].fancy,
                    pokerType: pokerType,
                    handPokers: handPoker,
                    score: lastRoundInfo[index].score,
                    point: point
                };

                this._playerBoxList[index].showAllPokerToOther({userId:index, info:info, isShowResult: true});

                //*显示玩家分数
                var modelNames = Game.Game.POKER_MODEL_NAMES;
                var txt = modelNames[pokerType];

                if (pokerType == "point") {
                    txt += (" " + point % 10 + "点");
                }
                this._playerBoxList[index].showGoldOfRound(gold, txt);
            }
        }
    };

    RoomTableMgr.prototype.stateRestore = function () {
        var state = this._roomInfo.state;
        var isGameStart = true;
        var isRob = false;
        var isShowBid = false;
        var isShowHandPoker = false;
        var isShowOptions = false;
        var isRubbing = false;
        var isNextDraw = false;
        var isEnd = false;
        var isShowResult = false;
        var isCheckOpenOuts = false;

        var table = this._roomInfo.table;
        var selfId = App.player.getId();
        var clients = table.clients;

        var whosRubbing = table.whosRubbing;
        if (whosRubbing > 0) {
            isRubbing = true;
        }

        if (clients[selfId]) {
            isShowResult = clients[selfId].showResult;
        }

        switch (state) {
            case Game.Room.STATE_READY: {
                isGameStart = false;
                isShowBid = false;
                break;
            }
            case Game.Room.STATE_ROB: {
                //*抢庄
                isRob = true;
                break;
            }
            case Game.Room.STATE_BID: {
                //*下注状态(下注倍数，是否下注，poker显示)
                isShowBid = true;
                isShowHandPoker = true;
                break;
            }
            case Game.Room.STATE_DRAW:
            case Game.Room.STATE_BANKER:
            case Game.Room.STATE_PAY: {
                //*闲家补牌操作
                //*闲家要完牌庄家处理阶段
                isShowBid = true;
                isShowHandPoker = true;
                if (!isRubbing) {
                    isNextDraw = true;
                }
                else {
                    isShowOptions = true;
                }
                isCheckOpenOuts = true;
                break;
            }
            case Game.Room.STATE_END: {
                isEnd = true;
                break;
            }
            default: {
                break;
            }
        }

        //*查看他们的分数
        this.showGoldOnRestore();

        //*查看是否在解散房间的状态
        if (this._roomInfo.dismissStamp > 0) {
            var info = {
                dismissConfirmList: this._roomInfo.dismissConfirmList,
                dismissStamp: this._roomInfo.dismissStamp
            };
            var firstDisMissUser;
            for (var index in this._roomInfo.dismissConfirmList) {
                firstDisMissUser = Number(index);
                break;
            }

            this.disMissRoom({userID: firstDisMissUser}, info);
        }

        if (isShowResult) {
            //*显示牌局的结果
            this.showResultOnRestore();
        }

        if (isGameStart) {
            //*游戏开始就隐藏准备按钮操作
            this.event(RoomTableMgr.EVENT.GAME_WAS_STRATED);
        }
        else {
            //*准备状态，检查谁准备好了
            this.showReadyOnRestore();
        }

        if (isRob) {
            //*显示抢庄的按钮
            this.event(RoomTableMgr.EVENT.ROOM_STATE_ROB);
        }

        if (isShowBid) {
            this.showBidRateOnRestore();
        }

        //*查看开补的情况
        if (isCheckOpenOuts) {
            this.checkOpenOutsOnRestore();
        }

        if (isShowHandPoker) {
            this.showHandPokersOnRestore();
        }

        if (isRubbing && !this.rubbedDialog) {
            this.rubbedPoker(whosRubbing);
        }

        if (isShowOptions) {
            if (clients[whosRubbing]) {
                //*显示操作按钮
                this.event(RoomTableMgr.EVENT.DRAW_POKERS, [{userId: whosRubbing, handPokers: clients[selfId].handPokers}]);
            }
        }

        if (isNextDraw) {
            this.nextPlayerCanDraw();
        }

        if (isEnd) {
            this.endRound();
        }
    };

    RoomTableMgr.prototype.reconnectRestore = function (info) {
        this._roomInfo = info;
        this._chairs = this._roomInfo.chairs;
        var gameRoomView = App.uiManager.getGameRoom();
        //*因为窗口被强制关闭了，所以在恢复的时候后就要清除这两个界面
        this._disbandPanel = null;
        this.rubbedDialog = null;
        //*清除桌面
        for (var index in this._playerBoxList) {
            this._playerBoxList[index] && this._playerBoxList[index].dispose();
        }
        this._playerBoxList = [];
        //*刷新桌面上的信息
        gameRoomView.refurbishTableShow(this._roomInfo);

        this.commandNext();
        //*状态恢复
        this.stateRestore();
    };

    RoomTableMgr.prototype.setRoomInfo = function (info) {
        this._roomInfo = info;
        this._chairs = info.chairs;
    };

    //*清除用作飞行的扑克
    RoomTableMgr.prototype.clearPokerImgList = function () {
        var length = this._pokerImgList.length;
        for (var i = 0; i < length; i++) {
            this._pokerImgList[i].dispose();
        }
    };

    RoomTableMgr.prototype.clearGameRoom = function () {
        if (this._disbandPanel) {
            this._disbandPanel.close();
            this._disbandPanel = null;
        }

        if(this.rubbedDialog) {
            this.rubbedDialog.dispose();
            this.rubbedDialog = null;
        }

        Laya.timer.clearAll(this);
        this.initMgrData();
        this.clearPokerImgList();
        App.removeRoomTableMgr();
    };

    RoomTableMgr.prototype.saveGameRoom = function () {
        this.checkBtnState();
        this.getForbidden();
    };

    RoomTableMgr.COMMAND_STATE = {
        CHECK: 1, //*检查是否有信息需要处理
        WAITING_EXECUTION: 2, //*等待处理结束
        EXECUTION_END: 3 //*处理结束
    };

    RoomTableMgr.EVENT = {
        JOIN_PLYER: "JOIN_PLYER",
        READY_FINISH: "READY_FINISH",
        ROOM_STATE_ROB: "ROOM_STATE_ROB",
        ROB_FINISH: "ROB_FINISH",
        GAME_START: "GAME_START",
        GHOST_POKER: "GHOST_POKER",
        BID: "BID",
        BID_END: "BID_END",
        DRAW_POKERS: "DRAW_POKERS",
        DO_PAY: "DO_PAY",
        GAME_WAS_STRATED: "GAME_WAS_STRATED",
        SHOW_BID_OPTION: "SHOW_BID_OPTION",
        COMPARISON_END: "COMPARISON_END",
        NEXT_ROUND: "NEXT_ROUND",
        CLOSE_ROOM: "CLOSE_ROOM",
        SAND_CHAT_DATA: "SAND_CHAT_DATA",
        CANCEL_FORBIDDEN: "CANCEL_FORBIDDEN",
        FORBIDDEN_PLYAER: "FORBIDDEN_PLYAER",
        STAND: "STAND",
        SITDOWN: "SITDOWN",
        REJECT_BANKER: "REJECT_BANKER",
        CANT_OPEN_OUTS: "CANT_OPEN_OUTS",
        CHANGE_DISBAND_STATE: "CHANGE_DISBAND_STATE",

        SHOW_HAND_POKER: "SHOW_HAND_POKER",
        LOCKED_ROOM: "LOCKED_ROOM",
        CHANGE_EFFORT_BTN: "CHANGE_EFFORT_BTN"
    };

    return RoomTableMgr;
}(laya.events.EventDispatcher));