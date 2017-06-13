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

    __proto.quitRoom = function () {
        App.removeRoomID();
        // 清除数据

        //*关闭房间
        this.event(RoomTableMgr.EVENT.CLOSE_ROOM);
     };

    __proto.getRoomLogUsers = function () {
        var roomLog = this._roomInfo.roomLog || {};
        return roomLog.users || {};
    };

    __proto.getRoomInfo = function () {
        return this._roomInfo || {};
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

    // 关闭房间
    __proto.closeRoom = function () {
        var round = this._roomInfo.round + 1;
        var maxRound = this._roomInfo.maxRound;
        var firstPay = this._roomInfo.firstPay;
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
    };

    __proto.roomStateUpdate = function () {
        if (!this._roomInfo) {
            return;
        }

        var selfId              = App.player.getId();
        var roomState           = this._roomInfo.state;
        var table               = this._roomInfo.table || {};
        var clients             = table.clients || {};

        var roomView            = this.getRoomView();

        if (!roomView) {
            return;
        }

        roomView.changeEffortBtnState(); // 战绩按钮是否灰掉
        roomView.changeLockRoomState(); // 房间是不是上锁了
        roomView.changeDisbandBtnState(); // 解散房间状态
        roomView.changeStandUpState(); // 站起按钮状态

        var playerBoxList       = roomView.getPlayerBoxs() || [];

        var isReadyState        = false;
        var isShowBidState      = true;
        var isShowBidPokers     = false;
        var isShowBidOption     = false;
        var isBankerState       = false;
        var isCheckShowResult   = false;
        var isDrawState         = false;

        var whoRubbing = table.whosRubbing || 0;
        switch (roomState) {
            case Game.Room.STATE_READY: {
                roomView.unShowDrawOption();
                roomView.updatePlayerSitPos();
                roomView.showReadyBtn(true);
                roomView.clearRoomShow();
                isReadyState = true;
                isShowBidState = false;
                isCheckShowResult = true;
                break;
            }

            case Game.Room.STATE_ROB: {
                isShowBidState = false;
                roomView.showReadyBtn(false);
                roomView.unShowDrawOption();
                //抢庄按钮显示
                break;
            }
            case Game.Room.STATE_START: {
                isShowBidState = false;
                roomView.showReadyBtn(false);
                break;
            }
            case Game.Room.STATE_BID: {
                if (this._stateUpdateContinue) {
                    isShowBidOption = true;
                    isShowBidPokers = true;
                }
                roomView.showReadyBtn(false);
                break;
            }
            case Game.Room.STATE_DRAW: {
                roomView.unShowBidOption();
                isShowBidPokers = true;
                isShowBidState = true;

                roomView.showReadyBtn(false);
                if (whoRubbing <= 0 && this._stateUpdateContinue) {
                    roomView.showDrawOption();
                    isDrawState = true;
                }
                break;
            }
            case Game.Room.STATE_BANKER: {
                roomView.unShowBidOption();
                roomView.showReadyBtn(false);
                if (whoRubbing <= 0 && this._stateUpdateContinue) {
                    roomView.showDrawOption();
                    isBankerState = true;
                }
                break;
            }
            case Game.Room.STATE_PAY: {
                roomView.unShowBidOption();
                roomView.showReadyBtn(false);
                roomView.unShowDrawOption();
                break;
            }
            case Game.Room.STATE_END: {
                roomView.unShowBidOption();
                roomView.showReadyBtn(false);
                roomView.unShowDrawOption();
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
        if (isCheckShowResult && clients[selfId]) {
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

            if (isReadyState && isShowResult) {
                //*断线或者刷新回来，没有按下准备要恢复最后的结算
                playerBox.showResult();
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
                playerBox.showBankerStatePoker();
            }
        }

        if (isReadyState && !isShowResult) {
            for (var i = 0; i < playerBoxList.length; i++) {
                if (playerBoxList[i]) {
                    playerBoxList[i].cleanShow();
                }
            }
        }

        if (whoRubbing > 0) {
            this.rubbedPoker(whoRubbing);
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
                 this._rubbedDialog = new RubbedPokerDialog(rubbedPoker);
                 this._rubbedDialog.popup();
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
            var gamble          = {};
            switch (fn) {
                case "ready": {
                    //*状态的更新先暂停
                    this._stateUpdateContinue = false;
                    if (App.player.getId() == userId) {
                        var roomView = App.uiManager.getGameRoom();
                        var playerBoxList = roomView.getPlayerBoxs() || [];
                        for (var i = 0; i < playerBoxList.length; i ++) {
                            if (playerBoxList[i]) {
                                playerBoxList[i].cleanShow();
                            }
                        }
                    }
                    this._stateUpdateContinue = true;
                    break;
                }
                //case "rob": {
                //    this._stateUpdateContinue = true;
                //    break;
                //}
                //case "bid": {
                //    this._stateUpdateContinue = true;
                //    break;
                //}
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
                //case "doPay": {
                //    this._stateUpdateContinue = true;
                //    break;
                //}
                //case "end": {
                //    this._stateUpdateContinue = true;
                //    break;
                //}
                //case "rejectBanker": {
                //    this._stateUpdateContinue = true;
                //    break;
                //}
            }
            this.nextCommand();
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
        this._roomInfo = info.room;
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

    __proto.checkRoomRoute = function (route) {
        if (!route) {
            return;
        }

        var roomRoute = Game.ROUTE.ROOM;
        var roomView = this.getRoomView();

        //*发牌
        if (route == roomRoute.DEAL) {
            this._stateUpdateContinue = false;
            roomView.dealPokerAction();
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
                if (info && info.room) {
                    this._roomInfo = info.room;
                }
                else {
                    this._roomInfo = info;
                }

                this.checkRoomRoute(route);
            }
        }
        else if (isChatRoute){

        }
        else {

        }
    };

    __proto.init = function () {
        this._commandList       = []; //*消息列表
        this._commadSate        = RoomTableMgr.COMMAND_STATE.CHECK; //*消息处理的状态

        this._roomInfo          = null; //*房间信息

        this._forbiddenList     = []; //*禁言列表
        this._chatSaveList      = []; //*聊天记录储存

        this._isDealingPoker    = false; //*是否执行发牌的动作

        this._stateUpdateContinue = true; //*是不是要继续更新状态

        this._rubbedDialog = null; //搓牌界面
    };

    __proto.update = function () {
        this.commandUpdate();
        this.roomStateUpdate();
    };

    __proto.initEvent = function () {
        Laya.timer.loop(100, this, this.update);
    };

    __proto.setRoomInfo = function (data) {
        this._roomInfo = data || {};
    };

    RoomTableMgr.COMMAND_STATE = {
        CHECK: 1, //*检查是否有信息需要处理
        WAITING_EXECUTION: 2, //*等待处理结束
        EXECUTION_END: 3 //*处理结束
    };

    RoomTableMgr.Event = {
        CLOSE_ROOM : "CLOSE"
    };

    return RoomTableMgr;
}(laya.events.EventDispatcher));