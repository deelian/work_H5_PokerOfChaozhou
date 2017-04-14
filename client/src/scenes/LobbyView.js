/**
 * 大厅界面
 */
var LobbyView = (function(_super) {
    function LobbyView() {
        LobbyView.super(this);

        this._roomId = null;

        this.init();
    }

    Laya.class(LobbyView, "LobbyView", _super);

    LobbyView.prototype.checkSelfIsInRoom = function () {
        var str = "创建房间";
        var roomId = App.getRoomId();

        if (roomId) {
            str = "返回房间";
            this._roomId = roomId;
        }
        this.createBtnLab.text = str;
    };

    LobbyView.prototype.touchHead = function () {
        var playerInfoPanel = new PlayerInfoDialog();
        App.uiManager.addUiLayer(playerInfoPanel);
    };

    LobbyView.prototype.onEnterRoom = function () {
        //*输入房间号
        var inputRoomNumberDialog = new InputRoomNumberDialog();
        App.uiManager.addUiLayer(inputRoomNumberDialog);
    };

    LobbyView.prototype.onCreateRoom = function () {
        if (this._roomId) {
            //*在房间就进入房间
            App.enterRoom(this._roomId);
        }
        else {
            //*选择游戏模式以及设置
            var selectModeDialog = new SelectModeDialog();
            App.uiManager.addUiLayer(selectModeDialog);
        }
    };

    LobbyView.prototype.initEvent = function () {
        //*创建房间按钮
        this.createRoomBtn.on(Laya.Event.CLICK, this, this.onCreateRoom);
        //*加入房间按钮
        this.enterRoomBtn.on(Laya.Event.CLICK, this, this.onEnterRoom);
        //*头像
        this.headIconTouch.on(Laya.Event.CLICK, this, this.touchHead);
    };

    LobbyView.prototype.init = function() {
        this.initEvent();
        this.checkSelfIsInRoom();
    };

    return LobbyView;
}(LobbyViewUI));
