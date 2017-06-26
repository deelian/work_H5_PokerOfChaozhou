/**
 * 房间桌面状态显示管理器
 */
var RoomTableMgr = (function(_super) {

    function RoomTableMgr() {
        this.initEvent();
        this.init();
    }

    Laya.class(RoomTableMgr, "RoomTableMgr", _super);

    var __proto = RoomTableMgr.prototype;

    __proto.init = function () {
        this._commandList       = []; //*消息列表
        this._commadSate        = RoomTableMgr.COMMAND_STATE.CHECK; //*消息处理的状态

        this._forbiddenList     = []; //*禁言列表
        this._chatSaveList      = []; //*聊天记录储存

        this._roomChairsList    = null;

        this._stateUpdateContinue = true; //*是不是要继续更新状态

        this._rubbedDialog      = null; //搓牌界面
        this._disbandPanel      = null;

        this._isClosedRoom      = false;

        this._roomObj           = null;
        this._updating          = false;

        this._confirmFalseUser  = null;
        this._canShowRubbed     = true;

        this._isShowResultBySelf = null;
    };

    __proto.initEvent = function () {
        Laya.timer.loop(100, this, this.update);
    };

    __proto.isSelf = function(userId) {
        return (userId == App.player.getId());
    };

    __proto.quitRoom = function () {
        App.removeRoomID();
        // 清除数据
        this.rubbedPokerDone();
        this.closeDisbandPanel();
        this.init();
        //*关闭房间
        App.uiManager.removeGameRoomView();
        this.event(RoomTableMgr.Event.CLOSE_ROOM);
     };

    __proto.getRoomInfo = function () {
        return this._roomObj || {};
    };

    __proto.syncRoomObj = function (data) {
        if (!data) {
            return;
        }

        //console.log(data);
        if (this._roomObj) {
            this._roomObj.syncRoom(data);

            this.updateRoomChairList(data.chairs);
        }

    };

    __proto.getRoomCharis = function () {
        var roomInfo = this.getRoomInfo();
        var chairs = roomInfo.chairs || [];
        return this._roomChairsList || chairs;
    };

    __proto.getChatSaveList = function () {
         return this._chatSaveList;
    };

    __proto.getRoomLog = function () {
        var roomInfo = this.getRoomInfo();
        return roomInfo.roomLog || {};
    };

    __proto.getRoomLogUsers = function () {
        var roomLog = this.getRoomLog();
        return roomLog.users || {};
    };

    __proto.getRoomLogRounds = function () {
        var roomLog = this.getRoomLog();
        return roomLog.rounds || {};
    };

    __proto.getRoomMembers = function () {
        var roomInfo = this.getRoomInfo();
        return  roomInfo.members || [];
    };

    __proto.getClients = function () {
        var roomInfo = this.getRoomInfo();
        var table = roomInfo.table || {};
        return table.clients || {};
    };

    __proto.getRoomView = function () {
        return App.uiManager.getGameRoom();
    };

    __proto.continueUpdateState = function () {
        this._stateUpdateContinue = true;
    };

    __proto.updateRoomChairList = function (chairList) {
        var chairs = this.getRoomCharis();
        chairList = chairList || chairs;
        this._roomChairsList = chairList;
    };

    __proto.charisUpdateByStandUp = function (userId) {
        if (!userId) {
            return;
        }

        var index = this._roomChairsList.indexOf(userId);
        if (index != -1) {
            this._roomChairsList[index] = null;
        }
    };

    __proto.charisUpdateBySitDown = function (pos, userId) {
        if (pos < 0 || pos >= 8) {
            return;
        }

        if (!userId) {
            return;
        }

        var idInChairsList = this._roomChairsList[pos];
        if (idInChairsList == userId) {

        }
        else if (idInChairsList == null) {
            this._roomChairsList[pos] = userId;
        }

    };

    __proto.removedDisbandPanel = function () {
        if (this._disbandPanel) {
            this._disbandPanel.off(Laya.Event.REMOVED, this.removedDisbandPanel);
            this._disbandPanel = null;
        }
    };

    //*申请解散
    __proto.disMissRoom = function (info,disMissInfo) {
        info = info || {};
        var logUser = this.getRoomLogUsers();
        var userID = info.userID || App.player.getId();
        var name = (logUser[userID] == null) ? "游客" : logUser[userID].name;
        var panelInfo = null;
        if (disMissInfo) {
            var dismissConfirmList = disMissInfo.dismissConfirmList || {};
            var dismissStamp = disMissInfo.dismissStamp || 0;
            panelInfo = {dismissConfirmList: dismissConfirmList, dismissStamp: dismissStamp};
        }
        var opts = {
            userID: userID,
            disMissInfo: panelInfo,
            name: name
        };
        //*弹出确认的窗口
        if (!this._disbandPanel && this._roomObj) {
            this._canShowRubbed = false;
            this._disbandPanel = App.uiManager.addUiLayer(DisbandDialog, opts, false, false, true);
            this._disbandPanel.on(Laya.Event.REMOVED, this, this.removedDisbandPanel);
        }
        else if (this._disbandPanel && this._disbandPanel.updateInfo) {
            this._disbandPanel.updateInfo(opts);
        }
     };

    //*确认/取消 解散
    __proto.disMissConfirm = function (info) {
        var confirm = info.confirm;
        var userId;

        if (confirm == null) {
            this.syncRoomObj(info);
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

    __proto.disMissResult = function () {
        var selfId = App.player.getId();
        //*如果是自己拒绝解散就不弹出提示
        if (this._confirmFalseUser == selfId) {
            this._canShowRubbed = true;
            this._confirmFalseUser = null;
            this.closeDisbandPanel();
            return;
        }

        //*解散失败，弹出提示框
        this._canShowRubbed = false;
        var users = this.getRoomLogUsers();
        var name = "游客";
        if (users[this._confirmFalseUser] != null && users[this._confirmFalseUser].name != null) {
            name = users[this._confirmFalseUser].name;
        }

        var self = this;
        var setCanShowRubbed = function () {
            self._canShowRubbed = true;
            self._confirmFalseUse = null;
        };

        var str = "由于" + name + "拒绝，房间解散失败，游戏继续！";
        App.uiManager.showMessage({msg:str, cb:setCanShowRubbed});

        this.closeDisbandPanel();
    };

    __proto.closeDisbandPanel = function () {
        if (this._disbandPanel) {
            this._disbandPanel.close();
        }

        this._disbandPanel = null;
    };

    // 关闭房间
    __proto.closeRoom = function () {
        if (this._isClosedRoom) {
            return;
        }

        if (!this._roomObj) {
            return;
        }

        this._isClosedRoom = true;
        var round = this._roomObj.round + 1;
        var maxRound = this._roomObj.maxRound;
        var firstPay = this._roomObj.firstPay;
        var roomView = App.uiManager.getGameRoom();
        //是不是已经玩过了
        if (firstPay) {
            //有没有玩完
            if (round >= maxRound) {
                roomView.showCloseRoom();
            }
            else {
                //直接显示结算面板
                roomView.showFinalPanel();
            }
        }
        else {
            //没开始就关掉了
            this.quitRoom();
        }
        this.closeDisbandPanel();
    };

    __proto.roomStateUpdate = function () {
        if (!this._roomObj) {
            return;
        }

        var selfId              = App.player.getId();
        var roomState           = this._roomObj.state;
        var table               = this._roomObj.table || {};
        var clients             = table.clients || {};
        var dismissStamp        = this._roomObj.dismissStamp || 0;
        var maxRound            = this._roomObj.maxRound || 10;
        var round               = this._roomObj.round;
        var roomType            = this._roomObj.type;
        var roundLogUsers       = this.getRoomLogUsers() || {};

        var roomView            = this.getRoomView();

        if (!roomView) {
            return;
        }

        roomView.changeEffortBtnState(); // 战绩按钮是否灰掉
        roomView.changeLockRoomState(); // 房间是不是上锁了
        roomView.changeDisbandBtnState(); // 解散房间状态
        roomView.changeStandUpState(); // 站起按钮状态
        roomView.notDoBankerState(); // 不做庄
        roomView.changeBankerTagShow();
        roomView.updateRoomRoundShow();//更新局数显示
        roomView.updateChatShow();

        var playerBoxList       = roomView.getPlayerBoxs() || [];

        var isReadyState        = false;
        var isShowBidState      = true;
        var isShowBidPokers     = false;
        var isShowBidOption     = false;
        var isBankerState       = false;
        var isCheckShowResult   = false;
        var isDrawState         = false;
        var isRob               = false;
        var isDismiss           = false;
        var isStartState        = false;

        if (dismissStamp > 0) {
            var info = {
                dismissConfirmList: this._roomObj.dismissConfirmList,
                dismissStamp: dismissStamp
            };
            var firstDisMissUser;
            var array = Object.keys(this._roomObj.dismissConfirmList);
            firstDisMissUser = array[0];
            var logUsers = this.getRoomLogUsers();
            var name = logUsers[firstDisMissUser].name || "游客";
            this.disMissRoom({userID: firstDisMissUser, name: name}, info);
            isDismiss = true;
        }

        var whoRubbing = table.whosRubbing || 0;
        switch (roomState) {
            case Game.Room.STATE_READY: {
                roomView.unShowDrawOption();
                roomView.showReadyBtn(true);
                roomView.clearRoomShow();
                roomView.unShowAllLight();
                isReadyState = true;
                isShowBidState = false;
                isCheckShowResult = true;
                break;
            }

            case Game.Room.STATE_ROB: {
                isStartState = true;
                if (roomType == Game.Game.ROOM_TYPE.CUSTOMIZED) {
                    isShowBidState = false;
                    roomView.showReadyBtn(false);
                    roomView.unShowDrawOption();
                    isRob = true;
                }
                break;
            }
            case Game.Room.STATE_START: {
                this._isShowResultBySelf = null;
                isShowBidState = false;
                isStartState = true;
                roomView.showReadyBtn(false);
                break;
            }
            case Game.Room.STATE_BID: {
                this._isShowResultBySelf = null;
                if (this._stateUpdateContinue) {
                    isShowBidOption = true;
                    isShowBidPokers = true;
                }
                else {
                    isShowBidState = false;
                }
                roomView.showReadyBtn(false);
                break;
            }
            case Game.Room.STATE_DRAW: {
                roomView.unShowBidOption();
                isShowBidState = true;

                roomView.showReadyBtn(false);
                if (this._stateUpdateContinue) {
                    roomView.showDrawOption();
                    if ( whoRubbing <= 0) {
                        roomView.showDrawOption();
                    }
                    else {
                        roomView.showDrawOption(whoRubbing);
                    }
                    isDrawState = true;
                }
                break;
            }
            case Game.Room.STATE_BANKER: {
                roomView.unShowBidOption();
                roomView.showReadyBtn(false);
                if (this._stateUpdateContinue) {
                    if (roomType != Game.Game.ROOM_TYPE.CHAOS) {
                        if ( whoRubbing <= 0) {
                            roomView.showDrawOption();
                        }
                        else {
                            roomView.showDrawOption(whoRubbing);
                        }
                    }
                    isBankerState = true;
                }
                break;
            }
            case Game.Room.STATE_PAY: {
                roomView.unShowBidOption();
                roomView.showReadyBtn(false);
                roomView.unShowDrawOption();
                if (clients[selfId] == null) {
                    this._isShowResultBySelf = true;
                }
                break;
            }
            case Game.Room.STATE_CLOSED: {
                roomView.unShowBidOption();
                roomView.showReadyBtn(false);
                roomView.unShowDrawOption();
                isShowBidState = false;
                this.closeRoom();
                break;
            }
        }

        var isShowResult = false;
        if (this._isShowResultBySelf == true) {
            isShowResult = true;
        }
        else if (isCheckShowResult && clients[selfId]) {
            isShowResult = clients[selfId].showResult;
        }

        for (var clientsIndex in clients) {
            var tablePlayer = clients[clientsIndex];
            var isReady     = tablePlayer.ready;
            var userID      = tablePlayer.userID;
            var bid         = tablePlayer.bid;
            var bidRate     = tablePlayer.bidRate;
            var isAfk       = tablePlayer.isAfk;
            var isRubbing   = tablePlayer.isRubbing;

            var playerBox   = playerBoxList[userID];

            if (!playerBox) {
                continue;
            }

            playerBox.updateGoldScroe();

            // 离线状态显示
            playerBox.setAfkSate(isAfk);

            // 有没有在搓牌
            if (whoRubbing == userID) {
                playerBox.setRubbedState(isRubbing);
            }
            else {
                playerBox.setRubbedState(false);
            }
            // 准备状态
            if (isReadyState && !isAfk) {
                playerBox.setReady(isReady);
            }
            else {
                playerBox.setReady(false);
            }

            if (isStartState) {
                playerBox.initShowResultTag();

            }

            if (isShowBidState) {
                playerBox.setBidStateShow(true, {bid:bid, bidRate: bidRate});
            }
            else {
                playerBox.setBidStateShow(false);
            }

            if (isShowBidOption) {
                if (userID == selfId) {
                    if (!bid && bidRate <= 0 ) {
                        roomView.showBidOption();
                    }
                    else {
                        roomView.unShowBidOption();
                    }
                }
            }
            else {
                roomView.unShowBidOption();
            }

            //*下注时候的poker显示
            if (isShowBidPokers) {
                playerBox.showBidPoker({bid:bid, bidRate: bidRate});
            }

            // 操作时候所显示的poker
            if (isBankerState || isDrawState) {
                playerBox.showBankerStatePoker(whoRubbing);
            }
        }

        if (whoRubbing > 0 && !isDismiss && this._canShowRubbed) {
            this.rubbedPoker(whoRubbing);
        }

        //*显示鬼牌
        if (roomState >= Game.Room.STATE_BID) {
            roomView.updateGhostPoker();
        }

        if (isRob) {
            roomView.prepareRob();
        }
        else {
            roomView.resetRob();
            roomView.unShowGrabBanker();
        }

        for (var userIndex in roundLogUsers) {
            var userId = userIndex;
            if (clients[userId] && playerBoxList[userId]) {
                if (roomState == Game.Room.STATE_READY && isShowResult) {
                    playerBoxList[userId].showResult();
                }
                else if (round >= maxRound) {
                    playerBoxList[userId].showResult();
                }
            }
        }

    };

    __proto.removedRubbedDialog = function () {
        if (this._rubbedDialog) {
            this._rubbedDialog.off(Laya.Event.REMOVED, this.removedRubbedDialog);
            this._rubbedDialog = null;
        }
    };

    // 搓牌结束，关闭搓牌的界面，继续检测房间状态
     __proto.rubbedPokerDone = function () {
        if(this._rubbedDialog)
        {
            this._rubbedDialog.close();
            this._rubbedDialog = null;
        }

        this._stateUpdateContinue = true;
     };

     //*搓牌操作
     __proto.rubbedPoker = function (userId) {
         var clients = this.getClients() || {};
         var handPokers = clients[userId].handPokers || [];
         var rubbedPoker = handPokers[2];
         if (userId == App.player.getId()) {
             if (!this._rubbedDialog) {
                 this._rubbedDialog = App.uiManager.addUiLayer(RubbedPokerDialog, rubbedPoker, false);
                 this._rubbedDialog.on(Laya.Event.REMOVED, this, this.removedRubbedDialog);
             } else {
                 // 发生在重连时已经处在搓牌界面中
                 this._rubbedDialog.wakeUp();
             }
         }
     };

    //*玩家操作的表现执行
    __proto.executePlayerDraw = function (info) {
        var userId = info.userId;
        var optionType = info.optionType;

        if (!userId) {
            return;
        }

        var roomView = this.getRoomView();
        if (!roomView) {
            return;
        }
        var playerBoxList = roomView.getPlayerBoxs() || [];
        var playerBox = playerBoxList[userId];

        if (!playerBox) {
            return;
        }

        switch (optionType) {
            case Game.Game.DRAW_COMMAND.OPEN: {
                //*明牌（翻开所有的牌）
                roomView.showPokerToPlayerAction(userId);
                break;
            }
            case Game.Game.DRAW_COMMAND.PASS:{
                //*过牌
                this._stateUpdateContinue = true;
                break;
            }
            case Game.Game.DRAW_COMMAND.DRAW:{
                //*补牌(补牌动作，显示第三张牌)
                roomView.playerDrawPoker(userId);
                break;
            }
            case Game.Game.DRAW_COMMAND.RUBBED:{
                this.rubbedPoker(userId);
                //*搓牌
                break;
            }
            case Game.Game.DRAW_COMMAND.BET_ALL:{
                //*庄家全开
                this._stateUpdateContinue = true;
                break;
            }
            case Game.Game.DRAW_COMMAND.BET_DRAW:{
                //*开补
                this._stateUpdateContinue = true;
                break;
            }
            default: {
                break;
            }
        }
    };

    __proto.nextCommand = function () {
        this._commandList.shift();
        if (this._commandList.length <= 0) {
            //*没有信息
            this._commadSate = RoomTableMgr.COMMAND_STATE.CHECK;
        }
        else {
            this.executionCommand();
        }
    };

    //*执行指令
    __proto.executionCommand = function () {
        var command = this._commandList[0];
        if (command) {
            var userId          = command.userID;
            var fn              = command.fn;
            switch (fn) {
                case "ready": {
                    //*状态的更新先暂停
                    this._stateUpdateContinue = false;
                    if (App.player.getId() == userId) {
                        var roomView = App.uiManager.getGameRoom();
                        if (roomView) {
                            var playerBoxList = roomView.getPlayerBoxs() || [];
                            for (var i in playerBoxList) {
                                if (playerBoxList[i]) {
                                    playerBoxList[i].cleanShow();
                                }
                            }
                        }
                    }
                    this._stateUpdateContinue = true;
                    break;
                }
                case "draw":
                case "doBankerDraw": {
                    this._stateUpdateContinue = false;
                    var optionType = command.type;
                    this.executePlayerDraw({userId: userId, optionType:optionType});
                    break;
                }
                case "rubDone": {
                    this._stateUpdateContinue = false;
                    this.rubbedPokerDone(userId);
                    break;
                }
            }
            this.nextCommand();
        }
    };

    __proto.deletePlayerBox = function (userId) {
        var roomView = App.uiManager.getGameRoom();
        if (roomView) {
            roomView.playerStand(userId);
        }
    };

    //*强制站起
    __proto.letStandUp = function (info) {
        var userId = info.userID;
        this.charisUpdateByStandUp(userId);
        if (info && info.room) {
            this.syncRoomObj(info.room);
        }

        this.deletePlayerBox(userId);
    };

    //*自己站起
    __proto.standUp = function (info) {
        var userId = info.userID;
        this.charisUpdateByStandUp(userId);
        if (info && info.room) {
            this.syncRoomObj(info.room);
        }

        //*删掉头像
        this.deletePlayerBox(userId);
     };

    //*坐下
    __proto.sitDown = function (info) {
        this._isShowResultBySelf = null;
        var chairsList = info.chairs;
        var pos = info.pos;
        var userId = info.userID;
        if (info && info.room) {
            this.syncRoomObj(info.room);
        }

        if (chairsList) {
            this.updateRoomChairList(chairsList);
        }
        this.charisUpdateBySitDown(pos, userId);
        var roomView = App.uiManager.getGameRoom();
        if (roomView) {
            roomView.playerSitDown(info);
        }
    };

    __proto.checkCommand = function () {
        var commandLength = this._commandList.length;
        if (commandLength > 0) {
            this._commadSate = RoomTableMgr.COMMAND_STATE.WAITING_EXECUTION;
            this.executionCommand();
        }
    };

    __proto.saveCommand = function (info) {
        var queue = info.queue;
        this.syncRoomObj(info.room);
        for (var i = 0; i < queue.length; i++) {
            this._commandList.push(queue[i]);
        }
    };

    __proto.commandUpdate = function () {
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

    __proto.checkChairRoute = function (route, info) {
        var chairRoute = Game.ROUTE.CHAIR;
        if (route == chairRoute.SIT_DOWN) {
            this.sitDown(info);
        }
        else if (route == chairRoute.STAND_UP) {
            this.standUp(info);
        }
        else if (route == chairRoute.LET_STAND_UP) {
            this.letStandUp(info);
        }
    };

    __proto.checkChatRoute = function (route, info) {
        var chatRoute = Game.ROUTE.CHAT;
        if (route == chatRoute.SEND) {
            this.sandChat(info);
        }
        else if (route == chatRoute.FORBID) {
            this.forbidPlayer(info);
        }
        else if (route == chatRoute.FORBID_CANCEL) {
            this.forbidCancelPlayer(info);
        }
    };

    __proto.kickUser = function (userId) {
        if (this.isSelf(userId)) {
            this.quitRoom();
        }
        else {
            this.deletePlayerBox(userId);
        }
    };

    __proto.leaveRoom = function (userId) {
        if (this.isSelf(userId)) {
            this.quitRoom();
        }
        else {
            this.deletePlayerBox(userId);
        }
    };

    __proto.checkRoomRoute = function (route, info) {
        if (!route) {
            return;
        }

        var roomView = this.getRoomView();
        var isSaveInfo = true;

        switch (route) {
            case Game.ROUTE.ROOM.ENTER: {
                if (info && info.room) {
                    this.syncRoomObj(info.room);
                    this.charisUpdateBySitDown(info.pos, info.userID);
                }
                if (roomView) {
                    this._stateUpdateContinue = false;
                    roomView.updatePlayerSitPos();
                }
                break;
            }
            case Game.ROUTE.ROOM.DEAL: {
                this._stateUpdateContinue = false;
                this.syncRoomObj(info.room);
                if (roomView) {
                    roomView.dealPokerAction();
                }
                break;
            }
            case Game.ROUTE.ROOM.DISMISS_APPLY: {
                this.disMissRoom(info);
                isSaveInfo = true;
                break;
            }
            case Game.ROUTE.ROOM.DISMISS_RESULT: {
                if (this._roomObj) {
                    this._roomObj.dismissStamp = 0;
                }
                if (info.result == false) {
                    this.disMissResult();
                }
                else if (info.result == true) {
                    this.closeRoom();
                }
                isSaveInfo = false;
                break;
            }
            case Game.ROUTE.ROOM.DISMISS_CONFIRM: {
                this.disMissConfirm(info);
                isSaveInfo = false;
                break;
            }
            case Game.ROUTE.ROOM.KICK: {
                this.kickUser(info.userID);
                // 自己的话 因为被踢出 不用同步房间信息 其他人要同步
                if (this.isSelf(info.userID)) {
                    App.uiManager.showMessage({msg: "您被房主踢出房间！"});
                    isSaveInfo = false;
                }
                break;
            }
            case Game.ROUTE.ROOM.LEAVE: {
                this.leaveRoom(info.userID);
                // 自己的话 因为被踢出 不用同步房间信息 其他人要同步
                if (this.isSelf(info.userID)) {
                    isSaveInfo = false;
                }
                break;
            }
            case Game.ROUTE.ROOM.CLOSE: {
                this.closeRoom();
                break;
            }
            default: {
                break;
            }
        }

        if (isSaveInfo) {
            var roomInfo;
            if (info && info.room) {
                roomInfo = info.room;
            }
            else if (info){
                roomInfo = info;
            }

            this.syncRoomObj(roomInfo);
        }
    };

    __proto.processMsg = function (route, info) {
        if (!route) {
            return;
        }

        var isRoomRoute = /^room./.test(route);
        var isChatRoute = /^chat./.test(route);

        if (isRoomRoute) {
            if (/.command$/.test(route)){
                this.saveCommand(info);
            }
            else {
                this.checkRoomRoute(route, info);
            }
        }
        else if (isChatRoute){
            this.checkChatRoute(route, info);
        }
        else {
            this.checkChairRoute(route, info);
        }
    };

    //*发送聊天信息
    __proto.sandChat = function (info) {
        var userId = info.userID;
        var msg = info.msg;
        var normalChat = Game.Game.Chat.normal;
        var index = normalChat.indexOf(msg);
        if (index != -1) {
            //*播放语音
            App.soundManager.playSound("chat_normal_" + index);
        }
        this._chatSaveList.push(info);
        this.event(RoomTableMgr.Event.SAND_CHAT_DATA, [info]);

        var roomView = this.getRoomView();
        roomView.setChatShowInfo(info);
    };

    //*解除禁言
    __proto.forbidCancelPlayer = function (info) {
        var userId = info.userID;
        var index = this._forbiddenList.indexOf(userId);
        if (index != -1) {
            this._forbiddenList.splice(index, 1);
            this.event(RoomTableMgr.Event.CANCEL_FORBIDDEN, [userId]);
        }

        if (this.isSelf(userId)) {
            var dlg = App.uiManager.addUiLayer(ConnectDialog);
            dlg.setText("您已被房主解除禁言!");
            var complete = function () {
                dlg.close();
            };
            Laya.timer.once(800, this, complete);
        }
    };

    //*禁言
    __proto.forbidPlayer = function (info) {
        var userId = info.userID;
        if (this._forbiddenList.indexOf(userId) == -1) {
            this._forbiddenList.push(userId);
            this.event(RoomTableMgr.Event.FORBIDDEN_PLYAER, [userId]);
        }

        if (this.isSelf(userId)) {
            var dlg = App.uiManager.addUiLayer(ConnectDialog);
            dlg.setText("您被房主禁言!");
            var complete = function () {
                dlg.close();
            };
            Laya.timer.once(800, this, complete);
        }
    };

    //*查询是否被禁言
    __proto.checkForbiddenByUserId = function (userId) {
        var isForbidden = false;
        if (this._forbiddenList.indexOf(userId) != -1) {
            isForbidden = true;
        }
        return isForbidden;
    };

     //*获取禁言列表
    __proto.getForbidden = function () {
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

    __proto.update = function () {
        if (this._updating) {
            return;
        }

        var roomView = this.getRoomView();
        if (!roomView) {
            return;
        }

        this._updating = true;

        this.commandUpdate();
        this.roomStateUpdate();

        this._updating = false;
    };

    __proto.setRoomInfo = function (data) {
        console.log(data);
        if (!this._roomObj) {
            this._roomObj = new Game.Room(data);
            this.updateRoomChairList();
        }
        else {
            this.syncRoomObj(data);
            var roomView = this.getRoomView();
            if (roomView) {
                roomView.updatePlayerSitPos();
            }
        }
    };

    RoomTableMgr.COMMAND_STATE = {
        CHECK: 1, //*检查是否有信息需要处理
        WAITING_EXECUTION: 2, //*等待处理结束
        EXECUTION_END: 3 //*处理结束
    };

    RoomTableMgr.Event = {
        CLOSE_ROOM : "CLOSE",
        CANCEL_FORBIDDEN : "CANCEL_FORBIDDEN",
        FORBIDDEN_PLYAER : "Event.FORBIDDEN_PLYAER",
        SAND_CHAT_DATA: "SAND_CHAT_DATA",
        CLOSE_PLAYER_INFO_VIEW: "CLOSE_PLAYER_INFO_VIEW"
    };

    return RoomTableMgr;
}(laya.events.EventDispatcher));