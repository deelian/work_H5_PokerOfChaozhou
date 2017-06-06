var ShowRuleDialog = (function(_super) {

    function ShowRuleDialog(roomData) {
        ShowRuleDialog.super(this);

        this.roomData = roomData;

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

        //this.closeBtn.on(Laya.Event.CLICK, this, this.closeView);

        this.initView();
    }

    Laya.class(ShowRuleDialog, "ShowRuleDialog", _super);

    ShowRuleDialog.prototype.initView = function() {

        var dataSource = {};

        // 牌型倍数
        dataSource.straightLab = this.roomData.pokerModels.straight;
        dataSource.straightFlushLab = this.roomData.pokerModels.straight_flush;
        dataSource.threesLab = this.roomData.pokerModels.threes;
        dataSource.doubleGhostLab = this.roomData.pokerModels.double_ghost;

        if(this.roomData.type != Game.Game.ROOM_TYPE.CUSTOMIZED)
        {
            this.roomSetBox.visible = true;
            this.customizedBox.visible = false;
            this.multipeBox.dataSource = dataSource;

            this.setViewData();
            this.changePos();
        }
        else
        {
            this.customizedBox.visible = true;
            this.roomSetBox.visible = false;

            // 点数倍数
            for(var i = 0 ; i < 10 ; i++)
            {
                dataSource["point_"+i] = this.roomData.pokerPoint[i];
            }
            this.customizedBox.dataSource = dataSource;

            this.setCustomizedRoundBtnShow();
        }

        var roomType = this.roomData.type;
        var titleSkin = ShowRuleDialog.TITLE_IMG[roomType];
        this.titleImg.skin = titleSkin;
    };

    ShowRuleDialog.prototype.setCustomizedRoundBtnShow = function () {
        var changeNodeTextColor = [];
        if(this.roomData.times == 10)
        {
            this.customizedTen.selected = true;
            this.customizedTwenty.selected = false;
            this.customizedThirty.selected = false;
            changeNodeTextColor.push(this.customizedTen);
        }
        else if(this.roomData.times == 20)
        {
            this.customizedTen.selected = false;
            this.customizedTwenty.selected = true;
            this.customizedThirty.selected = false;
            changeNodeTextColor.push(this.customizedTwenty);
        }
        else if (this.roomData.times == 30)
        {
            this.customizedTen.selected = false;
            this.customizedTwenty.selected = false;
            this.customizedThirty.selected = true;
            changeNodeTextColor.push(this.customizedThirty);
        }
        this.changeColor(changeNodeTextColor);
    };

    // 设置每个ITEM的数据
    ShowRuleDialog.prototype.setViewData = function() {
        var changeNodeTextColor = [];

        // 上庄条件
        if(this.roomData.condition == 0)
        {
            this.bigThenStraightCheck.selected = true;
            this.bigThenGodCheck.selected = false;
            changeNodeTextColor.push(this.bigThenStraightCheck);
        }
        else if(this.roomData.condition == 1)
        {
            this.bigThenStraightCheck.selected = false;
            this.bigThenGodCheck.selected = true;
            changeNodeTextColor.push(this.bigThenGodCheck);
        }

        // 局数选择
        if(this.roomData.times == 10)
        {
            this.tenRoundCheck.selected = true;
            this.twentyRoundCheck.selected = false;
            changeNodeTextColor.push(this.tenRoundCheck);
        }
        else if(this.roomData.times == 20)
        {
            this.tenRoundCheck.selected = false;
            this.twentyRoundCheck.selected = true;
            changeNodeTextColor.push(this.twentyRoundCheck);
        }

        // 鬼牌数
        if(this.roomData.ghostCount == 0)
        {
            this.noMoreJokerCheck.selected = true;
            this.oneMoreCheck.selected = false;
            this.twoMoreCheck.selected = false;

            changeNodeTextColor.push(this.noMoreJokerCheck);
        }
        else if(this.roomData.ghostCount == 1)
        {
            this.noMoreJokerCheck.selected = false;
            this.oneMoreCheck.selected = true;
            this.twoMoreCheck.selected = false;

            changeNodeTextColor.push(this.oneMoreCheck);
        }
        else if(this.roomData.ghostCount == 2)
        {
            this.noMoreJokerCheck.selected = false;
            this.oneMoreCheck.selected = true;
            this.twoMoreCheck.selected = true;

            changeNodeTextColor.push(this.oneMoreCheck);
            changeNodeTextColor.push(this.twoMoreCheck);
        }

        // 鬼牌型
        if(this.roomData.universalGhost)
        {
            this.jokerFormationCheak.selected = false;
            this.jokerAnyCheck.selected = true;
            changeNodeTextColor.push(this.jokerAnyCheck);
        }
        else
        {
            this.jokerFormationCheak.selected = true;
            this.nineGhostCheck.selected = false;
            if(this.roomData.fancyGod)
            {
                this.nineGhostCheck.selected = true;
                changeNodeTextColor.push(this.nineGhostCheck);
            }
            changeNodeTextColor.push(this.jokerFormationCheak);

        }

        // 下注功能
        var roomType = this.roomData.type;
        if (roomType != Game.Game.ROOM_TYPE.CHAOS) {
            this.moreBetCheck.visible = true;
            this.autoBetCheck.visible = false;
            if(this.roomData.betType == 0)
            {
                this.anyBetCheck.selected = true;
                this.moreBetCheck.selected = false;
                changeNodeTextColor.push(this.anyBetCheck);
            }
            else if(this.roomData.betType == 1)
            {
                this.anyBetCheck.selected = false;
                this.moreBetCheck.selected = true;
                changeNodeTextColor.push(this.moreBetCheck);
            }
        }
        else {
            this.moreBetCheck.visible = false;
            this.autoBetCheck.visible = true;
            if (this.roomData.chaosBet) {
                this.anyBetCheck.selected = true;
                this.autoBetCheck.selected = false;
                changeNodeTextColor.push(this.anyBetCheck);
            }
            else {
                this.anyBetCheck.selected = false;
                this.autoBetCheck.selected = true;
                changeNodeTextColor.push(this.autoBetCheck);
            }
        }


        // 功能牌
        if(this.roomData.isDouble)
        {
            this.doubleCheck.selected = true;
            changeNodeTextColor.push(this.doubleCheck);
        }

        //*0点条件
        if (this.roomData.beatDBLGhost == Game.Game.BEAT_DBL_GHOST.ALL_BEAT) {
            this.winDoubleGhostCheck.selected = true;
            this.tripleWinDoubleGhostCheck.selected = false;
            changeNodeTextColor.push(this.winDoubleGhostCheck);
        }
        else if (this.roomData.beatDBLGhost == Game.Game.BEAT_DBL_GHOST.FLUSH_THREE_BEAT){
            this.winDoubleGhostCheck.selected = false;
            this.tripleWinDoubleGhostCheck.selected = true;
            changeNodeTextColor.push(this.tripleWinDoubleGhostCheck);
        }

        //*赢三鬼
        if (this.roomData.beatThreeGhost) {
            this.tripleWinTripleGhostCheck.selected = true;
            changeNodeTextColor.push(this.tripleWinTripleGhostCheck);
        }

        //*比牌设置
        if (this.roomData.fancyWin) {
            this.fancyWinCheck.selected = true;
            changeNodeTextColor.push(this.fancyWinCheck);
        }

        this.changeColor(changeNodeTextColor);
    };

    // 改变颜色
    ShowRuleDialog.prototype.changeColor = function(changeArr) {
        for(var i = 0 ; i < changeArr.length ; i++)
        {
            var children = changeArr[i]._childs;
            var node;
            for(var childIndex = 0 ; childIndex < children.length ; childIndex++)
            {
                node = children[childIndex];
                if(node instanceof Laya.Label || node instanceof Laya.Text)
                {
                    node.color = "#ffb16c";
                }
            }
        }
    };

    // 改变位置
    ShowRuleDialog.prototype.changePos = function() {

        var index = this._selectBoxs.indexOf(this.conditionBox) + 1;
        var posY;

        if(this.roomData.type == Game.Game.ROOM_TYPE.STATIC)                // 长庄
        {
            this.conditionBox.visible = false;
            this.betBox.visible = true;
            posY = this.conditionBox.y;
        }
        else if(this.roomData.type == Game.Game.ROOM_TYPE.CLASSICAL)       // 经典
        {
            this.conditionBox.visible = true;
            this.betBox.visible = true;
            posY = this.conditionBox.y + 44;
        }
        else if(this.roomData.type == Game.Game.ROOM_TYPE.CHAOS)            // 混战
        {
            this.conditionBox.visible = false;
            this.betBox.visible = true;
            posY = this.conditionBox.y;
        }

        for (index; index < this._selectBoxs.length; index++) {

            if(!this.betBox.visible)
            {
                if(this.betBox === this._selectBoxs[index])
                {
                    continue;
                }
            }

            this._selectBoxs[index].y = posY;
            posY = this._selectBoxs[index].y + this._selectBoxs[index].height;
        }

    };

    ShowRuleDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    ShowRuleDialog.TITLE_IMG = [
        "assets/ui.room/showRule/img_zhangzhuang.png",
        "assets/ui.room/showRule/img_jingdian.png",
        "assets/ui.room/showRule/img_hunzhan.png",
        "assets/ui.room/showRule/img_dingzhi.png"
    ];
    return ShowRuleDialog;
}(ShowRuleDialogUI));