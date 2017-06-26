/**
 * 房间战绩item
 */
var EffortBox = (function(_super) {
    function EffortBox() {
        EffortBox.super(this);
        this._iconList = [];
        this.touchBox.on(Laya.Event.CLICK, this, this.touchRound);
    }

    Laya.class(EffortBox, "EffortBox", _super);

    EffortBox.prototype.touchRound = function () {
        App.soundManager.playSound("btnSound");
        App.uiManager.addUiLayer(RecordOfPokerDialog, this._data);
    };

    EffortBox.prototype.onRender = function(data){
        this._data = data;

        var roundNum = Number(this._data.round) + 1;
        this.roundNumLab.text = "第" + roundNum + "局";

        this.timeLab.text = "";

        var roundInfo = this._data.roundInfo;
        var selfId = App.player.getId();

        var selfRoundInfo = roundInfo[selfId] || {};
        var gold = selfRoundInfo.gold || 0;
        if (gold > 0) {
            this.goldNumLab.text = "+" + gold;
            this.goldNumLab.color = EffortBox.COLOR_LAB.GREED;
        }
        else if (gold < 0) {
            this.goldNumLab.text = gold;
            this.goldNumLab.color = EffortBox.COLOR_LAB.RED;
        }
        else {
            this.goldNumLab.text = "0";
        }

        for (var iconIndex in this._iconList) {
            this._iconList[iconIndex].dispose();
        }

        var users = this._data.users;
        var playerNum = 0;
        for (var index in roundInfo) {
            var playerGold = roundInfo[index].gold;
            var isBanker = roundInfo[index].isBanker;
            var avatar = users[index].avatar;
            var icon = new EffortIcon(playerGold,isBanker,avatar);
            icon.x = playerNum * 55;
            this.handIconLab.addChild(icon);
            this._iconList.push(icon);
            playerNum ++;
        }
    };

    EffortBox.renderHandler = function(cell, index) {
        cell.onRender(cell.dataSource,index);
    };

    EffortBox.COLOR_LAB = {
        GREED: "#7fff5c",
        RED: "#FF2626"
    };
    return EffortBox;
}(EffortBoxUI));
