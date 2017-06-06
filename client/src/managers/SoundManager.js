/**
 * 声音管理器
 */
var SoundAndMusicMgr = (function(_super) {

    var baseUrl = "assets/sound/";

    var preloadMusic = [
        "lobbyMusic.mp3",
        "roomMusic.mp3"
    ];

    var preloadSound = [
        "one.wav",
        "two.wav",
        "three.wav",
        "four.wav",
        "five.wav",
        "six.wav",
        "seven.wav",
        "eight.wav",
        "nine.wav",
        "bung.wav",

        "god_eight.wav",
        "god_nine.wav",
        "double_ghost.wav",
        "straight.wav",
        "straight_flush.wav",
        "threes.wav",

        "triple.wav",
        "double.wav",

        "chat_normal_0.wav",            //*1快点吧，我等到花儿都谢了
        "chat_normal_1.wav",            //*2又天公，赢定了
        "chat_normal_2.wav",            //*3玩太小，没意思
        "chat_normal_3.wav",            //*4风水不好，换个位置
        "chat_normal_4.wav",            //*5哇，你抢钱啊
        "chat_normal_5.wav",            //*6不好意思，又赢了
        "chat_normal_6.wav",            //*7来手好牌
        "chat_normal_7.wav",            //*8底裤都输光了
        "chat_normal_8.wav",            //*9这个庄也太弱了
        "chat_normal_9.wav",            //*10又断线，郁闷
        "chat_normal_10.wav",           //*11各位不好意思
        "chat_normal_11.wav",           //*12大家一起下他庄

        "btnSound.wav",             //*按钮
        "enterRoomSound.wav",       //*进入房间
        "optionSound.wav",          //*轮到玩家操作
        "pokerOptionSound.wav",     //*补牌

        "win.wav",
        "lost.wav"
    ];

    function SoundAndMusicMgr() {
        SoundAndMusicMgr.super(this);

        this.musics = {};
        this.sounds  = {};
        //*0是男，是女
        this._gender = 0;
        //*语音类型
        this._languageType = SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW;

        this.registeredResource("musics");
        this.registeredResource("sounds");

        this.initSoundAndMusicVolume();
        this.initLanguageType();
    }

    Laya.class(SoundAndMusicMgr, "SoundAndMusicMgr", _super);

    var __proto = SoundAndMusicMgr.prototype;

    //*初始化语言
    __proto.initLanguageType = function () {
        var type = App.storageManager.getItem("LANGUAGE_TYPE");
        if (!type) {
            type = SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW;
        }
        this.setLanguageType(type);
    };

    __proto.initVoiceType = function () {
        var type = this.getVoiceType();
        this.setVoiceType(type);
    };

    //*初始化音量
    __proto.initSoundAndMusicVolume = function () {
        var soundVolume = this.getSoundVolume();
        this.setSoundVolume(soundVolume);

        var musicVolume = this.getMusicVolume();
        this.setMusicVolume(musicVolume);
    };

    __proto.init = function(cb) {
        this.initVoiceType();

        cb && cb();
    };

    __proto.getPreload = function() {
        var resource = [];
        var musicIndex;
        var soundIndex;
        for (musicIndex in this.musics) {
            resource.push({url:this.musics[musicIndex], type:Laya.Loader.SOUND});
        }

        for (soundIndex in this.sounds) {
            resource.push({url:this.sounds[soundIndex], type:Laya.Loader.SOUND});
        }

        return resource;
    };

    __proto.registeredResource = function(type) {
        var i, size, obj, url, name;

        var preload;
        var arr;
        var path;
        if(type == "musics")
        {
            preload = preloadMusic;
            arr = this.musics;
        }
        else if(type == "sounds")
        {
            preload = preloadSound;
            arr = this.sounds;
        }

        // 注册音乐文件索引
        for (i = 0, size = preload.length; i < size; i++) {
            url = preload[i];

            name = url.substr(0, url.lastIndexOf("."));
            if (type == "musics") {
                path = baseUrl + url;
            }
            else if (type == "sounds") {
                path = baseUrl + this._gender + "/" + this._languageType + "/" + url;
            }

            arr[name] = path;
        }
    };

    __proto.getMusic = function(name) {
        return this.musics[name] || "";
    };

    __proto.getSound = function(name) {
        return this.sounds[name] || "";
    };

    __proto.playMusic = function(name) {
        var url = this.getMusic(name);
        url && Laya.SoundManager.playMusic(url);
    };

    __proto.playSound = function(name, complete) {
        if (this.sounds[name]) {
            var url = baseUrl + this._gender + "/" + this._languageType + "/" + name + ".wav";
            url && Laya.SoundManager.playSound(url, 1, complete);
        }
    };

    __proto.setMusicVolume = function(volume) {
        var musicVolume = volume/100;
        Laya.SoundManager.setMusicVolume(musicVolume); //* 0-1
        App.storageManager.setItem("MUSIC_VOLUME", volume); //* 0-100
    };

    __proto.setSoundVolume = function(volume) {
        Laya.SoundManager.soundVolume = volume/100;
        App.storageManager.setItem("SOUND_VOLUME", volume);
    };

    __proto.getMusicVolume = function () {
        var volume = App.storageManager.getItem("MUSIC_VOLUME");
        volume = (volume == undefined? 50 : Number(volume));
        return volume;
    };

    __proto.getSoundVolume = function () {
        var volume = App.storageManager.getItem("SOUND_VOLUME");
        volume = (volume == undefined? 50 : Number(volume));
        return volume;
    };

    __proto.getVoiceType = function () {
        var voiceType = App.storageManager.getItem("VOICE_TYPE");
        voiceType = (voiceType == undefined) ? App.player.gender : Number(voiceType);
        return voiceType;
    };

    __proto.setLanguageType = function (type) {
        var isRegistered = true;
        if (type == this._languageType) {
            isRegistered = false;
        }

        switch  (type) {
            case SoundAndMusicMgr.LANGUAG_TYPE.MANDARIN: {
                this._languageType = SoundAndMusicMgr.LANGUAG_TYPE.MANDARIN;
                break;
            }
            case SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW: {
                this._languageType = SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW;
                break;
            }
            default: {
                this._languageType = SoundAndMusicMgr.LANGUAG_TYPE.MANDARIN;
                break;
            }
        }

        if (isRegistered) {
            this.registeredResource("sounds");
        }

        App.storageManager.setItem("LANGUAGE_TYPE", this._languageType);
    };

    __proto.setVoiceType = function (type) {
        var isRegistered = true;
        if (type == this._gender) {
            isRegistered = false;
        }

        switch  (type) {
            case SoundAndMusicMgr.VOICE_TYPE.MAN: {
                this._gender = SoundAndMusicMgr.VOICE_TYPE.MAN;
                break;
            }
            case SoundAndMusicMgr.VOICE_TYPE.WOMEN: {
                this._gender = SoundAndMusicMgr.VOICE_TYPE.WOMEN;
                break;
            }
            default: {
                this._gender = SoundAndMusicMgr.VOICE_TYPE.MAN;
                break;
            }
        }

        if (isRegistered) {
            this.registeredResource("sounds");
        }

        App.storageManager.setItem("VOICE_TYPE", this._gender);
    };

    SoundAndMusicMgr.LANGUAG_TYPE = {
        MANDARIN: "mandarin",
        TEOCHEW: "Teochew"
    };

    SoundAndMusicMgr.VOICE_TYPE = {
        MAN: 0,
        WOMEN: 1
    };

    return SoundAndMusicMgr;
}(laya.events.EventDispatcher));