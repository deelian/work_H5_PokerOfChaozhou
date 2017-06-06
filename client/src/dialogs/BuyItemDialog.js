/**
 * 购买房卡界面
 */
var BuyItemDialog = (function(_super) {
    function BuyItemDialog() {
        BuyItemDialog.super(this);

        this.buyBtn.on(Laya.Event.CLICK, this, this.onBuyUserTokens);

        this.init();
    }

    Laya.class(BuyItemDialog, "BuyItemDialog", _super);

    BuyItemDialogUI.prototype.buyTokensSuccess = function (data) {
        var tokens = data || 0;
        this.event(LobbyView.Event.UPDATE_BALANCE, [tokens]);
        App.uiManager.showMessage({msg:"购买成功！"});
    };

    BuyItemDialog.prototype.onBuyUserTokens = function () {
        var self = this;
        var complete = function (err, data) {
            if (err) {
                return;
            }

            self.buyTokensSuccess(data);
        };
        //*退出房间
        App.netManager.send(
            "lobby.handler.buy_user_tokens",
            {},
            Laya.Handler.create(null, complete)
        );
    };


    BuyItemDialog.prototype.init = function() {
        this.wechatLab.text = Game.Game.WECHAT_NUMBER;
    };

    BuyItemDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return BuyItemDialog;
}(BuyItemDialogUI));
