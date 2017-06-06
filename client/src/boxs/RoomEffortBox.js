/**
 * 房间里面查看战绩的战绩ITEM
 */
var RoomEffortBox = (function(_super) {
    function RoomEffortBox() {
        RoomEffortBox.super(this);
        this._pokerList = [];
    }

    Laya.class(RoomEffortBox, "RoomEffortBox", _super);

    RoomEffortBox.prototype.onRender = function(data){
        this._data = data || {};
        var dataRound = this._data.round;
        if (typeof (dataRound) != "number") {
            dataRound = -1;
        }

        var pokerBoxList = [];
        var nameLabList = [];
        var scoreLabList = [];
        var handIconList = [];

        for (var j = 0; j < 2; j ++) {
            var pokerBox = this.line.getChildByName("pokerBox_" + j);
            pokerBox.visible = false;
            pokerBoxList.push(pokerBox);
            var nameLab = this.line.getChildByName("nameLab_" + j);
            nameLab.visible = false;
            nameLabList.push(nameLab);
            var scoreLab = this.line.getChildByName("scroeLab_" + j);
            scoreLab.visible = false;
            scoreLabList.push(scoreLab);
            var handIcon = this.line.getChildByName("handIcon_" + j);
            handIcon.visible = false;
            handIconList.push(handIcon);
        }

        if (dataRound <= -1) {
            //*内容的显示
            this.roundLab.visible = false;
            this.line.visible = true;

            this._ghostPokers = this._data.ghostPokers || [];

            var playerInfo;

            for (var pokerIndex in this._pokerList) {
                this._pokerList[pokerIndex].dispose();
            }

            var dataObj = Object.keys(this._data);
            var dataObjLength = dataObj.length;
            var num = 0;
            var roomLogUser = App.tableManager.getRoomLogUsers();
            for (var index = 0; index < dataObjLength; index ++) {
                var userId = dataObj[index];

                if (userId != "unName" && userId != "ghostPokers") {
                    playerInfo = this._data[userId];
                    handIconList[num].visible = true;
                    nameLabList[num].visible = true;
                    var name = roomLogUser[userId].name || "游客";
                    nameLabList[num].text = name;
                    var avatar = roomLogUser[userId].avatar || "";
                    handIconList[num].skin = avatar;
                    var gold = Number(playerInfo.gold);
                    if (gold > 0) {
                        scoreLabList[num].text = "+" + gold;
                        scoreLabList[num].color = RoomEffortBox.COLOR_LAB.GREED;
                    }
                    else if (gold < 0) {
                        scoreLabList[num].text = playerInfo.gold + "";
                        scoreLabList[num].color = RoomEffortBox.COLOR_LAB.RED;
                    }
                    else {
                        scoreLabList[num].text = "0";
                    }
                    scoreLabList[num].visible = true;

                    var handPokers = playerInfo.handPokers;
                    var tempNum = 0;
                    for (var pokerIndex in handPokers) {
                        var pokerInfo = handPokers[pokerIndex];
                        var poker = new Poker(pokerInfo, this._ghostPokers);
                        poker.scaleX = 0.18;
                        poker.scaleY = 0.18;
                        poker.x = tempNum * 40;
                        poker.y = 5;
                        pokerBoxList[num].visible = true;
                        pokerBoxList[num].addChild(poker);
                        this._pokerList.push(poker);
                        tempNum ++;
                    }

                    num ++;
                }

            }
        }
        else {
            //*只显示第几局
            var roundNum = Number(dataRound) + 1;
            this.roundLab.text = "第" + roundNum + "局";

            this.roundLab.visible = true;
            this.line.visible = false;
        }
    };

    RoomEffortBox.renderHandler = function(cell, index) {
        cell.onRender(cell.dataSource,index);
    };

    RoomEffortBox.COLOR_LAB = {
        GREED: "#7fff5c",
        RED: "#FF2626"
    };


    return RoomEffortBox;
}(RoomEffortBoxUI));
