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

    };

    ShareDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return ShareDialog;
}(ShareDialogUI));

