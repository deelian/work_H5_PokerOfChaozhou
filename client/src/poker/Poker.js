/**
 * 游戏扑克
 */
var Poker = (function(_super) {
    function Poker() {
        Poker.super(this);

        this.init();
    }

    Laya.class(Poker, "Poker", _super);

    //*发牌时候的移动
    Poker.prototype.dealMove = function () {

    };

    Poker.prototype.init = function() {

    };

    //*正反面
    Poker.POKER_TYPE = {};

    return Poker;
}(Laya.Sprite));