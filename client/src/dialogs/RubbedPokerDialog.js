var RubbedPokerDialog = (function(_super) {

    function RubbedPokerDialog(info) {
        RubbedPokerDialog.super(this);

        this.info = info;

        this.init();
    }

    Laya.class(RubbedPokerDialog, "RubbedPokerDialog", _super);

    var __proto = RubbedPokerDialog.prototype;

    __proto.init = function() {

        this._distance = 0;
        this.onChangeDirection();

        this.changeDirectionBtn.on(Laya.Event.CLICK,this,this.onChangeDirection);

        this.on(Laya.Event.MOUSE_DOWN, this, this.touchRubbedPoker);
        this.on(Laya.Event.MOUSE_UP, this, this.touchRubbedPoker);
        this.on(Laya.Event.MOUSE_MOVE, this, this.touchRubbedPoker);
        this.on(Laya.Event.MOUSE_OUT, this, this.touchRubbedPoker);

    };

    __proto.touchRubbedPoker = function(e) {
        switch (e.type) {
            case Laya.Event.MOUSE_DOWN:{
                this._isTouchPokerBack = true;
                this._mouseY = Laya.stage.mouseY;
                break;
            }
            case Laya.Event.MOUSE_UP:{
                this._isTouchPokerBack = false;
                break;
            }
            case Laya.Event.MOUSE_MOVE:{
                if (this._isTouchPokerBack) {
                    var diffY = this._mouseY - Laya.stage.mouseY;
                    this._mouseY = Laya.stage.mouseY;
                    this._showPanel.getChildByName("maskPoker").visible = true;
                    this._showPanel.getChildByName("guideImg").visible = false;

                    if (diffY >= 0) {
                        this._rubbedPoker.y -= 2;
                        this._pokerBack.y += 2;
                        this._distance += 2;
                        if(this._rubbedPoker.y <= this._showPanel.height/2)
                        {
                            this.rubbedPokerEnd();
                        }
                    }
                }
                break;
            }
            case Laya.Event.MOUSE_OUT:{
                this._isTouchPokerBack = false;
                break;
            }
        }
    };

    // 切换方向
    __proto.onChangeDirection = function() {
        this._showPanel && (this._showPanel.visible = false);

        // 移动百分比
        var movePercent = 0;
        var maskVisible = false;
        var guideImgVisible = true;
        if(this._showPanel)
        {
            movePercent = this._distance/this._showPanel.height;
            maskVisible = this._showPanel.getChildByName("maskPoker").visible;
            guideImgVisible = this._showPanel.getChildByName("guideImg").visible;
        }

        if(this._showPanel == this.verticalPanel)
        {

            this._showPanel = this.horizontalPanel;
        }
        else if(this._showPanel == this.horizontalPanel)
        {
            this._showPanel = this.verticalPanel;
        }
        else
        {
            this._showPanel = this.verticalPanel;
        }

        this._showPanel.visible = true;
        this._pokerBack = this._showPanel.getChildByName("pokerBack");
        this._rubbedPoker = this._showPanel.getChildByName("rubbedPoker");
        this._showPanel.getChildByName("maskPoker").visible = maskVisible;
        this._showPanel.getChildByName("guideImg").visible = guideImgVisible;

        ( this._distance !=0 ) && (this._pokerBack.y += (this._showPanel.height*movePercent));
        ( this._distance !=0 ) && (this._rubbedPoker.y -= (this._showPanel.height*movePercent));
        this._distance = 0;

        this._rubbedPoker.skin = "assets/pokers/rubbedPoker/" + this.getSkinName(this.info.type,this.info.value) + ".png";
    };

    __proto.rubbedPokerEnd = function() {
        this.off(Laya.Event.MOUSE_DOWN, this, this.touchRubbedPoker);
        this.off(Laya.Event.MOUSE_UP, this, this.touchRubbedPoker);
        this.off(Laya.Event.MOUSE_MOVE, this, this.touchRubbedPoker);
        this.off(Laya.Event.MOUSE_OUT, this, this.touchRubbedPoker);

        var self = this;
        var complete = function (err, data) {
            if (err) {
            }

        };
        App.netManager.send(
            "room.handler.command",
            {
                fn: "rubDone",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    __proto.getSkinName = function (type,value) {
        var skinName;
        switch (type) {
            case Game.Poker.TYPE.DIAMOND: {
                skinName = "diamond_" + value;
                break;
            }

            case Game.Poker.TYPE.CLUB: {
                skinName = "club_" + value;
                break;
            }

            case Game.Poker.TYPE.HEART: {
                skinName = "heart_" + value;
                break;
            }

            case Game.Poker.TYPE.SPADE: {
                skinName = "spade_" + value;
                break;
            }

            case Game.Poker.TYPE.JOKER: {
                skinName = "joker_" + value;
                break;
            }
        }

        return skinName;
    };

    __proto.dispose = function() {
        this.removeSelf();
    };

    return RubbedPokerDialog;
}(RubbedPokerDialogUI));