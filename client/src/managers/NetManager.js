
var NetManager = (function(_super) {
    var CODE = DejuPoker.Code;

    function NetManager() {
        NetManager.super(this);

        // 游戏服务器地址
        this.host              = App.config.host;
        this.port              = App.config.port;

        // 游戏服务器连接
        this.socket            = new Pomelo();

        // 服务器唯一标识
        this.uuid              = null;

        // 认证令牌
        this.token             = URLUtils.getParam("token") || null;
    }

    Laya.class(NetManager, "NetManager", _super);

    NetManager.prototype.init = function(callback) {
        var self = this;

        this.socket.init({
            host: this.host,
            port: this.port
        }, function(socket) {
            var complete = function(err, data) {
                self.socket.disconnect();

                if (err != null) {
                    console.log("network connection error");
                    return;
                }

                self.host    = data.host;
                self.port    = data.port;
                self.socket.init({
                    host:    data.host,
                    port:    data.port
                }, function(socket) {
                    self.send(
                        "connector.handler.entry",
                        {},
                        Laya.Handler.create(null, function(err, data) {
                            if (err != null) {
                                console.log("network connection error");
                                return;
                            }

                            console.log("NetManager inited...");

                            self.socket.on("message", self, self.processMessage);
                            
                            callback && callback();
                        })
                    )
                });
            };

            self.send(
                "gate.handler.getEntry",
                {},
                Laya.Handler.create(null, complete)
            );
        });
    };

    NetManager.prototype.encode = function() {
        var key;
        var keys = [];
        for (key in params) {
            if (key == 'signature') {
                continue;
            }

            keys.push(key);
        }

        keys.sort();

        var url = '';
        for (var i = 0, size = keys.length; i < size; i++) {
            key = keys[i];
            url += key + '=' + encodeURIComponent(params[key]);
            if (i < keys.length - 1) {
                url += '&';
            }
        }

        return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(url, App.config.appKey + 'papaya&'));
    };

    NetManager.prototype.formatURL = function(uri, params) {
        params = params || {};

        params.appID        = App.config.appID;
        params.udid         = App.storageManager.getDeviceId();
        //params.signature    = this.encode(params);

        var url = uri + '?';

        for (var key in params) {
            url += key + '=' + encodeURIComponent(params[key]) + '&';
        }

        return url.substring(0, url.length-1);
    };

    NetManager.prototype.resolve = function(path) {
        if (path.charAt(path.length - 1) == "/") {
            return path.substr(0, path.length - 1);
        }

        return path;
    };

    NetManager.prototype.get = function(url, handler) {
        var hr = new Laya.HttpRequest();

        var onHttpRequestComplete = function() {
            if (hr.data.code == CODE.OK) {
                handler.runWith([null, hr.data.data]);
            }
            else {
                var error = {
                    number: hr.data.err,
                    message: hr.data.msg
                };
                handler.runWith(error);
            }
        };

        var onHttpRequestError = function(e) {
            var error = {
                number: CODE.INTERNAL.HTTP_ERROR,
                message: e
            };
            handler.runWith(error, {});
        };

        // var onHttpRequestProgress = function(e) {
        //     if (progress) {
        //         progress.runWith(e);
        //     }
        // };

        // 设置认证token
        var headers = null;
        if (this.token) {
            headers = ["Authorization", "Bearer " + this.token];
        }

        //http.on(Laya.Event.PROGRESS, null, onHttpRequestProgress);
        hr.once(Laya.Event.ERROR, null, onHttpRequestError);
        hr.once(Laya.Event.COMPLETE, null, onHttpRequestComplete);
        hr.send(url, null, 'get', 'json', headers);
    };

    NetManager.prototype.post = function() {

    };

    NetManager.prototype.request = function(api, params, handler) {
        params = params || {};

        var self = this;
        var url = this.formatURL(this.service + api, params);

        var complete = function(err, data) {
            // 这里可以先拦截需要统一处理的错误
            if (err != null) {

            }

            // 这里统一同步账户余额
            // var player = App.player;
            // if (data.balance) {
            //     player && player.setBalance(data.balance);
            // }

            if (handler) {
                handler.runWith([err, data]);
            }
        };
        this.get(url, Laya.Handler.create(null, complete));
    };

    NetManager.prototype.send = function(route, msg, handler) {
        msg = msg || {};
        msg.udid = App.storageManager.getDeviceId();
        this.socket.request(route, msg, function(body) {
            var err = null;
            var data = null;

            if (body.code === CODE.OK) {
                data = body.data;
            } else {
                err = {
                    err: body.err,
                    msg: body.msg
                }
            }

            if (handler) {
                handler.runWith([err, data]);
            }
        });
    };

    NetManager.prototype.processMessage = function(msg) {
        console.log("recv socket message: ", msg.route, msg.body);
        var route   = msg.route;
        var info    = msg.body;
        switch (route) {
            case Game.ROUTE.ROOM.ENTER:
            {
                App.uiManager.gameRoomView.joinPlayer(info);
                break;
            }

            case Game.ROUTE.ROOM.COMMAND: {
                App.tableManager.commandHandler(info);
                break;
            }

            case Game.ROUTE.ROOM.DEAL: {
                App.tableManager.dealPoker(info);
                break;
            }
        }
    };

    return NetManager;
}(laya.events.EventDispatcher));
