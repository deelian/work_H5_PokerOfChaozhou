/**
 * 房间桌面状态显示管理器
 */
var RoomTableMgr = (function(_super) {

    function RoomTableMgr() {

        this._commadList    = [];
        this._actionList    = []; //*表演列表
        this._playerBoxList = {}; //*玩家Box列表，用作表演的

        this._commadSate    = RoomTableMgr.COMMAND_STATE.CHECK; //*消息处理的状态

        this.init();
    }

    Laya.class(RoomTableMgr, "RoomTableMgr", _super);

    //*每个人发扑克牌的表现
    RoomTableMgr.prototype.dealPlayerPokerAction = function () {

    };

    //*开始动画
    RoomTableMgr.prototype.startGameAction = function () {

    };

    //*发牌表演
    RoomTableMgr.prototype.dealPoker = function (info) {
        var chairs = info.chairs; //*要发牌给他的人
        var ghostPokers = info.table.ghostPokers; //*翻出的鬼牌
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

    //*创建发牌的一副牌的显示
    RoomTableMgr.prototype.createDeck = function () {
        var deckPoker;
        var imagePath = "assets/pokers/poker_back.png";
        deckPoker = new Laya.Image(imagePath);
        deckPoker.anchorX = 0.5;
        deckPoker.anchorY = 0.5;
        return deckPoker;
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

    RoomTableMgr.COMMAND_STATE = {
        CHECK: 1, //*检查是否有信息需要处理
        WAITING_EXECUTION: 2, //*等待处理结束
        EXECUTION_END: 3 //*处理结束
    };


    return RoomTableMgr;
}(laya.events.EventDispatcher));