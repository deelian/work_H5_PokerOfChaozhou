(function(root) {
    var _super = root.Serialize;
    var Player = root.Player = function(opts) {
        opts = opts || {};
        
        this.id             = opts.id || 0;
        this.name           = opts.name || "";
        this.avatar         = opts.avatar || "";
        this.tokens         = opts.tokens || 0;
        this.gender         = opts.gender || 0;
        this.data           = {};

        // this.playTimes      = opts.playTimes || 0;          //参与牌局数
        // this.winTimes       = opts.winTimes || 0;           //胜利次数
        // this.fightTimes     = opts.fightTimes || 0;         //比牌次数 用于计算胜率
        // this.godTimes       = opts.godTimes || 0;           //天公次数
        // this.ghostTimes     = opts.ghostTimes || 0;
        // this.logs           = opts.logs || [];

        this.init(opts.data);
    };

    root.inherits(Player, _super);

    root.extend(Player.prototype, {
        init: function(opts) {
            opts = opts || {};

            this.data.playTimes      = opts.playTimes || 0;          //参与牌局数
            this.data.winTimes       = opts.winTimes || 0;           //胜利次数
            this.data.fightTimes     = opts.fightTimes || 0;         //比牌次数 用于计算胜率
            this.data.godTimes       = opts.godTimes || 0;           //天公次数
            this.data.ghostTimes     = opts.ghostTimes || 0;
            this.data.logs           = opts.logs || [];
        },

        getId: function() {
            return this.id;
        },

        addLog: function(id) {
            this.data.logs.unshift(id);
            if (this.data.logs.length > 100) {
                this.data.logs.pop();
            }
        },
        
        addPlayTimes: function(times) {
            times = times || 0;
            this.data.playTimes += times;
        },

        addWinTimes: function(times) {
            times = times || 0;
            this.data.winTimes += times;
        },

        addFightTimes: function(times) {
            times = times || 0;
            this.data.fightTimes += times;
        },

        addGodTimes: function(times) {
            times = times || 0;
            this.data.godTimes += times;
        },

        addGhostTimes: function(times) {
            times = times || 0;
            this.data.ghostTimes += times;
        },
        
        update: function(opts) {
            var obj = this;
            opts = opts || {};

            for (var key in opts) {
                if (opts.hasOwnProperty(key)
                    && obj.hasOwnProperty(key)) {
                    obj[key] = opts[key];
                }
            }
        }
    });
} (DejuPoker));