/**
 * 游戏扑克
 */
var Poker = (function(_super) {
    function Poker(info) {
        Poker.super(this);

        this._info          = info;

        this.init();
    }

    Laya.class(Poker, "Poker", _super);

    //*发鬼牌时候的移动
    Poker.prototype.ghostMove = function () {

    };

    //*发牌时候的移动
    Poker.prototype.dealMove = function () {

    };

    Poker.prototype.changePokerSkin = function (type, info) {
        type = type || Poker.POKER_TYPE.OPPOSITE;
        switch (type) {
            case Poker.POKER_TYPE.OPPOSITE: {
                this.setSkin(Poker.OPPOSITE_SKIN);
                break;
            }
            case Poker.POKER_TYPE.POSITIVE: {
                var skinName;
                this._pokerType     = this._info.type;    //*花色
                this._pokerValue    = this._info.value;   //*点数
                switch (this._pokerType) {
                    case Game.Poker.TYPE.DIAMOND: {
                        skinName = "diamond_" + this._pokerValue;
                        break;
                    }

                    case Game.Poker.TYPE.CLUB: {
                        skinName = "club_" + this._pokerValue;
                        break;
                    }

                    case Game.Poker.TYPE.HEART: {
                        skinName = "heart_" + this._pokerValue;
                        break;
                    }

                    case Game.Poker.TYPE.SPADE: {
                        skinName = "spade_" + this._pokerValue;
                        break;
                    }

                    case Game.Poker.TYPE.JOKER: {
                        skinName = "joker_" + this._pokerValue;
                        break;
                    }
                }
                this.setSkin(skinName);
            }
        }
    };

    Poker.prototype.setSkin = function (skinName) {
        if (skinName) {
            this.skin = "assets/pokers/" + skinName + ".png";
        }
    };

    //*初始化显示
    Poker.prototype.initPokerDisplay = function () {
        if (this._info) {
            this.changePokerSkin(Poker.POKER_TYPE.POSITIVE, this._info);
        }
        else {
            //*没有卡牌的信息传过来就是显示卡背
            this.setSkin(Poker.OPPOSITE_SKIN);
        }
    };

    Poker.prototype.init = function() {
        this.initPokerDisplay();
    };

    Poker.POKER_TYPE = {
        POSITIVE: 1, //*正面
        OPPOSITE: 2  //*反面
    };

    Poker.OPPOSITE_SKIN = "poker_back";

    return Poker;
}(Laya.Image));