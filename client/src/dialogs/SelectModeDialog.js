/**
 * 选择游戏模式界面
 */
var SelectModeDialog = (function(_super) {
    function SelectModeDialog() {
        SelectModeDialog.super(this);

        this._selectBoxs = [
            this.conditionBox,
            this.roundNumSetBox,
            this.turnJokersBox,
            this.jokerEffectBox,
            this.skyGrandpaBox,
            this.betBox,
            this.multipeBox,
            this.zeroSetBox,
            this.doubleDealBox
        ];

        this._gameRound         = 10;    //*游戏局数
        this._turnJokerType     = null;  //*翻鬼牌设置类型
        this._isJokerFormation  = false; //*鬼牌是否成型
        this._isAnyBet          = true;  //*是否是任意下注
        this._threeZeroWin      = false; //*3张零点
        this._twoZeroWin        = false; //*2张零点
        this._isDouble          = false; //*是否翻倍
        this._nineGhost         = true;  //*鬼9
        this._eightGhost        = true;  //*鬼8
        this._bankerType        = SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD; //*上庄类型
        this._multiple          = {
                                    STRAIGHT_FLUSH: 4,
                                    THREES: 4,
                                    STRAIGHT: 4,
                                    DOUBLE_GHOST: 10
                                  };
        this._pointMultiple     = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; //*定制模式点数

        this._gameModeList      = Game.Game.ROOM_TYPE; //*房间类型
        this._pokerFormation    = Game.Game.POKER_FORMATION_MULTIPLE; //*牌型倍数设置
        this._ghostCounts       = 0; //*鬼牌数

        this._allSettings       = null;

        this._gameRoomMode      = this._gameModeList.STATIC; //*房间模式初始化
        this._gameRoomSettings  = null;

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
        var comboBox = info.combo;

        var multiple = comboBox.selectedLabel; //*这个返回的是string
        this._pointMultiple[index] = Number(multiple);
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
                break;
            }
            case SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_STRAIGHT: {
                this.bigThenGodCheck.selected = false;
                this.bigThenStraightCheck.selected = true;
                break;
            }
            default: {
                type = SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD;
                break
            }
        }

        this._bankerType = type;
    };

    SelectModeDialog.prototype.setFormationType = function (type) {
        switch (type) {
            case SelectModeDialog.FORMATION_TYPE.NINE_GHOST: {
                this._nineGhost = this.nineGhostCheck.selected;
                break;
            }
            case SelectModeDialog.FORMATION_TYPE.EIGHT_GHOST: {
                this._eightGhost = this.eightGhostCheck.selected;
                break;
            }
        }
    };

    SelectModeDialog.prototype.setBetType = function (type) {
        //*设置下注类型
        switch (type) {
            case SelectModeDialog.BET_TYPE.ANY: {
                this.anyBetCheck.selected = true;
                this.moreBetCheck.selected = false;
                this._isAnyBet = true;
                break;
            }
            case SelectModeDialog.BET_TYPE.MORE_THEN_MORE: {
                this.anyBetCheck.selected = false;
                this.moreBetCheck.selected = true;
                this._isAnyBet = false;
                break;
            }
        }
    };

    SelectModeDialog.prototype.setJokerTurn = function (type) {
        //*翻转鬼牌设置
        switch (type) {
            case SelectModeDialog.TURN_JOKER_TYPE.NO_MORE: {
                this.noMoreJokerCheck.selected = true;
                this.oneMoreCheck.selected = false;
                this.twoMoreCheck.selected = false;
                this._ghostCounts = 0;
                break;
            }
            case SelectModeDialog.TURN_JOKER_TYPE.ONE_MORE: {
                this.noMoreJokerCheck.selected = false;
                this.oneMoreCheck.selected = true;
                this.twoMoreCheck.selected = false;
                this._ghostCounts = 1;
                break;
            }
            case SelectModeDialog.TURN_JOKER_TYPE.TWO_MORE: {
                this.noMoreJokerCheck.selected = false;
                this.oneMoreCheck.selected = false;
                this.twoMoreCheck.selected = true;
                this._ghostCounts = 2;
                break;
            }
            default: {
                type = SelectModeDialog.TURN_JOKER_TYPE.NO_MORE;
                this._ghostCounts = 0;
            }
        }

        this._turnJokerType = type;
    };

    SelectModeDialog.prototype.setCustomizedGameRound = function (combo) {
        //*设置定制模式局数
        if (this._gameRoomMode == this._gameModeList.CUSTOMIZED) {
            this._gameRound = Number(combo.selectedLabel);
        }
    };

    SelectModeDialog.prototype.setGameRound = function (round) {
        //*设置回合数
        switch (round) {
            case SelectModeDialog.NORMAL_ROUND_TYPE.TEN: {
                this.tenRoundCheck.selected = true;
                this.twentyRoundCheck.selected = false;
                break;
            }
            case SelectModeDialog.NORMAL_ROUND_TYPE.TWENTY: {
                this.tenRoundCheck.selected = false;
                this.twentyRoundCheck.selected = true;
                break;
            }
            default: {
                round = SelectModeDialog.NORMAL_ROUND_TYPE.TEN;
                break;
            }
        }

        this._gameRound = round;
    };

    SelectModeDialog.prototype.setSkyGrandpa = function () {
        //*鬼牌成型，天公选项
        var factor = 1;
        if (this._isJokerFormation) {
            this.skyGrandpaBox.visible = true;
        }
        else {
            this.skyGrandpaBox.visible = false;
            factor = -1;
        }

        for (var i = 4; i < this._selectBoxs.length; i++) {
            this._selectBoxs[i].y += factor * 35;
        }
    };

    SelectModeDialog.prototype.setJokerEffect = function (effectType) {
        //*鬼牌功能
        switch (effectType) {
            case SelectModeDialog.JOKER_FUNC_TYPE.ANY: {
                this.jokerAnyCheck.selected = true;
                this.jokerFormationCheak.selected = false;
                break;
            }

            case SelectModeDialog.JOKER_FUNC_TYPE.FORMATION: {
                this.jokerAnyCheck.selected = false;
                this.jokerFormationCheak.selected = true;
                break;
            }

            default: {
                break;
            }
        }

        if (this._isJokerFormation != this.jokerFormationCheak.selected) {
            this._isJokerFormation = this.jokerFormationCheak.selected;
            this.setSkyGrandpa();
        }
    };

    SelectModeDialog.prototype.setDoubleDeal = function () {
        //*设置翻倍牌
        this._isDouble = this.doubleCheck.selected;
    };

    SelectModeDialog.prototype.touchCreateRoom = function () {
        //*需要传入的参数
        var type = this._gameRoomMode;
        var times = this._gameRound;
        var ghostCount = this._ghostCounts;
        var pokerModels = {};
        
        for (var i in this._multiple) {
            var multiple = this._multiple[i];
            var index = Game.Game.POKER_MODELS[i];
            pokerModels[index] = multiple;
        }

        var settings = {
            times: times,
            ghostCount: ghostCount,
            betType: 0
        };


        var self = this;
        var roomData;
        var complete = function(err, data) {
            if (err != null) {
                return;
            }

            App.roomID = data;
            App.enterRoom(App.roomID, function() {
                self.close();
            })
        };

        App.netManager.send(
            "room.handler.create",
            {
                type: type,
                settings: settings,
                pokerModels: pokerModels
            },
            Laya.Handler.create(null, complete)
        );
    };

    SelectModeDialog.prototype.pokerModeMultiple = function (info) {
        var pokerMode = info.pokerMode;
        var comboBox = info.combo;

        var multiple = comboBox.selectedLabel; //*这个返回的是string
        this._multiple[pokerMode] = Number(multiple);
    };

    //*切换设置显示和储存变量
    SelectModeDialog.prototype.changeModeSetDisplay = function () {
        //*获取这个模式最后一次的设置
        var modeName = SelectModeDialog.ROOM_NAME[this._gameRoomMode];
        this._gameRoomSettings = this._allSettings[modeName];

        this._gameRound             = this._gameRoomSettings.gameRound;
        this._isAnyBet              = this._gameRoomSettings.isAnyBet;
        this._isDouble              = this._gameRoomSettings.isDouble;
        this._twoZeroWin            = this._gameRoomSettings.twoZeroWin;
        this._threeZeroWin          = this._gameRoomSettings.threeZeroWin;
        this._turnJokerType         = this._gameRoomSettings.turnJokerType;
        this._multiple              = this._gameRoomSettings.multiples;
        this._eightGhost            = this._gameRoomSettings.eightGhost;
        this._nineGhost             = this._gameRoomSettings.nineGhost;
        this._pointMultiple         = this._gameRoomSettings.pointMultiple;

        //*初始化设置的显示
        if (this._gameRoomMode != this._gameModeList.CUSTOMIZED) {
            //*不是定制模式，直接勾选回合
            this.setGameRound(this._gameRound);
        }
        else {
            //*定制模式
            this.initCustomizedComboShow();
            return;
        }
        this.setJokerTurn(this._turnJokerType);
        this.doubleCheck.selected = this._isDouble;

        if (this._isAnyBet) {
            this.setBetType(SelectModeDialog.BET_TYPE.ANY);
        }
        else {
            this.setBetType(SelectModeDialog.BET_TYPE.MORE_THEN_MORE);
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

        this.initFormationCombos();

        this.threeZeroCheck.selected = this._threeZeroWin;
        this.twoZeroCheck.selected = this._twoZeroWin;

        this.nineGhostCheck.selected = this._eightGhost;
        this.eightGhostCheck.selected = this._nineGhost;
    };

    SelectModeDialog.prototype.setModeSettings = function () {
        this._gameRoomSettings.gameRound            = this._gameRound;
        this._gameRoomSettings.isJokerFormation     = this._isJokerFormation;
        this._gameRoomSettings.isAnyBet             = this._isAnyBet;
        this._gameRoomSettings.isDouble             = this._isDouble;
        this._gameRoomSettings.twoZeroWin           = this._twoZeroWin;
        this._gameRoomSettings.threeZeroWin         = this._threeZeroWin;
        this._gameRoomSettings.turnJokerType        = this._turnJokerType;
        this._gameRoomSettings.multiples            = this._multiple;
        this._gameRoomSettings.nineGhost            = this._nineGhost;
        this._gameRoomSettings.eightGhost           = this._eightGhost;

        if (this._gameRoomMode == this._gameModeList.CLASSICAL) {
            this._gameRoomSettings.bankerType = this._bankerType;
        }

        if (this._gameRoomMode == this._gameModeList.CUSTOMIZED) {
            this._gameRoomSettings.pointMultiple = this._pointMultiple;
        }
    };

    SelectModeDialog.prototype.touchModeBtn = function (modeIndex) {
        if (this._gameRoomMode == modeIndex) {
            return;
        }
        //*储存之前模式的设置
        this.setModeSettings();
        //*切换按钮显示
        this._gameModeBtnList[this._gameRoomMode].disabled = false;
        this._gameModeBtnList[modeIndex].disabled = true;
        //*设置显示切换
        if (modeIndex == this._gameModeList.CLASSICAL) {
            //*如果是切换成经典模式，显示上庄条件
            this.conditionBox.visible = true;
            var index = this._selectBoxs.indexOf(this.conditionBox) + 1;
            for (index; index < this._selectBoxs.length; index++) {
                this._selectBoxs[index].y += 27;
            }
        }
        else if (modeIndex == this._gameModeList.CUSTOMIZED) {
            //*定制模式要切换设置的显示
            this.customizedBox.visible = true;
            this.roomSetBox.visible = false;
        }

        if (this._gameRoomMode == this._gameModeList.CLASSICAL) {
            this.conditionBox.visible = false;
            var boxIndex = this._selectBoxs.indexOf(this.conditionBox) + 1;
            for (boxIndex; boxIndex < this._selectBoxs.length; boxIndex++) {
                this._selectBoxs[boxIndex].y -= 27;
            }
        }
        else if (this._gameRoomMode == this._gameModeList.CUSTOMIZED) {
            this.customizedBox.visible = false;
            this.roomSetBox.visible = true;
        }
        //*切换新的模式
        this._gameRoomMode = modeIndex;
        this.changeModeSetDisplay();
    };

    SelectModeDialog.prototype.initFormationCombos = function () {
        this.straightFlush.selectedLabel = String(this._multiple.STRAIGHT_FLUSH);
        this.threeOfAKind.selectedLabel = String(this._multiple.THREES);
        this.straight.selectedLabel = String(this._multiple.STRAIGHT);
        this.doubleJoker.selectedLabel = String(this._multiple.DOUBLE_GHOST);
    };

    SelectModeDialog.prototype.initCustomizedComboShow = function () {
        var pointMultiple = this._pointMultiple;
        for (var i = 0; i < pointMultiple.length; i++) {
            var combo = this._pointCombos[i];
            combo.selectedLabel = String(pointMultiple[i]);
        }
        this.gameRoundCustomized.selectedLabel = String(this._gameRound);
        this.initFormationCombos();
    };

    SelectModeDialog.prototype.initComboBox = function () {
        //*初始化倍数选项
        var i;
        var multipleInfo;
        var formation = [
            {name:this.straightFlush, pokerMode: SelectModeDialog.POKER_MODE_NAME.STRAIGHT_FLUSH},
            {name:this.threeOfAKind, pokerMode: SelectModeDialog.POKER_MODE_NAME.THREES},
            {name:this.straight, pokerMode: SelectModeDialog.POKER_MODE_NAME.STRAIGHT},
            {name:this.doubleJoker, pokerMode: SelectModeDialog.POKER_MODE_NAME.DOUBLE_GHOST},
            //*定制模式牌型倍数
            {name:this.straightFlushCustomized, pokerMode: SelectModeDialog.POKER_MODE_NAME.STRAIGHT_FLUSH},
            {name:this.straightCustomized, pokerMode: SelectModeDialog.POKER_MODE_NAME.THREES},
            {name:this.threeOfAKindCustomized, pokerMode: SelectModeDialog.POKER_MODE_NAME.STRAIGHT},
            {name:this.doubleJokerCustomized, pokerMode: SelectModeDialog.POKER_MODE_NAME.DOUBLE_GHOST}
        ];

        for (i in formation) {
            var str = "";
            var comboBox = formation[i].name;
            var pokerMode = formation[i].pokerMode;
            multipleInfo = this._pokerFormation[pokerMode];
            str = this.getComboLabels(multipleInfo);

            comboBox.labels = str;
            comboBox.selectedIndex = 0;
            var info = [{
                combo: comboBox,
                pokerMode: pokerMode
            }];
            comboBox.selectHandler = Laya.Handler.create(this, this.pokerModeMultiple, info, false);
        }

        //*定制模式倍数设置初始化
        //*局数
        var gameRoundList = Game.Game.CUSTOMIZED_SETTINGS.ROUND;
        this.gameRoundCustomized.labels = this.getComboLabels(gameRoundList);
        this.gameRoundCustomized.selectedIndex = 0;
        this.gameRoundCustomized.selectHandler = Laya.Handler.create(this, this.setCustomizedGameRound, [this.gameRoundCustomized], false);

        //*点数倍数
        var pointMultiple = Game.Game.CUSTOMIZED_SETTINGS.POINT_MULTIPLE;
        var multipleStr = this.getComboLabels(pointMultiple);
        for (var pointIndex = 0; pointIndex < 10; pointIndex ++) {
            var pointComboBox = this.customizedBox.getChildByName("point_" + pointIndex);
            pointComboBox.labels = multipleStr;
            pointComboBox.selectedIndex = 0;
            var selectInfo = [
                {
                    combo: pointComboBox,
                    index: pointIndex
                }
            ];
            pointComboBox.selectHandler = Laya.Handler.create(this, this.setCustomizedPointMul, selectInfo, false);
            this._pointCombos.push(pointComboBox);
        }
    };

    //*初始化勾选框的点击事件处理
    SelectModeDialog.prototype.initCheckBoxHandler = function () {
        var jokerType = SelectModeDialog.JOKER_FUNC_TYPE;
        var roundType = SelectModeDialog.NORMAL_ROUND_TYPE;
        var turnJokerType = SelectModeDialog.TURN_JOKER_TYPE;

        var checkBoxList = [
            {name:this.doubleCheck, func:this.setDoubleDeal, parameter:null},

            {name:this.jokerAnyCheck, func:this.setJokerEffect, parameter:[jokerType.ANY]},
            {name:this.jokerFormationCheak, func:this.setJokerEffect, parameter:[jokerType.FORMATION]},

            {name:this.tenRoundCheck, func:this.setGameRound, parameter:[roundType.TEN]},
            {name:this.twentyRoundCheck, func:this.setGameRound, parameter:[roundType.TWENTY]},

            {name:this.noMoreJokerCheck, func:this.setJokerTurn, parameter:[turnJokerType.NO_MORE]},
            {name:this.oneMoreCheck, func:this.setJokerTurn, parameter:[turnJokerType.ONE_MORE]},
            {name:this.twoMoreCheck, func:this.setJokerTurn, parameter:[turnJokerType.TWO_MORE]},

            {name:this.anyBetCheck, func:this.setBetType, parameter:[SelectModeDialog.BET_TYPE.ANY]},
            {name:this.moreBetCheck, func:this.setBetType, parameter:[SelectModeDialog.BET_TYPE.MORE_THEN_MORE]},

            {name:this.nineGhostCheck, func:this.setFormationType, parameter:[SelectModeDialog.FORMATION_TYPE.NINE_GHOST]},
            {name:this.eightGhostCheck, func:this.setFormationType, parameter:[SelectModeDialog.FORMATION_TYPE.EIGHT_GHOST]},

            {name:this.bigThenGodCheck, func:this.setCondition, parameter:[SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_GOD]},
            {name:this.bigThenStraightCheck, func:this.setCondition, parameter:[SelectModeDialog.CONDITION_CLASSICAL.BIG_THEN_STRAIGHT]}
        ];

        for (var index = 0; index < checkBoxList.length; index ++) {
            var component = checkBoxList[index].name;
            var func = checkBoxList[index].func;
            var parameter = checkBoxList[index].parameter;
            component.clickHandler = Laya.Handler.create(this, func, parameter, false);
        }

        this.initComboBox();
    };

    SelectModeDialog.prototype.touchAutoSettings = function () {
        this.createAutoSettings();
    };

    SelectModeDialog.prototype.initEvent = function () {
        //*创建房间
        this.createRoomBtn.on (Laya.Event.CLICK, this, this.touchCreateRoom);
        //*恢复默认设置（测试用）
        this.autoSettingBtn.on (Laya.Event.CLICK, this, this.touchAutoSettings);
        this.autoSettingBtn.visible = true;
        //*模式按钮
        var modeBtnList = [
            {btn:this.classicalBtn, parameter: [this._gameModeList.CLASSICAL]},
            {btn:this.staticBtn, parameter: [this._gameModeList.STATIC]},
            {btn:this.chaosBtn, parameter: [this._gameModeList.CHAOS]},
            {btn:this.customizedBtn, parameter: [this._gameModeList.CUSTOMIZED]}
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
                isJokerFormation: false,
                isAnyBet: true,
                multiples: {
                    STRAIGHT_FLUSH: 4,
                    THREES: 4,
                    STRAIGHT: 4,
                    DOUBLE_GHOST: 10
                },
                nineGhost: true,
                eightGhost: true,
                turnJokerType: SelectModeDialog.TURN_JOKER_TYPE.NO_MORE,
                threeZeroWin:false,
                twoZeroWin:false,
                isDouble: false
            },
            STATIC: {
                gameRound:10,
                isJokerFormation: false,
                isAnyBet: true,
                multiples: {
                    STRAIGHT_FLUSH: 4,
                    THREES: 4,
                    STRAIGHT: 4,
                    DOUBLE_GHOST: 10
                },
                nineGhost: true,
                eightGhost: true,
                turnJokerType: SelectModeDialog.TURN_JOKER_TYPE.NO_MORE,
                threeZeroWin:false,
                twoZeroWin:false,
                isDouble: false
            },
            CHAOS: {
                gameRound:10,
                isJokerFormation: false,
                isAnyBet: true,
                multiples: {
                    STRAIGHT_FLUSH: 4,
                    THREES: 4,
                    STRAIGHT: 4,
                    DOUBLE_GHOST: 10
                },
                nineGhost: true,
                eightGhost: true,
                turnJokerType: SelectModeDialog.TURN_JOKER_TYPE.NO_MORE,
                threeZeroWin: false,
                twoZeroWin: false,
                isDouble: false
            },
            CUSTOMIZED: {
                gameRound:10,
                multiples: {
                    STRAIGHT_FLUSH: 4,
                    THREES: 4,
                    STRAIGHT: 4,
                    DOUBLE_GHOST: 10
                },
                pointMultiple: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
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
        this.changeModeSetDisplay();//*设置的显示初始化，要恢复到这个模式最后一次的有效设置
        this.touchModeBtn(this._gameModeList.CLASSICAL);
    };

    SelectModeDialog.prototype.close = function() {
        //*关闭界面的时候要储存一下所有模式的设置
        this.setRoomSettings();
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    SelectModeDialog.prototype.getComboLabels = function (combos) {
        var min = combos.min;
        var max = combos.max;
        var dValue = combos.dValue || 1;
        var str = "";

        for (var index = min; index <= max; index += dValue) {
            if (index == max) {
                str += index;
            }
            else {
                str += index + ",";
            }
        }

        return str;
    };

    //*鬼牌功能类型（万能，牌型）
    SelectModeDialog.JOKER_FUNC_TYPE = {
        ANY: 1,
        FORMATION: 2
    };
    //*局数类型，除了定制模式
    SelectModeDialog.NORMAL_ROUND_TYPE = {
        TEN: 10,
        TWENTY: 20
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
        MORE_THEN_MORE: 1
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

    return SelectModeDialog;
}(SelectModeDialogUI));
