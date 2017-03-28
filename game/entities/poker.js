/**
 * Created by monkey on 2017/3/24.
 */
//一张牌
(function(root) {
    var _super = root.Serialize;
    var Poker = root.Poker = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        //数字0~13 0为鬼 1为A 11为J 12为Q 13为K
        this.number         = opts.number || 0;
        //花色 0 方块 1 梅花 2 红桃 3 黑桃
        //如是鬼的话 0为小鬼 1为大鬼 2为翻倍牌
        this.flower         = opts.flower || 0;

        if (this.number == 0) {
            this.name = Poker.NUMBERS_NAME[0] + "_" + Poker.JOKER_NAME[this.flower];
        }
        else {
            this.name = Poker.FLOWERS_NAME[this.flower] + "_" + Poker.NUMBERS_NAME[this.number];
        }
    };

    root.inherits(Poker, _super);

    root.extend(Poker.prototype, {
        getNumber: function() {
            return this.number;
        },

        getName: function() {
            return this.name;
        },

        callIt: function() {
            var name = "";
            if (this.number == 0) {
                if (this.flower == 0) {
                    name = "小鬼";
                }
                else if (this.flower == 1) {
                    name = "大鬼";
                }
                else {
                    name = "翻倍牌";
                }
            }
            else {
                switch (this.number) {
                    case 11: {
                        name = "J";
                        break;
                    }
                    case 12: {
                        name = "Q";
                        break;
                    }
                    case 13: {
                        name = "K";
                        break;
                    }
                    case 1: {
                        name = "A";
                        break;
                    }
                    default : {
                        name = "" + this.number;
                        break;
                    }
                }

                var flowerList = [
                    "♦️ ",
                    "♣ ",
                    "♥️ ",
                    "♠️ "
                ];

                name = flowerList[this.flower] + name;
            }

            return name;
        },

        update: function(opts) {
            var obj = this;
            opts = opts || {};

            for (var key in opts) {
                if (opts.hasOwnProperty(key)
                    && obj.hasOwnProperty(key)) {
                    obj[key] = opts[key];
                }
            }
        }
    });

    //花色 0 方块 1 梅花 2 红桃 3 黑桃
    Poker.FLOWERS_NAME = ["diamond", "club", "heart", "spade"];
    Poker.NUMBERS_NAME = ["joker", "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
    Poker.JOKER_NAME = ["small", "big", "double"];
} (dejuPoker));