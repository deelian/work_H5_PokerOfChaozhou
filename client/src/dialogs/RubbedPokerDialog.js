var RubbedPokerDialog = (function(_super) {

    function RubbedPokerDialog(info) {
        RubbedPokerDialog.super(this);

        this.info = info;

        this.init();
    }

    Laya.class(RubbedPokerDialog, "RubbedPokerDialog", _super);

    var __proto = RubbedPokerDialog.prototype;

    __proto.init = function() {

        this._panelDistance = 0;
        this._pokerDistance = 0;
        this._maskDistance = 0;
        this._panelHeight = 0;
        this._maskPoker = null;
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
                this.restorePoker();
                break;
            }
            case Laya.Event.MOUSE_MOVE:{
                if (this._isTouchPokerBack) {
                    var diffY = (this._mouseY - Laya.stage.mouseY)*0.7;
                    this._mouseY = Laya.stage.mouseY;
                    this._maskPoker.visible = true;
                    this._showPanel.getChildByName("guideImg").visible = false;
                    this.changeDirectionBtn.visible = false;

                    if (diffY >= 0) {
                        //this._rubbedPoker.y -= diffY;
                        //this._pokerBack.y += 2;
                        this._showPanel.height -= diffY;
                        this._panelDistance += diffY;

                        this._rubbedPoker.y -= (diffY * 2);
                        this._pokerDistance += (diffY * 2);

                        this._maskPoker.y -= (diffY - 1);
                        this._maskDistance += (diffY - 1);

                        if(this._showPanel.height <= this._panelHeight)
                        {
                            this.rubbedPokerEnd();
                        }
                    }
                }
                break;
            }
            case Laya.Event.MOUSE_OUT:{
                this._isTouchPokerBack = false;
                this.restorePoker();
                break;
            }
        }
    };

    // 恢复盖牌
    __proto.restorePoker = function() {
        this._rubbedPoker.y += this._pokerDistance;
        this._showPanel.height += this._panelDistance;
        this._maskPoker.y += this._maskDistance;

        this._maskPoker.visible = false;
        this._showPanel.getChildByName("guideImg").visible = true;
        this.changeDirectionBtn.visible = true;
        //this._distance = 0;
        this._panelDistance = 0;
        this._pokerDistance = 0;
        this._maskDistance = 0;
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

        if(!this._valueMaskPoker)
        {
            this._valueMaskPoker = new Laya.Image();
            this._valueMaskPoker.skin = "assets/pokers/rubbedPoker/img_zpzcc.png";
        }
        else
        {
            this._valueMaskPoker.parent = null;
        }

        if(this._showPanel == this.verticalPanel)
        {
            this._showPanel = this.horizontalPanel;
            this._panelHeight = this._showPanel.height * (1/2);
        }
        else if(this._showPanel == this.horizontalPanel)
        {
            this._showPanel = this.verticalPanel;
            this._panelHeight = this._showPanel.height * (3/5);
        }
        else
        {
            this._showPanel = this.horizontalPanel;
            this._panelHeight = this._showPanel.height * (1/2);
        }

        this._showPanel.visible = true;
        this._pokerBack = this._showPanel.getChildByName("pokerBack");
        this._rubbedPoker = this._showPanel.getChildByName("rubbedPoker");
        this._showPanel.getChildByName("maskPoker").visible = maskVisible;
        this._showPanel.getChildByName("guideImg").visible = guideImgVisible;


        this._valueMaskPoker.x = 2;
        this._valueMaskPoker.y = 2;
        this._rubbedPoker.addChild(this._valueMaskPoker);

        this._maskPoker = this._showPanel.getChildByName("maskPoker");

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

        this._rubbedPoker.y = 0;
        this._showPanel.height += this._panelDistance;
        this._maskPoker.visible = false;

        if(this._valueMaskPoker)
        {
            this._valueMaskPoker.removeSelf();
            this._valueMaskPoker = null;
        }

        setTimeout(function(){
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
        },800);

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