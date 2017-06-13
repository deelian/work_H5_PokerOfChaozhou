/**
 * 游戏大厅总战绩
 */
var LobbyEffortDialog = (function(_super) {
    function LobbyEffortDialog(data) {
        LobbyEffortDialog.super(this);

        this._effortList = data || [];

        this.init();
    }

    Laya.class(LobbyEffortDialog, "LobbyEffortDialog", _super);

    LobbyEffortDialog.prototype.initList = function () {
        var array = [];
        var list = new laya.ui.List();
        var render = LobbyEffortItemBox || new laya.ui.Box() ;

        for (var index in this._effortList) {
            array.push(this._effortList[index]);
        }

        list.array = array;
        list.itemRender = render || new laya.ui.Box();

        list.x = 3;
        list.y = 0;
        list.width = this.effortBox.width;
        list.height = this.effortBox.height;

        list.spaceY = 10;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this.effortBox.addChild(list);
    };

    LobbyEffortDialog.prototype.init = function () {
        this.initList();
    };

    LobbyEffortDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    LobbyEffortDialog.CLOSE = "close";

    return LobbyEffortDialog;
}(LobbyEffortDialogUI));

