/**
 * 游戏房间界面
 */
var GameRoomView = (function(_super) {
    function GameRoomView(roomData) {
        GameRoomView.super(this);
        //console.log(JSON.stringify(roomData.table));
        this._roomId                = roomData.id;
        this._roomType              = roomData.type;
        this._roomTable             = roomData.table;
        this._roomMember            = roomData.members;

        this._playerBoxs            = []; //*玩家信息显示的位置
        this._userPosInTable        = []; //*玩家在桌子上的位置

        this._isReady               = false; //*是否准备了，用于准备按钮的切换
        this.init();
    }

    Laya.class(GameRoomView, "GameRoomView", _super);

    //*有人退出
    GameRoomView.prototype.playerExit = function () {

    };

    //*有玩家加入
    GameRoomView.prototype.joinPlayer = function (playerInfo) {
        var pos     = playerInfo.pos; //*位置
        var userId  = playerInfo.userID;
        if (pos < 0) {
            //*站起的状态
            return;
        }

        //*加入新玩家
        var selfID = App.player.getId();
        var selfPos = this._roomMember.indexOf(selfID);
        var posDiff = pos - selfPos;
        if (posDiff < 0) {
            posDiff = posDiff + 8;
        }
        var playerSelfIcon = new RoomPlayerBox(playerInfo);
        playerSelfIcon.y -= 70;
        playerSelfIcon.x -= 70;
        this._playerBoxs[posDiff].addChild(playerSelfIcon);
        this._userPosInTable[posDiff] = userId;

        App.tableManager.addPlayerBox(userId, playerSelfIcon);
    };

    //*开始下注
    GameRoomView.prototype.pokerBid = function () {
        //*显示下注选项

    };

    //*显示鬼牌
    GameRoomView.prototype.showGhostPoker = function () {
        this._showGhostList[this._ghostIndex].visible = true;
        this._ghostIndex++;
        if (this._ghostIndex >= this._showGhostList.length) {
            //*通知可以给每个人做发牌的表现
            App.tableManager.dealPlayerPokerAction();
        }
    };

    //*飞出来的鬼牌动作
    GameRoomView.prototype.ghostPokersAction = function (ghostPoker) {
        ghostPoker = ghostPoker || {};
        var index;
        var pokerInfo;
        this._ghostList     = [];
        this._showGhostList = [];
        this._ghostIndex    = 0;
        for (index in ghostPoker) {
            pokerInfo = ghostPoker[index];

            var poker = new Poker(pokerInfo);
            poker.scaleX = 0.5;
            poker.scaleY = 0.5;
            poker.x = this.deckNode.x + 100 * Number(index);
            this.playersBox.addChild(poker);
            this._ghostList.push(poker);

            var showPoker = new Poker(pokerInfo);
            showPoker.scaleX = 0.3;
            showPoker.scaleY = 0.3;
            showPoker.x += 80 * Number(index);
            showPoker.visible = false;
            this.ghostBox.addChild(showPoker);
            this._showGhostList.push(showPoker);
        }

        //*fly
        for (var i = 0; i < this._ghostList.length; i++) {
            var ghost       = this._ghostList[i];
            var moveTo      = MoveTo.create(0.5, this.ghostBox.x, this.ghostBox.y);
            var scaleTo     = ScaleTo.create(0.5, 0, 0);
            var spawn       = Spawn.create(moveTo, scaleTo);
            var self        = this;
            var callBack    = CallFunc.create(Laya.Handler.create(this, function () {
                    this.showGhostPoker();
            }));
            var seq         = Sequence.create(spawn, callBack);
            App.actionManager.addAction(seq, ghost);
        }
    };

    //*房间中游戏开始
    GameRoomView.prototype.gameStart = function () {
        //*隐藏准备按钮的显示
        this.startBox.visible = false;
        //*start animation

        //*请求翻鬼牌了
        App.tableManager.ghostPokersMove();
    };

    //*设置准备按钮的状态
    GameRoomView.prototype.setReadyBtnState = function () {
        var readyText = "准备";
        if (this._isReady) {
            readyText = "取消准备";
        }
        this.readyLab.text = readyText;
    };

    GameRoomView.prototype.touchReadyBtn = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
            else {
                self._isReady = !self._isReady;
                self.setReadyBtnState();
            }
        };

        var ready = !this._isReady;

        //*点击准备
        App.netManager.send(
            "room.handler.command",
            {
                fn: "ready",
                data: ready
            },
            Laya.Handler.create(null, complete)
        );
    };

    GameRoomView.prototype.touchRuleBtn = function () {
        //*玩法说明界面打开
        var ruleView = new RuleDialog();
        App.uiManager.addUiLayer(ruleView);
    };

    GameRoomView.prototype.updateViewShow = function () {
        this.roomIdLab.text = this._roomId;
    };

    //*初始化房间玩家头像信息
    GameRoomView.prototype.initPlayerInfoIconShow = function () {
        //*获取位置
        var playersBox = this.playersBox;
        for (var i = 0; i < GameRoomView.PLAYER_COUNT; i++) {
            var playerSprite = playersBox.getChildByName("player_" + i);
            this._playerBoxs.push(playerSprite);
        }

        //*显示房间头像
        var roomMember      = this._roomMember;
        var selfId          = App.player.id;
        var selfPos         = this._roomMember.indexOf(selfId);
        for (var index = 0; index < 8; index++) {
            var sitId = selfPos + index;
            if (sitId >= 8) {
                sitId = sitId - 8;
            }
            var userID = roomMember[sitId];
            if (userID >= 0) {
                var info = {
                    pos: roomMember.indexOf(userID),
                    userID: userID
                };
                var playerSelfIcon = new RoomPlayerBox(info);
                playerSelfIcon.y -= 70;
                playerSelfIcon.x -= 70;
                this._playerBoxs[index].addChild(playerSelfIcon);
                this._userPosInTable[index] = userID;

                App.tableManager.addPlayerBox(userID, playerSelfIcon);
            }
        }
    };

    GameRoomView.prototype.initEvent = function () {
        this.closeBtn.on(Laya.Event.CLICK, this, this.dispose);

        this.readyBtn.on(Laya.Event.CLICK, this, this.touchReadyBtn);

        App.tableManager.on(RoomTableMgr.EVENT.GAME_START, this, this.gameStart);
        App.tableManager.on(RoomTableMgr.EVENT.GHOST_POKER, this, this.ghostPokersAction);
        App.tableManager.on(RoomTableMgr.EVENT.BID, this, this.pokerBid);
    };

    GameRoomView.prototype.init = function() {
        this.initEvent();
        this.initPlayerInfoIconShow();
        this.updateViewShow();
    };

    GameRoomView.prototype.getTableIndexByUserId = function (userId) {
        if (this._userPosInTable.indexOf(userId) != -1) {
            var index = this._userPosInTable.indexOf(userId);
            return this._playerBoxs[index];
        }
    };

    GameRoomView.prototype.getDeckNode = function () {
        return this.deckNode;
    };

    GameRoomView.prototype.getPlayersBox = function () {
        return this.playersBox;
    };

    GameRoomView.prototype.dispose = function () {
        //var self = this;
        //var complete = function (err, data) {
        //    if (err) {
        //        return;
        //    }
        //
        //    console.log(data);
            App.tableManager.clearGameRoom();
            App.uiManager.removeGameRoomView();
        //};
        //*退出房间
        //App.netManager.send(
        //    "room.handler.command",
        //    {
        //        fn: "leave",
        //        data: App.player.getId()
        //    },
        //    Laya.Handler.create(null, complete)
        //);
    };

    GameRoomView.PLAYER_COUNT = 10;

    return GameRoomView;
}(GameRoomViewUI));