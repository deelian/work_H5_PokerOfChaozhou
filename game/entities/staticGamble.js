
(function(root) {
    var _super = root.Serialize;

    var Poker = root.Poker;
    var Game = root.Game;

    var Utils = root.Utils;

    var Gamble = root.StaticGamble = function(opts) {
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

            // 按照牌面大小排序 倒序
            var compare = function(a, b) {
                if (a.value < b.value) {
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

            // (三鬼 > 双鬼 > 天公9 > 天公8) > (三条\同花顺\顺子 内部大小由设置的倍数决定 倍数大者胜) > (点数按大小)
            // 第一类型  10000  第二类型  1000  第三类型  100
            var i;
            var analyse = [];           // 用于分析的扑克信息
            var ghostCnt = 0;
            var double_poker = 1;

            for (i in pokers) {
                var poker = pokers[i];
                if (poker.type === Poker.TYPE.JOKER || this.data.ghost.indexOf(poker.value) != -1) {
                    ghostCnt++;
                    // 鬼牌从后面插入
                    analyse.push({
                        type: "ghost",
                        value: poker.value,
                        realValue: 10
                    });
                    if (poker.value === Poker.DOUBLE_POKER_VALUE) {
                        double_poker = 2;
                    }
                    continue;
                }
                var realValue = poker.value;
                if (realValue > 10) {
                    realValue = 10;
                }

                // 普通牌在前面插入
                analyse.unshift({
                    type: poker.type,
                    value: poker.value,
                    realValue: realValue
                });
            }
            // 记录双倍牌给上一层知道
            results.double_poker = double_poker;

            var point = 0;

            // 两张牌情况
            if (analyse.length === 2) {
                // 花式情况
                if (pokers[0].type === pokers[1].type) {
                    results.fancy = Game.FANCY.FLUSH_TWO;
                }
                else if (pokers[0].value === pokers[1].value) {
                    results.fancy = Game.FANCY.PAIR;
                }

                // 点数
                point = analyse[0].realValue + analyse[1].realValue || 0;
                results.point = point;
                
                // 双鬼
                if (ghostCnt === 2) {
                    results.score = 11000;
                    results.type = Game.POKER_MODELS.DOUBLE_GHOST;
                    results.multiple = this.data.settings.pokerModels[results.type];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
                // 有一只鬼
                if (ghostCnt > 0) {
                    // 鬼牌万能只能有三张牌 所以这里的情况都是鬼牌成型的处理
                    if (analyse[0].value === 9) {
                        results.score = 10100;
                        results.type = Game.POKER_MODELS.GOD_NINE;
                        results.multiple = this.data.settings.pokerModels[results.type];
                        // 花式天公
                        if (this.data.settings.fancyGod) {
                            // 变成同花花式
                            results.fancy = Game.FANCY.FLUSH_TWO;
                            results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
                        }
                        // 翻倍牌
                        results.multiple *= double_poker;
                        return results;
                    }
                    else if (analyse[0].value === 8) {
                        results.score = 10010;
                        results.type = Game.POKER_MODELS.GOD_EIGHT;
                        results.multiple = this.data.settings.pokerModels[results.type];
                        // 花式天公
                        if (this.data.settings.fancyGod) {
                            // 变成同花花式
                            results.fancy = Game.FANCY.FLUSH_TWO;
                            results.multiple *= Game.FANCY_MULTIPLE[results.fancy];
                        }
                        // 翻倍牌
                        results.multiple *= double_poker;
                        return results;
                    }
                }
                // 点数形成的天公9
                if ((analyse[0].realValue + analyse[1].realValue) % 10 === 9) {
                    results.score = 10100;
                    results.type = Game.POKER_MODELS.GOD_NINE;
                    results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                    return results;
                }
                // 点数形成的天公8
                if ((analyse[0].realValue + analyse[1].realValue) % 10 === 8) {
                    results.score = 10010;
                    results.type = Game.POKER_MODELS.GOD_EIGHT;
                    results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                    return results;
                }
                // 剩下的只能是普通点数牌了
                results.score = (analyse[0].realValue + analyse[1].realValue) % 10 + 100;
                results.type = Game.POKER_MODELS.POINT;
                results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                // 翻倍牌
                results.multiple *= double_poker;
                return results;
            }

            // 接下来是三张牌情况

            // 点数
            point = analyse[0].realValue + analyse[1].realValue + analyse[2].realValue || 0;
            results.point = point;

            // 顺子判断
            var flushDecide = function (v1, v2, v3) {
                if (v1 == null || v2 == null) {
                    return false;
                }
                
                // 只需要判断两张 那么就是有一张鬼牌的情况
                if (v3 == null) {
                    // 连着或者隔一个
                    if (v1 === v2 - 1 || v1 === v2 - 2) {
                        return true;
                    }
                    // A + K
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                    // A + Q
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_Q_VALUE) {
                        return true;
                    }
                    // 2 + K
                    if (v1 === Poker.POKER_2_VALUE && v2 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                }
                else {
                    // 正常的 1 2 3
                    if (v1 === v2 - 1 && v2 === v3 - 1) {
                        return true;
                    }
                    // Q K A
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_Q_VALUE && v3 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                    // K A 2
                    if (v1 === Poker.POKER_A_VALUE && v2 === Poker.POKER_2_VALUE && v3 === Poker.POKER_K_VALUE) {
                        return true;
                    }
                }

                return false;
            };
            
            // 花式情况
            if (pokers[0].type === pokers[1].type && pokers[0].type === pokers[2].type) {
                results.fancy = Game.FANCY.FLUSH_THREE;
            }

            // 没有鬼牌
            if (ghostCnt === 0) {
                // 三条
                if (analyse[0].value === analyse[1].value && analyse[1].value === analyse[2].value) {
                    results.type = Game.POKER_MODELS.THREES;
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.THREES];
                    results.multiple = this.data.settings.pokerModels[results.type];
                    return results;
                }
                // 顺子
                if (flushDecide(analyse[0].value, analyse[1].value, analyse[2].value)) {
                    // 同花顺
                    if (analyse[0].type === analyse[1].type && analyse[1].type === analyse[2].type) {
                        results.type = Game.POKER_MODELS.STRAIGHT_FLUSH;
                        results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT_FLUSH];
                        results.multiple = this.data.settings.pokerModels[results.type];
                        return results;
                    }
                    // 普通顺子
                    results.type = Game.POKER_MODELS.STRAIGHT;
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT];
                    results.multiple = this.data.settings.pokerModels[results.type];
                    return results;
                }
            }

            // 在排序的时候 因为鬼牌会排在后面 所以一张鬼牌的时候只判断前面两张即可
            if (ghostCnt === 1) {
                // 三条
                if (analyse[0].value === analyse[1].value) {
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.THREES];
                    results.type = Game.POKER_MODELS.THREES;
                    results.multiple = this.data.settings.pokerModels[results.type];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
                // 顺子
                if (flushDecide(analyse[0].value, analyse[1].value, null)) {
                    // 同花顺
                    if (analyse[0].type === analyse[1].type) {
                        results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT_FLUSH];
                        results.type = Game.POKER_MODELS.STRAIGHT_FLUSH;
                        results.multiple = this.data.settings.pokerModels[results.type];
                        // 翻倍牌
                        results.multiple *= double_poker;
                        return results;
                    }
                    results.type = Game.POKER_MODELS.STRAIGHT;
                    results.score = 1000 + this.data.settings.pokerModels[Game.POKER_MODELS.STRAIGHT];
                    results.multiple = this.data.settings.pokerModels[results.type];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
                // 三张同花的概念
                if (analyse[0].type === analyse[1].type) {
                    results.fancy = Game.FANCY.FLUSH_THREE;
                }

                // 不成型的牌 如果鬼牌万能 直接等于9点
                if (this.data.settings.universalGhost == true) {
                    results.type = Game.POKER_MODELS.POINT;
                    results.score = 9 + 100;
                    results.point = 9;
                    results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
                    // 翻倍牌
                    results.multiple *= double_poker;
                    return results;
                }
            }

            // 两只鬼的情况 变成三条
            if (ghostCnt == 2) {
                results.type = Game.POKER_MODELS.THREES;
                results.score = 1000 + this.data.settings.pokerModels[results.type];
                results.multiple = this.data.settings.pokerModels[results.type];
                // 翻倍牌
                results.multiple *= double_poker;
                return results;
            }

            // 三鬼
            if (ghostCnt == 3) {
                results.type = Game.POKER_MODELS.THREE_GHOST;
                results.score = 12000;
                results.multiple = this.data.settings.pokerModels[results.type];
                // 翻倍牌
                results.multiple *= double_poker;
                return results;
            }

            // 剩下的就是点数牌了
            results.type = Game.POKER_MODELS.POINT;
            results.score = (analyse[0].realValue + analyse[1].realValue + analyse[2].realValue) % 10 + 100;
            results.multiple = this.data.settings.pokerModels[results.type] * Game.FANCY_MULTIPLE[results.fancy];
            // 翻倍牌
            results.multiple *= double_poker;
            
            return results;
        }
    });
} (DejuPoker));