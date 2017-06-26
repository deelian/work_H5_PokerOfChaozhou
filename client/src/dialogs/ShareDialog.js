/**
 * 分享界面
 */
var ShareDialog = (function(_super) {
    function ShareDialog() {
        ShareDialog.super(this);

        this.init();
    }

    Laya.class(ShareDialog, "ShareDialog", _super);

    ShareDialog.prototype.init = function() {
        this.shareWithFriend.on(Laya.Event.MOUSE_DOWN, this, this.sendWXMessage, [false]);
        this.shareWithAllFriend.on(Laya.Event.MOUSE_DOWN, this, this.sendWXMessage, [true]);
    };

    ShareDialog.prototype.sendWXMessage = function (toTimeline) {
        var address = "http://www.glfun.cn";
        var title = "橄榄欢乐木虱";
        var description = "微信分享展示内容缩略描述以及示范效果，如果有更多的内容请点击链接查看详情！如果内容超出的话，看到的显示效果就是现在这个样子的，仔细分辨一下！";

        App.wxSendLinkMessage(address, title, description, !!toTimeline);
    };

    //ShareDialog.prototype.onClose = function() {
    //    //_super.prototype.close.call(this);
    //    App.uiManager.removeUiLayer(this);
    //};

    return ShareDialog;
}(ShareDialogUI));

