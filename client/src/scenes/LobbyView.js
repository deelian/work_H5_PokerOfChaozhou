/**
 * 大厅界面
 */
var LobbyView = (function(_super) {
    function LobbyView() {
        LobbyView.super(this);

        this._bulletins = [];
        this._labList = [];

        this.headIcon.width = 82;
        this.headIcon.height = 82;

        this.nameLab.text = App.player.name || "";
        this.headIcon.skin = App.player.avatar || "";
        console.log(App.player);

        this.balance = App.player.tokens || 0;
        this.balanceLab.text = this.balance + "";

        this.init();
    }

    Laya.class(LobbyView, "LobbyView", _super);

    LobbyView.prototype.getPlayerTokens = function () {
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
    };

    LobbyView.prototype.setBalance = function (tokens) {
        tokens = tokens || 0;
        this.balance = tokens;
        this.balanceLab.text = this.balance + "";
    };

    LobbyView.prototype.addBalance = function (tokens) {
        tokens = tokens || 0;
        this.balance += tokens;
        this.balanceLab.text = this.balance + "";
    };

    LobbyView.prototype.checkSelfIsInRoom = function () {
        var skin = LobbyView.BTN_SKIN.CREATE;
        var roomId = App.getRoomId();

        if (roomId) {
            skin = LobbyView.BTN_SKIN.BACK;
        }

        this.createRoomBtn.skin = skin;
    };

    //*更新界面显示
    LobbyView.prototype.updateView = function () {
        this.checkSelfIsInRoom();
        this.getPlayerTokens();
    };

    LobbyView.prototype.touchNews = function () {
        App.soundManager.playSound("btnSound");
        var newsPanel = new NewsDialog();
        App.uiManager.addUiLayer(newsPanel);
    };

    LobbyView.prototype.touchEffort = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
            else {
                App.soundManager.playSound("btnSound");
                var effortView = new LobbyEffortDialog(data);
                App.uiManager.addUiLayer(effortView);
            }
        };
        App.netManager.send(
            "lobby.handler.get_logs",
            {
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    LobbyView.prototype.touchExplain = function () {
        App.soundManager.playSound("btnSound");
        var explainView = new ExplainDialog();
        App.uiManager.addUiLayer(explainView);
    };

    //*share
    LobbyView.prototype.touchShare = function () {
        App.soundManager.playSound("btnSound");
        var shareView = new ShareDialog();
        App.uiManager.addUiLayer(shareView);
    };

    //*setting
    LobbyView.prototype.touchSetting = function () {
        App.soundManager.playSound("btnSound");
        var settingView = new SettingDialog();
        App.uiManager.addUiLayer(settingView);
    };

    //*购买饭卡
    LobbyView.prototype.touchAddRoomCard = function () {
        App.soundManager.playSound("btnSound");
        var roomCarView = new BuyItemDialog();
        roomCarView.on(LobbyView.Event.UPDATE_BALANCE, this, this.setBalance);
        App.uiManager.addUiLayer(roomCarView);
    };

    LobbyView.prototype.touchHead = function () {
        App.soundManager.playSound("btnSound");

        var opts = {
            userID: App.player.id,
            isHost: false
        };
        App.uiManager.showPlayerDlg(opts);
    };

    LobbyView.prototype.onEnterRoom = function () {
        App.soundManager.playSound("btnSound");
        if (App.getRoomId()) {
            //*在房间就进入房间
            App.enterRoom(App.getRoomId());
        }
        else {
            //*输入房间号
            var inputRoomNumberDialog = new InputRoomNumberDialog();
            App.uiManager.addUiLayer(inputRoomNumberDialog);
        }
    };

    LobbyView.prototype.onCreateRoom = function () {
        App.soundManager.playSound("btnSound");
        var roomId = App.getRoomId();
        if (roomId) {
            //*在房间就进入房间
            App.enterRoom(roomId);
        }
        else {
            //*选择游戏模式以及设置
            var selectModeDialog = new SelectModeDialog();
            App.uiManager.addUiLayer(selectModeDialog,{isAddShield:true,alpha:0.5,isDispose:false});
        }
    };

    LobbyView.prototype.updateMove = function (labInfo) {
        labInfo = labInfo || {};
        var initialX = labInfo.initialX || 416;
        var widthCount = labInfo.widthCount || 416;
        var lab = this; //*因为这个定时器是lab调用的，所以这个的this指的是lab
        var targetPos = - widthCount + (initialX - 416);
        if (lab.x <= targetPos) {
            lab.x = initialX;
        }
        else {
            lab.x -= 1.5;
        }
    };

    LobbyView.prototype.showBulletins = function (data) {
        this._bulletins = data || [];

        var showTextList = [];
        for (var bulletinsIndex = 0; bulletinsIndex < this._bulletins.length; bulletinsIndex ++) {
            var info = this._bulletins[bulletinsIndex];
            if (info.type == 1) {
                showTextList.push(info);
            }
        }

        var length = showTextList.length;
        this._widthCount = 0;
        if (length > 0) {
            this.bulletinShow.visible = true;
            var lastWidth = 0;
            for (var i = 0; i < length; i ++) {
                var lab = new Laya.Label();
                lab.text = this._bulletins[i].content;
                lab.color = "#ffffff";
                lab.fontSize = 20;
                lab.x = this.bulletinNode.width + lastWidth + 20 * i;
                lab.y = 8;
                this.bulletinNode.addChild(lab);
                lastWidth += lab.width;
                this._widthCount += lastWidth + 20 * i;
                this._labList.push(lab);
            }
            if (this._widthCount < this.bulletinNode.width) {
                this._widthCount = this.bulletinNode.width;
            }

            for (var index in this._labList) {
                var showLab = this._labList[index];
                Laya.timer.frameLoop(1, showLab, this.updateMove, [{initialX: showLab.x, widthCount: this._widthCount}]);
            }
        }
        else {
            this.bulletinShow.visible = false;
        }
    };

    //*获取公告
    LobbyView.prototype.getBulletins = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {
                //*错误提示
            }
            else {
                self.showBulletins(data);
            }
        };
        App.netManager.send(
            "lobby.handler.get_bulletins",
            {
                fn: "",
                data: {}
            },
            Laya.Handler.create(null, complete)
        );
    };

    LobbyView.prototype.updateShow = function () {
        var reviewing = App.reviewing();
        if (reviewing) {
            //*不显示
            this.wechatLab.visible = false;
        }
        this.phoneLab.visible = false;

        var notify = Game.Game.NOTICE_TEXT;
        var wechat = Game.Game.WECHAT_NUMBER;
        var phone = Game.Game.PHONE_NUMBER;
        this.notifyLab.text = notify;
        this.wechatLab.text = "公众微信:" + wechat;
        this.phoneLab.text = "联系电话:" + phone;
    };

    LobbyView.prototype.removed = function () {
        Laya.timer.clearAll(this);
    };

    LobbyView.prototype.initEvent = function () {
        var btnAndEvent = [
            {"btn": this.createRoomBtn, "func": this.onCreateRoom},//*创建房间按钮
            {"btn": this.enterRoomBtn, "func": this.onEnterRoom},//*加入房间按钮
            {"btn": this.headIconTouch, "func": this.touchHead},//*头像
            {"btn": this.addBalanceBtn, "func": this.touchAddRoomCard},//*购买房卡
            {"btn": this.settingsBtn, "func": this.touchSetting},//*设置
            {"btn": this.shareBtn, "func": this.touchShare},//*分享
            {"btn": this.explanBtn, "func": this.touchExplain},//*玩法说明
            {"btn": this.effortBtn, "func": this.touchEffort},//*战绩
            {"btn": this.newBtn, "func": this.touchNews},//*消息
        ];

        var btn;
        for (var i = 0; i < btnAndEvent.length; i ++) {
            btn = btnAndEvent[i]["btn"];
            var func = btnAndEvent[i]["func"];
            btn.on(Laya.Event.CLICK, this, func);
        }

        //App.tableManager.on(RoomTableMgr.EVENT.CLOSE_ROOM, this, this.updateView);

        this.on(Laya.Event.REMOVED, this, this.removed);
    };

    LobbyView.prototype.init = function() {
        this.initEvent();
        this.getPlayerTokens();
        this.updateShow();
        this.checkSelfIsInRoom();
        this.getBulletins();
        App.soundManager.playMusic("lobbyMusic");
    };

    LobbyView.BTN_SKIN = {
        CREATE: "assets/ui.main/btn_02.png",
        BACK: "assets/ui.main/btn_04.png"
    };

    LobbyView.Event = {
        UPDATE_BALANCE: "UPDATE_BALANCE"
    };

    return LobbyView;
}(LobbyViewUI));
