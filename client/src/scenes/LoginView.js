/**
 * 登录界面
 */
var LoginView = (function(_super) {
    function LoginView() {
        LoginView.super(this);

        this.revision.text = "版本号：" + App.config.version;

        this.init();
    }

    Laya.class(LoginView, "LoginView", _super);

    LoginView.prototype.init = function() {
        //window.alert(App.storageManager.getToken());
        // 如果已经获得微信授权码，则自动登录
        if (App._code) {
            Laya.timer.once(300, this, this.loginGame);
        }
        // 本地有Token
        else if (App.storageManager.getToken()) {
            Laya.timer.once(300, this, this.loginGame);
        }
        // 默认显示登录界面
        else {

        }

        this.initEvent();
        this.initButtons();
    };

    LoginView.prototype.initEvent = function () {
        this.guestBtn.on(Laya.Event.CLICK, this, this.loginGame);
        this.wxAuthorizeBtn.on(Laya.Event.CLICK, this, this.authorize);

        this.agreementText.on(Laya.Event.CLICK, this, this.showAgreement);
    };

    LoginView.prototype.initButtons = function() {
        var self = this;

        // 是否隐藏游客登录按钮
        this.guestBtn.visible = !!(App.config.showFPS == true || App.reviewing());

        // iOS要判断是否安装了微信
        if (App.config.env == 'ios') {
            var AppDelegate = Laya.PlatformClass.createClass("AppDelegate");
            AppDelegate.callWithBack(function(n) {
                if (!n) {
                    self.wxAuthorizeBtn.visible = false;
                }
            }, "isWXAppInstalled");
        }
    };

    LoginView.prototype.authorize = function() {
        App.wxAuthorize();
    };

    LoginView.prototype.loginGame = function () {
        App.login();
    };

    LoginView.prototype.block = function() {
        this.guestBtn.disabled = true;
        this.wxAuthorizeBtn.disabled = true;
    };

    LoginView.prototype.unblock = function() {
        this.guestBtn.disabled = false;
        this.wxAuthorizeBtn.disabled = false;
    };

    LoginView.prototype.showAgreement = function () {
        var argeementPanel = new AgreementDialog();
        argeementPanel.popup();
    };

    return LoginView;
}(LoginViewUI));