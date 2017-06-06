/**
 * 房间战绩头像
 */
var EffortIcon = (function(_super) {
    function EffortIcon(gold, isBanker, avatar) {
        EffortIcon.super(this);

        this._gold = gold;
        this._isBanker = isBanker;
        this._avatar = avatar || "";

        this.init();
    }

    Laya.class(EffortIcon, "EffortIcon", _super);

    EffortIcon.prototype.init = function () {
        if (this._avatar != "") {
            this.handIcon.skin = this._avatar;
        }

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
    };

    EffortIcon.prototype.dispose = function() {
       this.removeSelf();
    };

    return EffortIcon;
}(EffortIconUI));