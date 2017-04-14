/**
 * 游戏房间中玩家的头像显示
 */
var RoomPlayerBox = (function(_super) {
    function RoomPlayerBox(playerInfo) {
        RoomPlayerBox.super(this);

        this._userId        = playerInfo.userID || App.player.id;
        this._pos           = playerInfo.pos || 0;
        this._wasDealTime   = 0;
        this._isSelf        = false;
        this.init();
    }

    Laya.class(RoomPlayerBox, "RoomPlayerBox", _super);

    RoomPlayerBox.prototype.readyAction = function (isReady) {
        var readyIconVisible = false;
        if (isReady) {
            readyIconVisible = true;
        }
        this.readyIcon.visible = readyIconVisible;

        //*执行完成就返回说完成了，进行下一条
        App.tableManager.commandNext();
    };

    //*执行命令动作
    RoomPlayerBox.prototype.commandAction = function (command) {
        var userId = command.userID;
        var ready = command.ready;
        if (typeof(ready) == "boolean") {
            this.readyAction(ready);
        }
    };

    RoomPlayerBox.prototype.showDealPoker = function () {
        if (this._isSelf) {
            this._positivePokerList[this._wasDealTime].visible = true;
        }
        else {
            this._pokerBackList[this._wasDealTime].visible = true;
        }
        this._wasDealTime ++;
        if (this._wasDealTime >= 3) {
            this._wasDealTime = 0;
        }

        //*可以下一个发牌了
        App.tableManager.nextFlyPoker();
    };

    RoomPlayerBox.prototype.updateDisplay = function () {
        this.nameLab.text = "屌毛" + this._userId + "号";
        this.balanceLab.text = "0";

        this._pokerBackList = [];
        var pokerBox = this.pokerBox;
        for (var i = 0; i < 3; i++) {
            var pokerBack = new Poker();
            pokerBack.rotation = i * 25 - 25;
            pokerBack.anchorX = 0.5;
            pokerBack.anchorY = 0.5;
            pokerBack.scaleX = 0.3;
            pokerBack.scaleY = 0.3;
            pokerBack.y = 30;
            pokerBack.x = i * 10 + 10;
            pokerBack.visible = false;
            pokerBox.addChild(pokerBack);
            this._pokerBackList.push(pokerBack);
        }

        this._positivePokerList = [];
        var positivePokerBox = this.positivePokerBox;
        for (var index = 1; index < 4; index ++) {
            var poker = new Poker({type:1, value:1});
            poker.anchorX = 0.5;
            poker.anchorY = 0.5;
            poker.scaleX = 0.3;
            poker.scaleY = 0.3;
            poker.x = 14 * index + 17;
            poker.y = 37;
            positivePokerBox.addChild(poker);
            poker.visible = false;
            this._positivePokerList.push(poker);

            if (this._isSelf) {
                poker.changePokerSkin(Poker.POKER_TYPE.OPPOSITE);
            }
        }
    };

    RoomPlayerBox.prototype.touchHeadIcon = function () {
        var playerInfoPanel = new PlayerInfoDialog();
        App.uiManager.addUiLayer(playerInfoPanel);
    };

    RoomPlayerBox.prototype.initEvent = function () {
        //*点击玩家头像
        this.headTouch.on(Laya.Event.CLICK, this, this.touchHeadIcon);
    };

    RoomPlayerBox.prototype.init = function() {
        if (this._userId == App.player.id) {
            this._isSelf = true;
        }
        this.initEvent();
        this.updateDisplay();
    };

    return RoomPlayerBox;
}(RoomPlayerUI));