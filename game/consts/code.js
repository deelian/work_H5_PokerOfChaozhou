(function(root) {
    root.wrapMsg = function(err, data) {
        var msg = {};

        if (err != null) {
            msg.code = root.Code.FAILED;
            msg.err  = err;
            msg.msg  = "";
        } else {
            msg.code = root.Code.OK;
            msg.data = data;
        }

        return msg;
    };

    root.ROUTE = {
        ROOM: {
            ENTER:              "room.enter",
            STATE:              "room.state",
            ACTION:             "room.action",
            COMMAND:            "room.command",             // 玩家操作的反馈
            DEAL:               "room.deal",                // 发牌完结
        }

    };

    root.Code = {
        OK: 200,
        FAILED: 500,
        TIMEOUT: 1000,

        SYSTEM: {
            MySQL_ERROR:        1001,
            REDIS_ERROR:        1002,
            HTTP_ERROR:         1003,
            CHANNEL_ERROR:      1004,
            RPC_ERROR:          1005,
            SESSION_ERROR:      1006
        },

        ROUTE: {
            UNAUTHORIZED:       1101,
            INVALID_PARAMS:     1102,
            INVALID_SESSION:    1103
        },

        // 1200~1299
        GATE: {
            NOT_EXIST_ENTRY:    1201
        },

        // 1300~1399
        AUTH: {

        },

        // 1400~1499
        CONNECTOR: {

        },

        // 1500~1599
        LOBBY: {

        },

        // 1600~1699
        ROOM: {
            NOT_EXIST:          1601,
            NOT_IN_ROOM:        1602,
            ALREADY_HAVE_ROOM:  1603

        }
    };
}(DejuPoker));