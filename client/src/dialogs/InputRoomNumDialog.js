/**
 * 房间号输入界面
 */
var InputRoomNumberDialog = (function(_super) {
    function InputRoomNumberDialog() {
        InputRoomNumberDialog.super(this);

        this._roomNumber = "";
        this._roomNumberLabList = [];
        this.init();
    }

    Laya.class(InputRoomNumberDialog, "InputRoomNumberDialog", _super);

    InputRoomNumberDialog.prototype.enterRoom = function () {
        var self = this;
        var roomID = this._roomNumber;
        App.enterRoom(roomID, function() {
            self.close();
        });
    };

    InputRoomNumberDialog.prototype.setRoomNumberLab = function (str) {
        if (typeof (str) == "number") {
            this._roomNumber += str;
        }
        else if (str == "") {
            this._roomNumber = "";
        }

        for (var j = 0; j < 6; j ++) {
            this._roomNumberLabList[j].text = "";
        }

        if (this._roomNumber.length > 6) {
            return;
        }

        if (this._roomNumber.length <= 0) {
            for (var index = 0; index < 6; index ++) {
                this._roomNumberLabList[index].text = "";
            }
            return;
        }

        var temp = 0;
        for (var i in this._roomNumber) {
            if (this._roomNumber[i]) {
                this._roomNumberLabList[temp].text = this._roomNumber[i];
            }
            temp ++;
        }

        if (temp >= 6) {
            this.touchYes();
        }
    };

    InputRoomNumberDialog.prototype.touchYes = function () {
        this.enterRoom();
    };

    InputRoomNumberDialog.prototype.inputRoomNumber = function (num) {
        if (this._roomNumber.length >= 6) {
            return;
        }
        App.soundManager.playSound("btnSound");
        this.setRoomNumberLab(num);
    };

    InputRoomNumberDialog.prototype.deleteLastNum = function () {
        App.soundManager.playSound("btnSound");
        //*删除最后一个输入的数字
        this._roomNumber = this._roomNumber.substring(0,this._roomNumber.length-1);
        this.setRoomNumberLab();
    };

    InputRoomNumberDialog.prototype.resetRoomNumLab = function () {
        App.soundManager.playSound("btnSound");
        //*重新输入
        this.setRoomNumberLab("");
    };

    InputRoomNumberDialog.prototype.initEvent = function () {
        for (var i = 0; i < 10; i++) {
            var btn = this.keyBoardBox.getChildByName("num_" + i);
            btn.on(Laya.Event.CLICK, this, this.inputRoomNumber, [i]);
        }

        this.deleteBtn.on(Laya.Event.CLICK, this, this.deleteLastNum);
        this.reInputBtn.on(Laya.Event.CLICK, this, this.resetRoomNumLab);
    };

    InputRoomNumberDialog.prototype.init = function() {

        for (var i = 0; i < 6; i++) {
            var roomNumLab = this.numBox.getChildByName("roomNum_" + i);
            this._roomNumberLabList.push(roomNumLab);
        }

        this.initEvent();
    };

    InputRoomNumberDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };


    return InputRoomNumberDialog;
}(InputRoomNumDialogUI));
