var UI_LAYER_ORDER = 50;          //UI层
var UIManager = (function(_super) {
    function UIManager() {
        this.gameRoomView = null;
        this._uiLayers = [];      //记录创建在UI层的节点
        UIManager.super(this);
    }

    Laya.class(UIManager, "UIManager", _super);

    UIManager.prototype.init = function(callback) {
        callback && callback();
    };

    UIManager.prototype.runGameRoomView = function (data) {
        App.soundManager.playSound("enterRoomSound");
        //*创建和显示游戏房间界面
        if (this.gameRoomView) {
            //*刷新房间的界面
            App.tableManager.reconnectRestore(data);
        }
        else {
            this.gameRoomView = new GameRoomView(data);
            App.sceneLayer.addChild(this.gameRoomView);
        }
    };

    UIManager.prototype.removeGameRoomView = function () {
        if (App.getRunView() != App.lobbyView) {
            App.runLobbyView();
        }

        //*删除游戏房间界面，在解散房间的时候
        App.sceneLayer.removeChild(this.gameRoomView);
        this.gameRoomView = null;
    };

    UIManager.prototype.getGameRoom = function () {
        return this.gameRoomView;
    };

    UIManager.prototype.showMessage = function(msgInfo) {
        var boxMessage = new MessageDialog(msgInfo);
        boxMessage.popup(true);
    };

    UIManager.prototype.showPlayerDlg = function(opts) {
        var self = this;
        opts = opts || {};
        var complete = function(err, user) {
            if (err) {
                return;
            }

            opts.user = user;

            var dlg = new PlayerInfoDialog(opts);
            self.addUiLayer(dlg);
        };

        App.netManager.send(
            "lobby.handler.get_user",
            {
                id: opts.userID
            },
            Laya.Handler.create(null, complete)
        );
    };

    UIManager.prototype.removeUiLayer = function(layer){
        var index = this._uiLayers.indexOf(layer);
        if(index == -1){
            return;
        }
        this._uiLayers.splice(index, 1);
        if(layer.dispose){
            layer.dispose();
        }
    };

    UIManager.prototype.removeViewHandler = function (opt) {
        //*关闭菊花
        App.netManager.stopWaiting();
    };

    //让界面添加颜色屏蔽层(Dialog)
    UIManager.prototype.addShieldLayerDialog = function(layer,alpha,isDispose){
        isDispose = isDispose || false;
        alpha = alpha || 0.3;
        //屏蔽层
        var shieldLayer = new Laya.Sprite();
        shieldLayer.alpha = alpha;
        shieldLayer.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        layer.addChild(shieldLayer);
        shieldLayer.x = 0;
        shieldLayer.y = 0;

        var hitArea = new Laya.HitArea();
        hitArea.hit.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        shieldLayer.hitArea = hitArea;
        shieldLayer.mouseEnabled = true;
        shieldLayer.zOrder = -100;

        if(isDispose){
            var dispose = function(){
                layer.close();
            };
            shieldLayer.on(Laya.Event.CLICK, this, dispose);
        }

        return shieldLayer;
    };

    UIManager.prototype.addUiLayer = function(layer, addShieldObj){
        //layer.zOrder = UI_LAYER_ORDER;
        this._uiLayers.push(layer);

        var alpha = 0;
        var isDispose = false;
        addShieldObj = addShieldObj || {isAddShield:true,alpha:0.5,isDispose:true};
        if(layer.show){
            //Dialog
            layer.show();
            if (!(layer instanceof Laya.Dialog)) {
                App.uiLayer.addChild(layer);
            }


            layer.on(Laya.Event.REMOVED, this, this.removeViewHandler);

            if(addShieldObj.isAddShield !== undefined){
                alpha = addShieldObj.alpha || 0;
                isDispose = addShieldObj.isDispose;
                this.addShieldLayerDialog(layer,alpha,isDispose);
            }
            else{
                this.addShieldLayerDialog(layer);
            }
        }
    };

    return UIManager;
}(laya.events.EventDispatcher));