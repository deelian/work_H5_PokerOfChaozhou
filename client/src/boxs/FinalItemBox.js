/**
 *
 */
var FinalItemBox = (function(_super){
    function FinalItemBox(){
        FinalItemBox.super(this);
    }
    Laya.class(FinalItemBox,"FinalItemBox",_super);

    FinalItemBox.prototype.onRender = function(data){
        this._data = data;

        var showLength = Object.keys(this._data).length;
        if (showLength <= 1 && showLength > 0) {
            this.playerInfo_1.visible = false;
        }

        var roomInfo = App.tableManager.getRoomInfo();
        var roomHost = roomInfo.host;
        var boxList = [this.playerInfo_0, this.playerInfo_1];
        var tempNum = 0;
        for (var index in this._data) {
            var name = this._data[index].name;
            var godNum = this._data[index].godNum;
            var gold = this._data[index].gold;
            var handPoker = this._data[index].handPokers;
            var box = boxList[tempNum];
            var avatar = this._data[index].avatar || "";

            box.getChildByName("handIcon_" + tempNum).skin = avatar;
            box.getChildByName("nameLab_" + tempNum).text = name;
            box.getChildByName("godNumLab_" + tempNum).text = godNum;
            box.getChildByName("scoreLab_" + tempNum).text = gold;
            if (gold >= 0) {
                box.getChildByName("scoreLab_" + tempNum).color = FinalItemBox.COLOR_LAB.GREED;
            }
            else {
                box.getChildByName("scoreLab_" + tempNum).color = FinalItemBox.COLOR_LAB.RED;
            }

            var pokerNum = 0;
            for (var i in handPoker) {
                var poker = new Poker(handPoker[i]);
                poker.scaleX = 0.15;
                poker.scaleY = 0.15;
                poker.x = pokerNum * 40;
                box.getChildByName("pokerBox_" + tempNum).addChild(poker);
                pokerNum ++;
            }

            if (roomHost == Number(index)) {
                box.getChildByName("hostTag").visible = true;
            }
            else {
                box.getChildByName("hostTag").visible = false;
            }
            tempNum++;
        }
    };

    FinalItemBox.renderHandler = function(cell, index) {
        cell.onRender(cell.dataSource,index);
    };

    FinalItemBox.COLOR_LAB = {
        GREED: "#7fff5c",
        RED: "#FF2626"
    };

    return FinalItemBox;
})(FinalItemUI);