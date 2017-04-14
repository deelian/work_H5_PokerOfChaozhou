/**
 * 游戏房间界面
 */
var GameRoomView = (function(_super) {
    function GameRoomView(roomData) {
        GameRoomView.super(this);
        console.log(JSON.stringify(roomData.table));
        this._roomId                = roomData.id;
        this._roomType              = roomData.type;
        this._roomTable             = roomData.table;
        this._roomMember            = roomData.members;

        this._playersShowSprites    = []; //*玩家信息显示的位置
        this._roomPlayers           = []; //*房间中的玩家

        this.init();
    }

    Laya.class(GameRoomView, "GameRoomView", _super);

    //*模拟发牌表现
    GameRoomView.prototype.dealPokers = function () {
        //*创建牌堆
        var deck = App.tableManager.createDeck();
        deck.x = this.deckNode.x;
        deck.y = this.deckNode.y;
        this.playersBox.addChild(deck);
        //*要飞多少次
        var flyTime = this._roomMember.length;

        //*按照人数和位置发牌
        //this._playersShowSprites[index].dealMove();
    };

    //*有人退出
    GameRoomView.prototype.playerExit = function () {

    };

    //*有玩家加入
    GameRoomView.prototype.joinPlayer = function (playerInfo) {
        var pos = playerInfo.pos; //*位置

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
        playerSelfIcon.y -= 80;
        this._playersShowSprites[posDiff].addChild(playerSelfIcon);
    };

    GameRoomView.prototype.touchReadyBtn = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {

            }
        };
        //*点击准备
        App.netManager.send(
            "room.handler.command",
            {
                fn: "ready",
                data: true
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
            this._playersShowSprites.push(playerSprite);
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
                playerSelfIcon.y -= 80;
                this._playersShowSprites[index].addChild(playerSelfIcon);
            }
        }
    };

    GameRoomView.prototype.initEvent = function () {
        this.closeBtn.on(Laya.Event.CLICK, this, this.dispose);

        this.ruleBtn.on(Laya.Event.CLICK, this, this.touchRuleBtn);
        this.readyBtn.on(Laya.Event.CLICK, this, this.touchReadyBtn);


        //*测试用
        //*发牌
        //this.dealPokerBtn.on(Laya.Event.CLICK, this, this.dealPokers);
    };

    GameRoomView.prototype.init = function() {
        this.initEvent();
        this.initPlayerInfoIconShow();
        this.updateViewShow();
    };

    GameRoomView.prototype.dispose = function () {
        //var self = this;
        //var complete = function (err, data) {
        //    if (err) {
        //        return;
        //    }
        //
        //    console.log(data);
            App.uiManager.removeGameRoomView();
        //};
        ////*点击准备
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