/**
 * 大厅界面
 */
var LobbyView = (function(_super) {
    function LobbyView() {
        LobbyView.super(this);

        this.init();
    }

    Laya.class(LobbyView, "LobbyView", _super);

    LobbyView.prototype.onEnterRoom = function () {
        //*输入房间号
        var inputRoomNumberDialog = new InputRoomNumberDialog();
        App.uiManager.addUiLayer(inputRoomNumberDialog, {isAddShield:true,alpha:0,isDispose:true});
    };

    LobbyView.prototype.onCreateRoom = function () {
        //*选择游戏模式以及设置
        var selectModeDialog = new SelectModeDialog();
        App.uiManager.addUiLayer(selectModeDialog, {isAddShield:true,alpha:0,isDispose:true});
    };

    LobbyView.prototype.initEvent = function () {
        //*创建房间按钮
        this.createRoomBtn.on(Laya.Event.CLICK, this, this.onCreateRoom);
        //*加入房间按钮
        this.enterRoomBtn.on(Laya.Event.CLICK, this, this.onEnterRoom);
    };

    LobbyView.prototype.init = function() {
        this.initEvent();
    };

    return LobbyView;
}(LobbyViewUI));
