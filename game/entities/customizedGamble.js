// 定制模式比牌
(function(root) {
    var _super = root.Serialize;

    var Poker = root.Poker;
    var Game = root.Game;

    var Utils = root.Utils;

    var Gamble = root.CustomizedGamble = function(opts) {
        opts = opts || {};

        _super.call(this, opts);
        this.data = opts;
        this.data.ghost = [];           // ghost 是正式翻出的鬼牌 撇除了joker的 里面只有value 便于判断

        this.init(opts);
    };

    root.inherits(Gamble, _super);

    root.extend(Gamble.prototype, {
        init: function(opts) {
            var i;

            for (i in opts.ghostPokers) {
                var poker = opts.ghostPokers[i];
                if (poker && poker.type != Poker.TYPE.JOKER) {
                    this.data.ghost.push(poker.value);
                }
            }
        },

        pokerScore: function(handPokers) {
            var pokers = Utils.object_clone(handPokers);
            var results = {
                score: 0,
                multiple: 1,
                fancy: Game.FANCY.NORMAL,
                type: Game.POKER_MODELS.POINT
            };

            // 按照牌面大小排序
            var compare = function(a, b) {
                if (a.value > b.value) {
                    return 1;
                }
                else if (a.value == b.value) {
                    return 0;
                }
                else {
                    return -1;
                }
            };

            pokers.sort(compare);

            // 没有鬼牌 都是三张
            // 除了 顺子 同花顺 三条 可以设置倍数之外 每个点数也需要设置倍数
            // 使用倍数比较 倍数大的胜利
            var i;
            var analyse = [];           // 用于分析的扑克信息

            for (i in pokers) {
                var poker = pokers[i];
                var realValue = poker.value;
                if (realValue > 10) {
                    realValue = 10;
                }

                analyse.push({
                    type: poker.type,
                    value: poker.value,
                    realValue: realValue
                });
            }

            // 两张牌就是出错 给最低的他
            if (analyse.length === 2) {
                return results;
            }

            // 接下来是三张牌情况
            
            // 花式情况
            if (pokers[0].type === pokers[1].type && pokers[0].type === pokers[2].type) {
                results.fancy = Game.FANCY.FLUSH_THREE;
            }
            
            // 点数
            var point = analyse[0].realValue + analyse[1].realValue + analyse[2].realValue || 0;
            results.point = point;

            // 三条
            if (analyse[0].value === analyse[1].value && analyse[1].value === analyse[2].value) {
                results.type = Game.POKER_MODELS.THREES;
                results.multiple = this.data.settings.pokerModels[results.type];
                results.score = results.multiple;

                results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
                return results;
            }
            // 顺子
            if (analyse[0].value === analyse[1].value - 1 && analyse[1].value === analyse[2].value - 1) {
                // 同花顺
                if (analyse[0].type === analyse[1].type && analyse[1].type === analyse[2].type) {
                    results.type = Game.POKER_MODELS.STRAIGHT_FLUSH;
                    results.multiple = this.data.settings.pokerModels[results.type];
                    results.score = results.multiple;

                    results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
                    return results;
                }
                // 普通顺子
                results.type = Game.POKER_MODELS.STRAIGHT;
                results.multiple = this.data.settings.pokerModels[results.type];
                results.score = results.multiple;

                results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
                return results;
            }

            // 剩下的就是点数牌了
            results.type = Game.POKER_MODELS.POINT;
            var realPoint = point%10;
            if (realPoint == 0) {
                results.multiple = 0;
            }
            else {
                results.multiple = this.data.settings.pokerPoint[point % 10] || 1;
            }
            results.score = results.multiple;

            results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
            return results;
        }
    });
} (DejuPoker));