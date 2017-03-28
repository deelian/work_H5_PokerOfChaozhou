/**
 * 声音管理器
 */
var SoundAndMusicMgr = (function(_super) {
    function SoundAndMusicMgr() {
        this.musicVolume = 0;
        this.soundVolume = 0;
        this.attackSoundIndex = 0;
        SoundAndMusicMgr.super(this);
    }

    Laya.class(SoundAndMusicMgr, "SoundAndMusicMgr", _super);

    SoundAndMusicMgr.prototype.init = function() {
        this.initVolume();
    };

    SoundAndMusicMgr.prototype.initVolume = function () {
        var soundValue = App.storageManager.getItem("SOUND_VALUE");
        this.soundVolume = this.checkVolume(soundValue);
        this.setSoundVolume(this.soundVolume);

        var musicValue = App.storageManager.getItem("MUSIC_VALUE");
        this.musicVolume = this.checkVolume(musicValue);
        this.setMusicVolume(this.musicVolume);
    };

    SoundAndMusicMgr.prototype.playMusic = function () {

    };

    SoundAndMusicMgr.prototype.playSound = function (type) {

    };

    SoundAndMusicMgr.prototype.setMusicOpen = function (isOpen) {
        var volume = SoundAndMusicMgr.MUSIC_VOLUME;
        if (!isOpen) {
            volume = SoundAndMusicMgr.SOUND_MIN_VOLUME;
        }
        this.setMusicVolume(volume);
    };

    SoundAndMusicMgr.prototype.setSoundOpen = function (isOpen) {
        var volume = SoundAndMusicMgr.SOUND_VOLUME;
        if (!isOpen) {
            volume = SoundAndMusicMgr.SOUND_MIN_VOLUME;
        }
        this.setSoundVolume(volume);
    };

    SoundAndMusicMgr.prototype.setMusicVolume = function (volume) {
        this.musicVolume = this.checkVolume(volume);
        Laya.SoundManager.setMusicVolume(this.musicVolume);
        App.storageManager.setItem("MUSIC_VALUE", this.musicVolume);
    };

    SoundAndMusicMgr.prototype.setSoundVolume = function (volume) {
        this.soundVolume = this.checkVolume(volume);
        Laya.SoundManager.setSoundVolume(this.soundVolume);
        App.storageManager.setItem("SOUND_VALUE", this.soundVolume);
    };

    SoundAndMusicMgr.prototype.checkVolume = function (volume) {
        if (volume != null && volume != undefined) {
            volume = Number(volume);
            if (volume > SoundAndMusicMgr.SOUND_MAX_VOLUME) {
                volume = SoundAndMusicMgr.SOUND_MAX_VOLUME;
            }
            else if (volume < SoundAndMusicMgr.SOUND_MIN_VOLUME) {
                volume = SoundAndMusicMgr.SOUND_MIN_VOLUME;
            }
        }
        else {
            volume = SoundAndMusicMgr.SOUND_MAX_VOLUME;
        }

        return volume;
    };

    SoundAndMusicMgr.prototype.getMusicVolume = function () {
        return this.musicVolume;
    };

    SoundAndMusicMgr.prototype.getSoundVolume = function () {
        return this.soundVolume;
    };

    SoundAndMusicMgr.SOUND_MAX_VOLUME = 0.5;
    SoundAndMusicMgr.SOUND_MIN_VOLUME = 0;
    SoundAndMusicMgr.MUSIC_VOLUME = 0.5;
    SoundAndMusicMgr.SOUND_VOLUME = 0.5;


    return SoundAndMusicMgr;
}(laya.events.EventDispatcher));