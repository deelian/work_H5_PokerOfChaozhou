(function(root) {
    var Game = root.Game = function() {
          
    };

    //*牌型倍数
    Game.POKER_FORMATION_MULTIPLE = {
        STRAIGHT_FLUSH: {min:4, max:10},//*同花顺
        THREES: {min:4, max:10},//*三条
        STRAIGHT: {min:4, max:10},//*顺子
        DOUBLE_GHOST: {min:10, max:20}//*双鬼
    };

    //*定制模式设置(局数，点数倍率)
    Game.CUSTOMIZED_SETTINGS = {
        ROUND: {min:10, max:100, dValue:10},
        POINT_MULTIPLE: {min:1, max: 10}
    };

    //牌型
    Game.POKER_MODELS = {
        PAIR:           'pair',             //对子
        THREES:         'threes',           //三条
        STRAIGHT:       'straight',         //顺子
        FLUSH:          'flush',            //同花
        STRAIGHT_FLUSH: 'straight_flush',   //同花顺
        DOUBLE_GHOST:   'double_ghost',     //双鬼
        GOD_NINE:       'god_nine',         //天公9
        GOD_EIGHT:      'god_eight'         //天公8
    };

    //*房间类型(模式)
    Game.ROOM_TYPE = {
        STATIC:     0,          //长庄模式
        CLASSICAL:  1,          //经典模式
        CHAOS:      2,          //混战模式
        CUSTOMIZED: 3           //定制模式
    };

    //*下注类型
    Game.BET_TYPE = {
        ARBITRARILY:        0,  //任意下注
        MORE_THEN_MORE:     1   //一杠到底，要比之前的多
    };
}(DejuPoker));