/**
 * 设置界面
 */
var SettingDialog = (function(_super) {
    function SettingDialog() {
        SettingDialog.super(this);

        this._language = SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW;
        this._tableType = SettingDialog.TABLE_TYPE.GREEN;

        this.init();
    }

    Laya.class(SettingDialog, "SettingDialog", _super);

    SettingDialog.prototype.createSlider = function createSlider() {
        var slider = new Laya.HSlider();
        slider.skin = "assets/ui.setting/bg_03.png";
        slider.bar.skin = "assets/ui.setting/btn_bar.png";
        slider.min = 0;
        slider.max = 100;
        slider.value = 100;
        slider.tick = 1;
        slider.bar.stateNum = 3;
        slider.bar.y = -10;
        slider.bar.zOrder = 1;
        slider.showLabel = false;

        return slider;
    };

    SettingDialog.prototype.createImg =  function createImage () {
        var image = new Laya.Image();
        image.skin = "assets/ui.setting/bg_04.png";
        return image;
    };

    SettingDialog.prototype.initShow = function () {
        //*桌布选项初始化显示
        var tableColor = App.storageManager.getItem("TABLE_COLOR");
        if (tableColor != undefined) {
            if (tableColor == SettingDialog.TABLE_TYPE.GREEN) {
                this._tableType = SettingDialog.TABLE_TYPE.GREEN;
            }
            else if (tableColor == SettingDialog.TABLE_TYPE.YELLOW) {
                this._tableType = SettingDialog.TABLE_TYPE.YELLOW;
            }
        }
        else {
            App.storageManager.setItem("TABLE_COLOR", SettingDialog.TABLE_TYPE.GREEN);
            this._tableType = SettingDialog.TABLE_TYPE.GREEN;
        }
        this.touchTable(this._tableType);

        //*语言选项初始化
        var languageType = App.storageManager.getItem("LANGUAGE_TYPE");
        if (languageType == undefined) {
            languageType = SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW;
        }
        this._language = languageType;
        this.touchLanguage(this._language);

        //*声音类型初始化
        var voiceType = App.soundManager.getVoiceType();
        this.changeVoice(voiceType);

        this.musicSlider = this.createSlider();
        this.musicSlider.x = this.musicPos.x;
        this.musicSlider.y = this.musicPos.y;
        this.musicSlider.changeHandler = new Laya.Handler(this, this.changeMusicVolume);
        this.addChild(this.musicSlider);

        this.musicBar = this.createImg();
        this.musicBar.sizeGrid = "10,10,10,10";
        this.musicBar.zOrder = 0;
        this.musicSlider.addChild(this.musicBar);

        this.soundSlider = this.createSlider();
        this.soundSlider.x = this.soundPos.x;
        this.soundSlider.y = this.soundPos.y;
        this.soundSlider.changeHandler = new Laya.Handler(this, this.changeSoundVolume);
        this.addChild(this.soundSlider);

        this.soundBar = this.createImg();
        this.soundBar.sizeGrid = "10,10,10,10";
        this.soundBar.zOrder = 0;
        this.soundSlider.addChild(this.soundBar);


        //*音乐音效大小
        var soundVolume = App.soundManager.getSoundVolume();
        var musicVolume = App.soundManager.getMusicVolume();
        this.musicSlider.value = musicVolume;
        this.soundSlider.value = soundVolume;
    };

    SettingDialog.prototype.changeMusicVolume = function (value) {
        this.musicBar.width = 280*(value/100);
        App.soundManager.setMusicVolume(value);
    };

    SettingDialog.prototype.changeSoundVolume = function (value) {
        this.soundBar.width = 280*(value/100);
        App.soundManager.setSoundVolume(value);
    };

    SettingDialog.prototype.changeVoice = function (voiceType) {
        var type;
        switch (voiceType) {
            case SoundAndMusicMgr.VOICE_TYPE.MAN: {
                this.manImg.visible = true;
                this.gildImg.visible = false;
                this.manBtn.visible = false;
                this.gildBtn.visible = true;
                type = SoundAndMusicMgr.VOICE_TYPE.WOMEN;
                break;
            }
            case SoundAndMusicMgr.VOICE_TYPE.WOMEN: {
                this.manImg.visible = false;
                this.gildImg.visible = true;
                this.manBtn.visible = true;
                this.gildBtn.visible = false;
                type = SoundAndMusicMgr.VOICE_TYPE.MAN;
                break;
            }
            default: {
                type = SoundAndMusicMgr.VOICE_TYPE.MAN;
                break;
            }
        }

        App.soundManager.setVoiceType(voiceType);
    };

    SettingDialog.prototype.touchLanguage = function (type) {
        switch (type) {
            case SoundAndMusicMgr.LANGUAG_TYPE.MANDARIN: {
                this.madrainImg.visible = true;
                this.teochewImg.visible = false;
                this.mandarinBtn.visible = false;
                this.teochewBtn.visible = true;
                break;
            }
            case SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW: {
                this.madrainImg.visible = false;
                this.teochewImg.visible = true;
                this.mandarinBtn.visible = true;
                this.teochewBtn.visible = false;
                break;
            }
            default: {
                type = SoundAndMusicMgr.LANGUAG_TYPE.MANDARIN;
                break;
            }
        }

        App.soundManager.setLanguageType(type);
    };

    //*退出登录按钮
    SettingDialog.prototype.quitGame = function () {

    };

    //*更换桌布
    SettingDialog.prototype.touchTable = function (tableType) {
        switch (tableType) {
            case SettingDialog.TABLE_TYPE.GREEN: {
                this.greenTable.visible = true;
                this.yellowTable.visible = false;
                break;
            }
            case  SettingDialog.TABLE_TYPE.YELLOW: {
                this.greenTable.visible = false;
                this.yellowTable.visible = true;
                break;
            }
            default: {
                tableType = SettingDialog.TABLE_TYPE.GREEN;
                break;
            }
        }

        App.storageManager.setItem("TABLE_COLOR", tableType);
        this.event(SettingDialog.Events.CHANGE_TABLE);
    };

    SettingDialog.prototype.initEvent = function () {
        this.mandarinBtn.on(Laya.Event.CLICK, this, this.touchLanguage, [SoundAndMusicMgr.LANGUAG_TYPE.MANDARIN]);
        this.teochewBtn.on(Laya.Event.CLICK, this, this.touchLanguage, [SoundAndMusicMgr.LANGUAG_TYPE.TEOCHEW]);

        this.manBtn.on(Laya.Event.CLICK, this, this.changeVoice, [SoundAndMusicMgr.VOICE_TYPE.MAN]);
        this.gildBtn.on(Laya.Event.CLICK, this, this.changeVoice, [SoundAndMusicMgr.VOICE_TYPE.WOMEN]);

        this.green.on(Laya.Event.CLICK, this, this.touchTable, [SettingDialog.TABLE_TYPE.GREEN]);
        this.yellow.on(Laya.Event.CLICK, this, this.touchTable, [SettingDialog.TABLE_TYPE.YELLOW]);

        this.quitBtn.on(Laya.Event.CLICK, this, this.touchQuit, this.quitGame);
    };

    SettingDialog.prototype.init = function() {
        this.initEvent();

        this.initShow();
    };

    SettingDialog.prototype.close = function() {
        _super.prototype.close.call(this);
        App.uiManager.removeUiLayer(this);
    };

    SettingDialog.TABLE_TYPE = {
        GREEN: "green",
        YELLOW: "yellow"
    };

    SettingDialog.Events = {
        CHANGE_TABLE: "CHANGE_TABLE",
    };

    return SettingDialog;
}(SettingDialogUI));
