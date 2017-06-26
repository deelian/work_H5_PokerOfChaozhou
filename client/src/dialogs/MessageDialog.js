/**
 * 消息弹出界面
 */
var MessageDialog = (function(_super) {
    function MessageDialog(messageInfo) {
        MessageDialog.super(this);

        this.cb = null;
        this.sureBtn.on(Laya.Event.CLICK,this,this.onSure);
        this.cancelBtn.on(Laya.Event.CLICK,this,this.onCancel);

        this.init(messageInfo);
    }

    Laya.class(MessageDialog, "MessageDialog", _super);

    MessageDialog.prototype.init = function(messageInfo) {
        this.massageLab.text = messageInfo.msg || "";
        this.cb = messageInfo.cb;
        this.canCancel = messageInfo.canCancel ? true: false;

        if (this.canCancel) {
            this.cancelBtn.visible = true;
        }
        else {
            this.cancelBtn.visible = false;
            this.sureBtn.x = this.massageLab.x;
        }
    };

    MessageDialog.prototype.onCancel = function () {
        //_super.prototype.close.call(this);
        this.close();
    };

    MessageDialog.prototype.onSure = function(){
        //_super.prototype.close.call(this);
        this.close();
        if(this.cb)
        {
            this.cb();
        }
    };

    return MessageDialog;
}(MessageDialogUI));