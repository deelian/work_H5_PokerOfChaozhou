/**
 * 游戏扑克
 */
var Poker = (function(_super) {
    function Poker(info, ghostList) {
        Poker.super(this);

        this._info = info;

        this._ghostPokerList = ghostList || {};

        this.init();
    }

    Laya.class(Poker, "Poker", _super);

    Poker.prototype.setPokerAnchor = function (anchor) {
        anchor = anchor || {anchorX: 0.5, anchorY: 0.5};
        this.anchorX = anchor.anchorX;
        this.anchorY = anchor.anchorY;
    };

    Poker.prototype.setPokerPosition = function (position) {
        position = position || {x: 0, y: 0};
        this.x = position.x;
        this.y = position.y;
    };

    Poker.prototype.setPokerScale = function (scale) {
        scale = scale || {x: 0.5, y: 0.5};
        this.scaleX = scale.x;
        this.scaleY = scale.y;
    };

    Poker.prototype.createJokerTitle = function () {
        var jokerTitle = new Laya.Image();
        jokerTitle.skin = "assets/pokers/joker_title.png";

        jokerTitle.x = -15;
        jokerTitle.y = -20;
        this.addChild(jokerTitle);
    };

    Poker.prototype.getSkinName = function (type) {
        var skinName;
        switch (type) {
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

        return skinName;
    };

    Poker.prototype.changePokerSkin = function (type, info) {
        type = type || Poker.POKER_TYPE.OPPOSITE;
        switch (type) {
            case Poker.POKER_TYPE.OPPOSITE: {
                this.setSkin(Poker.OPPOSITE_SKIN);
                break;
            }

            case Poker.POKER_TYPE.POSITIVE: {
                this._pokerType     = info.type;    //*花色
                this._pokerValue    = info.value;   //*点数
                var skinName = this.getSkinName(this._pokerType);
                this.setSkin(skinName);
                break;
            }

            default: {
                this.setSkin();
                break;
            }
        }

    };

    Poker.prototype.setSkin = function (skinName) {
        if (skinName) {
            this.skin = "assets/pokers/" + skinName + ".png";
        }
        else {
            this.skin = "";
        }
    };

    //*初始化显示
    Poker.prototype.initPokerDisplay = function () {
        if (this._info) {
            var type = this._info.type;
            var value = this._info.value;
            if (type && value) {
                //*添加鬼牌标识
                if (type != Game.Poker.TYPE.JOKER) {
                    var ghostList = this._ghostPokerList;
                    for (var index in ghostList) {
                        var ghostPokerInfo = ghostList[index];
                        if (value == ghostPokerInfo.value) {
                            this.createJokerTitle();
                            break;
                        }
                    }
                }
                this.changePokerSkin(Poker.POKER_TYPE.POSITIVE, this._info);
            }
            else {
                this.setSkin(Poker.OPPOSITE_SKIN);
            }
        }
        else {
            //*没有卡牌的信息传过来就是显示卡背
            this.setSkin(Poker.OPPOSITE_SKIN);
        }
    };

    Poker.prototype.init = function() {
        this.initPokerDisplay();
    };

    Poker.prototype.dispose = function () {
        this.removeSelf();
    };

    Poker.POKER_TYPE = {
        POSITIVE: 1, //*正面
        OPPOSITE: 2, //*反面
        AIR: 3
    };

    Poker.OPPOSITE_SKIN = "poker_back";

    return Poker;
}(Laya.Image));