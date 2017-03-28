/**
 * Created by monkey on 2017/3/25.
 * 牌局
 */

(function(root){
    var _super = root.Serialize;
    var Game = root.Game = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.pokerSet = null;
        this.handPokers = [];
        this.ghostPokers = [];
        this.setting = {};
    };

    root.inherits(Game, _super);

    root.extend(Game.prototype, {
    });
}(dejuPoker));