/**
 * 游戏房间界面
 */
var GameRoomView = (function(_super) {
    function GameRoomView() {
        GameRoomView.super(this);

        this.init();
    }

    Laya.class(GameRoomView, "GameRoomView", _super);

    GameRoomView.prototype.dispose = function () {
        App.uiManager.removeGameRoomView();
    };

    GameRoomView.prototype.initEvent = function () {
        this.closeBtn.on(Laya.Event.CLICK, this, this.dispose);
    };

    GameRoomView.prototype.init = function() {
        this.initEvent();
    };

    return GameRoomView;
}(GameRoomViewUI));