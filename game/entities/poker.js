
(function(root) {
    var _super = root.Serialize;
    var Poker = root.Poker = function(opts) {
        opts = opts || {};

        this.value      = opts.value || 0;
        this.type       = opts.type  || 0;
        this.showTarget = opts.showTarget || 0;
    };

    root.inherits(Poker, _super);

    root.extend(Poker.prototype, {
        isJoker: function() {
            return this.type === Poker.TYPE.JOKER;
        },
        
        setShow: function(type) {
            this.showTarget = type;
        }
    });

    Poker.TYPE         = {};
    Poker.TYPE.DIAMOND = 1;
    Poker.TYPE.CLUB    = 2;
    Poker.TYPE.HEART   = 3;
    Poker.TYPE.SPADE   = 4;
    Poker.TYPE.JOKER   = 5;

    Poker.VALUES       = {};
    Poker.VALUES[Poker.TYPE.JOKER]   = [ 14, 15, 16 ];              // 14 小王 15 大王 16 翻倍
    Poker.VALUES[Poker.TYPE.DIAMOND] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
    Poker.VALUES[Poker.TYPE.CLUB]    = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
    Poker.VALUES[Poker.TYPE.HEART]   = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];
    Poker.VALUES[Poker.TYPE.SPADE]   = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13 ];

    Poker.SHOW_TARGET = {
        NONE    : 0,
        ME      : 1,
        ALL     : 2
    }
} (DejuPoker));