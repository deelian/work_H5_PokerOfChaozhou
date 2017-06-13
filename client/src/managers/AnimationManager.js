
var AnimationManager = (function(_super) {
    var Animations = {
        "ani.loading": {
            urls: [
                "assets/ui.animation/loading/loading0001.png",
                "assets/ui.animation/loading/loading0002.png",
                "assets/ui.animation/loading/loading0003.png",
                "assets/ui.animation/loading/loading0004.png",
                "assets/ui.animation/loading/loading0005.png",
                "assets/ui.animation/loading/loading0006.png",
                "assets/ui.animation/loading/loading0007.png",
                "assets/ui.animation/loading/loading0008.png"
            ],
            interval:100
        }
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