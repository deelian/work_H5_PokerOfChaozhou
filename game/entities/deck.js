
(function(root) {
    var _super = root.Serialize;
    var Deck = root.Deck = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.pokers         = opts.pokers;

        this.init();
    };

    root.inherits(Deck, _super);

    root.extend(Deck.prototype, {
        init: function(opts) {

        }
    });

} (DejuPoker));