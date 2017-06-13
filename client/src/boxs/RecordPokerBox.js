/**
 *
 */
var RecordPokerBox = (function(_super) {
    function RecordPokerBox() {
        RecordPokerBox.super(this);
        this._pokerList = [];
    }

    Laya.class(RecordPokerBox, "RecordPokerBox", _super);

    RecordPokerBox.prototype.onRender = function(data){
        this._data = data;

        var id = this._data.userID;
        var users = this._data.users;
        var name = users[id].name || "游客";

        this.nameLab.text = name;
        this.userIdLab.text = "ID:" + id;

        var avatar = users[id].avatar || "";
        this.handIcon.skin = avatar;

        var gold = this._data.roundInfo.gold;
        if (gold  > 0) {
            this.goldLab.text = "+" + gold;
            this.goldLab.color = EffortBox.COLOR_LAB.GREED;
        }
        else if (gold  < 0) {
            this.goldLab.text = gold;
            this.goldLab.color = EffortBox.COLOR_LAB.RED;
        }
        else {
            this.goldLab.text = "0";
        }

        var type = this._data.roundInfo.type;
        var modelNames = Game.Game.POKER_MODEL_NAMES;
        var txt = modelNames[type];
        if (type == "point") {
            txt = ("" + this._data.roundInfo.point % 10 + "点");
        }

        this.typeLab.text = txt;

        for (var index in this._pokerList) {
            this._pokerList[index].dispose();
        }

        var handPokers = this._data.roundInfo.handPokers;
        var pokerNum = 0;
        var pokerList = this._data.ghostPokers || [];
        for (var pokerIndex in handPokers) {
            var pokerInfo = handPokers[pokerIndex];
            var poker = new Poker(pokerInfo, pokerList);
            poker.scaleX = 0.2;
            poker.scaleY = 0.2;
            poker.x = pokerNum * 40;
            poker.y = 7;
            this.pokerBox.addChild(poker);
            this._pokerList.push(poker);
            pokerNum ++;
        }

        var bidRate = this._data.roundInfo.bidRate || 1;
        this.bidRateLab.text = "×" + bidRate;

        if (this._data.roundInfo.isBanker) {
            this.bankerTag.visible = true;
        }
        else {
            this.bankerTag.visible = false;
        }
    };

    RecordPokerBox.renderHandler = function(cell, index) {
        cell.onRender(cell.dataSource,index);
    };

    RecordPokerBox.COLOR_LAB = {
        GREED: "#7fff5c",
        RED: "#FF2626"
    };
    return RecordPokerBox;
}(RecordPokerBoxUI));