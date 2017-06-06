/**
 * 在房间里面查看战绩界面
 */
var EffortOfRoomDialog = (function(_super) {
    function EffortOfRoomDialog(info) {
        EffortOfRoomDialog.super(this);

        this._roundInfo = info;
        this.init();
    }

    Laya.class(EffortOfRoomDialog, "EffortOfRoomDialog", _super);

    EffortOfRoomDialog.prototype.getEffortShowArray = function () {
        var array = [];

        var roundInfoLength = this._roundInfo.length;
        for (var index = roundInfoLength - 1; index >= 0; index--) {
            var round = index; //*局数
            array.push({round: round});

            var clients = this._roundInfo[index]["clients"] || {};
            var ghostPokers = this._roundInfo[index]["ghostPokers"] || [];
            var clientObj = Object.keys(clients);
            var clientsLength = clientObj.length;
            var showLine = Math.round(clientsLength / 2); //*每一局显示几行
            var num = 0; //*这一局的第几个人

            var lineShowInfo = {
                ghostPokers: ghostPokers
            };

            //*显示的第几行
            for (var i = 0; i < showLine; i ++) {
                //*这一行的内容
                for (var j = 0 ; j < 2; j ++) {
                    var userId = clientObj[num];
                    if (!userId) {
                        //* 因为是这一局是单数的玩家，所以最后一个就是空的
                        lineShowInfo["unName"] = null;
                    }
                    else {
                        lineShowInfo[userId] = clients[userId];
                    }
                    num ++;
                }
                //*储存要显示的数据
                array.push(lineShowInfo);
                //*还原显示数据，为下一条显示做准备
                lineShowInfo = {
                    ghostPokers: ghostPokers
                };
            }
        }
        //console.log(array);
        return array;
    };

    EffortOfRoomDialog.prototype.initEffortBox = function () {
        var array = [];
        var list = new laya.ui.List();
        var render = RoomEffortBox || new laya.ui.Box() ;

        array = this.getEffortShowArray();

        list.array = array;
        list.itemRender = render || new laya.ui.Box();

        list.x = 0;
        list.y = 0;
        list.width = this.effortBox.width;
        list.height = this.effortBox.height;

        list.spaceY = 10;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this.effortBox.addChild(list);
    };

    EffortOfRoomDialog.prototype.init = function() {
        this.initEffortBox();
    };

    EffortOfRoomDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return EffortOfRoomDialog;
}(EffortOfRoomDialogUI));
