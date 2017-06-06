var LoadingAniDialog = (function(_super) {
    function LoadingAniDialog() {
        LoadingAniDialog.super(this);

        this.size(1136, 640);

        this.anim       = App.animManager.get("loadingAni");
        this.anim.x     = this.width / 2;
        this.anim.y     = this.height/ 2;
        this.anim.pivot(32, 32);
    }

    Laya.class(LoadingAniDialog, "LoadingAniDialog", _super);

    var __proto = LoadingAniDialog.prototype;

    __proto.start = function() {
        Laya.timer.once(3000, this, this.play);
    };

    __proto.play = function() {
        this.popup();
        this.anim.play();
        this.addChild(this.anim);
    };

    __proto.stop = function() {
        this.anim.stop();
        this.removeChild(this.anim);
        this.close();
        Laya.timer.clear(this, this.play);
    };

    return LoadingAniDialog;
}(Laya.Dialog));