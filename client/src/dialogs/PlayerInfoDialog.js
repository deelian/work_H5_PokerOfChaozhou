/**
 * 玩家信息显示界面
 */
var PlayerInfoDialog = (function(_super) {
    function PlayerInfoDialog(opts) {

        PlayerInfoDialog.super(this);

        this._userId = opts.userID;//*这个人的id
        this._isHost = opts.isHost;//*是不是房主打开了这个信息面板
        this.init(opts);
    }

    Laya.class(PlayerInfoDialog, "PlayerInfoDialog", _super);

    PlayerInfoDialog.prototype.init = function(opts) {
        this.initShow();
        this.initEvent();

        this.setInfo(opts.user);
    };

    //*禁言
    PlayerInfoDialog.prototype.forbidPlayer = function (userID) {
        if (this._isHost && this._userId == userID) {
            this.cannotTalk.disabled = true;
            this.canTalk.disabled = false;
        }
    };

    //*解除禁言
    PlayerInfoDialog.prototype.cancelForbidden = function (userID) {
        if (this._isHost && this._userId == userID) {
            this.cannotTalk.disabled = false;
            this.canTalk.disabled = true;
        }
    };

    PlayerInfoDialog.prototype.forbiddenState = function(userID) {
        if (this._isHost && this._userId == userID) {
            this.guestBannedTalk = true;
            this.transformTalkState();
        }
    };

    //*踢人
    PlayerInfoDialog.prototype.onKickBtn = function () {
        if (!this._isHost) {
            return;
        }
        App.soundManager.playSound("btnSound");
        var self = this;
        var complete = function (err, data) {
            if (!err) {
                self.close();
            }
        };
        App.netManager.send(
            "room.handler.kick",
            {
                data: this._userId
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*强制站起
    PlayerInfoDialog.prototype.onStandBtn = function () {
        var self = this;
        var complete = function (err, data) {
            if (!err) {
                self.close();
            }
        };
        App.soundManager.playSound("btnSound");
        App.netManager.send(
            "room.handler.let_stand_up",
            {
                data: this._userId
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*解除禁言
    PlayerInfoDialog.prototype.onCanTalk = function () {
        if (!this._isHost) {
            return;
        }
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
        };
        App.netManager.send(
            "room.handler.del_forbidden",
            {
                data: this._userId
            },
            Laya.Handler.create(null, complete)
        );
    };

    //*禁言
    PlayerInfoDialog.prototype.onCannotTalk = function () {
        if (!this._isHost) {
            return;
        }
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
        };
        App.netManager.send(
            "room.handler.add_forbidden",
            {
                data: this._userId
            },
            Laya.Handler.create(null, complete)
        );
    };

    PlayerInfoDialog.prototype.onBannedTalk = function() {
        if (!this._isHost) {
            return;
        }
        App.soundManager.playSound("btnSound");
        var self = this;
        var url;

        var complete = function (err, data) {
            if (err) {
                return;
            }

        };

        if(this.guestBannedTalk)
        {
            // 已经禁言了，点击解除
            url = "room.handler.del_forbidden"
        }
        else
        {
            // 没禁言，点击禁言
            url = "room.handler.add_forbidden"
        }

        App.netManager.send(
            url,
            {
                data: this._userId
            },
            Laya.Handler.create(null, complete)
        );
    };

    PlayerInfoDialog.prototype.initEvent = function () {
        var btnList = [
            {"btn": this.banned, "func": this.onBannedTalk},
            {"btn": this.standBtn, "func": this.onStandBtn},
            {"btn": this.kickBtn, "func": this.onKickBtn}
        ];

        for (var index in btnList) {
            var btnInfo = btnList[index];
            var btn = btnInfo["btn"];
            var func = btnInfo["func"];
            btn.on(Laya.Event.CLICK, this, func);
        }

        var tableEvent = [
            {"eventName":RoomTableMgr.Event.CANCEL_FORBIDDEN, "eventFunc":this.forbiddenState},
            {"eventName":RoomTableMgr.Event.FORBIDDEN_PLYAER, "eventFunc":this.forbiddenState},
            //{"eventName":RoomTableMgr.Event.CLOSE_PLAYER_INFO_VIEW, "eventFunc":this.close}
        ];

        for (var eventIndex in tableEvent) {
            var eventInfo = tableEvent[eventIndex];
            var eventName = eventInfo["eventName"];
            var eventFunc = eventInfo["eventFunc"];
            App.tableManager.on(eventName, this, eventFunc);
        }

        //this.btnClose.on(Laya.Event.CLICK,this,this.onClose);

        this.btnIncrease.on(Laya.Event.CLICK, this, this.showBuyTokensPanel);
    };

    PlayerInfoDialog.prototype.unregEvent = function () {
        var btnList = [
            {"btn": this.banned, "func": this.onBannedTalk},
            {"btn": this.standBtn, "func": this.onStandBtn},
            {"btn": this.kickBtn, "func": this.onKickBtn}
        ];

        for (var index in btnList) {
            var btnInfo = btnList[index];
            var btn = btnInfo["btn"];
            var func = btnInfo["func"];
            btn.off(Laya.Event.CLICK, this, func);
        }

        var tableEvent = [
            {"eventName":RoomTableMgr.Event.CANCEL_FORBIDDEN, "eventFunc":this.forbiddenState},
            {"eventName":RoomTableMgr.Event.FORBIDDEN_PLYAER, "eventFunc":this.forbiddenState},
            {"eventName":RoomTableMgr.Event.CLOSE_PLAYER_INFO_VIEW, "eventFunc":this.close}
        ];

        for (var eventIndex in tableEvent) {
            var eventInfo = tableEvent[eventIndex];
            var eventName = eventInfo["eventName"];
            var eventFunc = eventInfo["eventFunc"];
            App.tableManager.off(eventName, this, eventFunc);
        }

        this.btnIncrease.off(Laya.Event.CLICK, this, this.showBuyTokensPanel);
    };

    PlayerInfoDialog.prototype.initShow = function () {
        var selfId = App.player.getId();
        //*显示的是不是自己的信息面板
        if (selfId != this._userId) {
            this.imgBg.skin = "assets/ui.playerInfo/bg_jiemian2.png";
            this.otherInfoBox.visible = true;
            this.selfInfoBox.visible = false;
            
        }
        else {
            this.imgBg.skin = "assets/ui.playerInfo/bg_jiemian.png";
            this.otherInfoBox.visible = false;
            this.selfInfoBox.visible = true;
        }

        //*是否是房主查询
        if (this._isHost) {
            this.transformTalkState();
            this.setBtnState(); //*设置踢人和强制站起按钮
        }
        else {
            this.otherInfoBox.visible = false;
            this.imgBg.height = 367;
        }
    };

    PlayerInfoDialog.prototype.setBalance = function (data) {
        var tokens = data || 0;
        this.tokenLab.text = tokens + "";
    };

    PlayerInfoDialog.prototype.getTokens = function () {
        var selfId = App.player.getId();
        if (selfId == this._userId) {
            var self = this;
            var complete = function (err, data) {
                if (err) {
                    return;
                }

                self.setBalance(data);
            };
            //*退出房间
            App.netManager.send(
                "lobby.handler.get_user_tokens",
                {},
                Laya.Handler.create(null, complete)
            );
        }
    };

    PlayerInfoDialog.prototype.setInfo = function(user) {
        var self = this;

        if (user == null) {
            return;
        }

        self.idNumLab.text          = DejuPoker.sprintf('%08d', user.id);
        self.avatarImage.skin       = user.avatar == "" ? "assets/ui.room/img_ModelBig.png" : user.avatar;
        self.avatarImage.width      = 163;
        self.avatarImage.height     = 163;
        self.nameLab.text           = user.name == "" ? "游客" : user.name;
        self.tokenLab.text          = user.tokens || 0;
        self.genderImg.skin         = user.gender == 0 ? "assets/ui.playerInfo/icon_man.png" : "assets/ui.playerInfo/icon_woman.png";
        self.roundNumLab.text       = user.data.playTimes || 0;
        self.winLab.text            = user.data.ghostTimes || 0;
        self.sharmNumLab.text       = user.data.charm || 0;
        self.godNumLab.text         = user.data.godTimes || 0;

        self.getTokens();
    };

    PlayerInfoDialog.prototype.getInfo = function() {
        var self = this;
        var complete = function(err, user) {
            if (err) {
                return;
            }

            self.idNumLab.text          = DejuPoker.sprintf('%08d', user.id);
            self.avatarImage.skin       = user.avatar == "" ? "assets/ui.room/img_ModelBig.png" : user.avatar;
            self.avatarImage.width      = 163;
            self.avatarImage.height     = 163;
            self.nameLab.text           = user.name == "" ? "游客" : user.name;
            self.tokenLab.text          = user.tokens || 0;
            self.genderImg.skin         = user.gender == 0 ? "assets/ui.playerInfo/icon_man.png" : "assets/ui.playerInfo/icon_woman.png";
            self.roundNumLab.text       = user.data.playTimes || 0;
            self.winLab.text            = user.data.ghostTimes || 0;
            self.sharmNumLab.text       = user.data.charm || 0;
            self.godNumLab.text         = user.data.godTimes || 0;
        };

        App.netManager.send(
            "lobby.handler.get_user",
            {
                id: this._userId
            },
            Laya.Handler.create(null, complete)
        );
    };

    PlayerInfoDialog.prototype.showBuyTokensPanel = function () {
        App.soundManager.playSound("btnSound");
        App.uiManager.addUiLayer(BuyItemDialog);
    };

    PlayerInfoDialog.prototype.setBtnState = function () {
        //对派牌前坐下状态的玩家使用，派牌后按钮灰掉不能使用
        var roomInfo = App.tableManager.getRoomInfo();
        var clients = App.tableManager.getClients() || {};
        var roomState = roomInfo.state;

        if (clients[this._userId]) {
            if (roomState >= Game.Room.STATE_START) {
                this.kickBtn.disabled = true;
                this.standBtn.disabled = true;
            }
            else {
                this.kickBtn.disabled = false;
                this.standBtn.disabled = false;
            }
        }
    };

    PlayerInfoDialog.prototype.transformTalkState = function() {
        if (App.tableManager.checkForbiddenByUserId(this._userId)) {
            // 禁言
            this.banned.skin = "assets/ui.button/btn_yellow.png";
            this.stateTitle.skin = "assets/ui.playerInfo/img_RelieveGag.png";
            //this.stateTitle.x -= 38;
            this.guestBannedTalk = true;
        }
        else
        {
            // 没禁言
            this.banned.skin = "assets/ui.button/btn_bule.png";
            this.stateTitle.skin = "assets/ui.playerInfo/img_gag.png";
            //this.stateTitle.x += 38;
            this.guestBannedTalk = false;
        }

    };

    PlayerInfoDialog.prototype.onClosed = function() {
        //console.log("PlayerInfoDialog on closed...");
        this.unregEvent();
    };

    return PlayerInfoDialog;
}(PlayerInfoDailogUI));