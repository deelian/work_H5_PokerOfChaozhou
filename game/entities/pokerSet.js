/**
 * Created by publish on 2017/3/24.
 */
//一副牌
(function(root) {
    var _super = root.Serialize;
    var PokerSet = root.PokerSet = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        /**
         * poker结构
         * ..number 0~13 0为Joker 1为Ace 11为J 12为Q 13为K
         * ..flower 0~3 0为方块 1为梅花 2为红桃 3为黑桃   当joker时 0为小鬼 1为大鬼 2为翻倍
         * ..name 名字 主要用于客户端寻找资源
         * ..showTarget 显示对象 对谁显示
         */

        this.pokers         = opts.pokers || [];
        this.needJoker      = opts.needJoker;
        this.init();
    };
    
    root.inherits(PokerSet, _super);

    root.extend(PokerSet.prototype, {
        init: function() {
            //创建的时候已经传入牌了 就不用初始化
            if (this.pokers.length > 0) {
                return;
            }

            if (this.needJoker) {
                this.pokers.push({
                    number: 0, 
                    flower: 2, 
                    showTarget: 0, 
                    name: PokerSet.NUMBERS_NAME[0] + "_" + PokerSet.JOKER_NAME[2]
                });       //翻倍牌
                this.pokers.push({
                    number: 0,
                    flower: 1,
                    showTarget: 0,
                    name: PokerSet.NUMBERS_NAME[0] + "_" + PokerSet.JOKER_NAME[1]
                });       //大鬼
                this.pokers.push({
                    number: 0,
                    flower: 0,
                    showTarget: 0,
                    name: PokerSet.NUMBERS_NAME[0] + "_" + PokerSet.JOKER_NAME[0]
                });       //小鬼
            }

            for (var number = 1; number <= 13; number++) {
                for (var flower = 0; flower <= 3; flower++) {
                    this.pokers.push({
                        number: number,
                        flower: flower,
                        showTarget: 0,
                        name: PokerSet.FLOWERS_NAME[flower] + "_" + PokerSet.NUMBERS_NAME[number]
                    });
                }
            }
        },

        //发牌
        extract: function() {
            if (this.pokers.length <= 0) {
                return null;
            }

            var i = root.Utils.random_number(this.pokers.length);
            var result = this.pokers[i];
            this.pokers.splice(i, 1);
            return result;
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
    PokerSet.FLOWERS_NAME = ["diamond", "club", "heart", "spade"];
    PokerSet.NUMBERS_NAME = ["joker", "ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king"];
    PokerSet.JOKER_NAME = ["small", "big", "double"];

    PokerSet.SHOW_TARGET = {
        NONE    : 0,
        ME      : 1,
        ALL     : 2
    };
} (DejuPoker));