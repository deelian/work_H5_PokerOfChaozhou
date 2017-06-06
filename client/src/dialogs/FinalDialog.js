/**
 * 房间结束结算界面
 */
var FinalDialog = (function(_super) {
    function FinalDialog(info) {
        FinalDialog.super(this);

        this._info = info;
        this._finalInfo = {};
        this.init();
    }

    Laya.class(FinalDialog, "FinalDialog", _super);

    //*分享
    FinalDialog.prototype.onShowShare = function () {
        App.soundManager.playSound("btnSound");

        var shareView = new ShareDialog();
        App.uiManager.addUiLayer(shareView);
    };

    //*房间战绩显示
    FinalDialog.prototype.onShowEffortPanel = function () {
        App.soundManager.playSound("btnSound");
        //App.tableManager.quitRoom();

        var roomEffortDialog = new RoomEffortDialog({data:this._info});
        App.uiManager.addUiLayer(roomEffortDialog);
    };

    //*返回大厅
    FinalDialog.prototype.backLobby = function () {
        App.soundManager.playSound("btnSound");
        this.close();
    };

    FinalDialog.prototype.initShow = function () {
        var rounds = this._info.rounds;
        var user = this._info.users;

        var roundsLength = rounds.length;
        for (var index = roundsLength - 1; index >= 0; index --) {
            var roundSingle = rounds[index].clients || {};
            //*每一局的统计
            for (var i in roundSingle) {
                var gold        = user[i].total;
                var godNum      = user[i].godTimes;
                var name        = user[i].name || "游客";
                var avatar      = user[i].avatar || "";
                var handPokers  = roundSingle[i].handPokers;
                var score       = roundSingle[i].score;

                if (this._finalInfo[i]) {
                    //*最大的牌型
                    if (this._finalInfo[i].score < score) {
                        this._finalInfo[i].score = score;
                        this._finalInfo[i].handPokers = handPokers;
                    }
                    //*总分数
                    this._finalInfo[i].gold = gold;
                    //*天公次数
                    this._finalInfo[i].godNum = godNum;
                }
                else {
                    this._finalInfo[i] = {
                        score : score,
                        handPokers : handPokers,
                        gold : gold,
                        godNum : 0,
                        name: name,
                        avatar: avatar
                    };
                }
            }
        }

        //*初始化list
        var array = [];
        var list = new laya.ui.List();
        var render = FinalItemBox || new laya.ui.Box() ;

        var tempNum = 1;
        var info = {};
        var length = Object.keys(this._finalInfo).length;
        for( var k in this._finalInfo){
            info[k] = this._finalInfo[k];
            if (tempNum % 2 == 0) {
                array.push(info);
                info = {};
            }
            else {
                //*最后一个是单数
                if (tempNum >= length) {
                    array.push(info);
                    info = {};
                }
            }
            tempNum ++;
        }

        list.array = array;
        list.itemRender = render || new laya.ui.Box();

        list.x = 15;
        list.y = 10;
        list.width = this.finalBox.width;
        list.height = this.finalBox.height;

        list.spaceY = 10;
        list.vScrollBarSkin = "";

        list.renderHandler = render.renderHandler ? new Laya.Handler(render, render.renderHandler) : null;

        this.finalBox.addChild(list);
    };

    FinalDialog.prototype.initEvent = function () {
        var btnAndEvent = [
            //*返回大厅按钮
            {"btn": this.lobbyBtn, "func": this.backLobby},
            {"btn": this.effortBtn, "func": this.onShowEffortPanel},
            {"btn": this.shareBtn, "func": this.onShowShare}
        ];

        var btn;
        for (var i = 0; i < btnAndEvent.length; i ++) {
            btn = btnAndEvent[i]["btn"];
            var func = btnAndEvent[i]["func"];
            btn.on(Laya.Event.CLICK, this, func);
        }
    };

    FinalDialog.prototype.init = function() {
        this.initEvent();
        this.initShow();
    };

    FinalDialog.prototype.close = function() {
        App.tableManager.quitRoom();
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return FinalDialog;
}(FinalDialogUI));
