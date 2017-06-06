var Pomelo = (function(_super) {
    var JS_WS_CLIENT_TYPE = 'js-websocket';
    var JS_WS_CLIENT_VERSION = '0.0.1';

    var RES_OK = 200;
    var RES_FAIL = 500;
    var RES_OLD_CLIENT = 501;

    var rsa = window.rsa;
    var Protocol = window.Protocol;
    var protobuf = window.Protobuf;
    var decodeIO_protobuf = window.decodeIO_protobuf;
    var decodeIO_encoder = null;
    var decodeIO_decoder = null;
    var Package = Protocol.Package;
    var Message = Protocol.Message;

    var handshakeBuffer = {
        'sys': {
            type: JS_WS_CLIENT_TYPE,
            version: JS_WS_CLIENT_VERSION,
            rsa: {}
        },
        'user': {
        }
    };

    function Pomelo(params) {
        params = params || {};

        Pomelo.super(this);

        this.host = "";
        this.port = 0;

        this.socket = null;
        this.reqId = 0;
        this.callbacks = {};

        //Map from request id to route
        this.routeMap = {};
        this.dict = {};    // route string to code
        this.abbrs = {};   // code to route string
        this.serverProtos = {};
        this.clientProtos = {};
        this.protoVersion = 0;

        this.useCrypto = false;
        handshakeBuffer.user = params.user;
        if (params.encrypt) {
            this.useCrypto = true;
            rsa.generate(1024, "10001");
            handshakeBuffer.sys.rsa = {
                rsa_n: rsa.n.toString(16),
                rsa_e: rsa.e
            };
        }
        this.handshakeCallback = params.handshakeCallback || null;

        this.heartbeatInterval = 0;
        this.heartbeatTimeout = 0;
        this.nextHeartbeatTimeout = 0;
        this.gapThreshold = 100;
        this.heartbeatId = null;
        this.heartbeatTimeoutId = null;
        this.handshakeCallback = null;
    }

    Laya.class(Pomelo, "Pomelo", _super);

    Pomelo.prototype.decode = function(data) {
        //probuff decode
        var msg = Message.decode(data);

        if(msg.id > 0){
            msg.route = this.routeMap[msg.id];
            delete this.routeMap[msg.id];
            if(!msg.route){
                return;
            }
        }

        msg.body = this.deCompose(msg);
        return msg;
    };

    Pomelo.prototype.encode = function(reqId, route, msg) {
        var type = reqId ? Message.TYPE_REQUEST : Message.TYPE_NOTIFY;

        //compress message by protobuf
        if(protobuf && this.clientProtos[route]) {
            msg = protobuf.encode(route, msg);
        } else if(decodeIO_encoder && decodeIO_encoder.lookup(route)) {
            var Builder = decodeIO_encoder.build(route);
            msg = new Builder(msg).encodeNB();
        } else {
            msg = Protocol.strencode(JSON.stringify(msg));
        }

        var compressRoute = 0;
        if(this.dict && this.dict[route]) {
            route = this.dict[route];
            compressRoute = 1;
        }

        return Message.encode(reqId, type, compressRoute, route, msg);
    };

    Pomelo.prototype.connect = function(host, port, cb) {
        //Add protobuf version
        if (window.localStorage && window.localStorage.getItem('protos') && this.protoVersion === 0) {
            var protos = JSON.parse(window.localStorage.getItem('protos'));

            this.protoVersion = protos.version || 0;
            this.serverProtos = protos.server || {};
            this.clientProtos = protos.client || {};

            if(!!protobuf) {
                protobuf.init({encoderProtos: this.clientProtos, decoderProtos: this.serverProtos});
            }
            if(!!decodeIO_protobuf) {
                decodeIO_encoder = decodeIO_protobuf.loadJson(this.clientProtos);
                decodeIO_decoder = decodeIO_protobuf.loadJson(this.serverProtos);
            }
        }
        //Set protoversion
        handshakeBuffer.sys.protoVersion = this.protoVersion;

        var socket = this.socket = new Laya.Socket(host, port);

        socket.on(Laya.Event.CLOSE, this, this.onclose);
        socket.on(Laya.Event.MESSAGE, this, this.onmessage);
        socket.on(Laya.Event.ERROR, this, this.onerror);
        socket.on(Laya.Event.OPEN, this, this.onopen);
    };

    Pomelo.prototype.onopen = function(event) {
        var obj = Package.encode(Package.TYPE_HANDSHAKE, Protocol.strencode(JSON.stringify(handshakeBuffer)));

        this.send(obj);

        this.event('open', event);
    };

    Pomelo.prototype.onmessage = function(event) {
        this.processPackage(Package.decode(event));

        // new package arrived, update the heartbeat timeout
        if (this.heartbeatTimeout) {
            this.nextHeartbeatTimeout = Date.now() + this.heartbeatTimeout;
        }
    };

    Pomelo.prototype.onerror = function(event) {
        this.event('error', event);
    };

    Pomelo.prototype.onclose = function(event) {
        console.log("pomelo onclose");
        this.event('close', event);
        this.socket && this.socket.offAll();
        this.socket = null;
    };

    Pomelo.prototype.disconnect = function() {
        if (this.socket) {
            console.log("pomelo disconnect");
            this.socket.close();
            this.socket.offAll();
            this.socket = null;
        }

        if (this.heartbeatId) {
            clearTimeout(this.heartbeatId);
            this.heartbeatId = null;
        }
        if (this.heartbeatTimeoutId) {
            clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }
    };

    Pomelo.prototype.request = function(route, msg, cb) {
        if (arguments.length === 2 && typeof msg === 'function') {
            cb = msg;
            msg = {};
        } else {
            msg = msg || {};
        }

        route = route || msg.route;
        if (!route) {
            return;
        }

        this.reqId++;

        var reqId = this.reqId;
        this.sendMessage(reqId, route, msg);

        this.callbacks[reqId] = cb;
        this.routeMap[reqId] = route;
    };

    Pomelo.prototype.notify = function(route, msg) {
        msg = msg || {};
        this.sendMessage(0, route, msg);
    };

    Pomelo.prototype.sendMessage = function(reqId, route, msg) {
        if (this.useCrypto) {
            msg = JSON.stringify(msg);
            var sig = rsa.signString(msg, "sha256");
            msg = JSON.parse(msg);
            msg['__crypto__'] = sig;
        }

        if (this.encode) {
            msg = this.encode(reqId, route, msg);
        }

        var packet = Package.encode(Package.TYPE_DATA, msg);

        this.send(packet);
    };

    Pomelo.prototype.send = function(packet) {
        if (this.socket) {
            this.socket.send(packet.buffer);
        }
    };

    Pomelo.prototype.heartbeat = function(data) {
        // no heartbeat
        if (!this.heartbeatInterval) {
            return;
        }

        var obj = Package.encode(Package.TYPE_HEARTBEAT);
        if (this.heartbeatTimeoutId) {
            clearTimeout(this.heartbeatTimeoutId);
            this.heartbeatTimeoutId = null;
        }

        // already in a heartbeat interval
        if (this.heartbeatId) {
            return;
        }
        var self = this;
        this.heartbeatId = setTimeout(function() {
            self.heartbeatId = null;
            self.send(obj);

            self.nextHeartbeatTimeout = Date.now() + self.heartbeatTimeout;
            self.heartbeatTimeoutTimer();
        }, this.heartbeatInterval);
    };

    Pomelo.prototype.heartbeatTimeoutTimer = function() {
        var self = this;
        var gap = this.nextHeartbeatTimeout - Date.now();
        if (gap <= this.gapThreshold) {
            this.event('close', 'heartbeat timeout');
            this.disconnect();
            return;
        }

        this.heartbeatTimeoutId = setTimeout(function() {
            self.heartbeatTimeoutTimer();
        }, gap);
    };

    Pomelo.prototype.handshake = function(data) {
        data = JSON.parse(Protocol.strdecode(data));
        if (data.code === RES_OLD_CLIENT) {
            this.event('error', 'client version not fullfill');
            return;
        }

        if (data.code !== RES_OK) {
            this.event('error', 'handshake fail');
            return;
        }

        this.handshakeInit(data);

        var obj = Package.encode(Package.TYPE_HANDSHAKE_ACK);
        this.send(obj);

        this.event('handshake', this.socket);
    };

    Pomelo.prototype.onData = function(data) {
        var msg = data;
        if (this.decode) {
            msg = this.decode(msg);
        }
        this.processMessage(msg);
    };

    Pomelo.prototype.onKick = function(data) {
        data = JSON.parse(Protocol.strdecode(data));
        this.event('kick', data);
    };

    Pomelo.prototype.packageHandler = function(type, body) {
        switch (type) {
            case Package.TYPE_HANDSHAKE:
                this.handshake(body);
                break;
            case Package.TYPE_HEARTBEAT:
                this.heartbeat(body);
                break;
            case Package.TYPE_DATA:
                this.onData(body);
                break;
            case Package.TYPE_KICK:
                this.onKick(body);
                break;
            default:
                break;
        }
    };

    Pomelo.prototype.processPackage = function(msgs) {
        if(Array.isArray(msgs)) {
            for(var i=0; i<msgs.length; i++) {
                var msg = msgs[i];
                this.packageHandler(msg.type, msg.body);
            }
        } else {
            this.packageHandler(msgs.type, msgs.body);
        }
    };

    Pomelo.prototype.processMessage = function(msg) {
        if (!msg.id) {
            // server push message
            this.event('message', {
                route: msg.route,
                body: msg.body
            });
            return;
        }

        //if have a id then find the callback function with the request
        var cb = this.callbacks[msg.id];

        delete this.callbacks[msg.id];

        if(typeof cb !== 'function') {
            return;
        }

        cb(msg.body);
    };

    Pomelo.prototype.processMessageBatch = function(msgs) {
        for (var i=0, l=msgs.length; i<l; i++) {
            processMessage(msgs[i]);
        }
    };

    Pomelo.prototype.deCompose = function(msg) {
        var route = msg.route;

        //Decompose route from dict
        if (msg.compressRoute) {
            if(!abbrs[route]){
                return {};
            }

            route = msg.route = abbrs[route];
        }
        if (protobuf && this.serverProtos[route]) {
            return protobuf.decodeStr(route, msg.body);
        } else if (decodeIO_decoder && decodeIO_decoder.lookup(route)) {
            return decodeIO_decoder.build(route).decode(msg.body);
        } else {
            return JSON.parse(Protocol.strdecode(msg.body));
        }
    };
    
    Pomelo.prototype.handshakeInit = function(data) {
        if (data.sys && data.sys.heartbeat) {
            this.heartbeatInterval = data.sys.heartbeat * 1000;   // heartbeat interval
            this.heartbeatTimeout = this.heartbeatInterval * 2;        // max heartbeat timeout
        } else {
            this.heartbeatInterval = 0;
            this.heartbeatTimeout = 0;
        }

        this.initData(data);

        if(typeof this.handshakeCallback === 'function') {
            this.handshakeCallback(data.user);
        }
    };

    //Initilize data used in pomelo client
    Pomelo.prototype.initData = function(data) {
        if(!data || !data.sys) {
            return;
        }
        var dict = this.dict = data.sys.dict;
        var protos = data.sys.protos;
        var abbrs = this.abbrs;

        //Init compress dict
        if (dict) {
            abbrs = {};

            for (var route in dict) {
                if (dict.hasOwnProperty(route)) {
                    abbrs[dict[route]] = route;
                }
            }
        }

        //Init protobuf protos
        if (protos) {
            this.protoVersion = protos.version || 0;
            this.serverProtos = protos.server || {};
            this.clientProtos = protos.client || {};

            //Save protobuf protos to localStorage
            window.localStorage.setItem('protos', JSON.stringify(protos));

            if (!!protobuf) {
                protobuf.init({encoderProtos: protos.client, decoderProtos: protos.server});
            }
            if (!!decodeIO_protobuf) {
                decodeIO_encoder = decodeIO_protobuf.loadJson(this.clientProtos);
                decodeIO_decoder = decodeIO_protobuf.loadJson(this.serverProtos);
            }
        }
    };

    return Pomelo;
})(Laya.EventDispatcher);
