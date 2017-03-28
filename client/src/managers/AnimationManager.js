
var AnimationManager = (function(_super) {
    var Animations = {

    };

    var AnimationManager = function() {
        AnimationManager.super(this);
    };

    Laya.class(AnimationManager, "AnimationManager", _super);

    AnimationManager.prototype.init = function(callback) {
        var keys = Object.keys(Animations);
        for (var i = 0, size = keys.length; i < size; i++) {
            var name = keys[i];
            var urls = Animations[name].urls;
            var anim = new Laya.Animation();

            anim.loadImages(urls, name);
        }

        callback && callback();
    };

    AnimationManager.prototype.get = function(name) {
        var anim = new Laya.Animation();
        var interval = Animations[name] && Animations[name].interval || 30;

        anim._play = anim.play;
        anim._name = name;
        anim.interval = interval;
        anim.play = function() {
            this._play(0, true, this._name);
        };

        return anim;
    };

    return AnimationManager;
}(laya.events.EventDispatcher));