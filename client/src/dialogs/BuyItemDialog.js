/**
 * 购买房卡界面
 */
var BuyItemDialog = (function(_super) {
    function BuyItemDialog() {
        BuyItemDialog.super(this);

        this._productID = 10001;

        this.initEvent();
        this.init();
    }

    Laya.class(BuyItemDialog, "BuyItemDialog", _super);

    BuyItemDialogUI.prototype.buyTokensSuccess = function (data) {
        var tokens = data || 0;
        this.event(LobbyView.Event.UPDATE_BALANCE, [tokens]);
        App.uiManager.showMessage({msg:"购买成功！"});
    };

    BuyItemDialog.prototype.onBuyUserTokens = function () {
        //var productID = this._productID || 10001;

        //App.purchase(productID);

         var self = this;
         var complete = function (err, data) {
             if (err) {
                 return;
             }

             self.buyTokensSuccess(data);
         };

         var productID = this._productID || 10001;
         //*退出房间
         App.netManager.send(
             "lobby.handler.buy_user_tokens",
             {
                 productID: productID
             },
             Laya.Handler.create(null, complete)
         );
    };

    BuyItemDialog.prototype.updateDescShow = function () {
        var productInfo = Game.Game.DIAMOND_TYPE[this._productID];
        var price = productInfo["price"];
        var diamonds = productInfo["diamonds"];
        this.productDesc.text = "购买获得" + diamonds + "颗钻石";
        this.productPrice.text = price + "元";
    };

    BuyItemDialog.prototype.touchItem = function (item) {
        this._productID = item.productID || 10001;

        this.itemLight.x = item.x;
        this.itemLight.y = item.y;

        this.updateDescShow();
    };

    BuyItemDialog.prototype.initEvent = function () {
        this.buyBtn.on(Laya.Event.CLICK, this, this.onBuyUserTokens);

        var diamondType = Game.Game.DIAMOND_TYPE;
        for (var typeIndex in diamondType) {
            var productInfo = diamondType[typeIndex];
            var productID = productInfo["id"];
            var price = productInfo["price"];
            var diamonds = productInfo["diamonds"];

            var item = this.getChildByName("item_" + productID);
            var productDesc = item.getChildByName("diamondText");
            var productPrice = item.getChildByName("priceText");

            productDesc.text = "钻石" + diamonds + "颗";
            productPrice.text = price + "元";

            item.productID = productID;

            item.on(Laya.Event.CLICK, this, this.touchItem, [item]);
        }
    };

    BuyItemDialog.prototype.init = function() {
        this.wechatLab.text = Game.Game.WECHAT_NUMBER;

        var item = this.getChildByName("item_10001");
        this.touchItem(item);

        var reviewing = App.reviewing();
        if (reviewing) {
            this.gameInfoLabBox.visible = false;
        }
    };

    BuyItemDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    return BuyItemDialog;
}(BuyItemDialogUI));
