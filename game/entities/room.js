/**
 * Created by monkey on 2017/3/25.
 * room
 * ..players []
 * ..game Object
 */

(function(root){
    var _super = root.Entity;
    var Room = root.Room = function(opts) {
        opts = opts || {};

        _super.call(this, opts);

        this.players = [];
        this.game = null;
        this.setting = {};
    };

    root.inherits(Room, _super);

    root.extend(Room.prototype, {
    });
}(dejuPoker));