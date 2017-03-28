(function(root) {
    root.Code = {
        OK: 200,
        FAILED: 500,
        TIMEOUT: 1000,

        MySQL: {
            DB_ERROR: 1001,
            RECORD_ERROR: 1002,
            PROCEDURE_ERROR: 1003
        },

        REDIS: {
            REDIS_ERROR: 1101
        },

        HTTP: {
            REQUEST_ERROR: 1201,
            STATUS_ERROR: 1202,
            BODY_ERROR: 1203
        },

        GAME_ERR: {
            NOT_ENOUGH_GOLD:            10001,      //金币不足

            NO_ERR:                     null        //没有错误 一般不用
        },

        AUTH: {

        },

        REQUEST: {
            INVALID_PARAMS: 1500,
            INVALID_SIGNATURE: 1501,
            UNZIP_ERROR: 1502,
            JSON_ERROR: 1503,
            TOKEN_ERROR: 1504,
            SDK_ERROR: 1505,
            DATA_ERROR: 1506,
            INVALID_PLATFORM: 1507,
            INVALID_SERVER: 1508,
            INTERNAL_ERROR: 1509
        }
    };
}(dejuPoker));