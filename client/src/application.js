/**
 *  单例模式
 */
var Application = (function (_super) {
    // var Game = ;

    function Application() {
    }

    Application.init = function() {
        // private members
        this._runningView = null;

        // Managers
        this.actionManager       = new ActionManager();
        this.assetsManager       = new AssetsManager();
        this.storageManager      = new StorageManager();
        this.netManager          = new NetManager();
        this.uiManager           = new UIManager();
        this.animManager         = new AnimationManager();
        this.soundManager        = new SoundAndMusicMgr();
        this.tableManager        = new RoomTableMgr();

        // Controllers
        this.game = null;

        // Modules
        this.player = null;
        this.roomID = null;

        // Layers
        this.sceneLayer = new Laya.Sprite();
        this.sceneLayer.zOrder = 1;
        Laya.stage.addChild(this.sceneLayer);

        // Views
        this.lobbyView = null; //*大厅界面
        this.loaderView = null;//*加载界面
        this.loginView = null; //*登录界面

        this.state = Application.STATE_INITED;
        console.log('application inited...');
    };

    Application.preload = function() {
        var self = this;
        this.state = Application.STATE_PRELOADING;
        this.runView(this.loaderView);

        async.series([
            function (callback) {
                self.loaderView.setText("正在初始化网络......");
                self.netManager.init(function() {
                    callback(null);
                });
            },

        ], function(err, results) {
            console.log("assets loaded...");
            self.state = Application.STATE_PRELOADED;
            //* 创建登录界面
            self.loginView = new LoginView();
        });
    };

    Application.login = function() {
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                self.loaderView.setText("请检查网络设置......");
                return;
            }
            
            self.state = Application.STATE_AUTHORIZED;
            self.loaderView.setText("授权成功!");
            console.log("account authed...");
        };

        self.loaderView.setText("正在获取授权...");
        this.state = Application.STATE_AUTHORIZING;
        this.netManager.send(
            "auth.handler.verify",
            {
                udid: this.storageManager.getDeviceId()
            },
            Laya.Handler.create(null, complete)
        )
    };

    Application.prepare = function() {
        var self = this;
        var resources = this.assetsManager.getPreload();

        this.state = Application.STATE_PREPAREING;
        this.runView(this.loaderView);
        async.series([
            function (callback) {
                self.loaderView.setText("正在加载图片......");

                var onComplete = function () {
                    callback(null);
                };
                var onProgress = function (e) {
                    self.loaderView.changeValue(e);
                };

                Laya.loader.load(resources.images, Laya.Handler.create(null, onComplete), Laya.Handler.create(null, onProgress, null, false));
            },

            //function (callback) {
            //    self.loaderView.setText("正在加载音乐音效......");
            //    var onComplete = function () {
            //        callback(null);
            //    };
            //    var onProgress = function (e) {
            //        self.loaderView.changeValue(e);
            //    };
            //
            //    Laya.loader.load(resources.sounds, Laya.Handler.create(null, onComplete), Laya.Handler.create(null, onProgress, null, false));
            //},

            //function(callback) {
            //    self.loaderView.setText("正在加载字体......");
            //
            //    var onComplete = function () {
            //        callback(null);
            //    };
            //    var onProgress = function (e) {
            //        self.loaderView.changeValue(e);
            //    };
            //
            //    Laya.loader.load(resources.fonts, Laya.Handler.create(null, onComplete), Laya.Handler.create(null, onProgress, null, false));
            //},

            //function(callback) {
            //    self.loaderView.setText("正在加载光效资源......");
            //
            //    var effectFactory = new SpineFactory("effect", self.assetsManager.getEffectsRes());
            //    var onComplete = function() {
            //        effectFactory.off(SpineFactory.Event.PROGRESS, null, onProgress);
            //        callback(null);
            //    };
            //    var onProgress = function(e) {
            //        self.loaderView.changeValue(e);
            //    };
            //
            //    effectFactory.on(SpineFactory.Event.PROGRESS, null, onProgress);
            //    effectFactory.once(SpineFactory.Event.INITED, null, onComplete);
            //    effectFactory.init();
            //
            //    self.assetsManager.effectFactory = effectFactory;
            //},

            function(callback) {
                self.loaderView.setText("正在初始化资源......");
                self.assetsManager.init(function() {
                    callback(null);
                });
            },

            function(callback) {
                self.loaderView.setText("正在初始化界面......");
                self.uiManager.init(function() {
                    callback(null);
                });
            },

            //function(callback) {
            //    self.loaderView.setText("正在初始化动画......");
            //    self.animManager.init(function() {
            //        callback(null);
            //    });
            //}
        ], function(err, results) {
            self.state = Application.STATE_PREPARED;
            //*大厅界面创建
            self.lobbyView = new LobbyView();
        });
    };

    Application.enter = function() {
        var self = this;
        var complete = function(err, data) {
            if (err != null) {
                self.loaderView.setText("进入失败...");
                return;
            }

            self.state = Application.STATE_ENTERED;
            self.player = new Game.Player(data.player);
            self.roomID = data.roomID;

            self.loaderView.setText("进入成功!");

            self.lobbyView.init();

            console.log("account entered...", self.roomID, self.player);
        };

        self.loaderView.setText("正在进入游戏...");
        this.state = Application.STATE_ENTERING;
        this.netManager.send(
            "lobby.handler.enter",
            {},
            Laya.Handler.create(null, complete)
        )
    };

    Application.getRoomId = function () {
        //this.roomID = 313307;
        return this.roomID;
    };

    Application.enterRoom = function(roomID, callback) {
        var self = this;

        App.netManager.send(
            "room.handler.enter",
            {
                roomID: roomID
            },
            Laya.Handler.create(null, function(err, data) {
                callback && callback();

                if (err != null) {
                    return;
                }

                self.uiManager.runGameRoomView(data);
            })
        );
    };

    Application.runLoginView = function () {
        this.runView(this.loginView);
        this.state = Application.STATE_WITEING_LOGIN;
    };

    Application.runLobbyView = function() {
        this.runView(this.lobbyView);
        this.state = Application.STATE_RUNNING;
    };

    Application.getRunView = function() {
        return this._runningView;
    };

    Application.runView = function(view) {
        if (this._runningView) {
            this.sceneLayer.removeChild(this._runningView);
        }

        this._runningView = view;
        this.sceneLayer.addChild(this._runningView);
    };

    Application.start = function() {
        // 创建加载场景
        this.loaderView = new LoaderView();
        Laya.timer.frameLoop(1, this, this.loop);

        this.state = Application.STATE_STARTED;
        console.log('application started...');
    };

    Application.stop = function() {

    };

    Application.loop = function() {
        var running = false;
        var dt = Laya.timer.delta;

        switch (this.state) {
            case Application.STATE_STARTED:
                this.preload();
                break;
            case Application.STATE_PRELOADING:
                break;
            case Application.STATE_PRELOADED:
                //进入登录界面
                this.runLoginView();
                break;
            case Application.STATE_AUTHORIZING:
                break;
            case Application.STATE_AUTHORIZED:
                //进入资源加载界面
                this.prepare();
                break;
            case Application.STATE_PREPAREING:
                break;
            case Application.STATE_PREPARED:
                //进入游戏大厅
                this.enter();
                break;
            case Application.STATE_ENTERING:
                break;
            case Application.STATE_ENTERED:
                //加载完毕进入游戏大厅
                this.runLobbyView();
                break;
            case Application.STATE_RUNNING:
                running = true;
                break;
        }

        if (!running) {
            return;
        }

        this._runningView.update && this._runningView.update(dt);
    };

    Application.STATE_INITED           = 1;
    Application.STATE_STARTED          = 2;
    Application.STATE_PRELOADING       = 3;
    Application.STATE_PRELOADED        = 4;
    Application.STATE_AUTHORIZING      = 5;
    Application.STATE_AUTHORIZED       = 6;
    Application.STATE_PREPAREING       = 7;
    Application.STATE_PREPARED         = 8;
    Application.STATE_ENTERING         = 9;
    Application.STATE_ENTERED          = 10;

    Application.STATE_RUNNING          = 100;

    Application.Event                  = {};

    return Application;
}());