/**
 * 房间号输入界面
 */
var InputRoomNumberDialog = (function(_super) {
    function InputRoomNumberDialog() {
        InputRoomNumberDialog.super(this);

        this._roomNumber = "";
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

        this.roomNumLab.text = this._roomNumber;

        if (this._roomNumber.length >= 6) {
            this.enterRoom();
        }
    };

    InputRoomNumberDialog.prototype.inputRoomNumber = function (num) {
        if (this._roomNumber.length >= 6) {
            return;
        }

        this.setRoomNumberLab(num);
    };

    InputRoomNumberDialog.prototype.deleteLastNum = function () {
        //*删除最后一个输入的数字
        this._roomNumber = this._roomNumber.substring(0,this._roomNumber.length-1);
        this.setRoomNumberLab();
    };

    InputRoomNumberDialog.prototype.resetRoomNumLab = function () {
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
        this.roomNumLab.text = "";
        this.initEvent();
    };

    InputRoomNumberDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };


    return InputRoomNumberDialog;
}(InputRoomNumDialogUI));
