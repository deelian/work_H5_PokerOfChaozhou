/*
 * Base Dependencies
 */

/*
 * Server Dependencies
 */
var pomelo = require('../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);

var ChatService = require('./app/services/ChatService');
var RoomService = require('./app/services/RoomService');
var LobbyService = require('./app/services/LobbyService');
var AuthService = require('./app/services/AuthService');

/*
 * Game Dependencies
 */
var Game = require('../Game');
var Code = Game.Code;

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'server');

// app configuration
app.configure('production|development', 'connector', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.sioconnector,
            transports : ['websocket', 'polling'],
            heartbeats : true,
            closeTimeout : 60 * 1000,
            heartbeatTimeout : 60 * 1000,
            heartbeatInterval : 25 * 1000
        }
    );
});

app.configure('production|development', 'chat', function() {
    var chatService = new ChatService(app);
    app.set('chatService', chatService);
});

app.configure('production|development', 'lobby', function() {
    var lobbyService = new LobbyService(app);
    app.set('lobbyService', lobbyService);
});

app.configure('production|development', 'room', function() {
    var roomService = new RoomService(app);
    app.set('roomService', roomService);

    var room = require('./app/components/room');
    app.load(room, { service: roomService });
});

app.configure('production|development', 'auth', function() {
    var authService = new AuthService(app);
    app.set('authService', authService);
});

// filters  针对每个server的filter
app.before(function(msg, session, next) {
    var route = msg['__route__'];

    if (route === "gate.handler.getEntry") {
        next(null);
        return;
    }

    if (route == "connector.handler.entry") {
        next(null);
        return;
    }

    console.log(session);

    if (session.get('udid') != msg.udid) {
        next(new Error("Invalid request"));
        return;
    }

    if (route === "auth.handler.verify") {
        next(null);
        return;
    }

    if (session.uid == null) {
        next(new Error("invalid session phase"));
        return;
    }

    if (route == "lobby.handler.enter") {
        next(null);
        return;
    }

    if (session.get('lobby') == false) {
        next(new Error("invalid session phase"));
        return;
    }

    var opts = {
        uid: session.uid
    };
    var complete = function(err, user) {
        if (err != null) {
            next(err);
            return;
        }

        if (user === null) {
            next(new Error("Invalid request"));
            return;
        }

        session.user = user;
        next(null);
    };

    if (app.getServerType() === "lobby") {
        app.get('lobbyService').getUser(opts, complete);
    } else {
        app.rpc.lobby.remote.getUser(session, opts, complete);
    }
});
// app.after();
// app.filter();


// 这个session是一个全局的(app的)session 不是针对每个server的
// app.globalBefore(function(msg, session, next) {
// });
// app.globalAfter();
// app.globalFilter();

// start app
app.start();

process.on('uncaughtException', function (err) {
    logger.error('Caught exception: ' + err.stack);
});
