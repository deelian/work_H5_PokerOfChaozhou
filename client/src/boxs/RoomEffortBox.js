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

        var gameRound = this._data.round;
        if (typeof (gameRound) != "number") {
            gameRound = -1;
        }

        if (gameRound >= 0) {
            //*只显示第几局
            var roundNum = Number(gameRound) + 1;
            this.roundLab.text = "第" + roundNum + "局";
            this.roundLab.visible = true;
            this.line.visible = false;
        }
        else {
            this.roundLab.visible = false;
            this.line.visible = true;

            this._ghostPokers = this._data.ghostPokers || [];

            var roomLogUser = App.tableManager.getRoomLogUsers();

            for (var pokerIndex = 0; pokerIndex < this._pokerList.length; pokerIndex ++) {
                this._pokerList[pokerIndex].dispose();
            }

            //*要显示多少个
            var showUserNum = 0;
            var userIndexList = [];
            for (var dataIndex in this._data) {
                if (dataIndex == "unName" || dataIndex == "ghostPokers") {
                    continue;
                }

                if (userIndexList.indexOf(dataIndex) == -1) {
                    userIndexList.push(dataIndex);
                }
                showUserNum ++;
            }

            for (var showIndex = 0; showIndex < showUserNum; showIndex ++) {
                var userId          = userIndexList[showIndex];
                var userInfo        = this._data[userId];

                var showBox         = this.line.getChildByName("userBox_" + showIndex);
                showBox.visible     = true;

                var handIcon        = showBox.getChildByName("handIcon");
                var nameLab         = showBox.getChildByName("nameLab");
                var pokerBox        = showBox.getChildByName("pokerBox");
                var bidRateLab      = showBox.getChildByName("bidRateLab");
                var scoreLab        = showBox.getChildByName("scoreLab");
                var bankerTag       = showBox.getChildByName("bankerTag");

                var name            = roomLogUser[userId].name || "游客";
                var avatar          = roomLogUser[userId].avatar || "";
                var gold            = Number(userInfo.gold);
                var bidRate         = userInfo.bidRate;
                var isBanker        = userInfo.isBanker;
                var handPokers      = userInfo.handPokers || [];

                nameLab.text        = name;
                handIcon.skin       = avatar;
                bidRateLab.text     = "×" + bidRate;
                bankerTag.visible   = !!isBanker;

                var goldStr         = "";
                var goldColor       = RoomEffortBox.COLOR_LAB.GREED;
                if (gold > 0) {
                    goldStr = "+" + gold;
                }
                else if (gold < 0) {
                    goldStr = gold + "";
                    goldColor = RoomEffortBox.COLOR_LAB.RED;
                }
                else {
                    goldStr = "0";
                }

                scoreLab.text      = goldStr;
                scoreLab.color     = goldColor;

                var tempNum = 0;
                for (var handPokerIndex in handPokers) {
                    var pokerInfo = handPokers[handPokerIndex];
                    var poker = new Poker(pokerInfo, this._ghostPokers);
                    poker.scaleX = 0.18;
                    poker.scaleY = 0.18;
                    poker.x = tempNum * 40;
                    poker.y = 5;
                    pokerBox.addChild(poker);
                    this._pokerList.push(poker);
                    tempNum ++;
                }
            }
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
