/**
 * 房间桌面状态显示管理器
 */
var RoomTableMgr = (function(_super) {

    function RoomTableMgr() {

        this._commadList    = [];
        this._playerBoxList = {}; //*玩家Box列表，用作表演的
        this._gameRoom      = null;
        this._chairs        = null;
        this._ghostPoker    = null;

        this._dealRound      = 1; //*第几轮的牌
        this._dealUser      = 0; //*到谁

        this._commadSate    = RoomTableMgr.COMMAND_STATE.CHECK; //*消息处理的状态

        this.init();
    }

    Laya.class(RoomTableMgr, "RoomTableMgr", _super);

    RoomTableMgr.prototype.nextFlyPoker = function () {
        this.flyPoker();
    };

    RoomTableMgr.prototype.flyPoker = function () {
        if (this._dealRound > 2) {
            //*发完牌要下注了
            this.event(RoomTableMgr.EVENT.BID);
            return;
        }
        var deckNode = this._gameRoom.getDeckNode();
        var playerBox = this._gameRoom.getPlayersBox();
        var flyPoker = new Poker();
        flyPoker.x = deckNode.x;
        flyPoker.y = deckNode.y;
        flyPoker.scaleX = 0.5;
        flyPoker.scaleY = 0.5;
        playerBox.addChild(flyPoker);

        this._dealUser++; //*先加上1，庄家的下一个
        if (this._dealUser >= this._chairs.length) {
            this._dealUser = 0;
            //*轮数加一
            this._dealRound ++;
        }
        var userId = this._chairs[this._dealUser];
        var pos = this._gameRoom.getTableIndexByUserId(userId);
        var moveTo = MoveTo.create(0.5, pos.x, pos.y);
        var scaleTo = ScaleTo.create(0.5, 0, 0);
        var spa = Spawn.create(moveTo, scaleTo);
        var self = this;
        var callBack = CallFunc.create(Laya.Handler.create(null, function () {
            self._playerBoxList[userId].showDealPoker();
        }));
        var seq = Sequence.create(spa, callBack);
        App.actionManager.addAction(seq, flyPoker);
    };

    //*每个人发扑克牌的表现
    RoomTableMgr.prototype.dealPlayerPokerAction = function () {
        var deckNode = this._gameRoom.getDeckNode();
        var playerBox = this._gameRoom.getPlayersBox();
        var deckPoker = new Poker();
        deckPoker.x = deckNode.x;
        deckPoker.y = deckNode.y;
        deckPoker.scaleX = 0.5;
        deckPoker.scaleY = 0.5;
        playerBox.addChild(deckPoker);

        this.flyPoker();
    };

    //*通知发鬼牌
    RoomTableMgr.prototype.ghostPokersMove = function () {
        this.event(RoomTableMgr.EVENT.GHOST_POKER, [this._ghostPokers]);
    };

    //*发牌表演
    RoomTableMgr.prototype.dealPoker = function (info) {
        this._chairs = info.chairs; //*要发牌给他的人
        this._ghostPokers = info.table.ghostPokers; //*翻出的鬼牌
        this.event(RoomTableMgr.EVENT.GAME_START);
    };

    //*执行下一条指令
    RoomTableMgr.prototype.commandNext = function () {
        this._commadList.shift();
        if (this._commadList.length <= 0) {
            //*没有信息
            this._commadSate = RoomTableMgr.COMMAND_STATE.EXECUTION_END;
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
            //*表现
            if (this._playerBoxList[userId]) {
                this._playerBoxList[userId].commandAction(command);
            }
            else {
                this.commandNext();
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
        for (var index in info) {
            this._commadList.push(info[index]);
        }
    };

    RoomTableMgr.prototype.delPlayerBox = function (userId) {
        if (this._playerBoxList[userId]) {
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

    RoomTableMgr.prototype.init = function () {
        this.initEvent();
    };

    RoomTableMgr.prototype.removeGameRoomEvent = function () {

    };

    RoomTableMgr.prototype.initGameRoomEvent = function () {

    };

    RoomTableMgr.prototype.clearGameRoom = function () {
        this._gameRoom = null;
        this._playerBoxList = {};
        this.removeGameRoomEvent();
    };

    RoomTableMgr.prototype.saveGameRoom = function (gameRoom) {
        this._gameRoom = gameRoom;
        this.initGameRoomEvent();
    };

    RoomTableMgr.COMMAND_STATE = {
        CHECK: 1, //*检查是否有信息需要处理
        WAITING_EXECUTION: 2, //*等待处理结束
        EXECUTION_END: 3 //*处理结束
    };

    RoomTableMgr.EVENT = {
        GAME_START: "GAME_START",
        GHOST_POKER: "GHOST_POKER",
        BID: "BID"
    };

    return RoomTableMgr;
}(laya.events.EventDispatcher));