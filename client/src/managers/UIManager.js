
var UIManager = (function(_super) {
    function UIManager() {
        UIManager.super(this);

        this.gameRoomView           = null;
        this.dialogs                = [];      //记录创建在UI层的节点
        this.garbage                = [];

        this._lobbyEffortPanel      = null;
        this._lobbyEffortPage       = 0;
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
            App.tableManager.setRoomInfo(data);
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

        if (this.gameRoomView == null) {
            return;
        }

        //*删除游戏房间界面，在解散房间的时候
        App.sceneLayer.removeChild(this.gameRoomView);

        this.gameRoomView.destroy(true);
        this.gameRoomView = null;
    };

    UIManager.prototype.getGameRoom = function () {
        return this.gameRoomView;
    };

    UIManager.prototype.showMessage = function(msgInfo) {
        this.addUiLayer(MessageDialog, msgInfo, false, null, true);
    };

    UIManager.prototype.showPlayerDlg = function(opts) {
        var self = this;
        opts = opts || {};
        var complete = function(err, user) {
            if (err) {
                return;
            }

            opts.user = user;

            self.addUiLayer(PlayerInfoDialog, opts);
        };

        App.netManager.send(
            "lobby.handler.get_user",
            {
                id: opts.userID
            },
            Laya.Handler.create(null, complete)
        );
    };

    UIManager.prototype.removeViewHandler = function (opt) {
        //*关闭菊花
        App.netManager.stopWaiting();
    };

    //让界面添加颜色屏蔽层(Dialog)
    UIManager.prototype.addShieldLayerDialog = function(layer, alpha, isDispose) {
        isDispose = isDispose || true;
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

        if (isDispose) {
            var dispose = function() {
                layer.close();
            };
            shieldLayer.on(Laya.Event.CLICK, null, dispose);
        }

        return shieldLayer;
    };

    UIManager.prototype.removeUiLayer = function(layer) {

        var index = this.dialogs.indexOf(layer);
        if (index == -1) {
            return;
        }
        this.dialogs.splice(index, 1);
        this.garbage.push(layer);

        if (!(layer instanceof Laya.Dialog)) {
            App.uiLayer.removeChild(layer);
        }
    };

    UIManager.prototype.addUiLayer = function(constructor, opts, closeOnSide, isShow, closeOther){
        var layer = new constructor(opts);

        layer.closeHandler = Laya.Handler.create(this, this.removeUiLayer, [layer]);

        if (!(layer instanceof Laya.Dialog)) {
            App.uiLayer.addChild(layer);
        } else {
            if (isShow)
            {
                layer.show(closeOther);
            }
            else
            {
                layer.popup(closeOther);
            }
        }

        if (closeOnSide !== false) {
            this.addShieldLayerDialog(layer);
        }

        this.dialogs.push(layer);

        return layer;
    };

    UIManager.prototype.update = function () {
        while (this.garbage.length) {
            var dialog = this.garbage.pop();
            dialog.destroy(true);
        }
    };

    UIManager.prototype.updateLobbyEffort = function () {
        var self = this;
        var page = self._lobbyEffortPage;
        var complete = function (err, data) {
            if (!err) {
                self.showLobbyEffortPanel(data);
            }
        };
        App.netManager.send(
            "lobby.handler.get_logs",
            {
                page: page
            },
            Laya.Handler.create(null, complete)
        );
    };

    UIManager.prototype.showLobbyEffortPanel = function (data) {
        if (this._lobbyEffortPanel) {
            if (data instanceof Array && data.length > 0) {
                this._lobbyEffortPanel.updateShowItems(data);
                this._lobbyEffortPage ++;
            }
        }
        else {
            this._lobbyEffortPanel = this.addUiLayer(LobbyEffortDialog,data);
            this._lobbyEffortPanel.on(Laya.Event.REMOVED, this, this.removedLobbyEffortPanel);
            this._lobbyEffortPage ++;
        }
    };

    UIManager.prototype.removedLobbyEffortPanel = function () {
        this._lobbyEffortPanel.off(Laya.Event.REMOVED, this, this.removedLobbyEffortPanel);
        this._lobbyEffortPanel = null;
        this._lobbyEffortPage = 0;
    };

    return UIManager;
}(laya.events.EventDispatcher));