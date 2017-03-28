/**
 * Created by publish on 2017/3/24.
 */
//一副牌
(function(root) {
    var _super = root.Serialize;
    var PokerSet = root.PokerSet = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        //数字0~13 0为鬼 1为A 11为J 12为Q 13为K
        this.number         = opts.number || 0;
        //花色 0 方块 1 梅花 2 红桃 3 黑桃
        //如是鬼的话 0为小鬼 1为大鬼 2为翻倍牌
        this.flower         = opts.flower || 0;
        this.pokers         = opts.pokers || [];
        this.needJoker      = opts.needJoker;
        this.init();
    };
    
    root.inherits(PokerSet, _super);

    root.extend(Poker.prototype, {
        init: function() {
            //创建的时候已经传入牌了 就不用初始化
            if (this.pokers.length > 0) {
                return;
            }

            if (this.needJoker) {
                this.pokers.push(new root.Poker({number: 0, flower: 2}));       //翻倍牌
                this.pokers.push(new root.Poker({number: 0, flower: 1}));       //大鬼
                this.pokers.push(new root.Poker({number: 0, flower: 0}));       //小鬼
            }

            for (var number = 1; number <= 13; number++) {
                for (var flower = 0; flower <= 3; flower++) {
                    this.pokers.push(new root.Poker({number: number, flower: flower}));
                }
            }
        },

        showLeftName: function() {
            for (var i = 0; i < this.pokers.length; i++) {
                var poker = this.pokers[i];
                console.log(poker.callIt());
            }
        },

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
} (dejuPoker));