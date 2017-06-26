/**
 * 申请解散房间界面
 */
var DisbandDialog = (function(_super) {
    function DisbandDialog(opts) {
        DisbandDialog.super(this);

        this._firstDisbandUser = opts.userID;
        this._firstDisbandUserName = opts.name;

        //*这两个用于恢复状态时候
        if (opts.disMissInfo) {
            this._dismissConfirmList = opts.disMissInfo.dismissConfirmList;
            this._dismissStamp = opts.disMissInfo.dismissStamp;
        }

        this._coolDownTime = 0;

        this._playerLabList = [];

        this.init();
    }

    Laya.class(DisbandDialog, "DisbandDialog", _super);

    DisbandDialog.prototype.updateInfo = function (opts) {
        this._firstDisbandUser = opts.userID;
        this._firstDisbandUserName = opts.name;

        //*这两个用于恢复状态时候
        if (opts.disMissInfo) {
            this._dismissConfirmList = opts.disMissInfo.dismissConfirmList;
            this._dismissStamp = opts.disMissInfo.dismissStamp;
        }
        this.initCoolDownTime();
    };

    DisbandDialog.prototype.changePanelShow = function (userId, confirm) {
        var selfId = App.player.getId();
        if (selfId == userId && confirm == true) {
            this.yesBtn.visible = false;
            this.closeBtn.visible = false;
            this.waitLab.visible = true;
        }

        if (confirm == true && userId) {
            for (var index in this._playerLabList) {
                if (this._playerLabList[index].userId == userId) {
                    var selectLab = this._playerLabList[index].getChildByName("playerSelect");
                    selectLab.text = "同意";
                    selectLab.color = DisbandDialog.LAB_COLOR.RED;
                    break;
                }
            }
        }

    };

    DisbandDialog.prototype.canDisBand = function (isDisband) {
        isDisband = isDisband ? true : false;
        var complete = function (err, data) {
            if (err) {

            }
        };
        App.netManager.send(
            "room.handler.dismiss_confirm",
            {
                confirm: isDisband
            },
            Laya.Handler.create(null, complete)
        );
    };

    DisbandDialog.prototype.setCoolDownLabText = function () {
        var minute = 0;
        var second = 0;
        minute = Math.floor(this._coolDownTime / 60);
        if (minute < 10) {
            minute = "0" + minute;
        }
        second = this._coolDownTime - minute * 60;
        if (second < 10) {
            second = "0" + second;
        }

        this.timeLab.text = minute + ":" + second;
    };

    DisbandDialog.prototype.updateCoolDown = function () {
        this.syncCoolDown();
        
        if (this._coolDownTime <= 0) {
            Laya.timer.clear(this, this.updateCoolDown);
            this._coolDownTime = 0;
        }

        this.setCoolDownLabText();
    };

    DisbandDialog.prototype.unregEvent = function () {
        this.yesBtn.off(Laya.Event.CLICK, this, this.canDisBand);
        this.closeBtn.off(Laya.Event.CLICK, this, this.canDisBand);
    };

    DisbandDialog.prototype.initEvent = function () {
        this.yesBtn.on(Laya.Event.CLICK, this, this.canDisBand, [true]);
        this.closeBtn.on(Laya.Event.CLICK, this, this.canDisBand, [false]);
        Laya.timer.loop(1000, this, this.updateCoolDown);

        //App.tableManager.on(RoomTableMgr.Event.CLOSE_ROOM, this, this.onClose);
    };

    DisbandDialog.prototype.syncCoolDown = function() {
        if (this._dismissStamp) {
            var nowTime = App.getTime();
            var diff = Math.floor(nowTime) - this._dismissStamp;
            this._coolDownTime = 120 - Math.floor(diff);
        }
        else {
            this._coolDownTime = 120;
        }
    };

    DisbandDialog.prototype.initCoolDownTime = function () {
        this.syncCoolDown();

        if (this._dismissConfirmList) {
            for (var i in this._dismissConfirmList) {
                var userId = i;
                var confirm = this._dismissConfirmList[i];
                if (userId == App.player.getId() && confirm == true) {
                    this.yesBtn.visible = false;
                    this.closeBtn.visible = false;
                    this.waitLab.visible = true;
                }

                for (var boxIndex in this._playerLabList) {
                    var lab = this._playerLabList[boxIndex];
                    if (lab.userId == userId && confirm == true) {
                        var selectLab = lab.getChildByName("playerSelect");
                        selectLab.text = "同意";
                        selectLab.color = DisbandDialog.LAB_COLOR.RED;
                        break;
                    }
                }
            }
        }
    };

    DisbandDialog.prototype.initPanelShow = function () {
        var selfId = App.player.getId();
        var str = this._firstDisbandUserName + "申请解散房间，请问是否同意？（超过2分钟未做选择，则默认同意）";
        this.titleLab.text = str;

        var playerBox = this.playerBox;
        for (var i = 0; i < 10; i ++) {
            var nameLab = playerBox.getChildByName("playerName_" + i);
            nameLab.visible = false;
            this._playerLabList.push(nameLab);
        }

        if (this._firstDisbandUser == selfId) {
            this.yesBtn.visible = false;
            this.closeBtn.visible = false;
            this.waitLab.visible = true;
        }
        else {
            this.yesBtn.visible = true;
            this.closeBtn.visible = true;
            this.waitLab.visible = false;
        }

        var clients = App.tableManager.getRoomMembers();
        var roomLogUsers = App.tableManager.getRoomLogUsers();
        var playerNum = 0;
        for (var index in clients) {
            var userId = clients[index];
            this._playerLabList[playerNum].text = roomLogUsers[userId].name || "游客";
            this._playerLabList[playerNum].getChildByName("playerSelect").text = "等待选择";
            this._playerLabList[playerNum].getChildByName("playerSelect").color = DisbandDialog.LAB_COLOR.GREEN;
            this._playerLabList[playerNum].userId = userId;
            this._playerLabList[playerNum].visible = true;
            playerNum ++;
        }

        this.changePanelShow(this._firstDisbandUser, true);

        this.timeLab.text = "";
    };

    DisbandDialog.prototype.init = function() {
        this.initPanelShow();
        this.initCoolDownTime();
        this.initEvent();
    };

    DisbandDialog.prototype.onClosed = function () {
        Laya.timer.clearAll(this);
        this.unregEvent();
    };

    DisbandDialog.LAB_COLOR = {
        GREEN: "#70f862",
        RED: "#e4a167"
    };

    return DisbandDialog;
}(DisbandDialogUI));