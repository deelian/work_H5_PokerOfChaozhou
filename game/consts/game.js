(function(root) {
    var Game = root.Game = function() {
          
    };

    Game.ORIGIN = {
        WeChat: 0,
        WebApp: 1,
        APP:    2
    };

    Game.GENDER = {
        MALE:       0,          //男
        FEMALE:     1,          //女
        OTHER:      2           //其他
    };

    //*牌型倍数
    Game.POKER_FORMATION_MULTIPLE = {
        STRAIGHT_FLUSH: {min:5, max:8},     //*同花顺
        THREES: {min:5, max:8},             //*三条
        STRAIGHT: {min:4, max:10},          //*顺子
        DOUBLE_GHOST: {min:10, max:20}      //*双鬼
    };

    //*定制模式设置(局数，点数倍率)
    Game.CUSTOMIZED_SETTINGS = {
        ROUND: {min:10, max:100, dValue:10},
        POINT_MULTIPLE: {min:1, max: 10},
        STRAIGHT_FLUSH: {min:10, max:20},   //*同花顺
        THREES: {min:10, max:20},           //*三条
        STRAIGHT: {min:10, max:20}          //*顺子
    };

    //牌型
    Game.POKER_MODELS = {
        THREES:         'threes',           //三条
        STRAIGHT:       'straight',         //顺子
        STRAIGHT_FLUSH: 'straight_flush',   //同花顺
        DOUBLE_GHOST:   'double_ghost',     //双鬼
        THREE_GHOST:    'three_ghost',      //三鬼
        GOD_NINE:       'god_nine',         //天公9
        GOD_EIGHT:      'god_eight',        //天公8
        POINT:          'point'             //点数
    };

    Game.POKER_MODEL_NAMES = {
        'threes':           "三条",
        'straight':         "顺子",
        'straight_flush':   "同花顺",
        'double_ghost':     "双鬼",
        'three_ghost':      "三鬼",
        'god_nine':         "天公9",
        'god_eight':        "天公8",
        'point':            "点数"
    };

    // 花色
    Game.FANCY = {
        FLUSH_TWO:      'flush2',           //2张同花
        FLUSH_THREE:    'flush3',           //3张同花
        PAIR:           'pair',             //对子
        NORMAL:         'normal'            //普通 纯点数
    };

    // 花色倍数
    Game.FANCY_MULTIPLE = {};
    Game.FANCY_MULTIPLE[Game.FANCY.FLUSH_THREE] = 3;
    Game.FANCY_MULTIPLE[Game.FANCY.FLUSH_TWO]   = 2;
    Game.FANCY_MULTIPLE[Game.FANCY.PAIR]        = 2;
    Game.FANCY_MULTIPLE[Game.FANCY.NORMAL]      = 1;

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

    // 上庄条件
    Game.BANKER_CONDITION = {
        NORMAL:     0,          //顺子上庄：双鬼 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）
        GOD:        1           //天公上庄：双鬼 > 牌型（同花顺、三条、顺子根据设置倍数大者优先，相同时按该顺序优先）> 天公9 > 天公8
    };

    // 木虱赢双鬼的条件
    Game.BEAT_DBL_GHOST = {
        ALL_BEAT:           0,  // 木虱赢双鬼
        FLUSH_THREE_BEAT:   1   // 三条同花木虱赢双鬼
    };

    // 要牌操作
    Game.DRAW_COMMAND = {
        OPEN:       0,      //明牌
        PASS:       1,      //过牌
        DRAW:       2,      //补牌
        RUBBED:     3,      //搓牌
        BET_ALL:    4,      //全开
        BET_DRAW:   5       //开补
    };
    // 玩法说明界面
    Game.Explain = [
        {
            title:"一、游戏介绍",
            details:"木虱是广东潮汕地区盛行的一种纸牌竞技游戏，以其独特的比牌规则，玩法多样，节奏轻快，挑战玩家的胆识，深受广大玩家欢迎"
        },

        {
            title:"二、基本规则",
            details:
                "1.游戏人数：2-8人N" +
                "2.游戏牌数：一副扑克牌，包括大小王和广告牌，其中广告牌定义为功能牌，功能牌可选择是否加入，共54-55张牌"
        },

        {
            title:"三、玩法介绍",
            details:
            "1.游戏模式：经典模式，长庄模式，混战模式，定制模式N" +
            "经典模式：经典抢庄，可选择天公上庄或者顺子以上上庄N" +
            "长庄模式：房主霸王庄，不可换庄N" +
            "混战模式：俗称木虱鱼，无庄家，各玩家之间相互比牌N" +
            "定制模式：私人定制，牌型倍数自定义，玩法更刺激N" +
            "2.发牌：每位玩家首轮牌为两张牌N" +
            "3.补牌：玩家根据首轮牌情况，选择是否补牌，每位玩家有且仅有一次补牌机会N" +
            "4.比牌：玩家根据手中持有牌进行牌型大小比较"
        },

        //{title:"四、牌型说明", details:"img_paixing.png"},
        //
        {
            title:"五、牌型比较",
            details:
            "1.特殊牌型：双鬼>天公9>天公8>三条,同花顺>顺子，其中三条，同花顺可自定义倍数，倍数大者为大，同一牌型中的牌不比较大小顺子定义：A-K为闭环关系，任何顺序连在一起的牌都算为顺子，例如9、10、J为顺子，K、A、2亦为顺子，如果花色相同，即为同花顺N" +
            "2.普通牌型：点数牌>木虱（0点）N" +
            "点数说明：A-9分别为1-9点，10，J，Q，K均按10点算。三张或两张牌点数相加，个位数点数大者为大，若两张花色相同或者对子，则为2倍，三张牌花色相同为3倍N" +
            "3.特殊牌型>普通牌型N" +
            "4.木虱为最小点数牌型，但可以赢双鬼"
        },

        {
            title:"六、大小王（鬼牌）",
            details:
            "游戏可设置鬼牌不同功能N" +
            "1.鬼牌跟牌型，能拼出特殊牌型，如鬼牌、7、8为顺子或同花顺，鬼牌、7、7为三条，其他情况鬼牌算10点，如鬼牌、5、8为3点。鬼、8（9）算天公N" +
            "2.鬼牌可当任意一张牌及花色，即是拿到鬼牌若不能拼出特殊牌型，也最少是9点。首轮牌鬼、8（9）不能算天公，必须补牌N"
        },

        {
            title:"七、特殊可选规则",
            details:
            "1.鬼牌：默认为不翻鬼，即只有2张鬼牌(大小王)；翻鬼，可选择翻1或2张牌当鬼牌，即牌中最多有8张鬼牌。若翻出的鬼牌为大小王，系统会重新再翻一张牌当鬼牌N" +
            "2.鬼牌百变：鬼牌可当任意一张牌及花色，首轮牌鬼、8（9）不能算天公，必须补牌N" +
            "3.鬼牌成型：鬼牌不能拼成特殊牌型(三支、同花顺、顺子)时，仅能当10点，可变花色。首轮牌鬼、8（9）算天公，可不补牌，同时可选择首轮牌鬼、8（9）是否算双倍天公N" +
            "4.任意下注：每一局可任意选择下注倍数N" +
            "5.一杠到底：在同一个庄上，开弓没有回头箭，下注倍数只能加不能减。换庄后，可重新选择下注倍数N" +
            "6.功能牌：游戏中增加一张功能牌，游戏过程中拿到功能牌的玩家，赢牌时，按照手中牌型翻倍计算积分，同时，此牌具备鬼牌功能。N" +
            "7.木虱：设置木虱赢双鬼、三鬼的条件N"
        }
    ];

    Game.Chat = {
        normal:[
            "快点吧，我等到花儿都谢了",
            "又天公，赢定了",
            "玩太小，没意思",
            "风水不好，换个位置",
            "哇，你抢钱啊",
            "不好意思，又赢了",
            "来手好牌",
            "底裤都输光了",
            "这个庄也太弱了",
            "又断线，郁闷",
            "各位不好意思，离开一会",
            "大家一起下他庄"
        ],

        expression:[
            {code:"/001",img:"Expression_001.png"},
            {code:"/002",img:"Expression_002.png"},
            {code:"/003",img:"Expression_003.png"},
            {code:"/004",img:"Expression_004.png"},
            {code:"/005",img:"Expression_005.png"},
            {code:"/006",img:"Expression_006.png"},
            {code:"/007",img:"Expression_007.png"},
            {code:"/008",img:"Expression_008.png"},
            {code:"/009",img:"Expression_009.png"},
            {code:"/010",img:"Expression_010.png"},
            {code:"/011",img:"Expression_011.png"},
            {code:"/012",img:"Expression_012.png"},
            {code:"/013",img:"Expression_013.png"},
            {code:"/014",img:"Expression_014.png"},
            {code:"/015",img:"Expression_015.png"},
            {code:"/016",img:"Expression_016.png"},
            {code:"/017",img:"Expression_017.png"},
            {code:"/018",img:"Expression_018.png"},
            {code:"/019",img:"Expression_019.png"},
            {code:"/020",img:"Expression_020.png"},
        ]
    };

    Game.NOTICE_TEXT = "    所有玩家数据、运算均由服务器端下发，任何人都不可通过外挂破解客户端等手段前提获知其他玩家手牌或公共牌。";
    Game.PHONE_NUMBER = "18922217616";
    Game.WECHAT_NUMBER = "橄榄欢乐木虱";

    //3颗钻6元，15颗钻30元，30颗50元
    Game.DIAMOND_TYPE = {
        10001: {
            id: 10001,
            name: "3颗钻石",
            price: 6,
            diamonds: 3,
            SKU: "cn.glfun.dejupoker.product001"
        },
        10002: {
            id: 10002,
            name: "15颗钻石",
            price: 30,
            diamonds: 15,
            SKU: "cn.glfun.dejupoker.product002"
        },
        10003: {
            id: 10003,
            name: "30颗钻石",
            price: 50,
            diamonds: 30,
            SKU: "cn.glfun.dejupoker.product003"
        }
    };

}(DejuPoker));