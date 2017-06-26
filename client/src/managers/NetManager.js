
var NetManager = (function(_super) {
    var CODE = DejuPoker.Code;

    function NetManager() {
        NetManager.super(this);

        // 游戏服务器地址
        this.host              = App.config.host;
        this.port              = App.config.port;

        // 游戏服务器连接
        this.socket            = new Pomelo();
        this.connected         = false;

        // 服务器唯一标识
        this.uuid              = null;

        // 认证令牌
        this.token             = URLUtils.getParam("token") || null;
    }

    Laya.class(NetManager, "NetManager", _super);

    NetManager.prototype.init = function(callback) {
        var self = this;

        var host = self.host;
        var port = self.port;
        async.series([
            function(asyncCallback) {
                asyncCallback(null);
            }
        ], function(err) {
            if (err != null) {
                console.log("NetManager inited error...", err);
                callback && callback(err);
                return;
            }

            console.log("NetManager inited...");

            callback && callback(null);
        });
    };

    NetManager.prototype.connect = function(host, port, callback) {
        console.log("socket-connecting: " + host + ":" + port);

        var self = this;
        if (this.connected) {
            this.disconnect();
        }

        // var onerror = function(event) {
        //     self.clear();
        //     callback && callback(event);
        // };
        var onclose = function(event) {
            console.log("socket-close-on-connect", event);

            self.socket.off('handshake', null, onhandshake);
            self.socket.off('open', self, self.onOpen);
            self.socket.off('error', self, self.onError);
            self.socket.off('close', self, self.onClose);
            self.socket.off('message', self, self.processMessage);
            self.socket.off('timeout', self, self.onTimeout);
            self.socket.off('kick', self, self.onKick);
            callback && callback(event);
        };
        var onhandshake = function(socket) {
            console.log("socket-handshake: ", socket);

            //self.socket.off('error', null, onerror);
            self.socket.off('close', null, onclose);

            callback && callback();
        };

        this.socket.connect(host, port);

        this.socket.once('handshake', null, onhandshake);
        this.socket.once('close', null, onclose);
        //this.socket.once('error', null, onerror);

        this.socket.on('open', this, this.onOpen);
        this.socket.on('error', this, this.onError);
        this.socket.on('close', this, this.onClose);
        this.socket.on('message', this, this.processMessage);
        this.socket.on('timeout', this, this.onTimeout);
        this.socket.on('kick', this, this.onKick);
    };

    NetManager.prototype.disconnect = function() {
        console.log("socket-disconnecting: ", this.connected);

        if (this.connected) {
            this.socket.disconnect();

            this.clear();
        }
    };

    NetManager.prototype.send = function(route, msg, handler) {
        msg = msg || {};
        msg.udid = App.storageManager.getDeviceId();
        msg.origin = App.config.origin;

        this.startWaiting();

        var self = this;
        self.socket.request(route, msg, function(body) {
            self.stopWaiting();

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
        console.log("socket-message: ", msg.route, msg.body);

        var route   = msg.route;
        var info    = msg.body;

        App.tableManager.processMsg(route, info);
    };

    NetManager.prototype.clear = function() {
        this.connected = false;
        this.socket.offAll();
    };

    NetManager.prototype.onOpen = function(event) {
        console.log("socket-opened: ", event);

        this.connected = true;
    };

    NetManager.prototype.onClose = function(event) {
        console.log("socket-closed: ", event);
        this.stopWaiting();
        this.clear();

        App.socketClosed();
    };

    NetManager.prototype.onKick = function(event) {
        console.log("socket-kick: ", event);
    };

    NetManager.prototype.onError = function(event) {
        console.log("socket-error: ", event);
    };

    NetManager.prototype.onTimeout = function(event) {
        console.log("socket-timeout: ", event);
    };

    NetManager.prototype.startWaiting = function() {
        if (App.state != Application.STATE_RUNNING) {
            return;
        }

        if (this.waitingDlg == null) {
            this.waitingDlg = new LoadingAniDialog();
        }

        this.waitingDlg.start();
    };

    NetManager.prototype.stopWaiting = function() {
        this.waitingDlg && this.waitingDlg.stop();
    };

    return NetManager;
}(laya.events.EventDispatcher));
