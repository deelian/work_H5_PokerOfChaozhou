/**
 * 总战绩Item
 */
var LobbyEffortItemBox = (function(_super) {
    function LobbyEffortItemBox() {
        LobbyEffortItemBox.super(this);
        this._iconList = [];

        this.touchBox.on(Laya.Event.CLICK, this, this.touchRound);
    }

    Laya.class(LobbyEffortItemBox, "LobbyEffortItemBox", _super);

    LobbyEffortItemBox.prototype.touchRound = function () {
        App.soundManager.playSound("btnSound");
        var roomEffortDialog = new RoomEffortDialog(this._data);
        App.uiManager.addUiLayer(roomEffortDialog);
    };

    LobbyEffortItemBox.prototype.onRender = function(data){
        this._data = data;

        //*房间号
        var roomId = this._data.roomID;
        this.roomIdLab.text = roomId;

        var roundData = this._data.data;

        //*模式
        var roomInfo = roundData.info;
        var roomType = roomInfo.type;
        this.modeType.skin = LobbyEffortItemBox.ROOM_TYPE_SKIN[roomType];

        for (var iconIndex in this._iconList) {
            this._iconList[iconIndex].dispose();
        }

        var playerNum = 0;
        var roundInfo = roundData.users;
        for (var index in roundInfo) {
            var playerGold = roundInfo[index].total;
            var name = roundInfo[index].name || "游客";
            var avatar = roundInfo[index].avatar || "";
            var info = {
                id: index,
                gold: playerGold,
                name: name,
                avatar: avatar
            };
            var isBanker = false;
            var icon = new LobbyEffortPlayerIconBox(info,isBanker);
            icon.x = playerNum * 88;
            this.playerBox.addChild(icon);
            this._iconList.push(icon);
            playerNum ++;
        }

        var updatedAt = this._data.updatedAt;
        var moment = Game.moment(updatedAt);
        var day = moment.format("YYYY-MM-DD");
        this.dayLab.text = day;
        var clock = moment.format("HH:mm:ss");
        this.clockLab.text = clock;
    };

    LobbyEffortItemBox.renderHandler = function(cell, index) {
        cell.onRender(cell.dataSource,index);
    };

    LobbyEffortItemBox.ROOM_TYPE_SKIN = [
        "assets/ui.button/img_changzhuang.png",
        "assets/ui.button/img_jingdian.png",
        "assets/ui.button/img_hunzhan.png",
        "assets/ui.button/img_dingzhi.png"
    ];

    return LobbyEffortItemBox;
}(LobbyEffortItemBoxUI));
