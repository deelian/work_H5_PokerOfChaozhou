/**
 * 游戏大厅总战绩
 */
var LobbyEffortDialog = (function(_super) {
    function LobbyEffortDialog(data) {
        LobbyEffortDialog.super(this);

        this._effortList = data || [];
        this._effortListBox = null;
        this._canUpdateEffort = true;
        this.init();
    }

    Laya.class(LobbyEffortDialog, "LobbyEffortDialog", _super);

    LobbyEffortDialog.prototype.init = function () {
        this.initList();
    };

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
        list.mouseHandler = new Laya.Handler(this, this.listMouseHandler);

        this._effortListBox = list;
        this.effortBox.addChild(list);
    };

    LobbyEffortDialog.prototype.listMouseHandler = function (e) {
        var listScrollBar = this._effortListBox.scrollBar;
        if (listScrollBar.value >= listScrollBar.max && this._canUpdateEffort) {
            this._canUpdateEffort = false;
            App.uiManager.updateLobbyEffort();
        }

    };

    LobbyEffortDialog.prototype.updateShowItems = function (data) {
        this._canUpdateEffort = true;
        if (data instanceof Array && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                this._effortListBox.addItem(data[i]);
            }
        }
    };

    return LobbyEffortDialog;
}(LobbyEffortDialogUI));

