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
        this.netManager          = this["config"]["singleAlone"] ? new SingleAlone() : new NetManager();
        this.uiManager           = new UIManager();
        this.animManager         = new AnimationManager();
        this.soundManager        = new SoundAndMusicMgr();

        // Controllers
        this.game = null;

        // Modules
        this.player = null;

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

        var resources = this.assetsManager.getPreload();
        async.series([
            function (callback) {
                self.loaderView.setText("正在初始化网络......");
                self.netManager.init(function() {
                    callback(null);
                });
            },

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
            console.log("assets loaded...");

            self.state = Application.STATE_PRELOADED;

            //* 创建登录界面
            self.loginView = new LoginView();
            //*大厅界面创建
            self.lobbyView = new LobbyView();
        });
    };

    Application.connectServer = function() {
        this.state = Application.STATE_CONNECTED;

        //var self = this;
        //
        //self.state = Application.STATE_CONNECTING;
        //self.loaderView.setText("连接游戏服务器...");
        //
        //var onConnected = function() {
        //    self.loaderView.setText("连接成功!");
        //    self.state = Application.STATE_CONNECTED;
        //    console.log("game server connected...");
        //};
        //
        //var onError = function() {
        //    console.log("error");
        //};
        //
        //self.netManager.connectServer();
        //self.netManager.once(SocketIO.CONNECTED, null, onConnected);
        //self.netManager.once(SocketIO.ERROR, null, onError);
    };

    Application.accountAuth = function() {
        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                Laya.timer.once(1000, self, self.accountAuth);
                return;
            }
            self.state = Application.STATE_AUTHORIZED;
            self.loaderView.setText("授权成功!");

            console.log("account authed...", data);
        };

        self.loaderView.setText("正在获取授权...");
        this.state = Application.STATE_AUTHORIZING;

        this.netManager.accountAuth(Laya.Handler.create(null, onComplete));
    };

    Application.accountSync = function() {
        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                Laya.timer.once(1000, self, self.accountSync);
                return;
            }

            self.player = new Game.Player(data.player);

            self.state = Application.STATE_SYNCHRONIZED;
            self.loaderView.setText("同步成功!");

            console.log("account synced...", data);
        };

        self.loaderView.setText("正在同步账号...");
        this.state = Application.STATE_SYNCHRONIZING;

        this.netManager.accountSync(Laya.Handler.create(null, onComplete));
    };

    Application.enter = function() {
        var self = this;
        var onComplete = function(err, data) {
            if (err != null) {
                Laya.timer.once(1000, self, self.enter);
                return;
            }
            self.state = Application.STATE_ENTERED;
            self.loaderView.setText("进入成功!");

            console.log("account entered...", JSON.stringify(data));

            self.lobbyView.init();
        };

        self.loaderView.setText("正在进入游戏...");
        this.state = Application.STATE_ENTERING;

        var api = "/user/enter";
        var params = {};
        this.netManager.request(api, params, Laya.Handler.create(null, onComplete));
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
                this.connectServer();
                break;
            case Application.STATE_CONNECTING:
                break;
            case Application.STATE_CONNECTED:
                this.accountAuth();
                break;
            case Application.STATE_AUTHORIZING:
                break;
            case Application.STATE_AUTHORIZED:
                this.accountSync();
                break;
            case Application.STATE_SYNCHRONIZING:
                break;
            case Application.STATE_SYNCHRONIZED:
                //*进入登录界面
                this.runLoginView();
                break;
            case Application.STATE_WITEING_LOGIN:
                break;
            case Application.STATE_ENTERING:
                break;
            case Application.STATE_ENTERED:
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
    Application.STATE_CONNECTING       = 5;
    Application.STATE_CONNECTED        = 6;
    Application.STATE_AUTHORIZING      = 7;
    Application.STATE_AUTHORIZED       = 8;
    Application.STATE_SYNCHRONIZING    = 9;
    Application.STATE_SYNCHRONIZED     = 10;
    Application.STATE_WITEING_LOGIN    = 11;
    Application.STATE_ENTERING         = 12;
    Application.STATE_ENTERED          = 13;

    Application.STATE_RUNNING          = 100;


    Application.Event                  = {};

    return Application;
}());