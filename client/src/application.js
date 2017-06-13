/**
 *  单例模式
 */
var Application = (function (_super) {
    // var Game = ;

    function Application() {
    }

    Application.init = function() {
        // private members
        this._runningView        = null;
        this._code               = URLUtils.getParam('code');

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

        this.uiLayer = new Laya.Sprite();
        this.uiLayer.zOrder = 2;
        Laya.stage.addChild(this.uiLayer);
        
        // Views
        this.lobbyView = null; //*大厅界面
        this.loaderView = null;//*加载界面
        this.loginView = null; //*登录界面

        this.reConnectTimes = 0; //*断线自动重连的次数

        Laya.stage.on(Laya.Event.VISIBILITY_CHANGE, this, this.visibilityChanged);

        this.state = Application.STATE_INITED;
        console.log('application inited...');
    };

    Application.preload = function() {
        var self = this;
        this.state = Application.STATE_PRELOADING;
        this.runView(this.loaderView);

        async.series([
            function (callback) {
                // if (App.config.env != "ios") {
                //     callback(null);
                // }

                var complete = function(review) {
                    App.config.review = review && review.version || "";

                    callback(null);
                };

                // 加载审核文件
                Laya.loader.load(                               // Laya.LoadManager.load - 加载资源
                    "review/review.json",                       // url:* — 单个资源地址，或者资源地址数组(简单数组：["a.png","b.png"]，复杂数组[{url:"a.png",type:Loader.IMAGE,size:100,priority:1},{url:"b.json",type:Loader.JSON,size:50,priority:1}])。
                    Laya.Handler.create(null, complete),        // complete:Handler (default = null) — 结束回调，如果加载失败，则返回 null 。
                    null,                                       // progress:Handler (default = null) — 进度回调，回调参数为当前文件加载的进度信息(0-1)。
                    null,                                       // type:String (default = null) — 资源类型。比如：Loader.IMAGE
                    1,                                          // priority:int (default = 1) — 优先级，0-4，5个优先级，0优先级最高，默认为1。
                    false,                                      // cache:Boolean (default = true) — 是否缓存加载结果。
                    null,                                       // group:String (default = null) — 分组，方便对资源进行管理。
                    true                                        // ignoreCache:Boolean (default = false) — 是否忽略缓存，强制重新加载
                );
            }

        ], function(err, results) {
            if (err != null) {
                return;
            }

            console.log("assets loaded...");
            self.state = Application.STATE_PRELOADED;
            //* 创建登录界面
            self.loginView = new LoginView();
        });
    };

    Application.launch = function(complete) {
        var self = this;

        var host = App.config.host;
        var port = App.config.port;
        // 弹出连接界面
        var netDlg = new ConnectDialog();
        this.uiManager.addUiLayer(netDlg, {isAddShield:true,alpha:0.5,isDispose:false});

        async.series([
            // 连接网关服务器
            function(callback) {
                netDlg.setText("正在初始化网络......");

                self.netManager.connect(host, port, function(err) {
                    if (err != null) {
                        netDlg.setText("网络初始化失败！");
                        callback(err);
                        return;
                    }
                    netDlg.setText("初始化成功!");
                    callback(null);
                });
            },

            // 请求游戏服务器地址
            function(callback) {
                var complete = function(err, data) {
                    if (err != null) {
                        netDlg.setText("服务器地址获取失败!");
                        callback(err);
                        return;
                    }

                    host = data.host;
                    port = data.port;

                    self.netManager.disconnect();

                    netDlg.setText("服务器地址获取成功!");
                    callback();
                };

                netDlg.setText("正在获取服务器地址......");
                self.netManager.send(
                    "gate.handler.getEntry",
                    {},
                    Laya.Handler.create(null, complete)
                );
            },

            // 连接游戏服务器
            function(callback) {
                netDlg.setText("正在连接游戏服务器......");
                self.netManager.connect(host, port, function(err) {
                    if (err != null) {
                        netDlg.setText("服务器连接失败！");
                        callback(err);
                        return;
                    }

                    netDlg.setText("服务器连接成功！");
                    callback(null);
                });
            },

            // 建立服务器连接
            function(callback) {
                var complete = function(err, data) {
                    if (err != null) {
                        netDlg.setText("服务器登入失败！");
                        callback(err);
                        return;
                    }

                    netDlg.setText("服务器登入成功！");
                    callback(null);
                };

                netDlg.setText("正在登入游戏服务器......");
                self.netManager.send(
                    "connector.handler.entry",
                    {},
                    Laya.Handler.create(null, complete)
                )
            },

            // 获取授权
            function(callback) {
                var complete = function(err, data) {
                    if (err != null) {
                        netDlg.setText("授权失败！");

                        if (authType == "token") {
                            self.storageManager.removeToken()
                        }
                        callback(err);
                        return;
                    }

                    var player = data.player;
                    var token  = data.token;

                    self.storageManager.setToken(token);

                    netDlg.setText("授权成功!");
                    callback(null);
                    console.log("account authed...");
                };

                var authType = "";

                var route;
                var params;
                // 微信授权码认证
                if (self._code != null) {
                    route = "auth.handler.verify";
                    params = {
                        code: self._code
                    };

                    authType = "code";
                    // 只能使用一次
                    delete App._code;
                }
                // 本地令牌认证
                // 已经完成一次微信认证后重连或者再次打开游戏的时候自动使用
                else if (self.storageManager.getToken()) {
                    route = "auth.handler.refresh";
                    params = {
                        token: self.storageManager.getToken()
                    };

                    authType = "token";
                }
                // 游客方式认证
                // 游客方式不会发放令牌
                else {
                    route = "auth.handler.guest";

                    authType = "guest";
                }

                netDlg.setText("正在获取授权...");
                self.netManager.send(
                    route,
                    params,
                    Laya.Handler.create(null, complete)
                )
            },

            // 进入大厅
            function(callback) {
                var complete = function(err, data) {
                    if (err != null) {
                        netDlg.setText("进入大厅失败！");
                        callback(err);
                        return;
                    }

                    self.player = new Game.Player(data.player);
                    self.roomID = data.roomID;

                    netDlg.setText("进入成功!");
                    callback(null);

                    console.log("account entered...");
                };

                netDlg.setText("正在进入大厅...");
                self.netManager.send(
                    "lobby.handler.enter",
                    {},
                    Laya.Handler.create(null, complete)
                )
            }
        ], function(err) {
            var delay = (err == null) ? 1000 : 1500;

            Laya.timer.once(delay, null, function() {
                netDlg.close();
                complete && complete(err);
            });

        });
    };

    Application.wxAuthResp = function(code) {
        this._code = code;
        this.login();
    };

    // 点击【微信登录】后调用
    Application.wxAuthorize = function() {
        // Natvive
        if (window.conch) {
            var os = window.conch.config.getOS();

            if (os == "Conch-ios") {

                var AppDelegate = Laya.PlatformClass.createClass("AppDelegate");
                AppDelegate.call("sendAuthRequest:", this.config.state);

            } else if (os == "Conch-android") {

                var MainActivity = Laya.PlatformClass.createClass("cn.glfun.deju_poker.main.MainActivity");
                MainActivity.call("sendAuthRequest", this.config.state);

            } else {
                alert("Unknown os version")
            }
        }
        // 微信内
        else if (Laya.Browser.onWeiXin) {
            window.location = "http://api.glfun.cn/wx/authorize?state=" + this.config.state;
        }
        // 普通网站
        else {
            window.location = "http://api.glfun.cn/wx/qrconnect?state=" + this.config.state;
        }
    };

    Application.getOrderId = function(product, callback) {
        App.netManager.send(
            "lobby.handler.get_orderid",
            {
                productID: product.id,
                env: App.config.env
            },
            Laya.Handler.create(null, callback)
        );
    };

    Application.queryOrder = function(callback) {
        var self = this;
        var complete = function(err, data) {
            if (err  != null) {
                callback(err);
                return;
            }

            data.forEach(function (order) {
                // 可以考虑增加弹窗提示
                // {"orderId":"c09d3537-4342-455b-9e6b-c5f42fa7d931","productName":"3颗钻石","tokens":3}
                console.log(JSON.stringify(order));
                self.lobbyView.addBalance(order.tokens);
            });

            callback(null);
        };

        App.netManager.send(
            "lobby.handler.query_order",
            {
            },
            Laya.Handler.create(null, complete)
        );
    };

    Application.iOSPurchase = function(product) {
        var self = this;

        var dlg = new ConnectDialog();
        var orderId = "";

        dlg.popup();
        async.series([
            // 申请订单号
            function (callback) {

                dlg.setText("正在获取交易订单号......");
                self.getOrderId(product, function(err, data) {
                    if (err != null) {
                        dlg.setText("获取订单号失败！系统当前繁忙，请稍后再试...");
                        callback(err);
                        return;
                    }

                    dlg.setText("订单号获取成功！");
                    orderId = data;
                    callback(null);
                });
            },
            
            // 拉起IAP内购
            function (callback) {
                dlg.setText("交易进行中......");

                var json = {
                    "order_id":     orderId,
                    "amount":       1,
                    "product_id":   product.SKU,
                    "callback_uri": "http://api.glfun.cn/notice/apple"
                };
                conchMarket.recharge(JSON.stringify(json), function(jsonString) {
                    var pJson = JSON.parse(jsonString);

                    // console.log("code:" + pJson.code);
                    // console.log("product_id:" + pJson.product_id);
                    // console.log("amount:" + pJson.amount);
                    // console.log("order_id:" + pJson.order_id);
                    // console.log("desc:" + pJson.desc);

                    if (pJson.code != 0) {
                        dlg.setText("交易失败！错误代码：" + pJson.code);
                        callback(pJson.code);
                        return;
                    }

                    dlg.setText("交易成功！");
                    callback(null);
                });
            },
            
            // 查询订单结果
            function (callback) {
                dlg.setText("正在校验订单凭证......");
                self.queryOrder(function(err) {
                    if (err != null) {
                        dlg.setText("订单校验失败，请联系系统管理员！交单号：" + orderId);
                        callback(err);
                        return;
                    }

                    dlg.setText("订单校验成功，交易已完成！");
                    callback(null);
                });
            }
        ], function(err) {
            var delay = (err != null) ? 5000 : 1000;
            Laya.timer.once(delay, null, function () {
                dlg.close();
            });
        });
    };

    Application.wxPurchase = function(product) {
        var dlg = new MessageDialog({
            msg: "请关注微信公众号或联系推广员！"
        });

        dlg.popup();
    };

    Application.h5Purchase = function(product) {
        var dlg = new MessageDialog({
            msg: "请关注微信公众号或联系推广员！"
        });

        dlg.popup();
        // var self = this;
        // var dlg = new ConnectDialog();
        //
        // dlg.popup();
        // dlg.setText("正在获取交易订单号......");
        // this.getOrderId(product, function(err, data) {
        //     if (err != null) {
        //         dlg.setText("获取订单号失败！系统当前繁忙，请稍后再试...");
        //     } else {
        //         dlg.setText("订单号获取成功！" + data);
        //     }
        //
        //     Laya.timer.once(1000, null, function () {
        //         dlg.close();
        //     });
        // });
    };

    Application.purchase = function(productId) {
        var product = this.assetsManager.getProduct(productId);
        if (product == null) {
            return;
        }
        
        switch (App.config.env) {
            case "ios":
                this.iOSPurchase(product);
                break;
            case "android":
                this.wxPurchase(product);
                break;
            case "h5":
                this.h5Purchase(product);
                break;
            case "wp8":
            default:
                break;
        }
    };

    // 审核中(用于屏蔽某些敏感信息应付审核：AppStore...)
    Application.reviewing = function() {
        if (App.config.env == 'ios') {
            var localVersion = window.conch.config.getAppLocalVersion();

            // iOS的审核版本
            if (App.config.review == localVersion) {
                return true;
            }
        }

        return false;
    };

    Application.login = function() {
        var self = this;

        this.state = Application.STATE_AUTHORIZING;
        Laya.timer.once(300, null, function() {
            self.state = Application.STATE_AUTHORIZED;
        })
    };

    Application.enter = function() {
        var self = this;

        this.loginView.block();
        self.state = Application.STATE_ENTERING;
        this.launch(function(err) {
            if (err != null) {
                self.loginView.unblock();
                return;
            }

            self.state = Application.STATE_ENTERED;
        });
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

            function (callback) {
                self.loaderView.setText("正在加载音乐音效......");
                var soundResource = self.soundManager.getPreload();
                var onComplete = function () {
                    callback(null);
                };
                var onProgress = function (e) {
                    self.loaderView.changeValue(e);
                };

                Laya.loader.load(soundResource, Laya.Handler.create(null, onComplete), Laya.Handler.create(null, onProgress, null, false));
            },

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

            function(callback) {
                self.loaderView.setText("正在初始化音乐音效......");
                self.soundManager.init(function() {
                    callback(null);
                });
            },

            function(callback) {
                self.loaderView.setText("正在初始化动画......");
                self.animManager.init(function() {
                    callback(null);
                });
            }
        ], function(err, results) {
            self.state = Application.STATE_PREPARED;
            //*大厅界面创建
            self.lobbyView = new LobbyView();
            self.lobbyView.init();
        });
    };

    Application.getRoomId = function () {
        return this.roomID;
    };

    Application.enterRoom = function(roomID, callback) {
        var self = this;
        var code = Game.Code.ROOM;
        App.netManager.send(
            "room.handler.enter",
            {
                roomID: roomID
            },
            Laya.Handler.create(null, function(err, data) {
                callback && callback();
                if (err != null) {
                    var errCode = err.err;
                    switch (errCode) {
                        case code.NOT_EXIST:{
                            self.uiManager.showMessage({msg:"房间不存在，请确认你的房间号！"});
                            break;
                        }
                        case code.IS_LOCKED: {
                            self.uiManager.showMessage({msg:"房间号已开始游戏！"});
                            break;
                        }
                        case code.IS_FULL: {
                            self.uiManager.showMessage({msg:"房间人数已满！"});
                            break;
                        }
                        default: {
                            self.uiManager.showMessage({msg:"房间不可进入！"});
                            break;
                        }
                    }
                }
                else {
                    self.tableManager.setRoomInfo(data);
                    self.uiManager.runGameRoomView(data);
                }
            })
        );
    };

    Application.removeRoomTableMgr = function () {
        if (this.tableManager) {
            this.tableManager = null;
            this.tableManager = new RoomTableMgr();
        }
    };

    Application.removeRoomID = function () {
        this.roomID = null;
    };

    Application.runLoginView = function () {
        this.runView(this.loginView);
        this.state = Application.STATE_RUNNING_LOGIN;
    };

    Application.checkIsInRoom = function () {
        this.state = Application.STATE_RUNNING;
        this.loginView.unblock();
        if (this.roomID) {
            //*有房间的，就先进入房间，先显示房间，之后在添加大厅
            this.enterRoom(this.roomID);
        }
        else {
            //*没有房间就直接显示大厅
            this.runLobbyView();
        }
    };

    Application.runLobbyView = function() {
        this.runView(this.lobbyView);
        this.soundManager.playMusic("music");
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

    //*断线重连成功，恢复各种状态,游戏正常继续
    Application.reconnectSuccess = function () {
        //*自动重连次数累计清零
        this.reConnectTimes = 0;

        if (this.roomID) {
            this.enterRoom(this.roomID);
        }
        else {
            var gameRoom = App.uiManager.getGameRoom();
            if (gameRoom) {
                gameRoom.dispose();
                this.tableManager.quitRoom();
            }
        }
    };

    Application.runReconnectDlg = function() {
        var self = this;
        var confirm = function() {
            console.log("app-reconnect: started...");
            self.reConnectTimes ++;
            self.state = Application.STATE_RECONNECTING;
            self.launch(function(err) {
                self._dlgReconnect.close();
                self._dlgReconnect = null;
                if (err != null) {
                    console.log("app-reconnect error: ", err);
                    self.state = Application.STATE_SOCKET_CLOSED;
                    return;
                }

                console.log("app-reconnect: successed...");
                self.state = Application.STATE_RECONNECTED;
            })
        };

        if (self._dlgReconnect == null) {
            var msg = "网络已经断开！点击确定尝试重新连接网络......";
            self._dlgReconnect = new MessageDialog({msg:msg, cb:confirm});
        }

        console.log("App state changed " + self.state + " -> " + Application.STATE_RUNNING_RECONNECT);

        self.state = Application.STATE_RUNNING_RECONNECT;

        //*自动重连3次，3次之后就手动
        if (this.reConnectTimes >= Application.RECONNECT_TIMES) {
            self._dlgReconnect.popup(true);
        }
        else {
            confirm();
        }
    };

    Application.socketClosed = function() {
        // 正在确认重连状态
        if (this.state == Application.STATE_RUNNING_RECONNECT) {
            return;
        }

        // 不是运行阶段
        if (this.state != Application.STATE_RUNNING) {
            return;
        }

        console.log("App state changed " + this.state + " -> " + Application.STATE_SOCKET_CLOSED);
        this.state = Application.STATE_SOCKET_CLOSED;
    };

    Application.visibilityChanged = function() {
        if (Laya.stage.isVisibility) {
            console.log("前台显示......");
        }  else {
            console.log("后台显示......");
        }
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
        var self = this;
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
                //*验证结束，进入游戏大厅
                this.enter();
                break;
            case Application.STATE_ENTERING:
                break;
            case Application.STATE_ENTERED:
                //进入资源加载
                this.prepare();
                break;
            case Application.STATE_PREPAREING:
                break;
            case Application.STATE_PREPARED:
                //加载完毕进入游戏大厅
                this.checkIsInRoom();
                break;
            case Application.STATE_RUNNING:
                running = true;
                break;
            case Application.STATE_RUNNING_LOGIN:
                break;
            case Application.STATE_RUNNING_RECONNECT:
                break;
            case Application.STATE_SOCKET_CLOSED:
                App.runReconnectDlg();
                break;
            case Application.STATE_NETERROR:
                this.state = Application.STATE_RECONNECTING;

                App.launch(function(err){
                    if (err != null)  {
                        return;
                    }
                    self.state = Application.STATE_RECONNECTED;
                });
                break;
            case Application.STATE_RECONNECTING:
                break;
            case Application.STATE_RECONNECTED:
                this.reconnectSuccess();
                this.state = Application.STATE_RUNNING;
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
    Application.STATE_ENTERING         = 7;
    Application.STATE_ENTERED          = 8;
    Application.STATE_PREPAREING       = 9;
    Application.STATE_PREPARED         = 10;
    Application.STATE_RECONNECTING     = 11;
    Application.STATE_RECONNECTED      = 12;

    Application.STATE_NETERROR         = 50;

    Application.STATE_SOCKET_CLOSED    = 97;
    Application.STATE_RUNNING_RECONNECT= 98;
    Application.STATE_RUNNING_LOGIN    = 99;
    Application.STATE_RUNNING          = 100;

    Application.Event                  = {};

    Application.RECONNECT_TIMES        = 3;
    return Application;
}());