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
            READY:              "room.ready",               // 准备结束
            ENTER:              "room.enter",
            LEAVE:              "room.leave",               // 离开房间
            KICK:               "room.kick",                // 提出房间
            STATE:              "room.state",
            ACTION:             "room.action",
            COMMAND:            "room.command",             // 玩家操作的反馈
            ROB:                "room.rob",                 // 抢庄操作
            DEAL:               "room.deal",                // 发牌完结
            BID:                "room.bid",                 // bid完结
            DRAW:               "room.draw",                // 闲家要牌完结
            BANKER_DRAW:        "room.banker.draw",         // 庄家操作结束
            PAY:                "room.pay",                 // 结算操作
            END:                "room.end",                 // 牌局结束
            CLOSE:              "room.close",               // 房间关闭
            DISMISS_APPLY:      "room.dismiss.apply",       // 申请关房
            DISMISS_CONFIRM:    "room.dismiss.confirm",     // 申请关房确认
            DISMISS_RESULT:     "room.dismiss.result",      // 申请关房结果
            AFK:                "room.afk",                 // 离线
        },

        CHAT: {
            SEND:               "chat.send",                // 发送聊天信息
            FORBID:             "chat.forbid",              // 禁言
            FORBID_CANCEL:      "chat.forbid.cancel"        // 取消禁言
        },

        CHAIR: {
            SIT_DOWN:           "sit.down",                 // 坐下
            STAND_UP:           "stand.up",                 // 站起
            LET_STAND_UP:       "let.stand.up"              // 强制站起
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
            SESSION_ERROR:      1006,
            TOKEN_ERROR:        1007
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
            REJECT_GUEST:       1301
        },

        // 1400~1499
        CONNECTOR: {

        },

        // 1500~1599
        LOBBY: {
            NOT_PRODUCT:        1500
        },

        // 1600~1699
        ROOM: {
            NOT_EXIST:          1601,
            NOT_IN_ROOM:        1602,
            ALREADY_HAVE_ROOM:  1603,
            USER_IS_FORBIDDEN:  1604,
            IS_LOCKED:          1605,
            IS_FULL:            1606,
            NOT_ENOUGH_TOKENS:  1607                //钻石(房卡)不足
        }
    };

    var Error = root.ERROR = {
        INTERNAL_ERROR:                 "1000",
        INVALID_ARGUMENT:               "1001",
        MISSING_ARGUMENT:               "1002",
        ALREADY_EXISTS:                 "1003",
        NOT_EXISTS:                     "1004",
        INVALID_PASSWORD:               "1005",
        UNAUTHORIZED_REQUEST:           "1006",
        INVALID_TOKEN:                  "1007",
        ACCESS_DENIED:                  "1008",
        INVALID_REQUEST:                "1009",
        INVALID_AUTHORIZE_CODE:         "1010",
        REMOTE_SERVER_ERROR:            "1011",
        ALREADY_BIND:                   "1012",
        ALREADY_FREEZE:                 '1013',
        ALREADY_REMOVE:                 '1014',
        ARGUMENT_FORMAT_ERROR:          '1015',
        NULL_VALUE:                     '1016',
        ERROR_VALUE:                    '1017',
        OBJECT_HAVING_NULL_VALUE:       '1018',
        NOT_EQUAL_PASSWORD:             '1019',
        ERROR_PASSWORD:                 '1010'
    };

    var Message = root.MESSAGE = {
        "1000": [ 500, "InternalError" ],
        "1001": [ 400, "InvalidArgument" ],
        "1002": [ 400, "MissingArgument" ],
        "1003": [ 400, "AlreadyExists" ],
        "1004": [ 400, "NotExists" ],
        "1005": [ 400, "InvalidPassword" ],
        "1006": [ 401, "UnauthorizedRequest" ],
        "1007": [ 401, "InvalidToken" ],
        "1008": [ 400, "AccessDenied" ],
        "1009": [ 400, "InvalidRequest" ],
        "1010": [ 400, "InvalidAuthorizeCode" ],
        "1011": [ 500, "RemoteServerError" ],
        "1012": [ 400, "AlreadyBind" ],
        "1013": [ 400, "AlreadyFreeze" ],
        "1014": [ 400, "AlreadyRemove" ],
        "1015": [ 400, "ArgumentFormatError" ],
        "1016": [ 400, "NullValue" ],
        "1017": [ 400, "ErrorValue" ],
        "1018": [ 400, "ObjectHavingNullValue" ],
        "1019": [ 400, "NotEqualPassword" ],
        "1020": [ 400, "ErrorPassword" ]
    };

    var OrderType = root.ORDER_TYPE = {
        IOS:      1,
        ANDROID:  2,
        H5:       3,
        WEB:      4
    };

    var OrderStatus = root.ORDER_STATUS = {
        PROCESSING:    0,
        SUCCESS:       1,
        FAILURE:       2,
        EXPIRED:       3,
        PROCESSED:     4
    };
}(DejuPoker));