/**
 * 玩家信息显示界面
 */
var PlayerInfoDialog = (function(_super) {
    function PlayerInfoDialog(playerInfo) {
        PlayerInfoDialog.super(this);

        this._playerInfo = playerInfo;

        this.init();
    }

    Laya.class(PlayerInfoDialog, "PlayerInfoDialog", _super);

    PlayerInfoDialog.prototype.initEvent = function () {

    };

    PlayerInfoDialog.prototype.init = function() {
        this.initEvent();
    };

    PlayerInfoDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return PlayerInfoDialog;
}(PlayerInfoDailogUI));