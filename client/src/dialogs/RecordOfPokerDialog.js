/**
 *牌型记录界面
 */
var RecordOfPokerDialog = (function(_super) {
    function RecordOfPokerDialog(info) {
        RecordOfPokerDialog.super(this);

        this._info = info;
        this.init();
    }

    Laya.class(RecordOfPokerDialog, "RecordOfPokerDialog", _super);

    RecordOfPokerDialog.prototype.initList = function () {
        var array = [];
        var list = new laya.ui.List();
        var render = RecordPokerBox || new laya.ui.Box() ;

        var roundInfo = this._info.roundInfo;
        var users = this._info.users;
        var round = Number(this._info.round) + 1;
        var ghostPokers = this._info.ghostPokers;
        for (var index in roundInfo) {
            array.push({userID:index, roundInfo:roundInfo[index], users: users, ghostPokers:ghostPokers});
        }
        this.roundLab.text = "第" + round + "局";

        list.array = array;
        list.itemRender = render || new laya.ui.Box();

        list.x = 0;
        list.y = 0;
        list.width = this.pokerList.width;
        list.height = this.pokerList.height;

        list.spaceY = 10;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this._effortList = list;

        this.pokerList.addChild(list);
    };

    RecordOfPokerDialog.prototype.init = function () {
        this.initList();
    };

    RecordOfPokerDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };


    return RecordOfPokerDialog;
}(RecordOfPokerDialogUI));