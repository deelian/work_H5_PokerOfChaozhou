/**
 * 游戏房间中玩家的头像显示
 */
var RoomPlayerBox = (function(_super) {
    function RoomPlayerBox(playerInfo) {
        RoomPlayerBox.super(this);

        this._userId    = playerInfo.userID || App.player.id;
        this._pos       = playerInfo.pos || 0;

        this.init();
    }

    Laya.class(RoomPlayerBox, "RoomPlayerBox", _super);

    RoomPlayerBox.prototype.readyAction = function (isReady) {
        var readyIconVisible = false;
        if (isReady) {
            readyIconVisible = true;
        }
        this.readyIcon.visible = readyIconVisible;

        //*执行完成就返回说完成了，进行下一条
        App.tableManager.commandNext();
    };

    //*执行命令动作
    RoomPlayerBox.prototype.commandAction = function (command) {
        var userId = command.userID;
        var ready = command.ready;
        if (typeof(ready) == "boolean") {
            this.readyAction(ready);
        }
    };

    RoomPlayerBox.prototype.updateDisplay = function () {
        this.nameLab.text = "屌毛" + this._userId + "号";
        this.balanceLab.text = "0";
    };

    RoomPlayerBox.prototype.touchHeadIcon = function () {
        var playerInfoPanel = new PlayerInfoDialog();
        App.uiManager.addUiLayer(playerInfoPanel);
    };

    RoomPlayerBox.prototype.initEvent = function () {
        //*点击玩家头像
        this.headTouch.on(Laya.Event.CLICK, this, this.touchHeadIcon);
    };

    RoomPlayerBox.prototype.init = function() {
        this.initEvent();
        this.updateDisplay();
    };

    return RoomPlayerBox;
}(RoomPlayerUI));