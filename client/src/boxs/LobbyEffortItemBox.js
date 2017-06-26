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
        var self = this;
        var id = this._id;
        var complete = function (err, data) {
            if (!err) {
                App.uiManager.addUiLayer(RoomEffortDialog, data);
            }
        };
        App.netManager.send(
            "lobby.handler.get_record",
            {
                id: id
            },
            Laya.Handler.create(null, complete)
        );
    };

    LobbyEffortItemBox.prototype.onRender = function(data){
        this._data = data;

        this._id = this._data.id || 0;
        this._info = this._data.info || {};
        this._users = this._data.users || {};

        //*房间号
        this.roomIdLab.text = this._info.id;

        //*模式
        var roomType = this._info.type;
        this.modeType.skin = LobbyEffortItemBox.ROOM_TYPE_SKIN[roomType];

        //*局数
        var times = this._info.times;
        var maxRound = this._info.maxRound || Math.ceil(times/10) * 10;
        this.roundLab.text = times + "/" + maxRound + "局";

        //*时间
        var updatedAt = this._info.createTime;
        var moment = Game.moment(updatedAt);
        var day = moment.format("YYYY-MM-DD");
        this.dayLab.text = day;
        var clock = moment.format("HH:mm:ss");
        this.clockLab.text = clock;

        for (var iconIndex in this._iconList) {
            if (this._iconList[iconIndex]) {
                this._iconList[iconIndex].dispose();
            }
        }

        var playerNum = 0;
        for (var index in this._users) {
            var playerGold = this._users[index].total;
            var name = this._users[index].name || "游客";
            var avatar = this._users[index].avatar || "";
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
