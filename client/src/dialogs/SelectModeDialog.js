/**
 * 选择游戏模式界面
 */
function staticPage() {
    staticPage.super(this);
    this.size(209, 1303);

    this.setData = function(cellSrc)
    {
        var data;
        for(var i = 0 ; i < cellSrc.length ; i++)
        {
            data = cellSrc[i];
            this.addChild(data);
        }
    }
}

Laya.class(staticPage, "staticPage", Laya.Box);

function classicalPage() {
    classicalPage.super(this);
    this.size(209, 1460);

    this.setData = function(cellSrc)
    {
        var data;
        for(var i = 0 ; i < cellSrc.length ; i++)
        {
            data = cellSrc[i];
            this.addChild(data);
        }
    }
}
Laya.class(classicalPage, "classicalPage", Laya.Box);

function chaosPage() {
    chaosPage.super(this);
    this.size(209, 1120);

    this.setData = function(cellSrc)
    {
        var data;
        for(var i = 0 ; i < cellSrc.length ; i++)
        {
            data = cellSrc[i];
            this.addChild(data);
        }
    }
}
Laya.class(chaosPage, "chaosPage", Laya.Box);

function customizedPage() {
    customizedPage.super(this);
    this.size(209, 280);

    this.setData = function(cellSrc)
    {
        var data;
        for(var i = 0 ; i < cellSrc.length ; i++)
        {
            data = cellSrc[i];
            this.addChild(data);
        }
    }
}
Laya.class(customizedPage, "customizedPage", Laya.Box);

