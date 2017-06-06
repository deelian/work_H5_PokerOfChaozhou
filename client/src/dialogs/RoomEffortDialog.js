/**
 * 房间战绩
 */
var RoomEffortDialog = (function(_super) {
    function RoomEffortDialog(info) {
        RoomEffortDialog.super(this);

        this._info = info;
        this.init();
    }

    Laya.class(RoomEffortDialog, "RoomEffortDialog", _super);

    RoomEffortDialog.prototype.initList = function () {
        var array = [];
        var list = new laya.ui.List();
        var render = EffortBox || new laya.ui.Box() ;

        var rounds = this._info.data.rounds;
        var users = this._info.data.users;
        for (var index in rounds) {
            var roundsClients = rounds[index].clients || {};
            var ghostPokers = rounds[index].ghostPokers || [];
            var info = {
                round: index,
                roundInfo: roundsClients,
                users: users,
                ghostPokers: ghostPokers
            };
            array.push(info);
        }

        list.array = array;
        list.itemRender = render || new laya.ui.Box();

        list.x = 10;
        list.y = 0;
        list.width = this.effortBox.width;
        list.height = this.effortBox.height;

        list.spaceY = 10;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this.effortBox.addChild(list);
    };

    RoomEffortDialog.prototype.init = function () {
        this.initList();
    };

    RoomEffortDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };


    return RoomEffortDialog;
}(RoomEffortUI));
