
var AssetsManager = (function(_super) {
    var loaderRes = [
        {
            url: "assets/ui.loader/progress.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.loader/progress$bar.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.loader/logo.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.loader/progressBg.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.loader/img_yk.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/atlas/assets/ui.button.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.tip.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "unpack.json",
            type: Laya.Loader.JSON
        },

        {
            url: "assets/ui.agreement/img_yhxy.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.agreement/bg_01.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/ui.agreement/bg_jiemian.png",
            type: Laya.Loader.IMAGE
        },

        {
            url: "assets/atlas/assets/ui.inputRoom.json",
            type: Laya.Loader.ATLAS
        },
    ];

    var unpackRes = [

    ];

    var preload = [
        {
            url: "assets/atlas/assets/comp.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/pokers.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.button.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.buyItem.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.explan.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.image.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.main.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.recordOfPoker.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.roomEffort.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.room.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.setting.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.share.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.inputRoom.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.playerInfo.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.select.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.room/final.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.room/chat.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.effortOfRoomRound.json",
            type: Laya.Loader.ATLAS
        },

        {
            url: "assets/atlas/assets/ui.lobbyEffort.json",
            type: Laya.Loader.ATLAS
        },
        {
            url: "assets/atlas/assets/ui.room/showRule.json",
            type: Laya.Loader.ATLAS
        },
        {
            url: "assets/atlas/assets/ui.room/chat/expression.json",
            type: Laya.Loader.ATLAS
        },
        {
            url: "assets/atlas/assets/ui.room/showPokerType.json",
            type: Laya.Loader.ATLAS
        },
        {
            url: "assets/atlas/assets/ui.room/disband.json",
            type: Laya.Loader.ATLAS
        },
        {
            url: "assets/atlas/assets/pokers/rubbedPoker.json",
            type: Laya.Loader.ATLAS
        },
        {
            url: "assets/atlas/assets/ui.news.json",
            type: Laya.Loader.ATLAS
        },
        {
            url: "assets/atlas/assets/ui.room/resultLab.json",
            type: Laya.Loader.ATLAS
        }
    ];
    
    var preloadSounds = [];
    
    var preloadFonts = [
        {
            url:"assets/fonts/lost.fnt",
            type: Laya.Loader.XML
        },

        {
            url:"assets/fonts/win.fnt",
            type: Laya.Loader.XML
        }
    ];

    var preloadEffects = (function () {
        var effectResources = {};
        var idArray = [];

        for (var i = 0, size = idArray.length; i < size; i++) {
            var id = idArray[i];
            var path = "assets/ani.effects/" + id + "/poacher.sk";

            effectResources[id] = {
                id: id,
                path: path
            }
        }

        return effectResources;
    }());

    function AssetsManager() {
        AssetsManager.super(this);
        this.sounds = {};
        this.fonts  = {};
    }

    Laya.class(AssetsManager, "AssetsManager", _super);

    var __proto = AssetsManager.prototype;

    __proto.init = function(cb) {
        var i, size, obj, url, start, len, name;

        for (i = 0, size = preloadSounds.length; i < size; i++) {
            obj = preloadSounds[i];
            url = obj.url;

            start = url.lastIndexOf("/") + 1;
            len = url.lastIndexOf(".") - start;

            name = url.substr(url.lastIndexOf("/") + 1, url.lastIndexOf(".") - start);

            this.sounds[name] = url;
        }

        for (i = 0, size = preloadFonts.length; i < size; i++) {
            obj = preloadFonts[i];
            url = obj.url;

            start = url.lastIndexOf("/") + 1;
            len = url.lastIndexOf(".") - start;

            name = url.substr(url.lastIndexOf("/") + 1, url.lastIndexOf(".") - start);

            this.fonts[name] = url;
        }

        var self = this;
        var keys = Object.keys(this.fonts);
        async.eachSeries(keys, function(name, callback) {
            var url = self.fonts[name];
            var bmpFont = new Laya.BitmapFont();

            var xml = Laya.loader.getRes(url);
            var texture = Laya.loader.getRes(url.replace('.fnt', '.png'));
            bmpFont.parseFont(xml, texture);

            Laya.Text.registerBitmapFont(name, bmpFont);

            callback(null);

        }, function(err) {
            if (err != null) {
                console.log("assetManager init error...");
            }

            cb && cb();
        });
    };

    __proto.getLoaderRes = function() {
        return loaderRes;
    };

    __proto.getPreload = function() {
        var i, size;
        var resource = {
            images:   [],
            sounds:   [],
            fonts:    []
        };

        if (unpackRes.length === 0) {
            var unpack = Laya.loader.getRes("unpack.json");
            if (unpack != null) {
                for (i = 0, size = unpack.length; i < size; i++) {
                    unpackRes.push({
                        url: unpack[i],
                        type: Laya.Loader.IMAGE
                    })
                }
            }
        }

        resource.images = preload.concat(unpackRes);
        resource.sounds = preloadSounds.slice(0);
        resource.fonts  = preloadFonts.slice(0);

        for (i = 0, size = preloadFonts.length; i < size; i++) {
            resource.fonts.push({
                url: preloadFonts[i].url.replace('.fnt', '.png'),
                type: Laya.Loader.IMAGE
            })
        }

        return resource;
    };

    __proto.getEffectsRes = function (){
        return preloadEffects;
    };

    __proto.getSound = function(name) {
        return this.sounds[name] || "";
    };

    __proto.getFont = function(name) {
        return this.fonts[name] || "";
    };

    __proto.getProduct = function(id) {
        return Game.Game.DIAMOND_TYPE[id];
    };

    __proto.playMusic = function(name) {
        var url = this.getSound(name);
        url && Laya.SoundManager.playMusic(url);
    };

    __proto.playSound = function(name) {
        console.log(name);
        var url = this.getSound(name);
        url && Laya.SoundManager.playSound(url);
    };

    return AssetsManager;
}(laya.events.EventDispatcher));