(function(root) {
    var _super = root.Serialize;
    var Player = root.Player = function(opts) {
        opts = opts || {};
        
        this.id             = opts.id || 0;
        this.name           = opts.name || "";
        this.avatar         = opts.avatar || "";
        this.tokens         = opts.tokens || 0;
        this.gender         = opts.gender || 0;
    };

    root.inherits(Player, _super);

    root.extend(Player.prototype, {
        setId: function(id) {
            this.id = id;
        },
        
        getId: function() {
            return this.id;
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