var SelectModeDialog = (function(_super) {

    var introduction = {
        0:{
            title:"长庄玩法简介",
            details:"1.房主霸王庄，游戏过程不换庄。\n" +
            "2.默认不翻鬼，即只有2张鬼牌(大小王)，最多可翻两张牌做为鬼牌。翻鬼，可选择翻1或2张牌当鬼牌，若翻出的鬼牌为大小王，系统会重新再翻一张牌当鬼牌。\n" +
            "3.鬼牌百变：鬼牌可当任意一张牌及花色，首轮牌鬼、8（9）不能算天公，必须补牌。\n" +
            "4.鬼牌成型：鬼牌不能拼成特殊牌型(三支、同花顺、顺子)时，仅能当10点，可变花色。首轮牌鬼、8（9）算天公，可不补牌，同时可选择首轮牌鬼、8（9）是否算双倍天公。\n" +
            "5.任意下注：每一局可任意选择下注倍数。\n" +
            "6.一杠到底：在同一个庄上，下注倍数只能加不能减。换庄后，可重新选择下注倍数。\n" +
            "7.木虱：可设置木虱赢双鬼，三倍木虱赢双鬼，三倍木虱赢三鬼。\n" +
            "8.比牌：有倍赢无倍，双倍天公9>天公9，双倍天公8>天公8，普通牌点数相同时，倍数大者为大，即三倍>二倍>一倍，倍数相同打平。\n" +
            "9.功能牌：游戏中增加一张功能牌，游戏过程中拿到功能牌的玩家，赢牌时，按照手中牌型翻倍计算积分，同时，此牌具备鬼牌功能。"
        },

        1:{
            title:"经典玩法简介",
            details:"1.首局房主为庄家，过后按照上庄规则，满足条件者上庄，多位玩家满足条件，则牌型倍数最大的上庄，同样牌型则按照发牌顺序，先发牌的玩家上庄。\n" +
            "2.默认不翻鬼，即只有2张鬼牌(大小王)，最多可翻两张牌做为鬼牌。翻鬼，可选择翻1或2张牌当鬼牌，若翻出的鬼牌为大小王，系统会重新再翻一张牌当鬼牌。\n" +
            "3.鬼牌百变：鬼牌可当任意一张牌及花色，首轮牌鬼、8（9）不能算天公，必须补牌	。\n" +
            "4.鬼牌成型：鬼牌不能拼成特殊牌型(三支、同花顺、顺子)时，仅能当10点，可变花色。首轮牌鬼、8（9）算天公，可不补牌，同时可选择首轮牌鬼、8（9）是否算双倍天公。\n" +
            "5.任意下注：每一局可任意选择下注倍数。\n" +
            "6.一杠到底：在同一个庄上，下注倍数只能加不能减。换庄后，可重新选择下注倍数。\n" +
            "7.木虱：可设置木虱赢双鬼，三倍木虱赢双鬼，三倍木虱赢三鬼。\n" +
            "8.比牌：有倍赢无倍，双倍天公9>天公9，双倍天公8>天公8，普通牌点数相同时，倍数大者为大，即三倍>二倍>一倍，倍数相同打平。\n" +
            "9.功能牌：游戏中增加一张功能牌，游戏过程中拿到功能牌的玩家，赢牌时，按照手中牌型翻倍计算积分，同时，此牌具备鬼牌功能。"
        },

        2:{
            title:"混战玩法简介",
            details:"1.木虱鱼，无庄家，各玩家之间相互比牌。\n" +
            "2.默认不翻鬼，即只有2张鬼牌(大小王)，最多可翻两张牌做为鬼牌。翻鬼，可选择翻1或2张牌当鬼牌，若翻出的鬼牌为大小王，系统会重新再翻一张牌当鬼牌。\n" +
            "3.鬼牌百变：鬼牌可当任意一张牌及花色，首轮牌鬼、8（9）不能算天公，必须补牌。\n" +
            "4.鬼牌成型：鬼牌不能拼成特殊牌型(三支、同花顺、顺子)时，仅能当10点，可变花色。首轮牌鬼、8（9）算天公，可不补牌，同时可选择首轮牌鬼、8（9）是否算双倍天公。\n" +
            "5.木虱：可设置木虱赢双鬼，三倍木虱赢双鬼，三倍木虱赢三鬼。\n" +
            "6.比牌：有倍赢无倍，双倍天公9>天公9，双倍天公8>天公8，普通牌点数相同时，倍数大者为大，即三倍>二倍>一倍，倍数相同打平。\n" +
            "7.功能牌：游戏中增加一张功能牌，游戏过程中拿到功能牌的玩家，赢牌时，按照手中牌型翻倍计算积分，同时，此牌具备鬼牌功能"
        },

        3:{
            title:"定制玩法简介",
            details:"1.游戏牌数：一副扑克牌，去掉大小王，共52张牌。\n" +
            "2.每一局都要抢庄，确定庄家后，每位玩家各派三张牌，按照牌型，点数比大小。\n" +
            "3.可自定义牌型倍数，散牌点数倍数。"
        }
    };

    function SelectModeDialog() {
        SelectModeDialog.super(this);

        this._selectBoxs = [
            this.roundNumSetBox,
            this.conditionBox,
            this.turnJokersBox,
            this.betBox,
            this.multipeBox,
            this.zeroSetBox,
            this.gambleBox,
            this.doubleDealBox
        ];

        this._gameRound         = 10;    //*游戏局数
        this._isJokerFormation  = false; //*鬼牌是否成型
        this._isAnyBet          = true;  //*是否是任意下注
        this._beatDBLGhost       = SelectModeDialog.BEAT_DBL_GHOST.ALL_BEAT; //*0点赢双鬼类型
        this._isDouble          = false; //*是否翻倍
        this._nineGhost         = true;  //*鬼9
        this._bankerType        = SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD; //*上庄类型
        this._multiple          = {
            STRAIGHT_FLUSH: 6,
            THREES: 8,
            STRAIGHT: 4,
            DOUBLE_GHOST: 10

        };
        this._pointMultiple     = [1, 1, 2, 3, 4, 5, 6, 7, 8, 9]; //*定制模式点数
        this._isTripleWinGhost  = false; //*有三鬼
        this._fancyWin          = false; //*比牌设置

        this._gameModeList      = Game.Game.ROOM_TYPE; //*房间类型
        this._ghostCounts       = 0; //*鬼牌数

        this._allSettings       = null;

        this._gameRoomMode      = this._gameModeList.CLASSICAL; //*房间模式初始化
        this._gameRoomSettings  = null;

        this._chaosBet          = true; //*混战模式是不是能够自由下注

        this._gameModeBtnList   = {}; //*模式按钮储存
        this._pointCombos       = []; //*定制模式下拉储存

        this.init();
    }

    Laya.class(SelectModeDialog, "SelectModeDialog", _super);

    SelectModeDialog.prototype.setCustomizedPointMul = function (info) {
        if (this._gameRoomMode != this._gameModeList.CUSTOMIZED) {
            return;
        }
        //*定制模式设置点数倍数
        var index = info.index;

        var multiple = info.combo;//*这个返回的是string
        this._pointMultiple[index] = Number(multiple);
    };

    //*有倍赢
    SelectModeDialog.prototype.setfancyWin = function () {
        this.fancyWinCheck.selected = !this._fancyWin;
        this._fancyWin = this.fancyWinCheck.selected;
        if (this._fancyWin) {
            this.changeTitleColor(this.fancyWinCheck,"#ffb16c");
        }
        else {
            this.changeTitleColor(this.fancyWinCheck);
        }
    };

    //*三倍赢三鬼
    SelectModeDialog.prototype.setTripleWinGhost = function () {
        this.tripleWinTripleGhostCheck.selected = !this._isTripleWinGhost;
        this._isTripleWinGhost = this.tripleWinTripleGhostCheck.selected;
        if (this._isTripleWinGhost) {
            this.changeTitleColor(this.tripleWinTripleGhostCheck,"#ffb16c");
        }
        else {
            this.changeTitleColor(this.tripleWinTripleGhostCheck);
        }
    };

    //*设置0点赢的条件
    SelectModeDialog.prototype.setZeroPoint = function (type) {
        switch (type) {
            case SelectModeDialog.BEAT_DBL_GHOST.ALL_BEAT: {
                this._beatDBLGhost = type;
                this.winDoubleGhostCheck.selected = true;
                this.tripleWinDoubleGhostCheck.selected = false;
                this.changeTitleColor(this.winDoubleGhostCheck,"#ffb16c");
                this.changeTitleColor(this.tripleWinDoubleGhostCheck);
                break;
            }
            case SelectModeDialog.BEAT_DBL_GHOST.FLUSH_THREE_BEAT: {
                this._beatDBLGhost = type;
                this.tripleWinDoubleGhostCheck.selected = true;
                this.winDoubleGhostCheck.selected = false;
                this.changeTitleColor(this.tripleWinDoubleGhostCheck,"#ffb16c");
                this.changeTitleColor(this.winDoubleGhostCheck);
                break;
            }
        }
    };

    SelectModeDialog.prototype.setCondition = function (type) {
        //*经典模式设定上庄条件
        if (this._gameRoomMode != this._gameModeList.CLASSICAL) {
            return;
        }

        switch (type) {
            case SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD: {
                this.bigThenGodCheck.selected = true;
                this.bigThenStraightCheck.selected = false;
                this.changeTitleColor(this.bigThenGodCheck,"#ffb16c");
                this.changeTitleColor(this.bigThenStraightCheck,"#ffffff");
                break;
            }
            case SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_STRAIGHT: {
                this.bigThenGodCheck.selected = false;
                this.bigThenStraightCheck.selected = true;
                this.changeTitleColor(this.bigThenStraightCheck,"#ffb16c");
                this.changeTitleColor(this.bigThenGodCheck,"#ffffff");
                break;
            }
            default: {
                type = SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD;
                this.changeTitleColor(this.bigThenGodCheck,"#ffb16c");
                this.changeTitleColor(this.bigThenStraightCheck,"#ffffff");
                break
            }
        }

        this._bankerType = type;
    };


    SelectModeDialog.prototype.setFormationType = function () {
        this.nineGhostCheck.selected = !this._nineGhost;
        this._nineGhost = this.nineGhostCheck.selected;
        if(this.nineGhostCheck.selected)
        {
            this.changeTitleColor(this.nineGhostCheck,"#ffb16c");
        }
        else
        {
            this.changeTitleColor(this.nineGhostCheck);
        }

    };

    SelectModeDialog.prototype.setBetType = function (type) {
        //*设置下注类型
        switch (type) {
            case SelectModeDialog.BET_TYPE.ANY: {
                this.anyBetCheck.selected = true;
                if (this._gameRoomMode == this._gameModeList.CHAOS) {
                    //*混战模式
                    this.autoBetCheck.selected = false;
                    this._chaosBet = true;
                    this.changeTitleColor(this.autoBetCheck);
                }
                else{
                    //*非混战模式
                    this.moreBetCheck.selected = false;
                    this._isAnyBet = true;
                    this.changeTitleColor(this.moreBetCheck);
                }
                this.changeTitleColor(this.anyBetCheck,"#ffb16c");
                break;
            }
            case SelectModeDialog.BET_TYPE.MORE_THEN_MORE: {
                this.anyBetCheck.selected = false;
                this.moreBetCheck.selected = true;
                this._isAnyBet = false;

                this.changeTitleColor(this.moreBetCheck,"#ffb16c");
                this.changeTitleColor(this.anyBetCheck);
                break;
            }
            case SelectModeDialog.BET_TYPE.AUTO: {
                this.autoBetCheck.selected = true;
                this.changeTitleColor(this.autoBetCheck,"#ffb16c");

                this.anyBetCheck.selected = false;
                this.changeTitleColor(this.anyBetCheck);
                this._chaosBet = false;
                break;
            }
        }
    };

    SelectModeDialog.prototype.setJokerTurn = function (type) {
        //*翻转鬼牌设置
        switch (type) {
            case 0: {
                this.noMoreJokerCheck.selected = true;
                this.oneMoreCheck.selected = false;
                this.twoMoreCheck.mouseEnabled = false;
                this.twoMoreCheck.selected = false;
                this._ghostCounts = 0;

                this.selectTwoGhost();
                this.changeTitleColor(this.noMoreJokerCheck,"#ffb16c");
                this.changeTitleColor(this.oneMoreCheck);
                this.changeTitleColor(this.twoMoreCheck);
                break;
            }
            case 1: {
                this.noMoreJokerCheck.selected = false;
                this.oneMoreCheck.selected = true;
                this.twoMoreCheck.mouseEnabled = true;
                this._ghostCounts = 1;

                this.changeTitleColor(this.oneMoreCheck,"#ffb16c");
                this.changeTitleColor(this.noMoreJokerCheck);
                break;
            }
            default: {
                this._ghostCounts = 0;
            }
        }

    };

    SelectModeDialog.prototype.selectTwoGhost = function() {
        //*设置两张鬼牌
        if (this._ghostCounts != 0) {
            this.twoMoreCheck.selected = !this.twoMoreCheck.selected;
            if(this.twoMoreCheck.selected)
            {
                this._ghostCounts = 2;
                this.changeTitleColor(this.twoMoreCheck,"#ffb16c");
            }
            else
            {
                if(this._ghostCounts >= 1)
                {
                    this._ghostCounts = 1;
                }
                else
                {
                    this._ghostCounts = 0;
                }
                this.changeTitleColor(this.twoMoreCheck);
            }
        }
    };

    SelectModeDialog.prototype.setGameRoundOfCustomized = function (round) {
        switch (round) {
            case SelectModeDialog.NORMAL_ROUND_TYPE.TEN: {
                this.customizedTen.selected = true;
                this.customizedTwenty.selected = false;
                this.customizedThirty.selected = false;
                this.changeTitleColor(this.customizedTen,"#ffb16c");
                this.changeTitleColor(this.customizedTwenty);
                this.changeTitleColor(this.customizedThirty);
                break;
            }
            case SelectModeDialog.NORMAL_ROUND_TYPE.TWENTY: {
                this.customizedTen.selected = false;
                this.customizedTwenty.selected = true;
                this.customizedThirty.selected = false;
                this.changeTitleColor(this.customizedTwenty,"#ffb16c");
                this.changeTitleColor(this.customizedTen);
                this.changeTitleColor(this.customizedThirty);
                break;
            }
            case SelectModeDialog.NORMAL_ROUND_TYPE.THIRTY: {
                this.customizedTen.selected = false;
                this.customizedTwenty.selected = false;
                this.customizedThirty.selected = true;
                this.changeTitleColor(this.customizedThirty,"#ffb16c");
                this.changeTitleColor(this.customizedTen);
                this.changeTitleColor(this.customizedTwenty);
                break;
            }
            default: {
                round = SelectModeDialog.NORMAL_ROUND_TYPE.TEN;
                this.customizedTen.selected = true;
                this.customizedTwenty.selected = false;
                this.customizedThirty.selected = false;
                this.changeTitleColor(this.customizedTen,"#ffb16c");
                this.changeTitleColor(this.customizedTwenty);
                this.changeTitleColor(this.customizedThirty);
                break;
            }
        }

        this._gameRound = round;
    };

    SelectModeDialog.prototype.setGameRound = function (round) {
        //*设置回合数
        switch (round) {
            case SelectModeDialog.NORMAL_ROUND_TYPE.TEN: {
                this.tenRoundCheck.selected = true;
                this.twentyRoundCheck.selected = false;

                this.changeTitleColor(this.tenRoundCheck,"#ffb16c");
                this.changeTitleColor(this.twentyRoundCheck);
                break;
            }
            case SelectModeDialog.NORMAL_ROUND_TYPE.TWENTY: {
                this.tenRoundCheck.selected = false;
                this.twentyRoundCheck.selected = true;
                this.changeTitleColor(this.twentyRoundCheck,"#ffb16c");
                this.changeTitleColor(this.tenRoundCheck);
                break;
            }
            default: {
                round = SelectModeDialog.NORMAL_ROUND_TYPE.TEN;
                this.changeTitleColor(this.tenRoundCheck,"#ffb16c");
                this.changeTitleColor(this.twentyRoundCheck);
                break;
            }
        }

        this._gameRound = round;
    };

    SelectModeDialog.prototype.setJokerEffect = function (effectType) {
        //*鬼牌功能
        switch (effectType) {
            case SelectModeDialog.JOKER_FUNC_TYPE.ANY: {
                this.jokerAnyCheck.selected = true;
                this.jokerFormationCheak.selected = false;
                this.nineGhostCheck.selected = false;
                this.nineGhostCheck.mouseEnabled = false;
                this._nineGhost = false;
                this.changeTitleColor(this.nineGhostCheck);
                this.changeTitleColor(this.jokerAnyCheck,"#ffb16c");
                this.changeTitleColor(this.jokerFormationCheak);
                //this.setFormationType();
                break;
            }

            case SelectModeDialog.JOKER_FUNC_TYPE.FORMATION: {
                this.jokerAnyCheck.selected = false;
                this.jokerFormationCheak.selected = true;
                this.nineGhostCheck.mouseEnabled = true;

                this.changeTitleColor(this.jokerFormationCheak,"#ffb16c");
                this.changeTitleColor(this.jokerAnyCheck);
                break;
            }

            default: {
                break;
            }
        }

        if (this._isJokerFormation != this.jokerFormationCheak.selected) {
            this._isJokerFormation = this.jokerFormationCheak.selected;
        }
    };

    SelectModeDialog.prototype.setDoubleDeal = function () {
        //*设置翻倍牌
        this.doubleCheck.selected = !this._isDouble;
        this._isDouble = this.doubleCheck.selected;
        if(this.doubleCheck.selected)
        {
            this.changeTitleColor(this.doubleCheck,"#ffb16c");
        }
        else
        {
            this.changeTitleColor(this.doubleCheck);
        }
    };

    //*创建房间
    SelectModeDialog.prototype.touchCreateRoom = function () {
        App.soundManager.playSound("btnSound");
        var settings    = {}; //*需要传入的参数
        var pokerModels = {}; //*牌型倍数
        var pokerPoint  = []; //*点数倍数

        for (var i in this._multiple) {
            var multiple = this._multiple[i];
            var index = Game.Game.POKER_MODELS[i];
            pokerModels[index] = multiple;
        }

        var type = this._gameRoomMode;
        if (type == this._gameModeList.CUSTOMIZED) {
            //*定制模式
            //*点数倍数
            var point;
            for (var pointIndex in this._pointCombos) {
                point = Number(this._pointCombos[pointIndex].getChildByName("title").text);
                pokerPoint.push(point);
            }
            settings.pokerPoint = pokerPoint;
            //*牌型倍数
            settings.pokerModels = pokerModels;
        }
        else {
            //*非定制模式
            var ghostCount = this._ghostCounts;
            var betType = Game.Game.BET_TYPE.MORE_THEN_MORE;
            var fancyGod = this._nineGhost;
            var universalGhost = !this._isJokerFormation;
            var isDouble = this._isDouble;
            var beatDBLGhost = this._beatDBLGhost;
            var isTripleWinGhost = this._isTripleWinGhost;
            var fancyWin = this._fancyWin;
            var chaosBet = this._chaosBet;

            var condition;
            if (this._bankerType == SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD) {
                condition = Game.Game.BANKER_CONDITION.GOD;
            }
            else if (this._bankerType == SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_STRAIGHT) {
                condition = Game.Game.BANKER_CONDITION.NORMAL;
            }

            if (type == this._gameModeList.CHAOS) {
                betType = Game.Game.BET_TYPE.ARBITRARILY;
            }
            else {
                if (this._isAnyBet) {
                    betType = Game.Game.BET_TYPE.ARBITRARILY;
                }
            }

            settings.ghostCount = ghostCount;
            settings.betType = betType;
            settings.pokerModels = pokerModels;
            settings.fancyGod = fancyGod;
            settings.universalGhost = universalGhost;
            settings.isDouble = isDouble;
            settings.condition = condition;
            settings.beatDBLGhost = beatDBLGhost;
            settings.beatThreeGhost = isTripleWinGhost;
            settings.fancyWin = fancyWin;
            settings.chaosBet = chaosBet;
        }

        var times = this._gameRound;
        settings.times = times;

        var self = this;
        var code = Game.Code.ROOM;
        var complete = function(err, data) {
            if (err != null) {
                var errCode = err.err;
                switch (errCode) {
                    case code.NOT_ENOUGH_TOKENS: {
                        App.uiManager.showMessage({msg:"钻石不足！"});
                        break;
                    }
                    default: {
                        App.uiManager.showMessage({msg:"房间创建失败！"});
                        break;
                    }
                }
                return;
            }

            App.roomID = data;
            self.setRoomSettings();
            App.enterRoom(App.roomID, function() {
                self.close();
            })
        };

        App.netManager.send(
            "room.handler.create",
            {
                type: type,
                settings: settings
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*切换设置显示和储存变量
    SelectModeDialog.prototype.changeModeSetDisplay = function () {
        //*获取这个模式最后一次的设置
        var modeName = SelectModeDialog.ROOM_NAME[this._gameRoomMode];
        this._gameRoomSettings = this._allSettings[modeName];

        this._gameRound         = this._gameRoomSettings.gameRound;
        this._isDouble          = this._gameRoomSettings.isDouble;
        this._beatDBLGhost      = this._gameRoomSettings.beatDBLGhost;
        this._multiple          = this._gameRoomSettings.multiples;
        this._nineGhost         = this._gameRoomSettings.nineGhost;
        this._pointMultiple     = this._gameRoomSettings.pointMultiple;
        this._isJokerFormation  = this._gameRoomSettings.isJokerFormation;
        this._isTripleWinGhost  = this._gameRoomSettings.isTripleWinGhost;
        this._fancyWin          = this._gameRoomSettings.fancyWin;
        this._ghostCounts       = this._gameRoomSettings.ghostCounts;

        //*初始化设置的显示
        if (this._gameRoomMode != this._gameModeList.CUSTOMIZED) {
            //*不是定制模式，直接勾选回合
            this.setGameRound(this._gameRound);
        }
        else {
            //*定制模式
            this.setGameRoundOfCustomized(this._gameRound);
            this.initCustomizedComboShow();
            return;
        }

        if (this._gameRoomMode != this._gameModeList.CHAOS) {
            this._isAnyBet = this._gameRoomSettings.isAnyBet;
            if (this._isAnyBet) {
                this.setBetType(SelectModeDialog.BET_TYPE.ANY);
            }
            else {
                this.setBetType(SelectModeDialog.BET_TYPE.MORE_THEN_MORE);
            }
        }
        else {
            this._chaosBet = this._gameRoomSettings.chaosBet;
            if (this._chaosBet) {
                this.setBetType(SelectModeDialog.BET_TYPE.ANY);
            }
            else {
                this.setBetType(SelectModeDialog.BET_TYPE.AUTO);
            }
        }

        this.doubleCheck.selected = this._isDouble;
        this.setDoubleDeal();

        if (this._ghostCounts >= 2) {
            this.twoMoreCheck.selected = true;
            this.selectTwoGhost();

            this.oneMoreCheck.selected = true;
            this.changeTitleColor(this.oneMoreCheck,"#ffb16c");

            this.noMoreJokerCheck.selected = false;
            this.changeTitleColor(this.noMoreJokerCheck);
        }
        else {
            this.setJokerTurn(this._ghostCounts);
        }

        if (this._gameRoomSettings.isJokerFormation) {
            this.setJokerEffect(SelectModeDialog.JOKER_FUNC_TYPE.FORMATION);
        }
        else {
            this.setJokerEffect(SelectModeDialog.JOKER_FUNC_TYPE.ANY);
        }

        if (this._gameRoomMode == this._gameModeList.CLASSICAL) {
            this.setCondition(this._gameRoomSettings.bankerType);
        }

        this.tripleWinTripleGhostCheck.selected = this._isTripleWinGhost;
        if (this._isTripleWinGhost) {
            this.changeTitleColor(this.tripleWinTripleGhostCheck,"#ffb16c");
        }
        else {
            this.changeTitleColor(this.tripleWinTripleGhostCheck);
        }

        this.fancyWinCheck.selected = this._fancyWin;
        if (this._fancyWin) {
            this.changeTitleColor(this.fancyWinCheck,"#ffb16c");
        }
        else {
            this.changeTitleColor(this.fancyWinCheck);
        }

        this.setZeroPoint(this._beatDBLGhost);

        this.initFormationCombos();

        this.nineGhostCheck.selected = this._nineGhost;
    };

    SelectModeDialog.prototype.setModeSettings = function () {
        this._gameRoomSettings.gameRound            = this._gameRound;
        this._gameRoomSettings.isJokerFormation     = this._isJokerFormation;
        this._gameRoomSettings.isDouble             = this._isDouble;
        this._gameRoomSettings.beatDBLGhost         = this._beatDBLGhost;
        this._gameRoomSettings.multiples            = this._multiple;
        this._gameRoomSettings.nineGhost            = this._nineGhost;
        this._gameRoomSettings.isTripleWinGhost     = this._isTripleWinGhost;
        this._gameRoomSettings.fancyWin             = this._fancyWin;
        this._gameRoomSettings.ghostCounts          = this._ghostCounts;

        if (this._gameRoomMode == this._gameModeList.CHAOS) {
            this._gameRoomSettings.chaosBet = this._chaosBet;
        }
        else{
            this._gameRoomSettings.isAnyBet = this._isAnyBet;
        }

        if (this._gameRoomMode == this._gameModeList.CLASSICAL) {
            this._gameRoomSettings.bankerType = this._bankerType;
        }

        if (this._gameRoomMode == this._gameModeList.CUSTOMIZED) {
            this._gameRoomSettings.pointMultiple = this._pointMultiple;
        }
    };

    SelectModeDialog.prototype.touchModeBtn = function (modeIndex, isNotPlayBtnSound) {
        isNotPlayBtnSound = isNotPlayBtnSound ? true : false;
        if (!isNotPlayBtnSound) {
            App.soundManager.playSound("btnSound");
        }
        //*储存之前模式的设置
        this.setModeSettings();
        //*切换按钮显示
        this._gameModeBtnList[this._gameRoomMode].skin = SelectModeDialog.BTN_SKIN[this._gameRoomMode].NORMAL;
        this._gameModeBtnList[modeIndex].skin = SelectModeDialog.BTN_SKIN[modeIndex].DISABLED;

        if (this._gameRoomMode == modeIndex) {
            return;
        }

        this.customizedBox.visible = false;
        this.roomSetBox.visible = true;

        var index;
        var posY;
        if(modeIndex == this._gameModeList.CLASSICAL)
        {
            this.conditionBox.visible = true;
            this.betBox.visible = true;
            posY = this.conditionBox.y + 44;
            index = this._selectBoxs.indexOf(this.conditionBox) + 1;
            for (index; index < this._selectBoxs.length; index++) {
                this._selectBoxs[index].y = posY;
                posY = this._selectBoxs[index].y + this._selectBoxs[index].height + 8;
            }
        }
        else if(modeIndex == this._gameModeList.STATIC)
        {
            this.conditionBox.visible = false;
            this.betBox.visible = true;
            posY = this.conditionBox.y;
            index = this._selectBoxs.indexOf(this.conditionBox) + 1;
            for (index; index < this._selectBoxs.length; index++) {
                this._selectBoxs[index].y = posY;
                posY = this._selectBoxs[index].y + this._selectBoxs[index].height + 8;
            }
        }
        else if(modeIndex == this._gameModeList.CHAOS)
        {
            this.conditionBox.visible = false;
            this.betBox.visible = true;
            posY = this.conditionBox.y;
            index = this._selectBoxs.indexOf(this.conditionBox) + 1;
            for (index; index < this._selectBoxs.length; index++) {
                this._selectBoxs[index].y = posY;
                posY = this._selectBoxs[index].y + this._selectBoxs[index].height + 8;
            }
        }
        else if(modeIndex == this._gameModeList.CUSTOMIZED)
        {
            //*定制模式要切换设置的显示
            this.customizedBox.visible = true;
            this.roomSetBox.visible = false;
        }

        //*切换新的模式
        this._gameRoomMode = modeIndex;
        this.changeBetBoxDisplay();
        this.changeIntroduction();
        this.changeModeSetDisplay();
    };

    SelectModeDialog.prototype.initFormationCombos = function () {
        if(this._gameRoomMode == this._gameModeList.CUSTOMIZED)
        {
            this.straightFlushCustomized.getChildByName("title").text = String(this._multiple.STRAIGHT_FLUSH);
            this.threeOfAKindCustomized.getChildByName("title").text = String(this._multiple.THREES);
            this.straightCustomized.getChildByName("title").text = String(this._multiple.STRAIGHT);
        }
        else{
            this.straightFlush.getChildByName("title").text = String(this._multiple.STRAIGHT_FLUSH);
            this.threeOfAKind.getChildByName("title").text = String(this._multiple.THREES);
        }
    };

    SelectModeDialog.prototype.initCustomizedComboShow = function () {
        var pointMultiple = this._pointMultiple;
        for (var i = 0; i < pointMultiple.length; i++) {
            var combo = this._pointCombos[i];
            combo.getChildByName("title").text = String(pointMultiple[i]);
        }
        this.initFormationCombos();
    };

    //*初始化勾选框的点击事件处理
    SelectModeDialog.prototype.initCheckBoxHandler = function () {
        var jokerType = SelectModeDialog.JOKER_FUNC_TYPE;
        var roundType = SelectModeDialog.NORMAL_ROUND_TYPE;

        var checkBoxTouchList = [
            {name:this.tenRoundTouchBox, func:this.setGameRound, parameter:[roundType.TEN]},
            {name:this.twentyRoundTouchBox, func:this.setGameRound, parameter:[roundType.TWENTY]},

            {name:this.bigThenGodTouch, func:this.setCondition, parameter:[SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD]},
            {name:this.bigThenStraightTouch, func:this.setCondition, parameter:[SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_STRAIGHT]},

            {name:this.noMoreJokerTouch, func:this.setJokerTurn, parameter:[0]},
            {name:this.oneMoreTouch, func:this.setJokerTurn, parameter:[1]},
            {name:this.twoMoreTouch, func:this.selectTwoGhost, parameter:null},

            {name:this.jokerAnyTouch, func:this.setJokerEffect, parameter:[jokerType.ANY]},
            {name:this.jokerFormationTouch, func:this.setJokerEffect, parameter:[jokerType.FORMATION]},
            {name:this.nineGhostTouch, func:this.setFormationType},

            {name:this.anyBetTouch, func:this.setBetType, parameter:[SelectModeDialog.BET_TYPE.ANY]},
            {name:this.moreBetTouch, func:this.setBetType, parameter:[SelectModeDialog.BET_TYPE.MORE_THEN_MORE]},
            {name:this.autoBetTouch, func:this.setBetType, parameter:[SelectModeDialog.BET_TYPE.AUTO]},

            {name:this.winDoubleGhostTouch, func:this.setZeroPoint, parameter:[SelectModeDialog.BEAT_DBL_GHOST.ALL_BEAT]},
            {name:this.tripleWinDoubleGhostTouch, func:this.setZeroPoint, parameter:[SelectModeDialog.BEAT_DBL_GHOST.FLUSH_THREE_BEAT]},
            {name:this.tripleWinTripleGhostTouch, func:this.setTripleWinGhost, parameter:null},

            {name:this.fancyWinTouch, func:this.setfancyWin, parameter:null},

            {name:this.doubleTouch, func:this.setDoubleDeal, parameter:null},

            {name:this.customizedTenTouch, func:this.setGameRoundOfCustomized, parameter:[roundType.TEN]},
            {name:this.customizedTwentyTouch, func:this.setGameRoundOfCustomized, parameter:[roundType.TWENTY]},
            {name:this.customizedThirtyTouch, func:this.setGameRoundOfCustomized, parameter:[roundType.THIRTY]}
        ];

        for (var index = 0; index < checkBoxTouchList.length; index ++) {
            var component = checkBoxTouchList[index].name;
            var func = checkBoxTouchList[index].func;
            var parameter = checkBoxTouchList[index].parameter;
            component.on(Laya.Event.CLICK, this, func, parameter);
        }
    };

    SelectModeDialog.prototype.unregEvent = function () {
        this.createRoomBtn.off (Laya.Event.CLICK, this, this.touchCreateRoom);
        var modeBtnList = [
            {btn:this.classicalBtn},
            {btn:this.staticBtn},
            {btn:this.chaosBtn},
            {btn:this.customizedBtn}
        ];
        for (var i = 0; i < modeBtnList.length; i++) {
            var btn = modeBtnList[i].btn;
            btn.off(Laya.Event.CLICK, this, this.touchModeBtn);
        }

        var checkBoxTouchList = [
            {name:this.tenRoundTouchBox, func:this.setGameRound},
            {name:this.twentyRoundTouchBox, func:this.setGameRound},

            {name:this.bigThenGodTouch, func:this.setCondition},
            {name:this.bigThenStraightTouch, func:this.setCondition},

            {name:this.noMoreJokerTouch, func:this.setJokerTurn},
            {name:this.oneMoreTouch, func:this.setJokerTurn},
            {name:this.twoMoreTouch, func:this.selectTwoGhost},

            {name:this.jokerAnyTouch, func:this.setJokerEffect},
            {name:this.jokerFormationTouch, func:this.setJokerEffect},
            {name:this.nineGhostTouch, func:this.setFormationType},

            {name:this.anyBetTouch, func:this.setBetType},
            {name:this.moreBetTouch, func:this.setBetType},
            {name:this.autoBetTouch, func:this.setBetType},

            {name:this.winDoubleGhostTouch, func:this.setZeroPoint},
            {name:this.tripleWinDoubleGhostTouch, func:this.setZeroPoint},
            {name:this.tripleWinTripleGhostTouch, func:this.setTripleWinGhost},

            {name:this.fancyWinTouch, func:this.setfancyWin},

            {name:this.doubleTouch, func:this.setDoubleDeal},

            {name:this.customizedTenTouch, func:this.setGameRoundOfCustomized},
            {name:this.customizedTwentyTouch, func:this.setGameRoundOfCustomized},
            {name:this.customizedThirtyTouch, func:this.setGameRoundOfCustomized}
        ];

        for (var index = 0; index < checkBoxTouchList.length; index ++) {
            var component = checkBoxTouchList[index].name;
            var func = checkBoxTouchList[index].func;
            component.off(Laya.Event.CLICK, this, func);
        }
    };

    SelectModeDialog.prototype.initEvent = function () {
        //*创建房间
        this.createRoomBtn.on (Laya.Event.CLICK, this, this.touchCreateRoom);
        //*模式按钮
        var modeBtnList = [
            {btn:this.classicalBtn, parameter: [this._gameModeList.CLASSICAL, false]},
            {btn:this.staticBtn, parameter: [this._gameModeList.STATIC, false]},
            {btn:this.chaosBtn, parameter: [this._gameModeList.CHAOS, false]},
            {btn:this.customizedBtn, parameter: [this._gameModeList.CUSTOMIZED, false]}
        ];
        for (var i = 0; i < modeBtnList.length; i++) {
            var btn = modeBtnList[i].btn;
            var parameter = modeBtnList[i].parameter;
            btn.on(Laya.Event.CLICK, this, this.touchModeBtn, parameter);
            //*按钮储存，用于切换状态
            var index = parameter[0];
            this._gameModeBtnList[index] = btn;
        }

        //*初始化选框的点击事件
        this.initCheckBoxHandler();
    };

    SelectModeDialog.prototype.createAutoSettings = function () {
        this._allSettings = {
            CLASSICAL: {
                bankerType: SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD,
                gameRound:10,
                ghostCounts: 0,
                isJokerFormation: false,
                isAnyBet: true,
                multiples: {
                    STRAIGHT_FLUSH: 6,
                    THREES: 8,
                    STRAIGHT: 4,
                    DOUBLE_GHOST: 10
                },
                nineGhost: true,
                eightGhost: true,
                beatDBLGhost: SelectModeDialog.BEAT_DBL_GHOST.ALL_BEAT,
                isTripleWinGhost: false,
                fancyWin: false,
                isDouble: false
            },
            STATIC: {
                gameRound:10,
                ghostCounts: 0,
                isJokerFormation: false,
                isAnyBet: true,
                multiples: {
                    STRAIGHT_FLUSH: 6,
                    THREES: 8,
                    STRAIGHT: 4,
                    DOUBLE_GHOST: 10
                },
                nineGhost: true,
                eightGhost: true,
                beatDBLGhost: SelectModeDialog.BEAT_DBL_GHOST.ALL_BEAT,
                isTripleWinGhost: false,
                fancyWin: false,
                isDouble: false
            },
            CHAOS: {
                gameRound:10,
                ghostCounts: 0,
                isJokerFormation: false,
                chaosBet: true,
                multiples: {
                    STRAIGHT_FLUSH: 6,
                    THREES: 8,
                    STRAIGHT: 4,
                    DOUBLE_GHOST: 10
                },
                nineGhost: true,
                eightGhost: true,
                beatDBLGhost: SelectModeDialog.BEAT_DBL_GHOST.ALL_BEAT,
                isTripleWinGhost: false,
                fancyWin: false,
                isDouble: false
            },
            CUSTOMIZED: {
                gameRound:10,
                multiples: {
                    STRAIGHT_FLUSH: 13,
                    THREES: 15,
                    STRAIGHT: 10,
                    DOUBLE_GHOST: 10
                },
                pointMultiple: [1, 1, 2, 3, 4, 5, 6, 7, 8, 9]
            }
        };
    };

    SelectModeDialog.prototype.setRoomSettings = function () {
        this.setModeSettings();

        var saveValue = JSON.stringify(this._allSettings);
        App.storageManager.setItem(SelectModeDialog.GAME_ROOM_SETTINGS, saveValue);
    };

    //*获得所有模式的设置
    SelectModeDialog.prototype.getRoomSettings = function () {
        var saveValue = App.storageManager.getItem(SelectModeDialog.GAME_ROOM_SETTINGS);
        if (saveValue != undefined) {
            this._allSettings = JSON.parse(saveValue);
        }
        else {
            //*没有储存就要初始化一个默认的设置
            this.createAutoSettings();
        }
    };

    SelectModeDialog.prototype.init = function() {
        this.getRoomSettings();//*获取储存的设置
        this.initEvent();
        this.initMultipleTouch();
        this.initDescList();
        this.changeModeSetDisplay();//*设置的显示初始化，要恢复到这个模式最后一次的有效设置
        this.touchModeBtn(this._gameModeList.CLASSICAL, true);
        this.changeIntroduction();
        this.changeBetBoxDisplay();
    };

    // 改变checkBox旁边文字的颜色
    SelectModeDialog.prototype.changeTitleColor = function(touchBox,color) {
        var children = touchBox._childs;
        var node;
        for(var i = 0 ; i < children.length ; i++)
        {
            node = children[i];
            if(node instanceof Laya.Label || node instanceof Laya.Text)
            {
                node.color = color || "#ffffff";
            }
        }
    };

    //*设置下注选项的显示
    SelectModeDialog.prototype.changeBetBoxDisplay = function () {
        if (this._gameRoomMode == this._gameModeList.CHAOS) {
            this.autoBetCheck.visible = true;
            this.moreBetCheck.visible = false;
            this.autoBetTouch.visible = true;
            this.autoBetTouch.disable = true;
            this.moreBetTouch.visible = false;
        }
        else {
            this.autoBetCheck.visible = false;
            this.moreBetCheck.visible = true;
            this.autoBetTouch.visible = false;
            this.autoBetTouch.disable = false;
            this.moreBetTouch.visible = true;
        }
    };

    // 改变描述
    SelectModeDialog.prototype.changeIntroduction = function() {
        this.titleIntroduction.text = introduction[this._gameRoomMode].title;
        //this.detailsIntroduction.text = introduction[this._gameRoomMode].details;
        //
        //this.introductionPanel.vScrollBarSkin = "";
        //this.introductionPanel.vScrollBar.visible = false;
        //this.introductionPanel.refresh();
        //this.introductionPanel.scrollTo();

        switch (this._gameRoomMode) {
            case this._gameModeList.CLASSICAL: {
                this.classicalDescList.visible = true;
                this.staticDescList.visible = false;
                this.chaosDescList.visible = false;
                this.customizedDescList.visible = false;
                break;
            }

            case this._gameModeList.STATIC: {
                this.classicalDescList.visible = false;
                this.staticDescList.visible = true;
                this.chaosDescList.visible = false;
                this.customizedDescList.visible = false;
                break;
            }

            case this._gameModeList.CHAOS: {
                this.classicalDescList.visible = false;
                this.staticDescList.visible = false;
                this.chaosDescList.visible = true;
                this.customizedDescList.visible = false;
                break;
            }

            case this._gameModeList.CUSTOMIZED: {
                this.classicalDescList.visible = false;
                this.staticDescList.visible = false;
                this.chaosDescList.visible = false;
                this.customizedDescList.visible = true;
                break;
            }
        }
    };

    SelectModeDialog.prototype.updateItem = function(cell) {
        cell.setData(cell.dataSource);
    };

    SelectModeDialog.prototype.initDescList = function () {
        var boxList = [
            {listBox: this.classicalDescList, itemRender: classicalPage},
            {listBox: this.staticDescList, itemRender: staticPage},
            {listBox: this.chaosDescList, itemRender: chaosPage},
            {listBox: this.customizedDescList, itemRender: customizedPage},
        ];

        for (var i = 0; i < boxList.length; i++) {
            var boxListSingle = boxList[i].listBox;
            var itemRender = boxList[i].itemRender;
            boxListSingle.vScrollBarSkin = "";
            boxListSingle.itemRender = itemRender;
            boxListSingle.renderHandler = new Laya.Handler(this, this.updateItem);
        }

        var classicaPagesData = [[]];
        classicaPagesData[0].push(this.classicalPage1);
        this.classicalDescList.array = classicaPagesData;

        var staticPagesData = [[]];
        staticPagesData[0].push(this.staticPage1);
        this.staticDescList.array = staticPagesData;

        var chaosPagesData = [[]];
        chaosPagesData[0].push(this.chaosPage1);
        this.chaosDescList.array = chaosPagesData;

        var customizedData = [[]];
        customizedData[0].push(this.customizedPage1);
        this.customizedDescList.array = customizedData;
    };

    // 设置苹果类型的选择特效
    SelectModeDialog.prototype.initMultipleTouch = function() {

        for(var i = 0 ; i < 10 ; i++)
        {
            this["point"+i].on(Laya.Event.CLICK,this,this.onClickMultiple,[Game.Game.CUSTOMIZED_SETTINGS.POINT_MULTIPLE,"point"+i]);
            this._pointCombos.push(this["point"+i]);
        }

        this.straightFlushCustomized.on(Laya.Event.CLICK,this,this.onClickMultiple, [Game.Game.CUSTOMIZED_SETTINGS.STRAIGHT_FLUSH,SelectModeDialog.POKER_MODE_NAME.STRAIGHT_FLUSH]);

        this.straightCustomized.on(Laya.Event.CLICK,this,this.onClickMultiple, [Game.Game.CUSTOMIZED_SETTINGS.STRAIGHT,SelectModeDialog.POKER_MODE_NAME.STRAIGHT]);

        this.threeOfAKindCustomized.on(Laya.Event.CLICK,this,this.onClickMultiple, [Game.Game.CUSTOMIZED_SETTINGS.THREES,SelectModeDialog.POKER_MODE_NAME.THREES]);

        this.straightFlush.on(Laya.Event.CLICK, this, this.onClickMultiple, [Game.Game.POKER_FORMATION_MULTIPLE.STRAIGHT_FLUSH,SelectModeDialog.POKER_MODE_NAME.STRAIGHT_FLUSH]);

        this.threeOfAKind.on(Laya.Event.CLICK,this,this.onClickMultiple, [Game.Game.POKER_FORMATION_MULTIPLE.THREES,SelectModeDialog.POKER_MODE_NAME.THREES]);
    };

    SelectModeDialog.prototype.onClickMultiple = function(data,type) {
        var dlg = App.uiManager.addUiLayer(SelectMultipleDialog, data);

        dlg.on("multipleChange", this, this.changeMultiple, [type]);

    };

    SelectModeDialog.prototype.changeMultiple = function(type,multiple) {
        if(type.indexOf("point") != -1)
        {
            this[type].getChildByName("title").text = multiple;
            this.setCustomizedPointMul({index:type.replace("point",""),combo:multiple});
        }
        else
        {
            this._multiple[type] = multiple;
            this.initFormationCombos();
        }
    };

    SelectModeDialog.prototype.onClosed = function () {
        this.unregEvent();
    };

    //*鬼牌功能类型（万能，牌型）
    SelectModeDialog.JOKER_FUNC_TYPE = {
        ANY: 1,
        FORMATION: 2
    };
    //*局数类型，除了定制模式
    SelectModeDialog.NORMAL_ROUND_TYPE = {
        TEN: 10,
        TWENTY: 20,
        THIRTY: 30
    };
    //*翻鬼牌
    SelectModeDialog.TURN_JOKER_TYPE = {
        NO_MORE: 0,
        ONE_MORE: 1,
        TWO_MORE: 2
    };
    //*下注类型
    SelectModeDialog.BET_TYPE = {
        ANY: 0,
        MORE_THEN_MORE: 1,
        AUTO: 2
    };
    //*鬼牌成型类型
    SelectModeDialog.FORMATION_TYPE = {
        NINE_GHOST: 9,
        EIGHT_GHOST: 8
    };
    //*经典模式上庄条件
    SelectModeDialog.CONDITION_CLASSICAL = {
        BIG_THEN_GOD: "BIG_THEN_GOD",
        BIG_THEN_STRAIGHT: "BIG_THEN_STRAIGHT"
    };
    //*零点类型
    SelectModeDialog.BEAT_DBL_GHOST = {
        ALL_BEAT:           0,  // 木虱赢双鬼
        FLUSH_THREE_BEAT:   1   // 三条同花木虱赢双鬼
    };

    SelectModeDialog.GAME_ROOM_SETTINGS = "gameRoomSettings";
    //*房间，模式名字
    SelectModeDialog.ROOM_NAME = ["STATIC", "CLASSICAL", "CHAOS", "CUSTOMIZED"];
    //*倍数牌型名字
    SelectModeDialog.POKER_MODE_NAME = {
        STRAIGHT_FLUSH: "STRAIGHT_FLUSH",
        THREES: "THREES",
        STRAIGHT: "STRAIGHT",
        DOUBLE_GHOST: "DOUBLE_GHOST"
    };

    SelectModeDialog.BTN_SKIN = {
        0:     {
            NORMAL: "assets/ui.button/img_changzhuang.png",
            DISABLED: "assets/ui.button/img_changzhuang_2.png"
        },

        1:  {
            NORMAL: "assets/ui.button/img_jingdian.png",
            DISABLED: "assets/ui.button/img_jingdian_2.png"
        },

        2:      {
            NORMAL: "assets/ui.button/img_hunzhan.png",
            DISABLED: "assets/ui.button/img_hunzhan_2.png"
        },

        3: {
            NORMAL: "assets/ui.button/img_dingzhi.png",
            DISABLED: "assets/ui.button/img_dingzhi_2.png"
        }
    };



    return SelectModeDialog;
}(SelectModeDialogUI));
