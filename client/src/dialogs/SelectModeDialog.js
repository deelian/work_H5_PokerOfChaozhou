/**
 * 先择游戏模式界面
 */
var SelectModeDialog = (function(_super) {
    function SelectModeDialog() {
        SelectModeDialog.super(this);

        this.init();
    }

    Laya.class(SelectModeDialog, "SelectModeDialog", _super);


    SelectModeDialog.prototype.touchCreateRoom = function () {
        App.uiManager.runGameRoomView();
        this.close();
    };

    SelectModeDialog.prototype.initEvent = function () {
        this.createRoomBtn.on (Laya.Event.CLICK, this, this.touchCreateRoom);
    };

    SelectModeDialog.prototype.init = function() {
        this.initEvent();
    };

    SelectModeDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return SelectModeDialog;
}(SelectModeDialogUI));
