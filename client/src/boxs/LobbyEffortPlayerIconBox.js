/**
 *
 */
var LobbyEffortPlayerIconBox = (function(_super) {
    function LobbyEffortPlayerIconBox(info, isBanker) {
        LobbyEffortPlayerIconBox.super(this);

        this._id = info.id;
        this._gold = info.gold;
        this._isBanker = isBanker;
        this._userName = info.name;
        this._avatar = info.avatar;

        this.init();
    }

    Laya.class(LobbyEffortPlayerIconBox, "LobbyEffortPlayerIconBox", _super);

    LobbyEffortPlayerIconBox.prototype.init = function () {
        if (this._gold  > 0) {
            this.goldLab.text = "+" + this._gold;
            this.goldLab.color = EffortBox.COLOR_LAB.GREED;
        }
        else if (this._gold  < 0) {
            this.goldLab.text = this._gold;
            this.goldLab.color = EffortBox.COLOR_LAB.RED;
        }
        else {
            this.goldLab.text = "0";
        }

        if (this._isBanker) {
            this.bankerTag.visible = true;
        }
        else {
            this.bankerTag.visible = false;
        }

        this.nameLab.text = this._userName;
        this.idLab.text = this._id;

        if (this._avatar != "") {
            this.handIcon.skin = this._avatar;
        }
    };

    LobbyEffortPlayerIconBox.prototype.dispose = function () {
        this.removeSelf();
    };

    return LobbyEffortPlayerIconBox;
}(LobbyEfforIconBoxUI));