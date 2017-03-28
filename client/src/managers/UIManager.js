var UILAYERORDER = 50;          //UI层       
var UIManager = (function(_super) {
    function UIManager() {
        this.gameRoomView = null;
        UIManager.super(this);
    }

    Laya.class(UIManager, "UIManager", _super);

    UIManager.prototype.init = function(callback) {
        this._uiLayers = [];      //记录创建在UI层的节点
        callback && callback();
    };

    UIManager.prototype.runGameRoomView = function () {
        //*创建和显示游戏房间界面
        if (this.gameRoomView) {
            this.gameRoomView.visible = true;
        }
        else {
            this.gameRoomView = new GameRoomView();
            App.sceneLayer.addChild(this.gameRoomView);
        }
    };

    UIManager.prototype.removeGameRoomView = function () {
        //*删除游戏房间界面，在解散房间的时候
        App.sceneLayer.removeChild(this.gameRoomView);
        this.gameRoomView = null;
    };

    UIManager.prototype.gameRoomViewEnable = function () {
        //*已经创建或者加入房间之后点返回到大厅时候，隐藏游戏房间界面
        this.gameRoomView.visible = false;
    };

    UIManager.prototype.showMessage = function(msg) {
        var boxMessage = new MessageDialog(msg);

        var onBackOut = function() {
            Laya.stage.removeChild(boxMessage);
            boxMessage.destroy();
        };
        var onBackIn = function() {
            Laya.Tween.to(
                boxMessage,
                {x: Laya.stage.width + boxMessage.width},
                300,
                Laya.Ease["backOut"],
                Laya.Handler.create(null, onBackOut),
                1000,
                false
            );
        };

        Laya.Tween.from(
            boxMessage,
            {x: 0},
            500,
            Laya.Ease["backIn"],
            Laya.Handler.create(null, onBackIn)
        );
        Laya.stage.addChild(boxMessage);
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

    //让界面添加颜色屏蔽层(Dialog)
    UIManager.prototype.addShieldLayerDialog = function(layer,alpha,isDispose){
        isDispose = isDispose || false;
        alpha = alpha || 0.3;
        //屏蔽层
        var shieldLayer = new Laya.Sprite();
        shieldLayer.alpha = alpha;
        shieldLayer.graphics.drawRect(0, 0, Laya.stage.width, Laya.stage.height, "#000000");
        layer.addChild(shieldLayer);
        var layerPos = layer.localToGlobal(Point.p(0,0));
        shieldLayer.x = -layerPos.x;
        shieldLayer.y = -layerPos.y;

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

    UIManager.prototype.addUiLayer = function(layer,addShieldObj){
        layer.zOrder = UILAYERORDER;
        this._uiLayers.push(layer);

        var alpha = 0;
        var isDispose = false;

        if(layer.show){
            //Dialog
            layer.show();
            Laya.stage.addChild(layer);

            if(addShieldObj){
                if(addShieldObj.isAddShield !== undefined){
                    alpha = addShieldObj.alpha;
                    isDispose = addShieldObj.isDispose;
                    this.addShieldLayerDialog(layer,alpha,isDispose);
                }
                else{
                    this.addShieldLayerDialog(layer);
                }
            }
        }
        else{
            //View
            Laya.stage.addChild(layer);

            if(addShieldObj){
                if(addShieldObj.isAddShield !== undefined){
                    alpha = addShieldObj.alpha;
                    isDispose = addShieldObj.isDispose;
                    this.addShieldLayerView(layer,alpha,isDispose)
                }
                else{
                    this.addShieldLayerView(layer)
                }
            }
        }
    };

    return UIManager;
}(laya.events.EventDispatcher));