/*
 * Base Dependencies
 */

/*
 * Server Dependencies
 */
var pomelo = require('../pomelo');
var logger = pomelo.logger.getLogger('application', __filename);

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'server');

var ChatService = require('./app/services/ChatService');
var RoomService = require('./app/services/RoomService');
var LobbyService = require('./app/services/LobbyService');
var AuthService = require('./app/services/AuthService');

/*
 * Game Dependencies
 */
var Game = require('../game');
var Code = Game.Code;

app.configure('all', 'all', function() {
    var logger = pomelo.logger.getLogger('database', __filename);
    var db = require('../models/game');

    db.setLogger(logger.info.bind(logger));
});

// app configuration
app.configure('all', 'connector|gate', function(){
    app.set('connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 30,
            useDict : true,
            useProtobuf : true
        }
    );
});

app.configure('all', 'chat', function() {
    var chatService = new ChatService(app);
    app.set('chatService', chatService);
});

app.configure('all', 'lobby', function() {
    var lobbyService = new LobbyService(app);
    app.set('lobbyService', lobbyService);
});

app.configure('all', 'room', function() {
    var roomService = new RoomService(app);
    app.set('roomService', roomService);

    var room = require('./app/components/room');
    app.load(room, { service: roomService });
});

app.configure('all', 'auth', function() {
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
    
    if (session.get('udid') != msg.udid) {
        next(new Error("Invalid request"));
        return;
    }

    if (route === "auth.handler.verify"
    ||  route === "auth.handler.guest"
    ||  route === "auth.handler.refresh") {
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
