/**
 * 消息弹出界面
 */
var MessageDialog = (function(_super) {
    function MessageDialog() {
        MessageDialog.super(this);

        this.init();
    }

    Laya.class(MessageDialog, "MessageDialog", _super);

    MessageDialog.prototype.init = function() {

    };

    return MessageDialog;
}(MessageDialogUI));