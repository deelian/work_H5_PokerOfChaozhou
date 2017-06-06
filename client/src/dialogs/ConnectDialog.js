/**
 * 断线重连提示界面
 */
var ConnectDialog = (function(_super) {
    function ConnectDialog() {
        ConnectDialog.super(this);

        this.init();
    }

    Laya.class(ConnectDialog, "ConnectDialog", _super);

    ConnectDialog.prototype.setText = function (text) {
        text = text || "";
        this.message.text = text;
    };

    ConnectDialog.prototype.init = function() {

    };

    return ConnectDialog;
}(ConnectDialogUI));